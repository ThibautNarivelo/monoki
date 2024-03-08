import {useWindowScroll} from 'react-use';
import {CartForm, Image} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {Form, useLoaderData, useParams} from '@remix-run/react';
import {motion} from 'framer-motion';

import type {EnhancedMenu} from '~/lib/utils';
import {useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';

import {useDrawer} from './Drawer';
import {AccountLink, CartCount, CartDrawer, MenuDrawer} from './Layout';
import {IconMenu, IconSearch} from './Icon';

import {Heading, Input, Link} from '.';

export function Header({title, menu}: {title: string; menu?: EnhancedMenu}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <>
        <DesktopHeader
          isHome={isHome}
          title={title}
          menu={menu}
          openCart={openCart}
        />
        <MobileHeader
          isHome={isHome}
          title={title}
          openCart={openCart}
          openMenu={openMenu}
        />
      </>
    </>
  );
}

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80  text-contrast  shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome ? 'focus:border-contrast/20 ' : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
}) {
  const params = useParams();
  const {y} = useWindowScroll();

  return (
    <motion.header
      initial={isHome ? {height: '500px'} : {height: '32px'}}
      animate={isHome && y < 100 ? {height: '500px'} : {height: '32px'}}
      transition={{duration: 1, ease: [0.6, 0.01, 0.05, 0.95]}}
      role="banner"
      className="hidden bg-white lg:flex justify-between items-end fixed z-40 top-0 w-full"
    >
      <div className="flex gap-12">
        {/* MENU */}
        <nav className="flex gap-8">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {/* LOGO */}
        <Link
          to="/"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-fit h-fit"
        >
          <motion.img
            animate={`${
              (isHome && y > 100) || !isHome ? {opacity: 0} : {opacity: 1}
            }`}
            transition={{delay: 0.5}}
            src="/logo/mainLogo.png"
            alt="logo"
            className={`${
              (isHome && y > 100) || !isHome ? 'hidden' : 'block w-[25rem]'
            }`}
          />
          <motion.img
            animate={`${
              (isHome && y > 100) || !isHome ? {opacity: 1} : {opacity: 0}
            }`}
            transition={{delay: 0.5}}
            src="/logo/subLogo.png"
            alt="logo"
            className={`${
              (isHome && y > 100) || !isHome ? 'block w-[3rem]' : 'hidden'
            }`}
          />
        </Link>
      </div>
      {
        // CAT
      }
      {/* SEARCH */}
      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          {/* <Input
            className={
              isHome ? 'focus:border-contrast/20 ' : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          /> */}
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </motion.header>
  );
}
