import React from 'react';
import {Image} from '@shopify/hydrogen';

import type {
  MediaFragment,
  Media_MediaImage_Fragment,
} from 'storefrontapi.generated';

interface ImageVignetteProps {
  media: {
    nodes: MediaFragment[];
  };
}

export const ImageVignette: React.FC<ImageVignetteProps> = ({
  media: {nodes},
}) => {
  const images = nodes.filter(
    (m) => m.__typename === 'MediaImage',
  ) as Media_MediaImage_Fragment[];

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
      }}
    >
      <div>
        {images.map((img) => {
          return (
            <Image key={img.id} src={img.image?.url} alt="product-image" />
          );
        })}
      </div>
      <div
        style={{
          position: 'sticky',
          top: 50,
          height: '100px',
        }}
      >
        {images.map((v) => {
          return (
            <div
              key={v.id}
              style={{
                width: '10px',
                height: '10px',
                border: '1px solid black',
                borderRadius: '100%',
                margin: '10px 0',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
