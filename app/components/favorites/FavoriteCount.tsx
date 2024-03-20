import {Suspense} from 'react';
import {Await} from '@remix-run/react';

import {useRootLoaderData} from '~/root';

import {FavoriteBadge} from './FavoriteBagde';

export function FavoriteCount({
  isHome,
  openFavorite,
}: {
  isHome: boolean;
  openFavorite: () => void;
}) {
  const rootData = useRootLoaderData();

  return (
    <Suspense
      fallback={<FavoriteBadge count={0} openFavorite={openFavorite} />}
    >
      <Await resolve={rootData?.favorite}>
        {(favorite) => (
          <FavoriteBadge
            // dark={isHome}
            openFavorite={openFavorite}
            count={favorite?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}
