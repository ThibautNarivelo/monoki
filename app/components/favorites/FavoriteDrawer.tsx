import {Await} from '@remix-run/react';
import {Suspense} from 'react';

import {useRootLoaderData} from '~/root';

import {Drawer} from '../header/Drawer';

import {FavoriteLoading} from './FavoriteLoading';
import {Favorite} from './Favorite';

export function FavoriteDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Favorite" openFrom="right">
      <div className="grid">
        <Suspense fallback={<FavoriteLoading />}>
          <Await resolve={rootData?.favorite}>
            {(favorite) => (
              <Favorite layout="drawer" onClose={onClose} favorite={favorite} />
            )}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}
