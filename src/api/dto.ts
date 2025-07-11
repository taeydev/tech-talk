export interface PostDTO {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  views: number;
  tags: string | null;
  url?: string | null;
  thumbnailUrl?: string | null;
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
