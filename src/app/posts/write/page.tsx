'use client';
import React, { useState } from 'react';
import ArrowLeftIcon from '@icons/ArrowLeftIcon';
import CloseIcon from '@icons/CloseIcon';
import Button from '@components/Button';
import Link from 'next/link';
import Modal from '@components/Modal';

/**
 * 게시글 작성 페이지
 */
const PostWritePage = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPassword, setModalPassword] = useState('');
  const [modalPasswordTouched, setModalPasswordTouched] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const isValidPassword = (pw: string) =>
    pw.length === 6 && /^[A-Za-z0-9]+$/.test(pw);
  const modalPasswordError =
    modalPasswordTouched && !isValidPassword(modalPassword);
  const confirmPasswordError =
    confirmPasswordTouched && confirmPassword !== modalPassword;

  const canSubmit =
    isValidPassword(modalPassword) &&
    confirmPassword === modalPassword &&
    confirmPassword.length > 0;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    setModalPasswordTouched(true);
    if (!isValidPassword(modalPassword)) return;
    // 실제 게시글 등록 로직 (title, content, tags, modalPassword)
    setModalOpen(false);
    setModalPassword('');
    setModalPasswordTouched(false);
    // 성공 알림/리다이렉트 등 추가 가능
  };

  const resetModalPassword = () => {
    setModalOpen(false);
    setModalPassword('');
    setModalPasswordTouched(false);
    setConfirmPassword('');
    setConfirmPasswordTouched(false);
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
            <Button onClick={() => setModalOpen(true)}>게시하기</Button>
          </div>
        </div>
        {/* 게시글 작성 폼 */}
        <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
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
            className="min-h-[180px] w-full resize-y rounded border border-[var(--color-border)] px-4 py-2 text-base text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
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
        <Modal
          open={modalOpen}
          onClose={resetModalPassword}
          title="비밀번호 입력"
        >
          <div className="flex flex-col gap-2">
            <div className="mb-1 text-sm font-normal text-[var(--color-subtext)]">
              게시글 수정 및 삭제를 위해 비밀번호를 설정하세요.
              <br />
              <span className="text-[var(--color-error)]">
                비밀번호 분실 시 게시글을 수정하거나 삭제할 수 없습니다.
              </span>
            </div>
            <input
              type="password"
              className={`w-full rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none ${modalPasswordError ? 'border-[var(--color-error)]' : ''}`}
              placeholder="비밀번호(6자리, 영문과 숫자만 입력)"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
              onBlur={() => setModalPasswordTouched(true)}
              maxLength={6}
              required
            />
            {modalPasswordError && (
              <span className="text-xs text-[var(--color-error)]">
                비밀번호는 6자리, 영문과 숫자만 입력할 수 있습니다.
              </span>
            )}
            <input
              type="password"
              className={`w-full rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none ${confirmPasswordError ? 'border-[var(--color-error)]' : ''}`}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmPasswordTouched(true)}
              maxLength={6}
              required
            />
            {confirmPasswordError && (
              <span className="text-xs text-[var(--color-error)]">
                비밀번호가 일치하지 않습니다.
              </span>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={resetModalPassword}
              >
                취소
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleModalConfirm}
                disabled={!canSubmit}
              >
                확인
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default PostWritePage;
