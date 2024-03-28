type LinkArrowProps = {
  className?: string;
};

export function LinkArrow({className}: LinkArrowProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="75"
      height="75"
      viewBox="0 0 75 75"
      fill="inherit"
      className={className}
    >
      <path
        d="M0.818911 65.5289L53.9173 12.4304H5.07115L5.18018 0.109862H74.9604V69.8901L62.6399 69.9992V21.153L9.54144 74.2514L0.818911 65.5289Z"
        fill="inherit"
      />
    </svg>
  );
}
