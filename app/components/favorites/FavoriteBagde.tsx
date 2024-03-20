import {useMemo} from 'react';
import {Link} from '@remix-run/react';

import {useIsHydrated} from '~/hooks/useIsHydrated';

import {CartBag, Like} from '../icons';

export function FavoriteBadge({
  openFavorite,
  count,
}: {
  count: number;
  openFavorite: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <Like className="headerIcon" />
        <div className="absolute text-black bg-white bottom-1 right-1 text-[0.75rem] font-switzer font-light subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px">
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count],
  );

  return isHydrated ? (
    <button
      onClick={openFavorite}
      className="relative flex items-center justify-center w-8 h-8"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/favorite"
      className="relative flex items-center justify-center w-8 h-8"
    >
      {BadgeCounter}
    </Link>
  );
}
