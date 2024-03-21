import {useRef, Suspense} from 'react';
import {Disclosure, Listbox} from '@headlessui/react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Await} from '@remix-run/react';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {
  AnalyticsPageType,
  Money,
  ShopPayButton,
  VariantSelector,
  getSelectedProductOptions,
  Image,
} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';

import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';
import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
} from '~/components';
import {getExcerpt} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import type {Storefront} from '~/lib/type';
import {routeHeaders} from '~/data/cache';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from 'storefront-graphql';

export const headers = routeHeaders;

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const selectedOptions = getSelectedProductOptions(request);

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }

  if (!product.selectedVariant) {
    throw redirectToFirstVariant({product, request});
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: productHandle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer({
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: parseFloat(selectedVariant.price.amount),
    },
    seo,
  });
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductQuery['product'];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const firstVariant = product!.variants.nodes[0];
  for (const option of firstVariant.selectedOptions) {
    searchParams.set(option.name, option.value);
  }

  url.search = searchParams.toString();

  return redirect(url.href.replace(url.origin, ''), 302);
}

export default function Product() {
  const {product, shop, recommended, variants} = useLoaderData<typeof loader>();
  const {media, title, vendor, descriptionHtml} = product;
  const {shippingPolicy, refundPolicy} = shop;

  return (
    <>
      <section className="pt-[32px] px-[1.1rem]">
        {/* TITLE */}
        <h1 className="productTitle">{title}</h1>
        <div className="w-full h-full flex flex-row justify-between items-start gap-[.5rem]">
          {/* DESCRIPTION */}
          <div className="sticky top-1/2 w-1/3 flex flex-col justify-center items-start gap-[1.5rem]">
            {descriptionHtml && (
              <>
                <p className="footerLink uppercase">Description</p>
                <div
                  dangerouslySetInnerHTML={{__html: descriptionHtml}}
                  // className="prose"
                  className="productDescription"
                />
              </>
            )}
          </div>
          {/* GALLERY */}
          <div className="relative w-1/3 min-h-full bg-blue-100 overflow-y-scroll hiddenScroll">
            {media.nodes.map((media) => {
              const image =
                media.__typename === 'MediaImage' ? media.image : null;
              return (
                <div key={media.id || image?.id}>
                  {image && (
                    <Image
                      data={image}
                      aspectRatio={'4/5'}
                      sizes={'(min-width: 48em) 30vw, 90vw'}
                      className="object-cover w-full h-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* CAT */}
          <div className="sticky top-1/2 w-1/3 flex flex-col justify-center px-[3rem] gap-[1.5rem]">
            <Suspense fallback={<ProductForm variants={[]} />}>
              <Await
                errorElement="There was a problem loading related products"
                resolve={variants}
              >
                {(resp) => (
                  <ProductForm variants={resp.product?.variants.nodes || []} />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-32" />}>
          <Await
            errorElement="There was a problem loading related products"
            resolve={recommended}
          >
            {(products) => (
              <ProductSwimlane title="Related Products" products={products} />
            )}
          </Await>
        </Suspense>
      </section>
    </>
  );
}

export function ProductForm({
  variants,
}: {
  variants: ProductVariantFragmentFragment[];
}) {
  const {product, analytics, storeDomain} = useLoaderData<typeof loader>();

  const closeRef = useRef<HTMLButtonElement>(null);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant!;
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics: ShopifyAnalyticsProduct = {
    ...analytics.products[0],
    quantity: 1,
  };

  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;

  return (
    <div className="flex flex-col gap-[1rem]">
      {/* CUSTOM COLOR */}
      <div className="flex justify-start gap-[1rem]">
        {product.customVariant?.references?.edges?.map((edge) => {
          const customVariant = edge?.node;
          if (!customVariant) return null;

          return (
            <Link
              key={customVariant.id}
              to={`/products/${customVariant.handle}`}
              className="relative flex justify-center items-center h-7 w-7 group border-[1px] border-neutral-900 overflow-hidden
                hover:border-none"
            >
              <span className="absolute top-[-20px] z-10 opacity-0 group-hover:opacity-100 text-[.8rem] font-switzer uppercase">
                {customVariant.nameOfColor?.value}
              </span>
              <div
                style={{
                  backgroundColor: customVariant.color?.value || 'transparent',
                }}
                className="absolute inset-0 m-[2px] group-hover:translate-y-[-100%] transition-transform duration-150"
              />
              <div
                style={{
                  backgroundColor: customVariant.color?.value || 'transparent',
                }}
                className="absolute inset-0 m-[2px] translate-y-[110%] group-hover:translate-y-0 transition-transform duration-150"
              />
            </Link>
          );
        })}
      </div>
      <div className="flex flex-col gap-[1rem]">
        <VariantSelector
          handle={product.handle}
          options={product.options}
          variants={variants}
        >
          {({option}) => {
            return (
              <div key={option.name} className="flex flex-col flex-wrap">
                {/* <div className="min-w-[4rem]">{option.name}</div> */}
                <div className="flex flex-wrap items-baseline gap-4">
                  <div className="relative w-full">
                    <Listbox>
                      {({open}) => (
                        <>
                          <Listbox.Button
                            ref={closeRef}
                            className="flex items-center justify-between w-full py-[.70rem] px-[1rem] border border-neutral-900 rounded-[2px]"
                          >
                            <span>{option.value}</span>
                            <IconCaret direction={open ? 'up' : 'down'} />
                          </Listbox.Button>
                          <Listbox.Options
                            className={clsx(
                              'border-neutral-900 hiddenScroll bg-white bg-opacity-80 backdrop-blur-sm absolute bottom-12 z-30 grid min-h-full w-full overflow-y-scroll border transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                              open ? 'max-h-48' : 'max-h-0',
                            )}
                          >
                            {option.values.map(({value, to, isActive}) => (
                              <Listbox.Option
                                key={`option-${option.name}-${value}`}
                                value={value}
                              >
                                {({active}) => (
                                  <Link
                                    to={to}
                                    preventScrollReset
                                    className={clsx(
                                      'text-neutral-900 w-full p-2 transition flex justify-between items-center text-left cursor-pointer px-4',
                                      active && 'bg-neutral-900/80 text-white',
                                    )}
                                    onClick={() => {
                                      if (!closeRef?.current) return;
                                      closeRef.current.click();
                                    }}
                                  >
                                    {value}
                                    {isActive && (
                                      <span className="ml-2">
                                        <IconCheck />
                                      </span>
                                    )}
                                  </Link>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                </div>
              </div>
            );
          }}
        </VariantSelector>

        {/* BUY BUTTON */}
        {selectedVariant && (
          <div className="flex flex-col gap-[1rem]">
            {isOutOfStock ? (
              <button className="bg-neutral-400 py-[.75rem] sortLink">
                <span>{isFrench ? 'Épuisé' : 'Sold out'}</span>
              </button>
            ) : (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id!,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              >
                <div className="flex items-center justify-between py-[.75rem] px-[1rem]">
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price!}
                    as="span"
                    data-test="price"
                  />
                  <span className="sortLink !text-white">
                    {isFrench ? 'Ajouter au panier' : 'Add to cart'}
                  </span>
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice!}
                      as="span"
                    />
                  )}
                </div>
              </AddToCartButton>
            )}
            {!isOutOfStock && (
              <ShopPayButton
                width="100%"
                variantIds={[selectedVariant?.id!]}
                storeDomain={storeDomain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return {nodes: mergedProducts};
}
