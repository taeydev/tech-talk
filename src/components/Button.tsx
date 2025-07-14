import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'large' | 'medium' | 'small';
}

const BUTTON_STYLES = {
  primary:
    'bg-[var(--color-button)] text-[var(--color-bg)] hover:bg-[#1976d2] cursor-pointer rounded font-medium transition duration-150 disabled:hover:bg-[var(--color-button)] disabled:cursor-not-allowed disabled:opacity-50',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer rounded =font-medium transition duration-150 disabled:hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
  outline:
    'border border-[var(--color-border)] text-[var(--color-black)] hover:bg-gray-100 cursor-pointer rounded font-medium transition duration-150 disabled:hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50',
};

const SIZE_STYLES = {
  large: 'px-6 py-3 text-base',
  medium: 'px-5 py-2 text-sm',
  small: 'px-4 py-1.5 text-sm',
};

/**
 * 공통 버튼 컴포넌트
 */
const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <button
      className={`${BUTTON_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
