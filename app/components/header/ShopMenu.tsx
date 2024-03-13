import type {AnimationProps} from 'framer-motion';
import {AnimatePresence, motion} from 'framer-motion';

type ShopMenuProps = {
  shop?: string;
  headerMenu?: string;
  footerMenu?: string;
  className?: string;
  isHome?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
  onOut?: () => void;
  isOpen?: boolean;
};

export default function ShopMenu({
  shop,
  headerMenu,
  footerMenu,
  className,
  isHome,
  onEnter,
  onLeave,

  isOpen,
}: ShopMenuProps) {
  return (
    <div className="flex justify-around w-full h-full items-start gap-[4.1rem] p-[1.1rem] overflow-hidden">
      <div className="h-full flex flex-col group">
        <div className="subHeaderTitle relative inline-flex items-center pr-[.5rem] overflow-hidden">
          Boutique femme
          {/* <LinkArrow className="subHeaderIcon -translate-x-full" /> */}
        </div>
        <div className="subHeaderTitle relative inline-flex items-center pr-[.5rem] overflow-hidden">
          Boutique homme
        </div>
        <div className="subHeaderTitle relative inline-flex items-center pr-[.5rem] overflow-hidden">
          Bijoux
        </div>
        <div className="subHeaderTitle relative inline-flex items-center pr-[.5rem] overflow-hidden">
          Accessoires
        </div>
      </div>
      <div className="h-full flex flex-col w-full py-[1rem] group">
        <div className="subHeaderLink inline-flex items-center">Tout</div>
        <div className="subHeaderLink inline-flex items-center">Nouveautés</div>
        <div className="subHeaderLink inline-flex items-center">Kimonos</div>
        <div className="subHeaderLink inline-flex items-center">Tout</div>
        <div className="subHeaderLink inline-flex items-center">Nouveautés</div>
        <div className="subHeaderLink inline-flex items-center">Kimonos</div>
        <div className="subHeaderLink inline-flex items-center">Kimonos</div>
      </div>
      <div className="bg-blue-200 w-[500px] h-full">
        <span>IMAGE</span>
      </div>
    </div>
  );
}
