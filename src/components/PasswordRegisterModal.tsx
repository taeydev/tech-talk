import React from 'react';
import Modal from '@components/Modal';
import Button from '@components/Button';
import Input from '@components/Input';
import { usePasswordValidation } from '@hooks/usePasswordValidation';

interface PasswordRegisterModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

/**
 * 게시글 비밀번호 설정 모달
 */
const PasswordRegisterModal = ({
  open,
  onClose,
  onConfirm,
}: PasswordRegisterModalProps) => {
  const {
    password,
    setPassword,
    setPasswordTouched,
    isValidPassword,
    passwordError,
    passwordErrorMessage,
    confirmPassword,
    setConfirmPassword,
    confirmPasswordTouched,
    setConfirmPasswordTouched,
    isValidConfirmPassword,
    confirmPasswordError,
    confirmPasswordErrorMessage,
    isPasswordMatch,
    reset,
  } = usePasswordValidation({ minLength: 6, maxLength: 6 });

  const canSubmit =
    isValidPassword && isValidConfirmPassword && isPasswordMatch;

  const handleConfirm = () => {
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);
    if (canSubmit) {
      onConfirm(password);
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="비밀번호 등록">
      <div className="flex flex-col">
        <div className="mb-4 text-sm font-normal text-[var(--color-subtext)]">
          게시글 수정 및 삭제를 위해 비밀번호를 등록하세요.
          <br />
          <span className="text-[var(--color-error)]">
            비밀번호 분실 시 게시글을 수정하거나 삭제할 수 없습니다.
          </span>
        </div>
        <div className="mb-2">
          <Input
            type="password"
            className="w-full text-sm"
            errorMessage={passwordError ? passwordErrorMessage : undefined}
            placeholder="비밀번호(6자리, 영문과 숫자만 입력)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            maxLength={6}
            required
          />
        </div>
        <Input
          type="password"
          className="w-full text-sm"
          errorMessage={
            confirmPasswordTouched && !isPasswordMatch
              ? '비밀번호가 일치하지 않습니다.'
              : confirmPasswordError
                ? confirmPasswordErrorMessage
                : undefined
          }
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmPasswordTouched(true)}
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
            disabled={!canSubmit}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordRegisterModal;
