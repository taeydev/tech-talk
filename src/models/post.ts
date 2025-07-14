import { Comment } from './comment';

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  views: number;
  tags: string[];
  commentCount: number;
  comments?: Comment[];
  url?: string;
  thumbnailUrl?: string;
}
