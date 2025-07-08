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
