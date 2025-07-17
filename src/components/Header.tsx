'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@components/Button';
import LinkIcon from '@icons/LinkIcon';
import CreateIcon from '@icons/CreateIcon';
import { usePostStore } from '@store/usePostStore';
import { useModalStore } from '@store/useModalStore';

/**
 * 기본 헤더 컴포넌트
 */
const Header = () => {
  const { openModal } = useModalStore();
  const [open, setOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const isWritePage = pathname.startsWith('/posts/write');
  const { setEditPost, setAiAnalysisData } = usePostStore();
  const router = useRouter();

  const handleUrlModalOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal('urlInput', {
      onSuccess: (postData: any) => {
        setAiAnalysisData(postData);
        router.push('/posts/write');
      },
    });
    setOpen(false);
  };

  return (
    <header className="header-custom box-border flex h-[65px] w-full items-center justify-between px-10 py-6">
      <h1 className="text-xl font-bold">TechTalk</h1>
      <div className="relative">
        {!isWritePage && (
          <Button onClick={() => setOpen((prev) => !prev)}>작성하기</Button>
        )}
        {open && !isWritePage && (
          <div className="absolute right-0 z-50 mt-2 flex w-44 flex-col rounded border border-[var(--color-border)] bg-white text-sm font-medium shadow-lg">
            <Link href="/posts/write" passHref>
              <button
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left hover:bg-gray-100"
                onClick={handleUrlModalOpen}
              >
                <LinkIcon className="h-4 w-4 text-[var(--color-icon)]" />
                URL로 간단 작성
              </button>
            </Link>
            <Link href="/posts/write" passHref>
              <button
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left hover:bg-gray-100"
                onClick={() => {
                  setEditPost(null);
                  setOpen(false);
                }}
              >
                <CreateIcon className="h-4 w-4 text-[var(--color-icon)]" />
                일반 작성
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
