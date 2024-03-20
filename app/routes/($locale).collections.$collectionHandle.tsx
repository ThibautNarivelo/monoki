import React, {useEffect, useState} from 'react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, useNavigate} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import type {
  Filter,
  ProductCollectionSortKeys,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import {
  AnalyticsPageType,
  flattenConnection,
  getPaginationVariables,
  Image,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import {AnimatePresence, motion} from 'framer-motion';

import {SortFilter, Grid, ProductCard} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import type {SortParam} from '~/components/SortFilter';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {parseAsCurrency} from '~/lib/utils';
import {COLLECTION_QUERY, CUSTOM_ALL_PRODUCTS_QUERY} from 'storefront-graphql';
import type {CollectionDetailsQuery} from 'storefrontapi.generated';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: PAGINATION_SIZE,
  });
  const {collectionHandle} = params;
  const locale = context.storefront.i18n;

  invariant(collectionHandle, 'Missing collectionHandle param');

  const searchParams = new URL(request.url).searchParams;

  const {sortKey, reverse} = getSortValuesFromParam(
    searchParams.get('sort') as SortParam,
  );
  const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [] as ProductFilter[],
  );

  const {collection, collections} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...paginationVariables,
        handle: collectionHandle,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  if (!collection) {
    throw new Response('collection', {status: 404});
  }

  // const seo = seoPayload.collection({collection, url: request.url});

  const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );

  const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input as string) as ProductFilter;
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input as string) as ProductFilter;
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter): filter is NonNullable<typeof filter> => filter !== null);

  return json({
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    analytics: {
      pageType: AnalyticsPageType.collection,
      collectionHandle,
      resourceId: collection.id,
    },
    // seo,
  });
}

export default function Collection() {
  const {collection, collections, appliedFilters} =
    useLoaderData<typeof loader>();

  const [isHovered, setIsHovered] = useState<string | null>(null);

  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;

  return (
    <div className="relative pt-[32px] px-[1.1rem] pb-[20vh]">
      {collection?.metafield && (
        <h1 className="w-full text-[4.6875rem] tracking-[-5px] font-switzer uppercase">
          {collection.description}
        </h1>
      )}
      <div className="flex gap-[1rem]">
        {collection.metafield?.references?.nodes.map((node) => (
          <Link
            key={node.id}
            to={`/collections/${node.handle}`}
            className="text-[1rem] font-switzer uppercase"
          >
            {node.description}
          </Link>
        ))}
      </div>

      <SortFilter
        filters={collection.products.filters as Filter[]}
        appliedFilters={appliedFilters}
        collections={collections}
      >
        <div className="grid grid-rows-1 md:grid-cols-2 lg:grid-cols-4  gap-[4rem]">
          {collection.products.edges.map((product) => (
            <Link
              key={product.node.id}
              to={`/products/${product.node.handle}`}
              prefetch="intent"
              className="min-h-full h-full flex flex-col"
            >
              {product.node.images.nodes
                .slice(0, 2)
                .map((image, index, arr) => (
                  <motion.div key={image.id} className="flex-1">
                    <Image
                      src={image.url}
                      alt={product.node.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      onMouseEnter={() => setIsHovered(product.node.id)}
                      onMouseLeave={() => setIsHovered(null)}
                      className={`${
                        (index === 1 && product.node.id === isHovered) ||
                        (index === 0 && arr.length === 1) ||
                        (index === 0 && product.node.id !== isHovered)
                          ? 'block'
                          : 'hidden'
                      } w-full h-[400px] object-cover scale-[97%] hover:scale-100 transition-transform duration-[.4s] ease-in-out`}
                    />
                  </motion.div>
                ))}

              <div className="flex flex-row justify-between">
                <span>{product.node.title}</span>
                <span>
                  {product.node.priceRange.maxVariantPrice.amount}
                  {isEnglish ? '$' : '€'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </SortFilter>
    </div>
  );
}

function getSortValuesFromParam(sortParam: SortParam | null): {
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
} {
  switch (sortParam) {
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED',
        reverse: true,
      };
    // case 'featured':
    //   return {
    //     sortKey: 'MANUAL',
    //     reverse: false,
    //   };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}
