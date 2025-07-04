'use client';
import React, { useState } from 'react';
import ArrowLeftIcon from '@icons/ArrowLeftIcon';
import Button from '@components/Button';
import Link from 'next/link';

/**
 * 게시글 작성 페이지
 */
const WritePage = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  return (
    <main className="flex min-h-[60vh] flex-col items-center bg-[var(--color-bg)] py-10">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-12">
        <div className="mb-2 flex w-full items-center justify-between">
          <Link href="/" aria-label="뒤로가기">
            <button
              type="button"
              className="mr-4 flex items-center text-[var(--color-black)]"
            >
              <ArrowLeftIcon className="h-5 w-5 cursor-pointer" />
            </button>
          </Link>
          <h2 className="flex-1 text-2xl font-bold text-[var(--color-black)]">
            게시글 작성
          </h2>
          <div className="flex flex-1 justify-end">
            <Button>게시하기</Button>
          </div>
        </div>
        {/* 게시글 작성 폼 */}
        <form className="mt-8 flex flex-col gap-6">
          <input
            type="text"
            className="w-full rounded border border-[var(--color-border)] px-4 py-2 text-lg font-semibold text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <textarea
            className="min-h-[180px] w-full resize-y rounded border border-[var(--color-border)] px-4 py-2 text-base text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </form>
      </div>
    </main>
  );
};

export default WritePage;
