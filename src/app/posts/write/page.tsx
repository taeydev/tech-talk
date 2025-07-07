'use client';
import React, { useState } from 'react';
import ArrowLeftIcon from '@icons/ArrowLeftIcon';
import CloseIcon from '@icons/CloseIcon';
import Button from '@components/Button';
import Link from 'next/link';

/**
 * 게시글 작성 페이지
 */
const PostWritePage = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

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
            className="w-full rounded border border-[var(--color-border)] px-4 py-2 text-lg text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <textarea
            className="min-h-[180px] w-full resize-none rounded border border-[var(--color-border)] px-4 py-2 text-base text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
                placeholder="태그를 입력하세요"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
                maxLength={20}
              />
              <Button
                variant="outline"
                onClick={handleAddTag}
                disabled={!tag.trim()}
              >
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tagItem, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    <span>{tagItem}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tagItem)}
                      className="ml-1 rounded-full p-0.5 hover:bg-blue-200"
                    >
                      <CloseIcon className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default PostWritePage;
