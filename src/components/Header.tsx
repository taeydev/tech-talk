'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from '@components/Button';
import LinkIcon from '@icons/LinkIcon';
import CreateIcon from '@icons/CreateIcon';
import Modal from '@components/Modal';
import { usePostStore } from '@store/usePostStore';

/**
 * 기본 헤더 컴포넌트
 */
const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const pathname = usePathname();
  const isWritePage = pathname.startsWith('/posts/write');
  const [url, setUrl] = useState('');
  const { setEditPost } = usePostStore();

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
                onClick={(e) => {
                  e.preventDefault();
                  setUrlModalOpen(true);
                }}
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
      {/* Modal for URL 입력 */}
      <Modal
        open={urlModalOpen}
        onClose={() => {
          setUrlModalOpen(false);
          setOpen(false);
        }}
        title="URL로 간단하게 작성하기"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: handle url submit
            setUrlModalOpen(false);
            setOpen(false);
          }}
        >
          <div className="mb-3 text-sm font-normal text-[var(--color-subtext)]">
            입력하신 URL을 바탕으로{' '}
            <b className="text-[var(--color-button)]">AI</b>가 제목과 본문을{' '}
            <b className="text-[var(--color-button)]">자동 생성</b>합니다.
            <br />
            생성된 내용은 이후에 직접 수정하실 수 있습니다.
          </div>
          <input
            type="url"
            className="w-full rounded border border-[var(--color-border)] px-3 py-2 text-sm placeholder:text-sm focus:ring-1 focus:ring-blue-200 focus:outline-none"
            placeholder="URL을 입력하세요"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-1.5 text-sm"
              onClick={() => {
                setUrlModalOpen(false);
                setOpen(false);
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-4 py-1.5 text-sm"
            >
              확인
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
};

export default Header;
