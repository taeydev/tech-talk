'use client';
import { useRouter } from 'next/navigation';
import PostKebabMenu from './PostKebabMenu';
import { Post } from '@models/post';
import { usePostStore } from '@store/usePostStore';
import { verifyPostPassword, deletePost } from '@/api/posts';
import { useModalStore } from '@store/useModalStore';

export type PasswordCheckResult =
  | { success: true }
  | {
      success: false;
      error: 'password' | 'delete' | 'network' | 'unknown';
      message?: string;
    };

const PostKebabMenuTrigger = ({ post }: { post: Post }) => {
  const router = useRouter();
  const { setEditPost } = usePostStore();
  const { openModal } = useModalStore();

  const handleMenuClick = (action: 'edit' | 'delete') => {
    openModal('passwordCheck', {
      action,
      onConfirm: async (password: string): Promise<PasswordCheckResult> => {
        const ok = await verifyPostPassword(post.id, password);
        if (!ok) {
          return {
            success: false,
            error: 'password',
            message: '비밀번호가 일치하지 않습니다.',
          };
        }
        if (action === 'edit') {
          setEditPost(post);
          router.replace('/posts/write'); // push → replace
          return { success: true };
        } else if (action === 'delete') {
          try {
            await deletePost(post.id);
            router.replace('/posts'); // push → replace
            return { success: true };
          } catch (error) {
            return {
              success: false,
              error: 'delete',
              message: '삭제에 실패했습니다.',
            };
          }
        }
        return { success: false, error: 'unknown' };
      },
    });
  };

  return (
    <>
      <PostKebabMenu onRequestPasswordModal={handleMenuClick} />
    </>
  );
};

export default PostKebabMenuTrigger;
