type CheckProps = {
  className?: string;
};

export function Check({className}: CheckProps) {
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m7.04 10.37 2.42 2.41 3.5-5.56"
      fill="inherit"
      className={className}
    />
  );
}
