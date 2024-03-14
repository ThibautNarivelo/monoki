type ArrowProps = {
  className?: string;
};

export function Arrow({className}: ArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="158"
      viewBox="0 0 120 158"
      fill="inherit"
      className={className}
    >
      <path d="M10 54L60 104L110 54" stroke="#171717" strokeWidth="4" />
    </svg>
  );
}
