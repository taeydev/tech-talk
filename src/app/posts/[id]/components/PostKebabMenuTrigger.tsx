'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostKebabMenu from './PostKebabMenu';
import PostPasswordModal from './PostPasswordModal';
import { Post } from '@models/post';
import { usePostStore } from '@store/usePostStore';
import { verifyPostPassword, deletePost } from '@/api/posts';

const PostKebabMenuTrigger = ({ post }: { post: Post }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const router = useRouter();
  const { setEditPost } = usePostStore();

  const handleMenuClick = (action: 'edit' | 'delete') => {
    setAction(action);
    setModalOpen(true);
    setErrorMessage(undefined);
  };

  const handleModalConfirm = async (password: string) => {
    if (!action) return;
    const ok = await verifyPostPassword(post.id, password);
    if (ok) {
      if (action === 'edit') {
        setEditPost(post);
        router.push('/posts/write');
      } else if (action === 'delete') {
        try {
          await deletePost(post.id);
          router.push('/posts');
        } catch (error) {
          // TODO: 삭제 실패 안내 (예: toast, alert 등)
          return;
        }
      }
      setModalOpen(false);
      setAction(null);
      setErrorMessage(undefined);
    } else {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <>
      <PostKebabMenu onRequestPasswordModal={handleMenuClick} />
      <PostPasswordModal
        open={modalOpen}
        action={action}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default PostKebabMenuTrigger;
