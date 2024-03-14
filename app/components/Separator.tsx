type SeparatorProps = {
  className?: string;
};

export function Separator({className}: SeparatorProps) {
  return (
    <div
      className={`absolute h-[1px] w-full bottom-0 bg-neutral-900 ${className}`}
    />
  );
}
