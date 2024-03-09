type BrugerProps = {
  className: string;
};

export function Burger({className}: BrugerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="99"
      height="100"
      viewBox="0 0 99 100"
      fill="inherit"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M82.5 26.75H16.5V23.75H82.5V26.75ZM82.5 51.5H16.5V48.5H82.5V51.5ZM82.5 76.25H16.5V73.25H82.5V76.25Z"
        fill="black"
      />
    </svg>
  );
}
