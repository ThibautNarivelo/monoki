import {Await} from '@remix-run/react';
import {Suspense} from 'react';

import {useRootLoaderData} from '~/root';

import {Drawer} from '../header/Drawer';

import {CartLoading} from './CartLoading';
import {Cart} from './Cart';

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}
