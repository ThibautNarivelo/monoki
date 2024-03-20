// WishlistDisplay.tsx

import React from 'react';
import {Storefront} from '@shopify/hydrogen';

import {useWishlist} from '~/hooks/useWishList';

import {ProductCard} from './ProductCard';

export function WishlistDisplay() {
  const {wishlist} = useWishlist();

  return (
    <div>
      <h2>My Wishlist</h2>
      {wishlist.length > 0 ? (
        wishlist.map((productId) => (
          <Storefront.Product id={productId} key={productId}>
            {(product) => <ProductCard product={product.data?.product} />}
          </Storefront.Product>
        ))
      ) : (
        <p>Your wishlist is empty</p>
      )}
    </div>
  );
}
