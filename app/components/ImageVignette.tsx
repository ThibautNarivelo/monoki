import React, {useEffect, useState} from 'react';
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

  const refs = images.map(() => React.createRef<HTMLImageElement>());
  const [isVisible, setIsVisible] = useState<boolean[]>(
    new Array(images.length).fill(false),
  );

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(function (entry) {
        const index = images.findIndex(
          (img) => img.id === entry.target.getAttribute('data-id'),
        );
        setIsVisible((prevIsVisible) => {
          const newIsVisible = [...prevIsVisible];
          newIsVisible[index] = entry.isIntersecting;
          return newIsVisible;
        });
      });
    });

    refs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.setAttribute('data-id', images[index].id);
        observer.observe(ref.current);
      }
    });

    return () => {
      refs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [refs, images]);

  return (
    <div
      style={{
        display: 'flex',
        position: 'relative',
      }}
    >
      <div>
        {images.map((img, i) => {
          return (
            <Image
              key={img.id}
              ref={refs[i]}
              className={`intersecting-${i}`}
              src={img.image?.url}
              alt="product-image"
            />
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
        {images.map((v, i) => {
          return (
            <div
              key={v.id}
              style={{
                width: '10px',
                height: '10px',
                border: '1px solid black',
                borderRadius: '100%',
                margin: '10px 0',
                backgroundColor: isVisible[i] ? 'black' : 'transparent',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
