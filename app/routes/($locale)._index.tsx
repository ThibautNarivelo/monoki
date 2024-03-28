import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {AnalyticsPageType, Image} from '@shopify/hydrogen';
import {motion} from 'framer-motion';
import {useWindowScroll} from 'react-use';

import {ProductSwimlane, FeaturedCollections, Hero} from '~/components';
import {getHeroPlaceholder} from '~/lib/placeholders';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';
import HeroCollection from '~/components/HeroCollection';
import {useIsHomePath} from '~/lib/utils';
import {
  ALL_PAGES_QUERY,
  COLLECTION_HERO_QUERY,
  FEATURED_COLLECTIONS_QUERY,
  HOMEPAGE_FEATURED_PRODUCTS_QUERY,
  HOMEPAGE_SEO_QUERY,
} from 'storefront-graphql';

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
          ? 'mt-[200px] lg:mt-[300px]'
          : 'mt-[32px] lg:mt-[32px]'
      } overflow-hidden transition-all duration-[.5s] ease-in-out-monoki`}
    >
      <HeroCollection pages={pages} />
    </motion.div>
  );
}
