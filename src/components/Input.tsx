import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  className?: string;
  errorMessage?: string;
}

/**
 * 공통 텍스트필드 컴포넌트
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, errorMessage, className = '', ...props }, ref) => {
    const isError = error || !!errorMessage;
    return (
      <div>
        <input
          ref={ref}
          className={`rounded border border-[var(--color-border)] px-4 py-2 text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none ${isError ? 'border-[var(--color-error)]' : ''} ${className}`}
          {...props}
        />
        {errorMessage && (
          <div className="mt-1 text-xs text-[var(--color-error)]">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

export default Input;
