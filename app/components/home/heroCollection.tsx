import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import {Image} from '@shopify/hydrogen';

import type {CustomHomepageQuery} from 'storefrontapi.generated';

interface HeroCollectionProps {
  page: CustomHomepageQuery['page'];
  isHome: boolean;
  y: number;
}

export default function HeroCollection({page, isHome}: HeroCollectionProps) {
  const containerRef = React.useRef<HTMLAnchorElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  const inView = useInView(containerRef, {
    amount: 0.15,
  });

  return (
    <>
      {page?.metafield?.references?.nodes?.map((collection, index) => {
        // const {title, image, link} = collection;
        // const {handle} = link?.reference || {};

        return (
          <Link
            key={collection.id}
            to={collection.field?.value || '/'}
            ref={containerRef}
            className="relative overflow-hidden"
          >
            <AnimatePresence>
              {inView && (
                <motion.div
                  initial={{y: -50}}
                  animate={{y: 0}}
                  exit={{y: -50}}
                  transition={{duration: 0.5}}
                  className="absolute top-0 left-0 w-full h-full"
                >
                  <Image
                    src={collection.field?.value}
                    alt={collection.field?.value}
                    className="object-cover w-full h-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.h1
              ref={titleRef}
              initial={{y: 50}}
              animate={{y: 0}}
              exit={{y: 50}}
              transition={{duration: 0.5}}
              className="absolute bottom-0 left-0 w-full text-white text-center"
            >
              {title}
            </motion.h1>
          </Link>
        );
      })}
    </>
  );
}
