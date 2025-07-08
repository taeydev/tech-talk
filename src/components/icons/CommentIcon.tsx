import React from 'react';

interface CommentIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const CommentIcon: React.FC<CommentIconProps> = ({ className = '', style }) => (
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 11C2 12.6565 2.49724 14.2084 3.36471 15.5416L2.40432 19.3831C2.22123 20.1155 2.88462 20.7789 3.617 20.5958L8.40143 19.3997C9.51807 19.7874 10.7314 20 12 20C17.5228 20 22 15.9706 22 11C22 6.02944 17.5228 2 12 2C6.47715 2 2 6.02944 2 11ZM4.81992 15.9054C4.92101 15.501 4.84929 15.0728 4.62197 14.7235C3.90355 13.6194 3.5 12.3493 3.5 11C3.5 7.00261 7.15301 3.5 12 3.5C16.847 3.5 20.5 7.00261 20.5 11C20.5 14.9974 16.847 18.5 12 18.5C10.8995 18.5 9.85236 18.3156 8.89348 17.9827C8.61798 17.887 8.32056 17.8737 8.03763 17.9445L4.06165 18.9384L4.81992 15.9054Z"
      fill="currentColor"
    />
  </svg>
);

export default CommentIcon;
