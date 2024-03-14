import {Link} from '@remix-run/react';
import type {AnimationProps} from 'framer-motion';
import {AnimatePresence, motion} from 'framer-motion';
import {Image} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';

import type {
  AllCollectionsQuery,
  BoyfriendCollectionsQuery,
  WomenCollectionsQuery,
} from 'storefrontapi.generated';
import type {EnhancedMenu} from '~/lib/utils';

import {LinkArrow} from '../icons';

export default function ShopMenu({
  collection,
  womenCollection,
  boysCollection,
  subMenu,
}: {
  collection: AllCollectionsQuery;
  womenCollection: WomenCollectionsQuery;
  boysCollection: BoyfriendCollectionsQuery;
  subMenu?: EnhancedMenu;
}) {
  const [isWomen, setIsWomen] = useState(false);
  const [isBoyfriend, setIsBoyfriend] = useState(false);
  const [isBijoux, setIsBijoux] = useState(false);
  const [isAccessoires, setIsAccessoires] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (title: string) => {
    switch (title) {
      case subMenu?.items[0]?.title:
        setIsWomen(true);
        setIsBoyfriend(false);
        setIsBijoux(false);
        setIsAccessoires(false);
        break;
      case subMenu?.items[1]?.title:
        setIsWomen(false);
        setIsBoyfriend(true);
        setIsBijoux(false);
        setIsAccessoires(false);
        break;
      // case 'bijoux':
      //   setIsWomen(false);
      //   setIsBoyfriend(false);
      //   setIsBijoux(true);
      //   setIsAccessoires(false);
      //   break;
      // case 'accessoires':
      //   setIsWomen(false);
      //   setIsBoyfriend(false);
      //   setIsBijoux(false);
      //   setIsAccessoires(true);
      //   break;
      default:
        setIsWomen(false);
        setIsBoyfriend(false);
        setIsBijoux(false);
        setIsAccessoires(false);
        break;
    }
  };

  const handleCollectionHover = () => {
    setIsHovered(true);
  };

  return (
    <>
      {/* WOMEN */}
      <div className="w-full flex justify-start iten gap-[4rem] p-[1.1rem] ">
        <div
          // className="bg-red-200 flex flex-col justify-around w-full h-full items-start gap-[4.1rem] p-[1.1rem] overflow-hidden"
          className="flex flex-col justify-start"
        >
          {subMenu?.items.map((item) => {
            return (
              <Link
                key={item?.id}
                to={item?.to}
                onMouseEnter={() => handleMouseEnter(item?.title)}
                onClick={() => handleMouseEnter(item?.title)}
                className="subHeaderTitle flex justify-start items-baseline gap-[.5rem] pr-[1rem] group"
              >
                {item?.title}
                <LinkArrow className="subHeaderIcon rotate-45 opacity-0 group-hover:opacity-100" />
              </Link>
            );
          })}
        </div>
        {isWomen && (
          <div className="relative w-full h-full p-[1.1rem]">
            {womenCollection?.collections?.edges.map((item) => {
              return (
                <div
                  key={item?.node?.id}
                  className="flex flex-row justify-between w-full"
                >
                  <Link
                    to={`/collections/${item?.node?.handle} `}
                    className="subHeaderLink"
                  >
                    {item?.node?.titleCollections?.value || ''}
                  </Link>
                </div>
              );
            })}
            <div className="absolute top-0 right-0 overflow-hidden">
              <Image
                src={womenCollection.collections.edges[0].node.image?.url || ''}
                // alt={item?.node?.image?.altText || ''}
                // width={item?.node?.image?.width || 100}
                // height={item?.node?.image?.height || 100}
                className="object-cover max-h-[300px]"
              />
            </div>
          </div>
        )}
        {isBoyfriend && (
          <div className="relative w-full h-full p-[1.1rem]">
            {boysCollection?.collections?.edges.map((item) => {
              return (
                <div
                  key={item?.node?.id}
                  className="flex flex-row justify-between w-full"
                >
                  <Link
                    to={`/collections/${item?.node?.handle} `}
                    className="subHeaderLink"
                  >
                    {item?.node?.titleCollections?.value || ''}
                  </Link>
                </div>
              );
            })}
            <div className="absolute top-0 right-0 overflow-hidden">
              <Image
                src={boysCollection.collections.edges[0].node.image?.url || ''}
                // alt={item?.node?.image?.altText || ''}
                // width={item?.node?.image?.width || 100}
                // height={item?.node?.image?.height || 100}
                className="object-cover max-h-[300px]"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
