'use client';
import { useModalStore } from '@store/useModalStore';
import PasswordCheckModal from '@/app/posts/[id]/components/PasswordCheckModal';
import UrlInputModal from '@components/UrlInputModal';
import PasswordRegisterModal from '@components/PasswordRegisterModal';
import AlertModal from '@components/AlertModal';

const ModalRenderer = () => {
  const { type, props, isOpen, closeModal } = useModalStore();

  if (!isOpen || !type) return null;

  switch (type) {
    case 'urlInput':
      return <UrlInputModal open={isOpen} onClose={closeModal} {...props} />;
    case 'passwordRegister':
      return (
        <PasswordRegisterModal open={isOpen} onClose={closeModal} {...props} />
      );
    case 'passwordCheck':
      return (
        <PasswordCheckModal open={isOpen} onClose={closeModal} {...props} />
      );
    case 'alert':
      return <AlertModal open={isOpen} onClose={closeModal} {...props} />;
    default:
      return null;
  }
};

export default ModalRenderer;
