type CloseProps = {
  className?: string;
  onClick?: () => void;
};

export function Close({className, onClick}: CloseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="82"
      height="88"
      viewBox="0 0 82 88"
      fill="inherit"
      onClick={onClick}
      className={className}
    >
      <path
        d="M2.00001 1.49991L80.3594 86.5M2.00002 86.4999L80.3594 1.5"
        stroke="#171717"
        strokeWidth="2.8"
      />
    </svg>
  );
}
