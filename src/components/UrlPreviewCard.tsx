import React, { useState, useEffect, useMemo } from 'react';
import LinkIcon from '@icons/LinkIcon';
import FallbackImage from '@components/FallbackImage';

interface UrlPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

interface UrlPreviewCardProps {
  data: UrlPreviewData;
  onRemove?: () => void;
  className?: string;
}

/**
 * URL 미리보기 카드 컴포넌트
 */
const UrlPreviewCard: React.FC<UrlPreviewCardProps> = ({
  data,
  onRemove,
  className = '',
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  // 이미지 URL을 절대 URL로 변환
  const absoluteImageUrl = useMemo(() => {
    if (!data.image) return undefined;
    if (data.image.startsWith('http://') || data.image.startsWith('https://')) {
      return data.image;
    }
    try {
      const baseUrl = new URL(data.url);
      return new URL(data.image, baseUrl.origin).href;
    } catch {
      return data.image;
    }
  }, [data.image, data.url]);

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={0}
      className={`group relative block overflow-hidden rounded-lg border border-[var(--color-border)] bg-white transition-all hover:shadow-md hover:shadow-black/3 focus:outline-none ${className}`}
      aria-label={data.title || data.url}
    >
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault(); // 카드 클릭 시 링크 이동 막지 않도록
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="미리보기 제거"
        >
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      <div className="flex min-h-[90px] items-stretch">
        <div className="relative aspect-[16/9] w-40 flex-shrink-0 overflow-hidden rounded-none">
          {(!absoluteImageUrl || imgError) && (
            <FallbackImage className="absolute inset-0 h-full w-full rounded-none" />
          )}
          {absoluteImageUrl && (
            <img
              src={absoluteImageUrl}
              alt={data.title || '미리보기 이미지'}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${imgLoaded && !imgError ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          )}
        </div>
        <div className="flex min-h-[90px] flex-1 flex-col justify-between p-3">
          <div className="flex-1">
            {data.title && (
              <h3 className="mb-1 line-clamp-2 text-sm font-medium text-[var(--color-black)]">
                {data.title}
              </h3>
            )}
            {data.description && (
              <p className="line-clamp-2 text-xs text-[var(--color-subtext)]">
                {data.description}
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-[var(--color-subtext)]">
            <LinkIcon className="h-3 w-3" />
            <span className="truncate">{data.siteName}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default UrlPreviewCard;
