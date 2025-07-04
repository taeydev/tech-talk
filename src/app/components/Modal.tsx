import React from 'react';
import CloseIcon from '@icons/CloseIcon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({
  title,
  onClose,
}) => (
  <div className="mb-6 flex items-center">
    <h3 className="text-lg font-bold">{title}</h3>
    <button
      className="ml-auto cursor-pointer"
      onClick={onClose}
      aria-label="닫기"
    >
      <CloseIcon className="h-6 w-6" />
    </button>
  </div>
);

/**
 * 기본 공통 모달팝업
 */
const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex w-full max-w-md flex-col rounded-lg bg-white p-6 shadow-lg">
        <ModalHeader title={title} onClose={onClose} />
        {children}
      </div>
    </div>
  );
};

export default Modal;
