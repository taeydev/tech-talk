import { Post } from '@models/post';
import { create } from 'zustand';

interface AiAnalysisData {
  title: string;
  content: string[];
  tags: string[];
  url: string;
}

interface PostStore {
  editPost: Post | null;
  aiAnalysisData: AiAnalysisData | null;
  setEditPost: (post: Post | null) => void;
  getEditPost: () => Post | null;
  setAiAnalysisData: (data: AiAnalysisData | null) => void;
  getAiAnalysisData: () => AiAnalysisData | null;
  clearAiAnalysisData: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  editPost: null,
  aiAnalysisData: null,
  setEditPost: (post) => set({ editPost: post }),
  getEditPost: () => get().editPost,
  setAiAnalysisData: (data) => set({ aiAnalysisData: data }),
  getAiAnalysisData: () => get().aiAnalysisData,
  clearAiAnalysisData: () => set({ aiAnalysisData: null }),
}));
