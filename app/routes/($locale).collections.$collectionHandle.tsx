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
  Pagination,
  flattenConnection,
  getPaginationVariables,
  Image,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';

import {
  PageHeader,
  Section,
  Text,
  SortFilter,
  Grid,
  ProductCard,
  Button,
} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import type {SortParam} from '~/components/SortFilter';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {parseAsCurrency} from '~/lib/utils';
import {COLLECTION_QUERY, CUSTOM_ALL_PRODUCTS_QUERY} from 'storefront-graphql';
import {CollectionDetailsQuery} from 'storefrontapi.generated';

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

  const {products} = await context.storefront.query(CUSTOM_ALL_PRODUCTS_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

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

  const seo = seoPayload.collection({collection, url: request.url});

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
    products,
    collection,
    appliedFilters,
    collections: flattenConnection(collections),
    analytics: {
      pageType: AnalyticsPageType.collection,
      collectionHandle,
      resourceId: collection.id,
    },
    seo,
  });
}

// export default function Collection() {
//   const {collection, collections, appliedFilters} =
//     useLoaderData<typeof loader>();

//   const {ref, inView} = useInView();

//   return (
//     <div className="relative pt-[32px] px-[1.1rem]">
//       {collection?.description && (
//         <h1 className="w-full text-[4.6875rem] tracking-[-5px] font-switzer uppercase">
//           {collection.description}
//         </h1>
//       )}

//       <div>
//         <SortFilter
//           filters={collection.products.filters as Filter[]}
//           appliedFilters={appliedFilters}
//           collections={collections}
//         >
//           <Pagination connection={collection.products}>
//             {({
//               nodes,
//               isLoading,
//               PreviousLink,
//               NextLink,
//               nextPageUrl,
//               hasNextPage,
//               state,
//             }) => (
//               <>
//                 <div className="flex items-center justify-center mb-6">
//                   <Button as={PreviousLink} variant="secondary" width="full">
//                     {isLoading ? 'Loading...' : 'Load previous'}
//                   </Button>
//                 </div>
//                 <ProductsLoadedOnScroll
//                   collection={
//                     collection as CollectionDetailsQuery['collection']
//                   }
//                   nodes={nodes}
//                   inView={inView}
//                   nextPageUrl={nextPageUrl}
//                   hasNextPage={hasNextPage}
//                   state={state}
//                 />
//                 <div className="flex items-center justify-center mt-6">
//                   <Button
//                     ref={ref}
//                     as={NextLink}
//                     variant="secondary"
//                     width="full"
//                   >
//                     {isLoading ? 'Loading...' : 'Load more products'}
//                   </Button>
//                 </div>
//               </>
//             )}
//           </Pagination>
//         </SortFilter>
//       </div>
//     </div>
//   );
// }

// function ProductsLoadedOnScroll({
//   nodes,
//   inView,
//   nextPageUrl,
//   hasNextPage,
//   state,
//   collection,
// }: {
//   nodes: any;
//   inView: boolean;
//   nextPageUrl: string;
//   hasNextPage: boolean;
//   state: any;
//   collection: CollectionDetailsQuery['collection'];
// }) {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (inView && hasNextPage) {
//       navigate(nextPageUrl, {
//         replace: true,
//         preventScrollReset: true,
//         state,
//       });
//     }
//   }, [inView, navigate, state, nextPageUrl, hasNextPage]);

//   return (
//     <Grid layout="products" data-test="product-grid">
//       {nodes.map((product: any, i: number) => (
//         <ProductCard
//           key={product.id}
//           product={product}
//           loading={getImageLoadingPriority(i)}
//           collection={collection}
//         />
//       ))}
//     </Grid>
//   );
// }

export default function Collection() {
  const products = useLoaderData<typeof loader>();

  const [isHovered, setIsHovered] = useState<string | null>(null);

  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;

  return (
    <div className="pt-[32px]">
      {products.collection?.description && (
        <>
          <h1 className="bg-orange-200 text-[3rem]">
            {products.collection.description}
          </h1>
          <div className="grid grid-cols-4">
            {products.products.edges.map((product) => (
              <div key={product.node.id}>
                <Link
                  to={
                    isEnglish
                      ? `/en-us/products/${product.node.handle}`
                      : `/products/${product.node.handle}`
                  }
                >
                  <Image
                    src={
                      isHovered === product.node.id
                        ? product.node.images.nodes[1].url
                        : product.node.images.nodes[0].url
                    }
                    alt={product.node.title}
                    onMouseEnter={() => setIsHovered(product.node.id)}
                    onMouseLeave={() => setIsHovered(null)}
                  />
                  <span>{product.node.title}</span>
                  <span>
                    {
                      products.products.nodes[0].priceRange.maxVariantPrice
                        .amount
                    }
                  </span>
                  <span>
                    {
                      products.products.nodes[0].priceRange.maxVariantPrice
                        .currencyCode
                    }
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
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
