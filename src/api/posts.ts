import { Post } from '@models/post';
import { PostDTO } from './dto';
import { format, parseISO } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const POSTS_ENDPOINT = `${API_BASE_URL}/posts`;

function mapPost(dto: PostDTO): Post {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    createdAt: format(parseISO(dto.createdAt), 'yyyy-MM-dd'),
    views: dto.views,
    tags: dto.tags ? JSON.parse(JSON.stringify(dto.tags)) : [],
    url: dto.url ?? undefined,
    thumbnailUrl: dto.thumbnailUrl ?? undefined,
  };
}

/**
 * 게시글 목록 조회
 */
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(POSTS_ENDPOINT, { cache: 'no-store' });
  if (!res.ok) throw new Error('게시글 목록을 불러오지 못했습니다.');

  const data: PostDTO[] = await res.json();
  return data.map(mapPost);
}

/**
 * 게시글 상세(단일) 조회
 */
export async function getPostById(id: string): Promise<Post> {
  const res = await fetch(`${POSTS_ENDPOINT}/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.');

  const data: PostDTO = await res.json();
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    createdAt: format(parseISO(data.createdAt), 'yyyy-MM-dd'),
    views: data.views,
    tags: data.tags ? JSON.parse(JSON.stringify(data.tags)) : [],
    url: data.url ?? undefined,
    thumbnailUrl: data.thumbnailUrl ?? undefined,
  };
}
