'use client';
import CommentIcon from '@icons/CommentIcon';
import { useState } from 'react';
import Button from '@components/Button';

/**
 * 댓글 영역 컴포넌트
 */
const CommentSection = () => {
  const [comment, setComment] = useState<string>('');

  return (
    <div className="border-t border-[var(--color-border)] pt-8">
      <span className="mb-4 flex items-center gap-1 text-base font-semibold text-[var(--color-black)]">
        <CommentIcon className="h-4 w-4 text-[var(--color-icon)]" />
        댓글
      </span>
      <div className="mt-4 flex flex-col gap-2">
        <textarea
          className="min-h-[48px] w-full resize-none rounded border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-black)] placeholder:text-gray-400 focus:ring-1 focus:ring-blue-200 focus:outline-none"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={200}
          rows={2}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!comment.trim()}
            onClick={() => {
              /* 등록 로직 */
            }}
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
