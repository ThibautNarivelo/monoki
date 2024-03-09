import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useWindowScroll} from 'react-use';

import {ProductSwimlane, FeaturedCollections, Hero} from '~/components';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getHeroPlaceholder} from '~/lib/placeholders';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import HeroCollection from '~/components/HeroCollection';
import {useIsHomePath} from '~/lib/utils';

export const headers = routeHeaders;

export async function loader({params, context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  const {shop, hero} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'freestyle'},
  });

  const {pages} = await context.storefront.query(ALL_PAGES_QUERY, {
    variables: {country, language},
  });

  const seo = seoPayload.home();

  return defer({
    pages,

    shop,
    primaryHero: hero,
    // These different queries are separated to illustrate how 3rd party content
    // fetching can be optimized for both above and below the fold.
    featuredProducts: context.storefront.query(
      HOMEPAGE_FEATURED_PRODUCTS_QUERY,
      {
        variables: {
          /**
           * Country and language properties are automatically injected
           * into all queries. Passing them is unnecessary unless you
           * want to override them from the following default:
           */
          country,
          language,
        },
      },
    ),
    secondaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'backcountry',
        country,
        language,
      },
    }),
    featuredCollections: context.storefront.query(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),
    tertiaryHero: context.storefront.query(COLLECTION_HERO_QUERY, {
      variables: {
        handle: 'winter-2022',
        country,
        language,
      },
    }),
    analytics: {
      pageType: AnalyticsPageType.home,
    },

    seo,
  });
}

export default function Homepage() {
  const {
    pages,
    primaryHero,
    secondaryHero,
    tertiaryHero,
    featuredCollections,
    featuredProducts,
  } = useLoaderData<typeof loader>();

  // TODO: skeletons vs placeholders
  const skeletons = getHeroPlaceholder([{}, {}, {}]);
  const isHome = useIsHomePath();
  const {y} = useWindowScroll();

  return (
    <motion.div
      className={`${
        isHome && y < 100
          ? 'mt-[200px] lg:mt-[500px]'
          : 'mt-[32px] lg:mt-[100px]'
      } min-w-screen overflow-hidden transition-all duration-[.5s] ease-in-out-monoki`}
    >
      <HeroCollection pages={pages} />
    </motion.div>

    // TEMPLATE CODE
    // <motion.div
    //   initial={isHome ? {marginTop: '500px'} : {marginTop: '100px'}}
    //   animate={isHome && y < 100 ? {marginTop: '500px'} : {marginTop: '100px'}}
    //   transition={{duration: 0.5, ease: 'easeInOut'}}
    //   className="min-w-screen overflow-hidden "
    // >

    //   {/* KEEP THE CODE BELOW COMMENTED FOR NOW AS EXAMPLE */}

    //   {/* {pages && (
    //     <div className="mt-[500px]">
    //       {pages.nodes.map((page) => (
    //         <Link
    //           key={page.id}
    //           to={`/collections/${page.collectionLink?.reference?.handle}`}
    //         >
    //           <h1>{page.pageTitle?.value}</h1>
    //           <Image
    //             src={page.imageCover?.reference?.image?.url}
    //             alt={page.imageCover?.reference?.image?.altText || ''}
    //             width={page.imageCover?.reference?.image?.width || 0}
    //             height={page.imageCover?.reference?.image?.height || 0}
    //           />
    //         </Link>
    //       ))}
    //     </div>
    //   )} */}

    //   {/* {primaryHero && (
    //     <Hero {...primaryHero} height="full" top loading="eager" />
    //   )}

    //   {featuredProducts && (
    //     <Suspense>
    //       <Await resolve={featuredProducts}>
    //         {({products}) => {
    //           if (!products?.nodes) return <></>;
    //           return (
    //             <ProductSwimlane
    //               products={products}
    //               title="Featured Products"
    //               count={4}
    //             />
    //           );
    //         }}
    //       </Await>
    //     </Suspense>
    //   )}

    //   {secondaryHero && (
    //     <Suspense fallback={<Hero {...skeletons[1]} />}>
    //       <Await resolve={secondaryHero}>
    //         {({hero}) => {
    //           if (!hero) return <></>;
    //           return <Hero {...hero} />;
    //         }}
    //       </Await>
    //     </Suspense>
    //   )}

    //   {featuredCollections && (
    //     <Suspense>
    //       <Await resolve={featuredCollections}>
    //         {({collections}) => {
    //           if (!collections?.nodes) return <></>;
    //           return (
    //             <FeaturedCollections
    //               collections={collections}
    //               title="Collections"
    //             />
    //           );
    //         }}
    //       </Await>
    //     </Suspense>
    //   )}

    //   {tertiaryHero && (
    //     <Suspense fallback={<Hero {...skeletons[2]} />}>
    //       <Await resolve={tertiaryHero}>
    //         {({hero}) => {
    //           if (!hero) return <></>;
    //           return <Hero {...hero} />;
    //         }}
    //       </Await>
    //     </Suspense>
    //   )} */}
    // </motion.div>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
  }
  ${MEDIA_FRAGMENT}
` as const;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;

const COLLECTION_HERO_QUERY = `#graphql
  query heroCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;

// @see: https://shopify.dev/api/storefront/current/queries/products
export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;

// @see: https://shopify.dev/api/storefront/current/queries/collections
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 4,
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
` as const;

export const ALL_PAGES_QUERY = `#graphql
  query AllPages($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    pages(first: 100, query: "Homepage") {
      nodes {
        id
        title
        handle
        pageTitle: metafield(namespace: "page", key: "title") {
        value
        }
        imageCover: metafield(key: "image_cover", namespace: "page") {
          reference {
            ... on MediaImage {
              id
              image {
                altText
                height
                id
                url
                width
              }
            }
          }
        }
        collectionLink: metafield(key: "collection_link", namespace: "page") {
          reference {
            ... on Collection {
              id
              handle
            }
          }
        }
      }
    }
  }
` as const;
