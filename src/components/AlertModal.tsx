import React from 'react';
import Modal from '@components/Modal';
import Button from '@components/Button';
import AlertIcon from '@components/icons/AlertIcon';

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
}

/**
 * 경고, 알림 모달
 */
const AlertModal = ({
  open,
  onClose,
  title = '알림',
  message,
  buttonText = '확인',
}: AlertModalProps) => {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center gap-3 py-6">
        <AlertIcon className="h-8 w-8 text-[var(--color-error)]" />
        <span className="text-center text-base">{message}</span>
      </div>
      <div className="mt-4 flex justify-center">
        <Button variant="primary" onClick={onClose} className="w-32">
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
