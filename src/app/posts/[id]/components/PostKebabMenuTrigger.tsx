'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PostKebabMenu from './PostKebabMenu';
import PostPasswordModal from './PostPasswordModal';
import { Post } from '@models/post';
import { usePostStore } from '@store/usePostStore';

const PostKebabMenuTrigger = ({ post }: { post: Post }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [action, setAction] = useState<'edit' | 'delete' | null>(null);
  const router = useRouter();
  const { setEditPost } = usePostStore();

  const handleMenuClick = (action: 'edit' | 'delete') => {
    setAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = (password: string) => {
    if (action === 'edit') {
      // TODO: 비밀번호 검증 후
      setEditPost(post);
      router.push('/posts/write');
    }
    // TODO: 삭제 로직 구현
    setModalOpen(false);
    setAction(null);
  };

  return (
    <>
      <PostKebabMenu onRequestPasswordModal={handleMenuClick} />
      <PostPasswordModal
        open={modalOpen}
        action={action}
        onClose={() => setModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  );
};

export default PostKebabMenuTrigger;
