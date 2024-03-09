import {useWindowScroll} from 'react-use';
import {CartForm, Image} from '@shopify/hydrogen';
import {Suspense, useEffect, useState} from 'react';
import {Await, Form, useLoaderData, useParams} from '@remix-run/react';
import {motion, useAnimate, stagger, animate} from 'framer-motion';

import type {EnhancedMenu} from '~/lib/utils';
import {useIsHomePath} from '~/lib/utils';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';

import {useDrawer} from './Drawer';
import {CartCount, CartDrawer, MenuDrawer} from './Layout';
import {IconLogin, IconMenu, IconSearch} from './Icon';
import {Account, Login, Search} from './icons';
import {Burger} from './icons/Burger';

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
      className="fixed flex lg:hidden items-end justify-between w-full bg-white z-40 top-0 px-[.7rem]"
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <Burger className="headerIcon" />
        </button>
      </div>

      <div className="flex flex-col justify-center items-center w-auto p-[2rem] h-fit gap-5">
        <div className="overflow-hidden h-auto w-auto">
          <motion.img
            initial={{y: 40}}
            whileInView={{y: 0}}
            transition={{duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95]}}
            src="/logo/subLogo.png"
            alt="logo"
            className={`${isSmallHeader ? 'w-[1rem] mt-5' : 'w-[2.5rem]'} `}
          />
        </div>
        <div className="flex flex-col justify-center items-center overflow-hidden">
          {isBigHeader && (
            <>
              <motion.div
                initial={{y: -32}}
                whileInView={{y: 0}}
                exit={{y: -32}}
                transition={{
                  duration: 1,
                  ease: [0.6, 0.01, 0.05, 0.95],
                  delay: 0.5,
                }}
                className="font-didot text-[2.35rem] uppercase -tracking-widest leading-[32px] bg-whit  z-10"
              >
                MONOKI
              </motion.div>
              <motion.div
                initial={{y: -45}}
                whileInView={{y: 0}}
                exit={{y: -45}}
                transition={{
                  duration: 1,
                  ease: [0.6, 0.01, 0.05, 0.95],
                  delay: 0.8,
                }}
                className="font-didot text-[1rem] truncate mt-[-5px]"
              >
                by Diane Goldstein
              </motion.div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end w-full gap-[.3rem] overflow-hidden">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex gap-10 "
        >
          <motion.button
            type="submit"
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{
              duration: 1,
              ease: [0.6, 0.01, 0.05, 0.95],
              delay: 0.4,
            }}
            className="switzerLink h-fit flex gap-1 items-end"
          >
            <Search className="headerIcon" />
          </motion.button>
        </Form>
        <motion.div
          initial={{opacity: 0, y: 100}}
          animate={{opacity: 1, y: 0}}
          transition={{
            duration: 1,
            ease: [0.6, 0.01, 0.05, 0.95],
            delay: 0.25,
          }}
        >
          <AccountLink />
        </motion.div>
        <motion.div
          initial={{opacity: 0, y: 100}}
          animate={{opacity: 1, y: 0}}
          transition={{
            duration: 1,
            ease: [0.6, 0.01, 0.05, 0.95],
            delay: 0,
          }}
        >
          <CartCount isHome={isHome} openCart={openCart} />
        </motion.div>
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
      initial={isHome ? {height: '300px'} : {height: '32px'}}
      animate={isHome && y < 100 ? {height: '300px'} : {height: '32px'}}
      transition={{duration: 1, ease: [0.6, 0.01, 0.05, 0.95]}}
      role="banner"
      className="hidden bg-white lg:flex justify-between items-end fixed z-40 top-0 w-full px-[1.1rem] overflow-hidden"
    >
      <div className="flex gap-12">
        {/* MENU */}
        <motion.nav
          className="switzerLink flex gap-[1rem]"
          initial={{y: 200}}
          animate={{y: 0}}
          transition={{
            duration: 1,
            staggerChildren: 1,
            delayChildren: 0.5,
            ease: [0.6, 0.01, 0.05, 0.95],
          }}
        >
          {/* Top level menu items
          {(menu?.items || []).map(
            (item) => (
              console.log(item),
              (
                <Link
                  key={item.id}
                  to={item.to}
                  target={item.target}
                  prefetch="intent"
                  className={({isActive}) =>
                    isActive ? 'pb-1 border-b -mb-px overflow-hidden' : 'pb-1'
                  }
                >
                  {item.title}
                </Link>
              )
            ),
          )} */}
          {menu?.items[0] && (
            <motion.div
              initial={{opacity: 0, y: 100}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 1, ease: [0.6, 0.01, 0.05, 0.95]}}
            >
              <Link
                to={menu.items[0].to}
                target={menu.items[0].target}
                prefetch="intent"
                className={({isActive}) =>
                  isActive ? 'pb-1 border-b -mb-px overflow-hidden' : 'pb-1'
                }
              >
                {menu.items[0].title}
              </Link>
            </motion.div>
          )}
          {menu?.items[1] && (
            <motion.div
              initial={{opacity: 0, y: 100}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 1,
                ease: [0.6, 0.01, 0.05, 0.95],
                delay: 0.35,
              }}
            >
              <Link
                to={menu.items[1].to}
                target={menu.items[1].target}
                prefetch="intent"
                className={({isActive}) =>
                  isActive ? 'pb-1 border-b -mb-px overflow-hidden' : 'pb-1'
                }
              >
                {menu.items[1].title}
              </Link>
            </motion.div>
          )}
          {menu?.items[2] && (
            <motion.div
              initial={{opacity: 0, y: 100}}
              animate={{opacity: 1, y: 0}}
              transition={{
                duration: 1,
                ease: [0.6, 0.01, 0.05, 0.95],
                delay: 0.5,
              }}
            >
              <Link
                to={menu.items[2].to}
                target={menu.items[2].target}
                prefetch="intent"
                className={({isActive}) =>
                  isActive ? 'pb-1 border-b -mb-px overflow-hidden' : 'pb-1'
                }
              >
                {menu.items[2].title}
              </Link>
            </motion.div>
          )}
        </motion.nav>
        {/* LOGO */}
        <Link
          to="/"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-fit h-fit overflow-hidden"
        >
          <div className="flex flex-col justify-center items-center w-auto p-[2rem] h-fit gap-5">
            <div className="overflow-hidden h-auto w-auto">
              <motion.img
                initial={{y: 75}}
                whileInView={{y: 0}}
                transition={{duration: 1.5, ease: [0.6, 0.01, 0.05, 0.95]}}
                src="/logo/subLogo.png"
                alt="logo"
                className={`${isSmallHeader ? 'w-[2.5rem] mt-5' : 'w-[5rem]'} `}
              />
            </div>
            <div className="flex flex-col overflow-hidden">
              {isBigHeader && (
                <>
                  <motion.div
                    initial={{y: -65}}
                    whileInView={{y: 0}}
                    exit={{y: -65}}
                    transition={{
                      duration: 1,
                      ease: [0.6, 0.01, 0.05, 0.95],
                      delay: 0.5,
                    }}
                    className="font-didot text-[5rem] uppercase -tracking-widest leading-[65px] bg-white  z-10"
                  >
                    MONOKI
                  </motion.div>
                  <motion.div
                    initial={{y: -105}}
                    whileInView={{y: 0}}
                    exit={{y: -105}}
                    transition={{
                      duration: 1,
                      ease: [0.6, 0.01, 0.05, 0.95],
                      delay: 0.8,
                    }}
                    className="font-didot text-[2.25rem] truncate mt-[-10px]"
                  >
                    by Diane Goldstein
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-end gap-[.6rem] overflow-hidden">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex gap-10 "
        >
          <motion.button
            type="submit"
            initial={{opacity: 0, y: 100}}
            animate={{opacity: 1, y: 0}}
            transition={{
              duration: 1,
              ease: [0.6, 0.01, 0.05, 0.95],
              delay: 0.4,
            }}
            className="switzerLink h-fit flex gap-1 items-end"
          >
            <Search className="headerIcon" />
          </motion.button>
        </Form>
        <motion.div
          initial={{opacity: 0, y: 100}}
          animate={{opacity: 1, y: 0}}
          transition={{
            duration: 1,
            ease: [0.6, 0.01, 0.05, 0.95],
            delay: 0.25,
          }}
        >
          <AccountLink />
        </motion.div>
        <motion.div
          initial={{opacity: 0, y: 100}}
          animate={{opacity: 1, y: 0}}
          transition={{
            duration: 1,
            ease: [0.6, 0.01, 0.05, 0.95],
            delay: 0,
          }}
        >
          <CartCount isHome={isHome} openCart={openCart} />
        </motion.div>
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
