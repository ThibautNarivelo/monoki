import {useRef, Suspense, useState} from 'react';
import {Listbox} from '@headlessui/react';
import {Await, Link} from '@remix-run/react';
import type {ShopifyAnalyticsProduct} from '@shopify/hydrogen';
import {Money, VariantSelector} from '@shopify/hydrogen';

import type {
  ProductCardFragment,
  ProductQuery,
  ProductVariantFragmentFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/cart/AddToCartButton';
import {IconCaret, IconCheck} from '~/components/Icon';

type ProductFormProps = {
  variants: ProductVariantFragmentFragment[];
  product: ProductQuery['product'];
  productAnalytics: ShopifyAnalyticsProduct;
  selectedVariant: ProductVariantFragmentFragment;
};

export function Forms({
  variants,
  product,
  productAnalytics,
  selectedVariant,
}: ProductFormProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  //   const selectedVariant = product?.selectedVariant || variants[0];
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  //   const productAnalytics: ShopifyAnalyticsProduct = {
  //     ...analytics.products[0],
  //     quantity: 1,
  //   };

  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;

  //   console.log('product', product);

  return (
    <div className="flex flex-col gap-[1rem]">
      {/* CUSTOM COLOR */}
      <div className="flex justify-start gap-[1rem]">
        {product?.customVariant?.references?.edges?.map((edge) => {
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
          handle={product?.handle!}
          options={product?.options!}
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
                            className={`border-neutral-900 hiddenScroll bg-white bg-opacity-80 backdrop-blur-sm absolute bottom-12 z-30 grid min-h-full w-full overflow-y-scroll border transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b ${
                              open ? 'max-h-48' : 'max-h-0'
                            }`}
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
                                    className={`${
                                      active
                                        ? 'bg-neutral-900/80 text-white'
                                        : 'text-neutral-900'
                                    } w-full p-2 transition flex justify-between items-center text-left cursor-pointer px-4`}
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
                  totalValue: parseFloat(productAnalytics?.price!),
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
            {/* {!isOutOfStock && (
                <ShopPayButton
                  width="100%"
                  variantIds={[selectedVariant?.id!]}
                  storeDomain={storeDomain}
                />
              )} */}
          </div>
        )}
      </div>
    </div>
  );
}
