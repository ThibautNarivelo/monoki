import {Link} from '@remix-run/react';
import {AnimatePresence, motion} from 'framer-motion';
import React, {useEffect, useState} from 'react';

import type {EnhancedMenu} from '~/lib/utils';
import type {WomenCollectionsQuery} from 'storefrontapi.generated';

import {Arrow, Close} from '../icons';
import {Separator} from '../Separator';
import {CountrySelector} from '../CountrySelector';

export default function MobileSubHeader({
  isOpen,
  onOpen,
  onClose,
  menu,
  subMenu,
  womenCollection,
  boysCollection,
}: {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  menu?: EnhancedMenu;
  subMenu?: EnhancedMenu;
  womenCollection: WomenCollectionsQuery;
  boysCollection: WomenCollectionsQuery;
}) {
  const [isSecondLevelOpen, setIsSecondLevelOpen] = useState(false); // false
  const [isWomen, setIsWomen] = useState(false); // false
  const [isBoyfriend, setIsBoyfriend] = useState(false);

  const handleSecondLevelOpen = () => {
    setIsSecondLevelOpen(!isSecondLevelOpen);
  };

  const handleMouseSenconLevel = (title: string) => {
    switch (title) {
      case subMenu?.items[0]?.title:
        setIsWomen(true);
        setIsSecondLevelOpen(true);
        setIsBoyfriend(false);
        break;
      case subMenu?.items[1]?.title:
        setIsBoyfriend(true);
        setIsSecondLevelOpen(true);
        setIsWomen(false);
        break;
      default:
        setIsWomen(false);
        setIsBoyfriend(false);
        setIsBoyfriend(false);
        break;
    }
  };

  const isEnglish =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('/en-us');
  const isFrench = !isEnglish;

  return (
    <div className="fixed flex flex-col h-screen w-full z-50 bg-white">
      {/* FIRST LEVEL */}
      <div className=" relative flex justify-between h-fit ">
        <img
          src="/logo/subLogo.png"
          alt="logo"
          className="w-[2rem] ml-[1.1rem]"
        />
        <Close
          onClick={onClose}
          className=" fill-neutral-900 w-[1rem] h-auto cursor-pointer mr-[1.1rem]"
        />
        <Separator />
      </div>

      {subMenu?.items.map((item) => {
        return (
          <div key={item?.id} className="h-fit">
            {item?.tags.includes('femme') ||
            item?.tags.includes('boyfriend') ||
            item?.tags.includes('women') ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => handleMouseSenconLevel(item?.title)}
                onKeyDown={() => handleMouseSenconLevel(item?.title)}
                className="subHeaderLinkMobile"
              >
                <div className="w-full flex items-center  px-[1.1rem]">
                  <span className="flex-1">{item?.title}</span>
                  <Arrow className="iconHeaderMobile" />
                </div>
                <Separator />
              </div>
            ) : (
              <Link
                to={item?.to}
                className="subHeaderLinkMobile"
                onClick={onClose}
              >
                <div className="w-full flex items-center  px-[1.1rem]">
                  <span className="flex-1">{item?.title}</span>
                  <Arrow className="iconHeaderMobile" />
                </div>
                <Separator />
              </Link>
            )}
          </div>
        );
      })}
      <CountrySelector />
      {/* <div className="subHeaderLinkMobile bg-red-100">
        <Separator />
      </div> */}

      {/* SECOND LEVEL */}
      <AnimatePresence>
        {isSecondLevelOpen && (
          <motion.div
            initial={{x: '100%'}}
            animate={{x: 0}}
            exit={{
              x: '100%',
              transition: {duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95]},
            }}
            transition={{duration: 0.4, ease: [0.6, 0.01, 0.05, 0.95]}}
            className="fixed inset-0  bg-white "
          >
            <div className="relative flex justify-between h-fit">
              <img
                src="/logo/subLogo.png"
                alt="logo"
                className="w-[2rem] ml-[1.1rem]"
              />
              <Close
                onClick={onClose}
                className=" fill-neutral-900 w-[1rem] h-auto cursor-pointer mr-[1.1rem]"
              />
              <Separator />
            </div>
            <div className="relative flex justify-between h-fit">
              {isFrench ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleSecondLevelOpen}
                  onKeyDown={handleSecondLevelOpen}
                  className="subHeaderLinkMobile relative ml-[1.1rem]"
                >
                  <Arrow className="iconHeaderMobile absolute left-0 top-0 py-[.5rem]  !rotate-90" />
                  <span className="ml-[2rem]">Retour</span>
                </div>
              ) : (
                <span className="subHeaderLinkMobile ml-[3.1rem]">
                  Go Back{' '}
                  <Arrow className="iconHeaderMobile absolute left-0 top-0 mx-[1.1rem] !rotate-90" />
                </span>
              )}

              {/* WOMEN LEVEL */}
              {isWomen && (
                <div className="subHeaderLinkMobile relative mr-[1.1rem]">
                  {womenCollection?.collections?.edges.map((item) => {
                    return (
                      <>
                        {item.node.handle === 'femme' && (
                          <div
                            role="button"
                            tabIndex={0}
                            key={item?.node?.id}
                            onClick={onClose}
                            onKeyDown={onClose}
                            className="flex flex-row justify-between w-full"
                          >
                            <Link to={`/collections/${item?.node?.handle} `}>
                              {item.node.titleCollections?.value || 'Femme'}
                            </Link>
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              )}
              {isBoyfriend && (
                <div className="subHeaderLinkMobile relative mr-[1.1rem]">
                  {boysCollection?.collections?.edges.map((item) => {
                    return (
                      <>
                        {item.node.handle === 'boyfriend' && (
                          <div
                            role="button"
                            tabIndex={0}
                            key={item?.node?.id}
                            onClick={onClose}
                            onKeyDown={onClose}
                            className="flex flex-row justify-between w-full"
                          >
                            <Link to={`/collections/${item?.node?.handle} `}>
                              {item.node.titleCollections?.value || 'Boyfriend'}
                            </Link>
                          </div>
                        )}
                      </>
                    );
                  })}
                </div>
              )}
              <Separator />
            </div>

            {isWomen && (
              <div className="relative flex flex-col justify-between h-fit">
                {womenCollection?.collections?.edges.map((item) => {
                  return (
                    <div key={item?.node?.id} className="subHeaderLinkMobile">
                      <Link
                        to={`/collections/${item?.node?.handle} `}
                        onClick={onClose}
                      >
                        <span className="px-[1.1rem]">
                          {item?.node?.titleCollections?.value || ''}
                        </span>
                        <Separator />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
            {isBoyfriend && (
              <div className="relative flex flex-col justify-between h-fit">
                {boysCollection?.collections?.edges.map((item) => {
                  return (
                    <div key={item?.node?.id} className="subHeaderLinkMobile">
                      <Link
                        to={`/collections/${item?.node?.handle} `}
                        onClick={onClose}
                      >
                        <span className="px-[1.1rem]">
                          {item?.node?.titleCollections?.value || ''}
                        </span>
                        <Separator />
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}