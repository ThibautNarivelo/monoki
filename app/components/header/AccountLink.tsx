import {Await, Link} from '@remix-run/react';
import {Suspense} from 'react';

import {useRootLoaderData} from '~/root';

import {Account, Login} from '../icons';
import {IconLogin} from '../Icon';

export function AccountLink({className}: {className?: string}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<Login />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) =>
            isLoggedIn ? (
              <Login className="headerIcon" />
            ) : (
              <Account className="headerIcon" />
            )
          }
        </Await>
      </Suspense>
    </Link>
  );
}
