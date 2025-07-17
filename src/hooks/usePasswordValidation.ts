import { useState } from 'react';

interface UsePasswordValidationProps {
  minLength: number;
  maxLength: number;
  pattern?: RegExp;
}

interface UsePasswordValidationReturn {
  password: string;
  setPassword: (value: string) => void;
  passwordTouched: boolean;
  setPasswordTouched: (value: boolean) => void;
  isValidPassword: boolean;
  passwordError: boolean;
  passwordErrorMessage: string;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  confirmPasswordTouched: boolean;
  setConfirmPasswordTouched: (value: boolean) => void;
  isValidConfirmPassword: boolean;
  confirmPasswordError: boolean;
  confirmPasswordErrorMessage: string;
  isPasswordMatch: boolean;
  reset: () => void;
}

/**
 * 비밀번호 입력 및 비밀번호 확인 입력 상태와 유효성 검증을 관리하는 커스텀 훅
 */
export const usePasswordValidation = ({
  minLength,
  maxLength,
  pattern = /^[A-Za-z0-9]+$/,
}: UsePasswordValidationProps): UsePasswordValidationReturn => {
  const [password, setPassword] = useState<string>('');
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] =
    useState<boolean>(false);

  const isValidPassword =
    password.length >= minLength &&
    password.length <= maxLength &&
    pattern.test(password);

  const passwordError = passwordTouched && !isValidPassword;

  const passwordErrorMessage =
    !passwordTouched || password.length === 0
      ? ''
      : password.length < minLength
        ? `비밀번호는 ${minLength}자리 이상 입력해주세요.`
        : password.length > maxLength
          ? `비밀번호는 ${maxLength}자리 이하로 입력해주세요.`
          : !pattern.test(password)
            ? '비밀번호는 영문과 숫자만 입력할 수 있습니다.'
            : '';

  const isValidConfirmPassword =
    confirmPassword.length >= minLength &&
    confirmPassword.length <= maxLength &&
    pattern.test(confirmPassword);

  const confirmPasswordError =
    confirmPasswordTouched && !isValidConfirmPassword;

  const confirmPasswordErrorMessage =
    !confirmPasswordTouched || confirmPassword.length === 0
      ? ''
      : confirmPassword.length < minLength
        ? `비밀번호는 ${minLength}자리 이상 입력해주세요.`
        : confirmPassword.length > maxLength
          ? `비밀번호는 ${maxLength}자리 이하로 입력해주세요.`
          : !pattern.test(confirmPassword)
            ? '비밀번호는 영문과 숫자만 입력할 수 있습니다.'
            : '';

  const isPasswordMatch = password === confirmPassword;

  const reset = () => {
    setPassword('');
    setPasswordTouched(false);
    setConfirmPassword('');
    setConfirmPasswordTouched(false);
  };

  return {
    password,
    setPassword,
    passwordTouched,
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
  };
};
