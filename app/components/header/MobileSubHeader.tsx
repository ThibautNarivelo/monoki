import {Link} from '@remix-run/react';
import {motion} from 'framer-motion';

import type {EnhancedMenu} from '~/lib/utils';

import {Close} from '../icons';

export default function MobileSubHeader({
  isOpen,
  onClose,
  menu,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  menu?: EnhancedMenu;
}) {
  return (
    <div className="relative flex h-screen w-screen z-50 bg-white">
      <div className=" relative flex justify-between w-full mx-[1.1rem] h-fit ">
        <img src="/logo/subLogo.png" alt="logo" className="w-[2rem] asp" />
        <Close
          onClick={onClose}
          className=" fill-neutral-900 w-[1rem] h-auto cursor-pointer"
        />
        <div className="absolute h-[1px] ml-[-1.1rem] w-screen bottom-0 bg-neutral-900" />
      </div>
      {/* NAV TAB */}
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
          >
            {menu.items[2].title}
          </Link>
          <button onClick={onClose} className="absolute top-5 right-5">
            close
          </button>
        </motion.div>
      )}
    </div>
  );
}
