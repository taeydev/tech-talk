'use client';
import { useState } from 'react';
import { usePasswordValidation } from '@hooks/usePasswordValidation';
import Modal from '@components/Modal';
import Button from '@components/Button';
import Input from '@components/Input';
import type { PasswordCheckResult } from './PostKebabMenuTrigger';

interface PasswordCheckModalProps {
  open: boolean;
  action: 'edit' | 'delete' | null;
  onClose: () => void;
  onConfirm: (password: string) => Promise<PasswordCheckResult>;
}

/**
 * 게시글 수정/삭제를 위한 비밀번호 확인 모달
 */
const PasswordCheckModal = ({
  open,
  action,
  onClose,
  onConfirm,
}: PasswordCheckModalProps) => {
  const {
    password,
    setPassword,
    setPasswordTouched,
    isValidPassword,
    passwordError,
    passwordErrorMessage,
    reset,
  } = usePasswordValidation({ minLength: 6, maxLength: 6 });
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handleConfirm = async () => {
    setPasswordTouched(true);
    if (!isValidPassword) return;
    const result = await onConfirm(password);
    if (result.success) {
      reset();
      setErrorMessage(undefined);
      onClose();
    } else {
      setErrorMessage(result.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  const handleClose = () => {
    reset();
    setErrorMessage(undefined);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="비밀번호 입력">
      <div className="flex flex-col">
        <div className="mb-4 text-sm font-normal text-[var(--color-subtext)]">
          게시글 {action === 'edit' ? '수정' : '삭제'}를 위해 비밀번호를
          입력하세요.
        </div>
        <Input
          type="password"
          className="w-full text-sm"
          errorMessage={passwordError ? passwordErrorMessage : errorMessage}
          placeholder="비밀번호(6자리, 영문과 숫자만 입력)"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage(undefined);
          }}
          onBlur={() => setPasswordTouched(true)}
          maxLength={6}
          required
        />
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={!isValidPassword}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordCheckModal;
