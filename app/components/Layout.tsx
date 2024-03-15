import {Disclosure} from '@headlessui/react';
import {Suspense} from 'react';

import {Text, Heading, IconCaret, Link} from '~/components';
import {type EnhancedMenu, type ChildEnhancedMenuItem} from '~/lib/utils';
import type {
  AllCollectionsQuery,
  BoyfriendCollectionsQuery,
  LayoutQuery,
  WomenCollectionsQuery,
} from 'storefrontapi.generated.d';

import {Header} from './header/Header';
import Footer from './footer/Footer';

type LayoutProps = {
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    subHeaderMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
  collection: AllCollectionsQuery;
  children?: React.ReactNode;
  womenCollection: WomenCollectionsQuery;
  boysCollection: BoyfriendCollectionsQuery;
  menu?: EnhancedMenu;
  onClose?: () => void;
  item?: ChildEnhancedMenuItem;
};

export function Layout({
  collection,
  womenCollection,
  boysCollection,
  children,
  layout,
}: LayoutProps) {
  const {headerMenu, subHeaderMenu, footerMenu} = layout || {};
  return (
    <>
      <div className="min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {headerMenu && subHeaderMenu && layout?.shop.name && (
          <Header
            title={layout.shop.name}
            menu={headerMenu}
            subheader={subHeaderMenu}
            collection={collection}
            womenCollection={womenCollection}
            boysCollection={boysCollection}
          />
        )}
        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

export function MenuMobileNav({menu, onClose}: LayoutProps) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}
