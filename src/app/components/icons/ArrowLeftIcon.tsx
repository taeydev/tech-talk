import React from 'react';

interface ArrowLeftIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({
  className = '',
  style,
}) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M10.9549 18.8943L4.81057 12.7501H21.2499C21.6641 12.7501 21.9999 12.4143 21.9999 12.0001C21.9999 11.5858 21.6641 11.2501 21.2499 11.2501H4.81057L10.9549 5.10577C11.2478 4.81288 11.2478 4.338 10.9549 4.04511C10.9183 4.0085 10.8788 3.97646 10.8372 3.949C10.5461 3.75679 10.1505 3.78883 9.8942 4.04511L2.46958 11.4697C2.17669 11.7626 2.17669 12.2375 2.46958 12.5304L9.8942 19.955C9.93081 19.9916 9.97027 20.0237 10.0119 20.0511C10.303 20.2433 10.6986 20.2113 10.9549 19.955C11.2478 19.6621 11.2478 19.1872 10.9549 18.8943Z"
      fill="currentColor"
    />
  </svg>
);

export default ArrowLeftIcon;
