'use client';
import { useState } from 'react';
import Modal from '@components/Modal';
import Button from '@components/Button';
import Input from '@components/Input';

interface PostPasswordModalProps {
  open: boolean;
  action: 'edit' | 'delete' | null;
  onClose: () => void;
  onConfirm: (password: string) => void;
  errorMessage?: string;
}

const PostPasswordModal = ({
  open,
  action,
  onClose,
  onConfirm,
  errorMessage,
}: PostPasswordModalProps) => {
  const [password, setPassword] = useState<string>('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isValidPassword = (pw: string) =>
    pw.length === 6 && /^[A-Za-z0-9]+$/.test(pw);
  const passwordError = passwordTouched && !isValidPassword(password);

  const handleConfirm = () => {
    setPasswordTouched(true);
    if (!isValidPassword(password)) return;
    onConfirm(password);
    setPassword('');
    setPasswordTouched(false);
  };

  const handleClose = () => {
    setPassword('');
    setPasswordTouched(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="비밀번호 입력">
      <div className="flex flex-col gap-2">
        <div className="mb-1 text-sm font-normal text-[var(--color-subtext)]">
          게시글 {action === 'edit' ? '수정' : '삭제'}를 위해 비밀번호를
          입력하세요.
        </div>
        <Input
          type="password"
          className="text-sm"
          error={passwordError}
          placeholder="비밀번호(6자리, 영문과 숫자만 입력)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setPasswordTouched(true)}
          maxLength={6}
          required
        />
        {passwordError && (
          <span className="text-xs text-[var(--color-error)]">
            비밀번호는 6자리, 영문과 숫자만 입력할 수 있습니다.
          </span>
        )}
        {errorMessage && !passwordError && (
          <span className="text-xs text-[var(--color-error)]">
            {errorMessage}
          </span>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={!isValidPassword(password)}
          >
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PostPasswordModal;
