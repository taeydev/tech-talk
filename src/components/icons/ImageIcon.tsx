import React from 'react';

interface ImageIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ImageIcon: React.FC<ImageIconProps> = ({
  width = 20,
  height = 20,
  color = '#BDBDBD',
  className,
  style,
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
  >
    <path
      d="M10.25 10.5C11.0784 10.5 11.75 9.82843 11.75 9C11.75 8.17157 11.0784 7.5 10.25 7.5C9.42157 7.5 8.75 8.17157 8.75 9C8.75 9.82843 9.42157 10.5 10.25 10.5Z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5ZM19.5 5C19.5 4.72386 19.2761 4.5 19 4.5H5C4.72386 4.5 4.5 4.72386 4.5 5V13.7222L6.02139 12.3699C6.58203 11.8715 7.4246 11.8639 7.99412 12.3521L10.5 14.5L14.9393 10.0607C15.5251 9.47487 16.4749 9.47487 17.0607 10.0607L19.5 12.5V5ZM5 19.5C4.72386 19.5 4.5 19.2761 4.5 19V15.7292L7.01794 13.491L9.52381 15.6389C10.1189 16.149 11.0064 16.1149 11.5607 15.5607L16 11.1213L19.5 14.6213V19C19.5 19.2761 19.2761 19.5 19 19.5H5Z"
      fill={color}
    />
  </svg>
);

export default ImageIcon;
