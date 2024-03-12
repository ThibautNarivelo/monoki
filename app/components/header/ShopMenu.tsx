import type {AnimationProps} from 'framer-motion';
import {motion} from 'framer-motion';

type ShopMenuProps = {
  shop?: string;
  headerMenu?: string;
  footerMenu?: string;
  className?: string;
  isHome?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
};

export default function ShopMenu({
  shop,
  headerMenu,
  footerMenu,
  className,
  isHome,
  onEnter,
  onLeave,
}: ShopMenuProps) {
  return (
    <motion.div
      //   initial={{y: '-100%'}}
      initial={{y: isHome ? '100%' : '-100%'}}
      //   animate={{y: 0}}
      animate={{y: isHome ? 0 : 0}}
      //   exit={{
      //     y: '-100%',
      //     transition: {duration: 2.5, ease: [0.6, 0.01, 0.05, 0.95]},
      //   }}
      exit={{y: isHome ? '-100%' : '-100%'}}
      transition={{duration: 1, ease: [0.6, 0.01, 0.05, 0.95]}}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={className}
    >
      coucou
    </motion.div>
  );
}
