'use client';
import { useState } from 'react';
import CommentIcon from '@components/icons/CommentIcon';
import Button from '@components/Button';
import Input from '@components/Input';
import { Comment } from '@models/comment';
import CommentItem from './CommentItem';
import { postComment } from '@api/posts';
import { useRouter } from 'next/navigation';

interface CommentSectionProps {
  comments: Comment[];
  postId: number;
}

/**
 * 댓글 영역 컴포넌트
 */
const CommentSection = ({
  comments: initialComments,
  postId,
}: CommentSectionProps) => {
  const router = useRouter();
  const [comment, setComment] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const newComment = await postComment({
        postId,
        content: comment,
        password,
      });
      setComments((prev) => [...prev, newComment]);
      setComment('');
      setPassword('');
      router.refresh();
    } catch (e) {
      setError('댓글 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-[var(--color-border)] pt-8">
      <span className="mb-4 flex items-center gap-1 text-base font-semibold text-[var(--color-black)]">
        <CommentIcon className="h-4 w-4 text-[var(--color-icon)]" />
        댓글
        <span className="ml-1 text-sm font-normal text-[var(--color-subtext)]">
          {comments.length}
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
        <div className="mt-1 flex items-center justify-end gap-1">
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-8 w-40 py-0.5 text-sm"
            maxLength={6}
            errorMessage={error || undefined}
          />
          <Button
            type="button"
            disabled={!comment.trim() || !password.trim() || loading}
            onClick={handleRegister}
            size="small"
            className="text-sm"
          >
            {loading ? '등록 중...' : '등록'}
          </Button>
        </div>
      </div>
      <div className="mt-6 flex flex-col">
        {comments.map((item) => (
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
      </div>
    </div>
  );
};

export default CommentSection;
