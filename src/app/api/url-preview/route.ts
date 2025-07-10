import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // URL 유효성 검사
    new URL(url);

    // fetch에 타임아웃(5초) 추가
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TechTalkBot/1.0)',
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const metadata = parseMetadata(html);

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

function parseMetadata(html: string): Record<string, string> {
  const metadata: Record<string, string> = {};
  // title 태그 파싱
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }
  // meta 태그 파싱
  const metaRegex =
    /<meta[^>]+(?:name|property)=["']([^"']+)["'][^>]+content=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const [, name, content] = match;
    metadata[name.toLowerCase()] = content.trim();
  }
  // description 태그 파싱 (meta 태그에서 name="description")
  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i
  );
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  }
  return metadata;
}
