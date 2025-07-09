import { Post } from '@models/post';
import { PostCreateDTO, PostDTO, PostUpdateDTO } from './dto';
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

/**
 * 게시글 생성
 */
export async function createPost(newPost: PostCreateDTO): Promise<Post> {
  const res = await fetch(POSTS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  if (!res.ok) throw new Error('게시글을 생성하지 못했습니다.');

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

/**
 * 게시글 수정
 */
export async function updatePost(
  id: number,
  updatePost: PostUpdateDTO
): Promise<Post> {
  const res = await fetch(`${POSTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatePost),
  });
  if (!res.ok) throw new Error('게시글을 수정하지 못했습니다.');

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

/**
 * 게시글 삭제
 */
export async function deletePost(id: number): Promise<boolean> {
  const res = await fetch(`${POSTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) return true;
  throw new Error('게시글을 삭제하지 못했습니다.');
}

/**
 * 비밀번호 검증
 */
export async function verifyPostPassword(
  postId: number,
  password: string
): Promise<boolean> {
  const res = await fetch(`${POSTS_ENDPOINT}/${postId}/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.ok) return true;
  if (res.status === 403) return false;
  throw new Error('비밀번호 검증에 실패했습니다.');
}
