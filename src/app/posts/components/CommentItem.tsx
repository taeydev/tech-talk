'use client';
import { useState } from 'react';
import { Comment } from '@models/comment';
import UserIcon from '@components/icons/UserIcon';
import KebabMenu from '@components/KebabMenu';
import Input from '@components/Input';
import Button from '@components/Button';
import { updateComment, deleteComment } from '@api/posts';
import EditIcon from '@icons/EditIcon';
import DeleteIcon from '@icons/DeleteIcon';

interface CommentItemProps {
  comment: Comment;
  onUpdate?: (updated: Comment) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

/**
 * 댓글 아이템 컴포넌트
 */
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUpdate,
  onDelete,
  className,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [mode, setMode] = useState<'none' | 'edit' | 'delete'>('none');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = (action: 'edit' | 'delete') => {
    setMode(action);
    setPassword('');
    setError(null);
    setShowMenu(false);
  };

  const handleEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateComment({
        commentId: comment.id,
        content: editContent,
        password,
      });
      onUpdate?.(updated);
      setMode('none');
    } catch (e: any) {
      setError(e.message || '수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteComment({
        commentId: comment.id,
        password,
      });
      onDelete?.(comment.id);
      setMode('none');
    } catch (e: any) {
      setError(e.message || '삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-2 border-b border-[var(--color-border)] px-2 py-3 transition-colors last:border-b-0 hover:bg-gray-50 ${className || ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pt-1 pr-2">
        <UserIcon className="h-8 w-8" />
      </div>
      <div className="flex-1">
        {mode === 'edit' ? (
          <textarea
            className="min-h-[40px] w-full rounded border border-[var(--color-border)] px-3 py-2 text-sm text-gray-600 focus:ring-1 focus:ring-blue-200 focus:outline-none"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={200}
            rows={2}
          />
        ) : (
          <div className="text-sm break-words whitespace-pre-line text-gray-600">
            {comment.content}
          </div>
        )}
        <div className="mt-1 text-left text-xs text-gray-400">
          {comment.createdAt}
        </div>
        {mode !== 'none' && (
          <div className="mt-2 flex items-start justify-end gap-2">
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-8 w-40 py-0.5 text-sm"
              maxLength={4}
              errorMessage={error || undefined}
            />
            {mode === 'edit' ? (
              <Button
                type="button"
                variant="outline"
                disabled={
                  !password.trim() ||
                  loading ||
                  !editContent.trim() ||
                  editContent === comment.content
                }
                onClick={handleEdit}
                size="small"
              >
                {loading ? '적용 중...' : '적용'}
              </Button>
            ) : (
              <Button
                type="button"
                disabled={!password.trim() || loading}
                onClick={handleDelete}
                color="danger"
                variant="outline"
                size="small"
              >
                {loading ? '삭제 중...' : '삭제'}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setMode('none')}
              size="small"
            >
              취소
            </Button>
          </div>
        )}
      </div>
      <div
        className={`absolute top-2 right-0 ${(hovered || menuOpen) && mode === 'none' ? '' : 'hidden'}`}
      >
        <KebabMenu
          menus={[
            {
              label: '수정',
              value: 'edit',
              icon: <EditIcon className="h-4 w-4 text-[var(--color-icon)]" />,
              onClick: () => handleMenuClick('edit'),
            },
            {
              label: '삭제',
              value: 'delete',
              icon: (
                <DeleteIcon className="h-4 w-4 text-[var(--color-error)]" />
              ),
              onClick: () => handleMenuClick('delete'),
            },
          ]}
          open={menuOpen}
          setOpen={setMenuOpen}
        />
      </div>
    </div>
  );
};

export default CommentItem;
