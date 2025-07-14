import React from 'react';

interface UserIconProps {
  className?: string;
}

const UserIcon = ({ className = '' }: UserIconProps) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="12" fill="#E5E8EB" />
    <ellipse cx="12" cy="10" rx="4" ry="4" fill="#B0B8C1" />
    <ellipse cx="12" cy="17" rx="6" ry="3" fill="#B0B8C1" />
  </svg>
);

export default UserIcon;
