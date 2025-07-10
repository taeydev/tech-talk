import React from 'react';

// 텍스트 내 URL을 <a> 태그로 변환하는 함수
export function linkifyText(text: string): React.ReactNode {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return React.createElement(
        'a',
        {
          key: i,
          href: part,
          target: '_blank',
          rel: 'noopener noreferrer',
          className:
            'text-neutral-500 underline break-all hover:text-neutral-700',
        },
        part
      );
    }
    return part;
  });
}
