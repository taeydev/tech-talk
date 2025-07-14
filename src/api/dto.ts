export interface PostListDTO {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  views: number;
  tags: string[];
  commentCount: number;
  url?: string;
  thumbnailUrl?: string;
}

export interface PostDetailDTO extends PostListDTO {
  comments: CommentDTO[];
}

export interface CommentDTO {
  id: number;
  postId: number;
  content: string;
  createdAt: string;
}

export interface PostCreateDTO {
  title: string;
  content: string;
  tags?: string[];
  url?: string;
  thumbnailUrl?: string;
  password: string;
}

export interface PostUpdateDTO {
  title: string;
  content: string;
  tags?: string[];
  url?: string;
  thumbnailUrl?: string;
}

export interface UrlAnalysisData {
  url: string;
  title: string;
  summary: string[];
  tags: string[];
}
