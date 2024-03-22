import React from 'react';

type HeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export function Heading({children, className}: HeadingProps) {
  return (
    <h1
      className={`${className}
        font-switzer text-[2rem] tracking-tighter leading-9  uppercase text-neutral-900
        md:text-[3.125rem] md:leading-[47px]
        lg:text-[4.6875rem] lg:leading-[70px]`}
    >
      {children}
    </h1>
  );
}
