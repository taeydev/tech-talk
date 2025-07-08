import React from 'react';

interface CloseIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const CloseIcon: React.FC<CloseIconProps> = ({ className = '', style }) => (
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
      d="M18.0121 4.92865C18.305 4.63576 18.7798 4.63576 19.0727 4.92865C19.3656 5.22155 19.3656 5.69642 19.0727 5.98931L13.0623 11.9997L19.0727 18.0101C19.3656 18.303 19.3656 18.7779 19.0727 19.0708C18.7798 19.3637 18.305 19.3637 18.0121 19.0708L12.0016 13.0604L5.99127 19.0707C5.95466 19.1074 5.9152 19.1394 5.87361 19.1669C5.5825 19.3591 5.18689 19.327 4.93061 19.0707C4.63771 18.7779 4.63771 18.303 4.93061 18.0101L10.941 11.9997L4.93061 5.98936C4.63772 5.69647 4.63772 5.22159 4.93061 4.9287C5.2235 4.63581 5.69838 4.63581 5.99127 4.9287L12.0016 10.9391L18.0121 4.92865Z"
      fill="currentColor"
    />
  </svg>
);

export default CloseIcon;
