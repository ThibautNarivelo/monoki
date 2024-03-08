import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {useWindowScroll} from 'react-use';

import type {AllPagesQuery} from 'storefrontapi.generated';

export default function HeroCollection({
  pages,
}: {
  pages: AllPagesQuery['pages'] | undefined;
}) {
  return (
    <>
      {pages && (
        <>
          {pages.nodes.map((page) => (
            <>
              <Link
                key={page.id}
                to={`/collections/${page.collectionLink?.reference?.handle}`}
                className="relative "
              >
                <h1 className="absolute bottom-0 right-0 p-[5rem] text-red-500">
                  {/* {page.pageTitle?.value} */}
                  {pages.nodes[0].pageTitle?.value}
                </h1>
                <Image
                  className="w-full h-[900px] object-cover"
                  src={page.imageCover?.reference?.image?.url}
                  alt={page.imageCover?.reference?.image?.altText || ''}
                  width={page.imageCover?.reference?.image?.width || 0}
                  height={page.imageCover?.reference?.image?.height || 0}
                  //   sizes="(min-width: 48em) 50vw, 90vw"
                />
              </Link>
              <h1 className="fixed bottom-0 left-0 p-[5rem] will-change-contents">
                {pages.nodes[0].pageTitle?.value}
              </h1>
            </>
          ))}
        </>
      )}
    </>
  );
}
