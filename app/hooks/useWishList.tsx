import React, {createContext, useContext, useState} from 'react';

type WishlistContextProps = {
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextProps>({
  wishlist: [],
  addToWishlist: () => null,
  removeFromWishlist: () => null,
});

export function WishlistProvider({children}: {children: React.ReactNode}) {
  const [wishlist, setWishlist] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('wishlist') || '[]') as string[];
  });

  function addToWishlist(id: string) {
    const newWishlist = [...wishlist, id];
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  }

  function removeFromWishlist(id: string) {
    const newWishlist = wishlist.filter((item) => item !== id);
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  }

  return (
    <WishlistContext.Provider
      value={{wishlist, addToWishlist, removeFromWishlist}}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
