'use client';
import { useEffect, useState } from 'react';
import {
  extractUrls,
  fetchUrlPreview,
  UrlPreviewData,
} from '@utils/urlPreview';
import UrlPreviewCard from '@components/UrlPreviewCard';

interface Props {
  lines: string[];
}

const InlineUrlPreviewCards: React.FC<Props> = ({ lines }) => {
  const [previewMap, setPreviewMap] = useState<Record<string, UrlPreviewData>>(
    {}
  );

  useEffect(() => {
    const urls = Array.from(new Set(lines.flatMap(extractUrls)));
    Promise.all(urls.map(fetchUrlPreview)).then((previews) => {
      const map: Record<string, UrlPreviewData> = {};
      previews.forEach((preview) => {
        if (preview) map[preview.url] = preview;
      });
      setPreviewMap(map);
    });
  }, [lines]);

  return (
    <>
      {lines.map((line, idx) => {
        const urls = extractUrls(line);
        return (
          <div key={idx} className="mb-2">
            {urls.map(
              (url) =>
                previewMap[url] && (
                  <div key={url} className="mt-2">
                    <UrlPreviewCard
                      data={previewMap[url]}
                      className="max-w-md"
                    />
                  </div>
                )
            )}
          </div>
        );
      })}
    </>
  );
};

export default InlineUrlPreviewCards;
