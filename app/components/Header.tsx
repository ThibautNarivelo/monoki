import {useWindowScroll} from 'react-use';
import {CartForm, Image} from '@shopify/hydrogen';
import {Suspense, useEffect, useState} from 'react';
import {Await, Form, useLoaderData, useParams} from '@remix-run/react';
import {motion} from 'framer-motion';

import type {EnhancedMenu} from '~/lib/utils';
import {useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';

import {useDrawer} from './Drawer';
import {CartCount, CartDrawer, MenuDrawer} from './Layout';
import {IconLogin, IconMenu, IconSearch} from './Icon';
import {Account, Login, Search} from './icons';

import {Heading, Input, Link} from '.';
import {Burger} from './icons/Burger';

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
  const {y} = useWindowScroll();
  const [isBigHeader, setIsBigHeader] = useState(true);
  const [isSmallHeader, setIsSmallHeader] = useState(false);

  useEffect(() => {
    const changeHeaderState = isHome && y <= 100;
    setIsBigHeader(changeHeaderState);
    setIsSmallHeader(!changeHeaderState);
  }, [isHome, y]);

  return (
    <motion.header
      role="banner"
      initial={isHome ? {height: '200px'} : {height: '32px'}}
      animate={isHome && y < 100 ? {height: '200px'} : {height: '32px'}}
      transition={{duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95]}}
      className="fixed flex lg:hidden items-end justify-between w-full bg-white z-40 top-0"
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <Burger className="headerIcon" />
        </button>
      </div>

      <Link
        to="/"
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-fit h-fit"
      >
        {isBigHeader && (
          <motion.img
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95]}}
            exit={{opacity: 0}}
            src="/logo/mainLogo.png"
            alt="logo"
            className="w-[13rem]"
          />
        )}
        {isSmallHeader && (
          <motion.img
            initial={{opacity: 0}}
            whileInView={{opacity: 1}}
            transition={{duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95]}}
            exit={{opacity: 0}}
            src="/logo/subLogo.png"
            alt="logo"
            className="w-[2.7rem]"
          />
        )}
      </Link>

      <div className="flex items-center justify-end w-full gap-[.3rem]">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            {/* <IconSearch /> */}
            <Search className="headerIcon" />
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
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </motion.header>
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
  const [isBigHeader, setIsBigHeader] = useState(true);
  const [isSmallHeader, setIsSmallHeader] = useState(false);

  useEffect(() => {
    const changeHeaderState = isHome && y <= 100;
    setIsBigHeader(changeHeaderState);
    setIsSmallHeader(!changeHeaderState);
  }, [isHome, y]);

  return (
    <motion.header
      initial={isHome ? {height: '500px'} : {height: '32px'}}
      animate={isHome && y < 100 ? {height: '500px'} : {height: '32px'}}
      transition={{duration: 1, ease: [0.6, 0.01, 0.05, 0.95]}}
      role="banner"
      className="hidden bg-white lg:flex justify-between items-end fixed z-40 top-0 w-full px-[1.1rem]"
    >
      <div className="flex gap-12">
        {/* MENU */}
        <nav className="switzerLink flex gap-[1rem]">
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
          {isBigHeader && (
            <motion.img
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              transition={{duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95]}}
              exit={{opacity: 0}}
              src="/logo/mainLogo.png"
              alt="logo"
              className="w-[30rem]"
            />
          )}
          {isSmallHeader && (
            <motion.img
              initial={{opacity: 0}}
              whileInView={{opacity: 1}}
              transition={{duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95]}}
              exit={{opacity: 0}}
              src="/logo/subLogo.png"
              alt="logo"
              className="w-[3rem]"
            />
          )}
        </Link>
      </div>

      <div className="flex items-center justify-end gap-[.6rem] overflow-hidden">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex gap-10 "
        >
          <button
            type="submit"
            className="switzerLink h-fit flex gap-1 items-end"
          >
            <Search className="headerIcon" />
          </button>
        </Form>
        <AccountLink />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </motion.header>
  );
}

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
