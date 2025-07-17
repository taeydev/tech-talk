'use client';
import { useState } from 'react';
import CommentIcon from '@components/icons/CommentIcon';
import Button from '@components/Button';
import Input from '@components/Input';
import { Comment } from '@models/comment';
import CommentItem from './CommentItem';
import { postComment, getComments } from '@api/posts';
import { useRouter } from 'next/navigation';
import { usePasswordValidation } from '@hooks/usePasswordValidation';

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  commentCount: number;
}

const PAGE_SIZE = 10;

/**
 * 댓글 영역 컴포넌트
 */
const CommentSection = ({
  comments: initialComments,
  postId,
  commentCount,
}: CommentSectionProps) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(
    initialComments.length === PAGE_SIZE
  );
  const [recentComment, setRecentComment] = useState<Comment | null>(null);

  const {
    password,
    setPassword,
    setPasswordTouched,
    isValidPassword,
    passwordError,
    passwordErrorMessage,
    reset,
  } = usePasswordValidation({ minLength: 4, maxLength: 4 });

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const newComment = await postComment({
        postId,
        content: comment,
        password,
      });
      if (recentComment) {
        setComments((prev) => {
          // 기존에 새로 등록한 댓글이 이미 들어가 있지 않은 경우에만 추가
          if (!prev.some((c) => c.id === recentComment.id)) {
            return [...prev, recentComment];
          }
          return prev;
        });
      }
      setRecentComment(newComment); // 새로 등록한 댓글을 별도 상태로 저장
      const totalCount = comments.length + (recentComment ? 1 : 0) + 1;
      setHasMore(totalCount < commentCount);
      setComment('');
      reset();
      router.refresh();
    } catch (e) {
      setError('댓글 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const newComments = await getComments(postId, comments.length, PAGE_SIZE);
    setComments((prev) => [...prev, ...newComments]);
    let cnt = comments.length + newComments.length + (recentComment ? 1 : 0);
    setHasMore(cnt < commentCount);
  };

  return (
    <div className="border-t border-[var(--color-border)] pt-8">
      <span className="mb-4 flex items-center gap-1 text-base font-semibold text-[var(--color-black)]">
        <CommentIcon className="h-4 w-4 text-[var(--color-icon)]" />
        댓글
        <span className="ml-1 text-sm font-normal text-[var(--color-subtext)]">
          {commentCount}
        </span>
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
        <div className="mt-1 flex h-14 items-baseline justify-end gap-1">
          <Input
            type="password"
            placeholder="비밀번호(4자리)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            className="h-8 w-45 py-0.5 text-sm"
            maxLength={4}
            errorMessage={
              passwordError ? passwordErrorMessage : error || undefined
            }
          />
          <Button
            type="button"
            disabled={!comment.trim() || !isValidPassword || loading}
            onClick={handleRegister}
            size="small"
            className="text-sm"
          >
            {loading ? '등록 중...' : '등록'}
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        {comments
          .filter((item) => !recentComment || item.id !== recentComment.id)
          .map((item) => (
            <CommentItem
              key={item.id}
              comment={item}
              onUpdate={(updated) =>
                setComments((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                )
              }
              onDelete={(id) => {
                setComments((prev) => prev.filter((c) => c.id !== id));
                router.refresh();
              }}
            />
          ))}
        {hasMore && (
          <Button
            type="button"
            variant="outline"
            className="my-4 self-center"
            onClick={handleLoadMore}
            size="small"
          >
            댓글 더보기
          </Button>
        )}
        {recentComment && (
          <CommentItem
            key={recentComment.id}
            comment={recentComment}
            onUpdate={(updated) => setRecentComment(updated)}
            onDelete={() => setRecentComment(null)}
            className="bg-blue-50 hover:bg-blue-50"
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
