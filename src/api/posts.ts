import {
  PostListDTO,
  PostDetailDTO,
  PostCreateDTO,
  PostUpdateDTO,
  UrlAnalysisData,
  CommentDTO,
} from './dto';
import { Post } from '@models/post';
import { Comment } from '@models/comment';
import { format } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const POSTS_ENDPOINT = `${API_BASE_URL}/posts`;
const ANALYZE_URL_ENDPOINT = `${API_BASE_URL}/analyze-url`;
const ANALYZE_POST_ENDPOINT = `${API_BASE_URL}/analyze-post`;

function mapCommentFromDTO(dto: CommentDTO): Comment {
  return {
    id: dto.id,
    postId: dto.postId,
    content: dto.content,
    createdAt: format(new Date(dto.createdAt), 'yyyy-MM-dd HH:mm'),
  };
}

function mapPostFromListDTO(dto: PostListDTO): Post {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    createdAt: format(new Date(dto.createdAt), 'yyyy-MM-dd'),
    views: dto.views,
    tags: dto.tags ?? [],
    commentCount: dto.commentCount,
    url: dto.url ?? undefined,
    thumbnailUrl: dto.thumbnailUrl ?? undefined,
  };
}

function mapPostFromDetailDTO(dto: PostDetailDTO): Post {
  return {
    ...mapPostFromListDTO(dto),
    comments: dto.comments?.map(mapCommentFromDTO) ?? [],
  };
}

/**
 * 게시글 목록 조회
 */
export async function getPosts(): Promise<Post[]> {
  const res = await fetch(POSTS_ENDPOINT, { cache: 'no-store' });
  if (!res.ok) throw new Error('게시글 목록을 불러오지 못했습니다.');

  const data: PostListDTO[] = await res.json();
  return data.map(mapPostFromListDTO);
}

/**
 * 게시글 상세(단일) 조회
 */
export async function getPostById(id: string): Promise<Post> {
  const res = await fetch(`${POSTS_ENDPOINT}/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('게시글을 불러오지 못했습니다.');

  const data: PostDetailDTO = await res.json();
  return mapPostFromDetailDTO(data);
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

  const data: PostListDTO = await res.json();
  return mapPostFromListDTO(data);
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

  const data: PostListDTO = await res.json();
  return mapPostFromListDTO(data);
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

/**
 * URL 내용을 분석하는 함수
 */
export async function analyzeUrlWithOpenAI(
  url: string
): Promise<UrlAnalysisData | null> {
  try {
    const response = await fetch(ANALYZE_URL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      console.error('URL analysis failed:', response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing URL with OpenAI:', error);
    return null;
  }
}

/**
 * 글 내용을 OpenAI로 기술 관련 여부 판별
 */
export async function analyzePostWithOpenAI(content: string): Promise<boolean> {
  try {
    const response = await fetch(ANALYZE_POST_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (response.status === 400) return false;
    if (!response.ok) throw new Error('글 분석에 실패했습니다.');
    const data = await response.json();
    return !!data.is_tech;
  } catch (error) {
    console.error('Error analyzing post with OpenAI:', error);
    throw error;
  }
}

/**
 * 댓글 등록
 */
export async function postComment({
  postId,
  content,
  password,
}: {
  postId: number;
  content: string;
  password: string;
}): Promise<Comment> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ postId, content, password }),
  });
  if (!res.ok) throw new Error('댓글 등록에 실패했습니다.');
  const data: CommentDTO = await res.json();
  return mapCommentFromDTO(data);
}

/**
 * 댓글 수정
 */
export async function updateComment({
  commentId,
  content,
  password,
}: {
  commentId: number;
  content: string;
  password: string;
}): Promise<Comment> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, password }),
  });
  if (!res.ok) throw new Error('댓글 수정에 실패했습니다.');
  const data: CommentDTO = await res.json();
  return mapCommentFromDTO(data);
}

/**
 * 댓글 삭제
 */
export async function deleteComment({
  commentId,
  password,
}: {
  commentId: number;
  password: string;
}): Promise<boolean> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.ok) return true;
  if (res.status === 403) throw new Error('비밀번호가 일치하지 않습니다.');
  throw new Error('댓글 삭제에 실패했습니다.');
}
