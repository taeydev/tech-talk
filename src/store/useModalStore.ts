import { create } from 'zustand';

export type ModalType =
  | 'urlInput'
  | 'passwordRegister'
  | 'passwordCheck'
  | 'alert';

export interface ModalState {
  type: ModalType | null;
  props: any;
  isOpen: boolean;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  props: null,
  isOpen: false,
  openModal: (type, props = {}) => set({ type, props, isOpen: true }),
  closeModal: () => set({ type: null, props: null, isOpen: false }),
}));
