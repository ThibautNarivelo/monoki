type AccountProps = {
  className?: string;
};

export function Login({className}: AccountProps) {
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
        d="M66 29.375C66 20.2623 58.6127 12.875 49.5 12.875C40.3873 12.875 33 20.2623 33 29.375C33 38.4877 40.3873 45.875 49.5 45.875C58.6127 45.875 66 38.4877 66 29.375ZM78.375 76.125C78.375 68.5311 72.3728 62.375 64.9688 62.375H34.0312C26.6272 62.375 20.625 68.5311 20.625 76.125V83H78.375V76.125Z"
        fill="inherit"
      />
    </svg>
  );
}
