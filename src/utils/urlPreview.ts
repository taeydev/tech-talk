export interface UrlPreviewData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

/**
 * URL에서 메타데이터를 가져오는 함수
 * CORS 이슈로 인해 프록시 서버를 통해 요청
 */
export async function fetchUrlPreview(
  url: string
): Promise<UrlPreviewData | null> {
  try {
    // 프록시 서버를 통해 메타데이터 가져오기
    const response = await fetch(`/api/url-preview?url=${url}`);

    if (!response.ok) {
      console.error('URL preview fetch failed:', response.status);
      return null;
    }

    const data = await response.json();

    return {
      url,
      title: data.title || data['og:title'] || data['twitter:title'],
      description:
        data.description ||
        data['og:description'] ||
        data['twitter:description'],
      image: data['og:image'] || data['twitter:image'],
      siteName: data['og:site_name'] || data['twitter:site'],
    };
  } catch (error) {
    console.error('Error fetching URL preview:', error);
    return null;
  }
}

/**
 * 텍스트에서 URL 추출
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

/**
 * URL이 유효한지 확인
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
