type IconProps = {
  className?: string;
};

export function Bag({className}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="119"
      height="120"
      viewBox="0 0 119 120"
      fill="inherit"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.0304 30.25C46.0304 22.8114 52.0606 16.7812 59.4991 16.7812C66.9377 16.7812 72.9679 22.8114 72.9679 30.25V33.802H46.0304V30.25ZM43.2179 36.6145V45.125C43.2179 45.9016 43.8475 46.5312 44.6241 46.5312C45.4008 46.5312 46.0304 45.9016 46.0304 45.125V36.6145H72.9679V45.125C72.9679 45.9016 73.5975 46.5312 74.3741 46.5312C75.1508 46.5312 75.7804 45.9016 75.7804 45.125V36.6145H87.9481L92.6901 98.2604H26.3106L31.0526 36.6145H43.2179ZM43.2179 33.802V30.25C43.2179 21.2581 50.5073 13.9688 59.4991 13.9688C68.491 13.9688 75.7804 21.2581 75.7804 30.25V33.802H89.2503C89.9851 33.802 90.5961 34.3678 90.6524 35.1004L95.6108 99.5588C95.6408 99.9493 95.5066 100.335 95.2405 100.622C94.9743 100.91 94.6004 101.073 94.2087 101.073H24.792C24.4003 101.073 24.0263 100.91 23.7602 100.622C23.4941 100.335 23.3598 99.9493 23.3899 99.5588L28.3482 35.1004C28.4046 34.3678 29.0155 33.802 29.7503 33.802H43.2179Z"
        fill="#171717"
      />
    </svg>
  );
}
