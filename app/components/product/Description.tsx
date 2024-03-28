import React from 'react';

type DescriptionProps = {
  titleClassName?: string;
  contentClassName?: string;
  dangerouslySetInnerHTML?: {__html: string};
};

export function Description({
  titleClassName,
  contentClassName,
  dangerouslySetInnerHTML,
}: DescriptionProps) {
  return (
    <div className="sticky top-1/2 lg:w-1/4 flex flex-col justify-center items-start">
      <h2
        className={`${titleClassName} text-[1rem] font-switzer text-neutral-400 leading-5 tracking-tighter uppercase`}
      >
        Description
      </h2>
      <span
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        className={`${contentClassName} mt-[1.5rem] font-switzer text-[1rem] tracking-tighter text-neutral-900`}
      />
    </div>
  );
}
