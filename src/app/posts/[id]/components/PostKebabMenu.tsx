'use client';
import KebabMenu from '@components/KebabMenu';
import EditIcon from '@icons/EditIcon';
import DeleteIcon from '@icons/DeleteIcon';

interface PostKebabMenuProps {
  onRequestPasswordModal?: (action: 'edit' | 'delete') => void;
}

const PostKebabMenu = ({ onRequestPasswordModal }: PostKebabMenuProps) => {
  const handleEdit = () => {
    onRequestPasswordModal?.('edit');
  };

  const handleDelete = () => {
    onRequestPasswordModal?.('delete');
  };

  const menus = [
    {
      label: '수정',
      value: 'edit',
      icon: <EditIcon className="h-4 w-4 text-[var(--color-icon)]" />,
      onClick: handleEdit,
    },
    {
      label: '삭제',
      value: 'delete',
      icon: <DeleteIcon className="h-4 w-4 text-[var(--color-error)]" />,
      onClick: handleDelete,
    },
  ];

  return <KebabMenu menus={menus} />;
};

export default PostKebabMenu;
