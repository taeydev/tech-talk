import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const BUTTON_STYLES = {
  primary:
    'bg-[var(--color-button)] text-[var(--color-bg)] hover:bg-[#1976d2] cursor-pointer rounded px-5 py-2 text-sm font-medium transition duration-150',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer rounded px-5 py-2 text-sm font-medium transition duration-150',
};

/**
 * 공통 버튼 컴포넌트
 */
const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  ...props
}) => {
  return (
    <button className={`${BUTTON_STYLES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
