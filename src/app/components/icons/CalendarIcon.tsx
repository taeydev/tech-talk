import React from 'react';

interface CalendarIconProps {
  className?: string;
  style?: React.CSSProperties;
}

const CalendarIcon: React.FC<CalendarIconProps> = ({
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
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5H6.25V3.75C6.25 3.33579 6.58579 3 7 3C7.41421 3 7.75 3.33579 7.75 3.75V5H16.25V3.75C16.25 3.33579 16.5858 3 17 3C17.4142 3 17.75 3.33579 17.75 3.75V5H20C21.1046 5 22 5.89543 22 7V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V7C2 5.89543 2.89543 5 4 5ZM20 6.5C20.2761 6.5 20.5 6.72386 20.5 7V9H3.5V7C3.5 6.72386 3.72386 6.5 4 6.5H20ZM4 19.5C3.72386 19.5 3.5 19.2761 3.5 19V10.5H20.5V19C20.5 19.2761 20.2761 19.5 20 19.5H4Z"
      fill="currentColor"
    />
  </svg>
);

export default CalendarIcon;
