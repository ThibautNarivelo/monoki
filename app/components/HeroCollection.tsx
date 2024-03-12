import {Link} from '@remix-run/react';
import {AnimatePresence, motion, useInView} from 'framer-motion';
import React, {useEffect} from 'react';
import {Image} from '@shopify/hydrogen';
import {useWindowScroll} from 'react-use';

import type {AllPagesQuery} from 'storefrontapi.generated';

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
      className="relative"
    >
      <AnimatePresence initial={false}>
        {inView && page.pageTitle?.value && (
          <div className="fixed bottom-10 left-10  min-w-screen  overflow-hidden">
            <motion.h1
              initial={{y: scrollDirection === 'down' ? -50 : 50}}
              animate={{y: 0}}
              exit={{
                y: scrollDirection === 'down' ? -50 : 50,
                // transition: {duration: 1, ease: [0.6, 0.01, 0.05, 0.95]},
              }}
              transition={{duration: 0.5, ease: [0.6, 0.01, 0.05, 0.95]}}
              className="leading-[55px] uppercase font-bold text-white text-[3rem]"
            >
              {page.pageTitle?.value}
            </motion.h1>
          </div>
        )}
      </AnimatePresence>
      <Image
        src={page.imageCover?.reference?.image?.url}
        alt={page.imageCover?.reference?.image?.altText || ''}
        width={page.imageCover?.reference?.image?.width || 0}
        height={page.imageCover?.reference?.image?.height || 0}
        className="w-full"
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
