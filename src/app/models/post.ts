export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  views: number;
  //   comments: Comment[]; 익명이라 댓글 수정/삭제가 애매해 우선 보류
  url?: string;
  thumbnailUrl?: string;
}
