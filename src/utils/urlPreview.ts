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

/**
 * Next.js _next/image 프록시 URL에서 원본 이미지 URL 추출
 */
export function extractOriginalImageUrl(imgUrl: string): string {
  try {
    if (imgUrl && imgUrl.includes('_next/image')) {
      const urlObj = new URL(
        imgUrl,
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost'
      );
      const urlParam = urlObj.searchParams.get('url');
      if (urlParam) {
        return decodeURIComponent(urlParam);
      }
    }
  } catch {}
  return imgUrl;
}

/**
 * 일반적인 이미지 URL 검증
 * - http/https로 시작
 * - 이미지 확장자(jpg, jpeg, png, gif, webp, bmp, svg)로 끝나는지
 */
export function isValidThumbnailUrl(url: string | undefined): boolean {
  if (!url) return false;
  // http/https로 시작하는지
  if (!/^https?:\/\//i.test(url)) return false;
  // 이미지 확장자로 끝나는지 (쿼리스트링 허용)
  const validExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const extMatch = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
  if (!extMatch) return false;
  const ext = extMatch[1].toLowerCase();
  if (!validExts.includes(ext)) return false;
  return true;
}
