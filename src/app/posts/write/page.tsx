'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CloseIcon from '@icons/CloseIcon';
import Button from '@components/Button';
import Input from '@components/Input';
import Modal from '@components/Modal';
import PageHeader from '@posts/components/PageHeader';
import UrlPreviewCard from '@components/UrlPreviewCard';

import { usePostStore } from '@store/usePostStore';
import { createPost, updatePost } from '@api/posts';
import {
  fetchUrlPreview,
  extractUrls,
  isValidUrl,
  type UrlPreviewData,
} from '@utils/urlPreview';

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
  const [urlPreviews, setUrlPreviews] = useState<UrlPreviewData[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const { getEditPost, setEditPost, getAiAnalysisData, clearAiAnalysisData } =
    usePostStore();
  const editPost = getEditPost();
  const editMode = editPost != null;
  const router = useRouter();

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
      setTags(editPost.tags);
    } else {
      // AI 분석 데이터에서 가져오기
      const aiData = getAiAnalysisData();
      if (aiData) {
        if (!title) {
          setTitle(aiData.title);
        }
        if (!content) {
          setContent(
            `${aiData.content.join('\n')}\n\n원문: ${decodeURI(aiData.url)}`
          );
        }
        if (tags.length === 0) {
          setTags(aiData.tags);
        }
        // AI 분석 데이터 사용 후 클리어
        clearAiAnalysisData();
      }
    }
  }, [editPost, getAiAnalysisData, clearAiAnalysisData]);

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

  // URL 미리보기 관련 함수들
  const processContentForUrls = useCallback(
    async (text: string) => {
      const urls = extractUrls(text);
      const newUrls = urls.filter(
        (url) =>
          isValidUrl(url) && !urlPreviews.some((preview) => preview.url === url)
      );

      if (newUrls.length > 0) {
        setIsLoadingPreview(true);
        try {
          const newPreviews = (
            await Promise.all(newUrls.map((url) => fetchUrlPreview(url)))
          ).filter(Boolean) as UrlPreviewData[]; // null 제거 및 타입 단언
          setUrlPreviews((prev) => [...prev, ...newPreviews]);
        } catch (error) {
          console.error('Error fetching URL previews:', error);
        } finally {
          setIsLoadingPreview(false);
        }
      }
    },
    [urlPreviews]
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // URL이 포함되어 있는지 확인하고 미리보기 처리
    if (newContent.includes('http')) {
      processContentForUrls(newContent);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const paste = e.clipboardData.getData('text');
    // URL 패턴만 찾아서 decodeURI
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let replaced = false;
    const newText = paste.replace(urlRegex, (url) => {
      if (/%[0-9A-Fa-f]{2}/.test(url)) {
        try {
          replaced = true;
          return decodeURI(url);
        } catch {
          return url;
        }
      }
      return url;
    });
    if (replaced) {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        textarea.value.substring(0, start) +
        newText +
        textarea.value.substring(end);
      setContent(newValue);
      // 커서 위치도 맞춰주기
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd =
          start + newText.length;
      }, 0);
    }
  };

  const removeUrlPreview = (urlToRemove: string) => {
    setUrlPreviews((prev) =>
      prev.filter((preview) => preview.url !== urlToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode) {
      handleCreateOrUpdatePost();
    } else {
      setModalOpen(true);
    }
  };

  const handleCreateOrUpdatePost = async () => {
    const thumbnailUrl = urlPreviews.find((preview) => preview.image)?.image;
    try {
      if (editPost) {
        const post = await updatePost(editPost.id, {
          title,
          content,
          tags,
          thumbnailUrl,
        });
        setTitle('');
        setContent('');
        setTags([]);
        setEditPost(null); // 이동 전 초기화
        router.push(`/posts/${post.id}`);
      } else {
        const post = await createPost({
          title,
          content,
          tags,
          password: modalPassword,
          thumbnailUrl,
        });
        setTitle('');
        setContent('');
        setTags([]);
        setEditPost(null); // 이동 전 초기화
        router.push(`/posts/${post.id}`);
      }
    } catch (error) {
      // TODO: toast 등으로 에러 메시지 처리 예정
    }
  };

  const handleModalConfirm = async () => {
    setModalPasswordTouched(true);
    if (!isValidPassword(modalPassword)) return;
    await handleCreateOrUpdatePost();
    resetModalPassword();
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
        <PageHeader
          title={editMode ? '게시글 수정' : '게시글 작성'}
          showBackButton={true}
          backHref="/"
          rightButton={
            <Button onClick={handleSubmit}>
              {editMode ? '저장하기' : '게시하기'}
            </Button>
          }
        />
        {/* 게시글 작성 폼 */}
        <form className="mt-8 flex flex-col gap-6" onSubmit={handleSubmit}>
          <Input
            type="text"
            className="w-full text-lg"
            placeholder="제목을 입력하세요(50자 이하)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
          />
          <textarea
            className="min-h-[320px] w-full resize-none rounded border border-[var(--color-border)] px-4 py-2 text-base text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={handleContentChange}
            onPaste={handlePaste}
            required
          />
          {urlPreviews.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="text-sm font-medium text-[var(--color-black)]">
                링크 미리보기
              </div>
              <div className="flex flex-col gap-2">
                {urlPreviews.map((preview) => (
                  <UrlPreviewCard
                    key={preview.url}
                    data={preview}
                    onRemove={() => removeUrlPreview(preview.url)}
                    className="max-w-md"
                  />
                ))}
              </div>
            </div>
          )}
          {isLoadingPreview && (
            <div className="flex items-center gap-2 text-sm text-[var(--color-subtext)]">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-button)]"></div>
              링크 미리보기를 불러오는 중...
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="text"
                className="w-full flex-1 text-sm"
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
            <Input
              type="password"
              className="w-full text-sm"
              errorMessage={
                modalPasswordError
                  ? '비밀번호는 6자리, 영문과 숫자만 입력할 수 있습니다.'
                  : undefined
              }
              placeholder="비밀번호(6자리, 영문과 숫자만 입력)"
              value={modalPassword}
              onChange={(e) => setModalPassword(e.target.value)}
              onBlur={() => setModalPasswordTouched(true)}
              maxLength={6}
              required
            />
            <Input
              type="password"
              className="w-full text-sm"
              errorMessage={
                confirmPasswordError
                  ? '비밀번호가 일치하지 않습니다.'
                  : undefined
              }
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setConfirmPasswordTouched(true)}
              maxLength={6}
              required
            />
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
