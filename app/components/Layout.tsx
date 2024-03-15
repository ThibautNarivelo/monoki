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
  children: React.ReactNode;
  womenCollection: WomenCollectionsQuery;
  boysCollection: BoyfriendCollectionsQuery;
  menu: EnhancedMenu;
  onClose: () => void;
  item: ChildEnhancedMenuItem;
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
      {/* {footerMenu && <Footer menu={footerMenu} />} */}
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

// function Footer({menu}: {menu?: EnhancedMenu}) {
//   const isHome = useIsHomePath();
//   const itemsCount = menu
//     ? menu?.items?.length + 1 > 4
//       ? 4
//       : menu?.items?.length + 1
//     : [];

//   return (
//     <Section
//       divider={isHome ? 'none' : 'top'}
//       as="footer"
//       role="contentinfo"
//       className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
//         bg-primary  text-contrast overflow-hidden`}
//     >
//       <FooterMenu menu={menu} />
//       <CountrySelector />
//       <div
//         className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
//       >
//         &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
//         Licensed Open Source project.
//       </div>
//     </Section>
//   );
// }

function FooterLink({item}: LayoutProps) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({menu}: LayoutProps) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Disclosure>
            {({open}) => (
              <>
                <Disclosure.Button className="text-left md:cursor-default">
                  <Heading className="flex justify-between" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="md:hidden">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Disclosure.Button>
                {item?.items?.length > 0 ? (
                  <div
                    className={`${
                      open ? `max-h-48 h-fit` : `max-h-0 md:max-h-fit`
                    } overflow-hidden transition-all duration-300`}
                  >
                    <Suspense data-comment="This suspense fixes a hydration bug in Disclosure.Panel with static prop">
                      <Disclosure.Panel static>
                        <nav className={styles.nav}>
                          {item.items.map((subItem: ChildEnhancedMenuItem) => (
                            <>hello</>
                            // <FooterLink key={subItem.id} item={subItem} />
                          ))}
                        </nav>
                      </Disclosure.Panel>
                    </Suspense>
                  </div>
                ) : null}
              </>
            )}
          </Disclosure>
        </section>
      ))}
    </>
  );
}
