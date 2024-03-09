type SearchProps = {
  className?: string;
};

export function Search({className}: SearchProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="89"
      height="90"
      viewBox="0 0 89 90"
      fill="inherit"
      className={className}
    >
      <path
        d="M56.6149 55.135C56.0682 54.5883 55.1818 54.5883 54.635 55.135C54.0883 55.6818 54.0883 56.5682 54.635 57.1149L56.6149 55.135ZM76.885 79.3649C77.4318 79.9117 78.3182 79.9117 78.8649 79.3649C79.4117 78.8182 79.4117 77.9318 78.8649 77.385L76.885 79.3649ZM37.0833 62.1417C23.5201 62.1417 12.525 51.1465 12.525 37.5833H9.725C9.725 52.6929 21.9737 64.9417 37.0833 64.9417V62.1417ZM61.6417 37.5833C61.6417 51.1465 50.6465 62.1417 37.0833 62.1417V64.9417C52.1929 64.9417 64.4417 52.6929 64.4417 37.5833H61.6417ZM37.0833 13.025C50.6465 13.025 61.6417 24.0201 61.6417 37.5833H64.4417C64.4417 22.4737 52.1929 10.225 37.0833 10.225V13.025ZM37.0833 10.225C21.9737 10.225 9.725 22.4737 9.725 37.5833H12.525C12.525 24.0201 23.5201 13.025 37.0833 13.025V10.225ZM54.635 57.1149L76.885 79.3649L78.8649 77.385L56.6149 55.135L54.635 57.1149Z"
        fill="black"
      />
    </svg>
  );
}
