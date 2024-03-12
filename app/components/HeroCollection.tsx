import {Link} from '@remix-run/react';
import {AnimatePresence, motion, useInView} from 'framer-motion';
import React, {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {useWindowScroll} from 'react-use';

import type {AllPagesQuery} from 'storefrontapi.generated';

import {LinkArrow} from './icons';
import {Underline} from './Underline';

type PageNode = AllPagesQuery['pages']['nodes'][0];

function PageLink({page}: {page: PageNode}) {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      // eslint-disable-next-line no-console
      console.log(`Link ${page.id} is in view`);
    }
  }, [inView, page.id]);

  const {y} = useWindowScroll();
  const scrollDirection = y > 0 ? 'down' : 'up';

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('scrollDirection', scrollDirection);
  }, [scrollDirection]);

  return (
    <Link
      key={page.id}
      ref={ref}
      to={`/collections/${page.collectionLink?.reference?.handle}`}
      className="relative overflow-hidden bg-red-200"
    >
      <AnimatePresence initial={false}>
        {inView && page && (
          <div
            className="fixed bottom-10 left-4 min-w-screen overflow-hidden
              lg:left-5"
          >
            <motion.h1
              initial={{y: scrollDirection === 'down' ? -50 : 50}}
              animate={{y: 0}}
              exit={{
                y: scrollDirection === 'up' ? -50 : 50,
                transition: {duration: 0.05, ease: [0.6, 0.01, 0.05, 0.95]},
              }}
              transition={{duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95]}}
              className="titleCollection"
            >
              {page.pageTitle?.value}
            </motion.h1>
            <AnimatePresence>
              {page.linkTitle?.value && (
                <div className="overflow-hidden group">
                  <motion.div
                    initial={{y: scrollDirection === 'down' ? -50 : 50}}
                    animate={{y: 0}}
                    exit={{
                      y: scrollDirection === 'up' ? -50 : 50,
                      transition: {
                        duration: 0.5,
                        ease: [0.6, 0.01, 0.05, 0.95],
                      },
                    }}
                    transition={{duration: 0.7, ease: [0.6, 0.01, 0.05, 0.95]}}
                    className="relative flex justify-start w-fit items-baseline 
                    font-didot text-[1rem] text-white uppercase overflow-hidden
                    lg:text-[1.125rem]"
                  >
                    <span className="mt-[-5px] lg:mt-[.5px]">
                      {page.linkTitle?.value}
                    </span>
                    <LinkArrow className="w-3 h-3 ml-2 fill-white" />
                    <Underline />
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
      <Image
        src={page.imageCover?.reference?.image?.url}
        alt={page.imageCover?.reference?.image?.altText || ''}
        width={page.imageCover?.reference?.image?.width || 0}
        height={page.imageCover?.reference?.image?.height || 0}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className=" object-contain w-full"
      />
    </Link>
  );
}

export default function HeroCollection({
  pages,
}: {
  pages: AllPagesQuery['pages'];
}) {
  return (
    <>
      {pages && (
        <>
          {pages.nodes.map((page) => (
            <PageLink key={page.id} page={page} />
          ))}
        </>
      )}
    </>
  );
}
