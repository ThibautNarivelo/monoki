import {useMemo} from 'react';
import {Link} from '@remix-run/react';

import {useIsHydrated} from '~/hooks/useIsHydrated';

import {CartBag} from '../icons';

export function Badge({
  openCart,
  count,
}: {
  count: number;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <CartBag className="headerIcon" />
        <div className="absolute text-black bg-white bottom-1 right-1 text-[0.75rem] font-switzer font-light subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px">
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}
