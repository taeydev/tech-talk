import React from 'react';
import ImageIcon from '@components/icons/ImageIcon';

interface FallbackImageProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  alt = '기본 이미지',
  className,
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-md bg-gray-200 ${className || ''}`}
      style={{ position: 'relative' }}
    >
      <span style={{ display: 'inline-flex', width: '35%', height: '35%' }}>
        <ImageIcon style={{ width: '100%', height: '100%' }} aria-label={alt} />
      </span>
    </div>
  );
};

export default FallbackImage;
