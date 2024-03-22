import React from 'react';
import {Image} from '@shopify/hydrogen';

import type {MediaFragment} from 'storefrontapi.generated';

type ImagesMobileProps = {
  media: {
    nodes: MediaFragment[];
  };
  currentImg: number;
  onPrevClick: () => void;
  onNextClick: () => void;
};

export function ImagesMobile({
  media,
  currentImg,
  onPrevClick,
  onNextClick,
}: ImagesMobileProps) {
  return (
    <div className="relative flex lg:hidden flex-col bg-blue-100 min-h-full overflow-hidden">
      <button onClick={onPrevClick} className="absolute top-1/2 left-3">
        ←
      </button>
      <button onClick={onNextClick} className="absolute top-1/2 right-3">
        →
      </button>
      {media.nodes.map((media, idx) => {
        const image = media.__typename === 'MediaImage' ? media.image : null;
        return (
          <div
            key={media.id || image?.id}
            className={currentImg === idx ? 'block' : 'hidden'}
          >
            {image && (
              <Image
                data={image}
                aspectRatio={'4/5'}
                sizes={'(min-width: 48em) 30vw, 90vw'}
                className="object-cover w-full h-[80vh]"
              />
            )}
          </div>
        );
      })}
      {/* carousel indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {media.nodes.map((_, idx) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            className={`h-1 w-1 rounded-full ${
              currentImg === idx ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
