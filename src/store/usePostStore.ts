import { Post } from '@models/post';
import { create } from 'zustand';

interface PostStore {
  editPost: Post | null;
  setEditPost: (post: Post | null) => void;
  getEditPost: () => Post | null;
}

export const usePostStore = create<PostStore>((set, get) => ({
  editPost: null,
  setEditPost: (post) => set({ editPost: post }),
  getEditPost: () => get().editPost,
}));
