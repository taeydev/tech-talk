import { ReactNode } from 'react';
import Link from 'next/link';
import ArrowLeftIcon from '@icons/ArrowLeftIcon';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  backHref?: string;
  rightButton?: ReactNode;
}

/**
 * 페이지 상단 헤더 컴포넌트
 */
const PageHeader = ({
  title,
  showBackButton = false,
  backHref = '/posts',
  rightButton,
}: PageHeaderProps) => {
  return (
    <div className="mb-2 flex w-full items-center justify-between">
      {showBackButton ? (
        <Link href={backHref} aria-label="뒤로가기">
          <button
            type="button"
            className="mr-4 flex items-center text-[var(--color-black)]"
          >
            <ArrowLeftIcon className="h-5 w-5 cursor-pointer" />
          </button>
        </Link>
      ) : (
        <div className="mr-4" />
      )}
      <h2 className="flex-1 text-2xl font-bold text-[var(--color-black)]">
        {title}
      </h2>
      {rightButton ? (
        <div className="flex flex-1 justify-end">{rightButton}</div>
      ) : (
        <div className="flex flex-1" />
      )}
    </div>
  );
};

export default PageHeader;
