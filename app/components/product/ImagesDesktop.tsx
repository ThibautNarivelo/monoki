import React from 'react';
import {Image} from '@shopify/hydrogen';

import type {MediaFragment} from 'storefrontapi.generated';

type ImageProps = {
  data: any;
  aspectRatio: string;
  sizes: string;
  className: string;
};

type MediaProps = {
  __typename: string;
  image: ImageProps;
  id?: string | number;
};

type ImageGalleryProps = {
  media: {
    nodes: MediaFragment[];
  };
};

export function ImagesDesktop({media}: ImageGalleryProps) {
  return (
    <div
      className="hidden relative  flex-row min-h-full bg-blue-100 overflow-y-scroll hiddenScroll
        lg:flex lg:flex-col lg:w-2/4"
    >
      {media.nodes.map((media) => {
        const image = media.__typename === 'MediaImage' ? media.image : null;
        return (
          <div key={media.id || image?.id}>
            {image && (
              <Image
                data={image}
                aspectRatio={'4/5'}
                sizes={'(min-width: 48em) 30vw, 90vw'}
                className="object-cover object-center w-[100vh] h-full"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
