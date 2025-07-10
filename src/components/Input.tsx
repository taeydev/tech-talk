import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
}

/**
 * 공통 텍스트필드 컴포넌트
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded border border-[var(--color-border)] px-4 py-2 text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none ${error ? 'border-[var(--color-error)]' : ''} ${className}`}
        {...props}
      />
    );
  }
);

export default Input;
