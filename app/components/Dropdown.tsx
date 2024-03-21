import React, {useState} from 'react';

import type {ProductQuery} from 'storefrontapi.generated';

export default function Dropdown({option}: {option: ProductQuery['product']}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null as string | null);

  //   const options = ['Option 1', 'Option 2', 'Option 3']; // Your options go here

  return (
    <div className="relative">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption || 'Select an option'}</span>
        <svg
          className="fill-current h-4 w-4 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M0 6l10 10 10-10" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute bg-white shadow-md mt-1">
          {option?.variants.nodes.map((variant) => (
            <button
              key={variant?.id}
              className="block text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setSelectedOption(variant?.title);
                setIsOpen(false);
              }}
            >
              {variant?.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
