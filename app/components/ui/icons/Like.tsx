type LikeProps = {
  className?: string;
};

export function Like({className}: LikeProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="92"
      height="94"
      viewBox="0 0 92 94"
      fill="inehrit"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M80.5 33.4376C80.5 57.6345 46.0014 78.0001 46.0014 78.0001C46.0014 78.0001 11.5 57.3334 11.5 33.4866C11.5 23.7501 19.1667 16.0001 28.75 16.0001C38.3333 16.0001 46 27.6251 46 27.6251C46 27.6251 53.6667 16.0001 63.25 16.0001C72.8333 16.0001 80.5 23.7501 80.5 33.4376Z"
        stroke="inherit"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
