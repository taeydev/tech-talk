import React from 'react';
import ArrowRightIcon from '@icons/ArrowRightIcon';
import CalendarIcon from '@icons/CalendarIcon';
import EyeIcon from '@icons/EyeIcon';
import type { Post } from '@models/post';

interface PostListItemProps {
  post: Post;
}

/**
 * 게시글 리스트 아이템
 */
const PostListItem: React.FC<PostListItemProps> = ({ post }) => {
  return (
    <div className="group flex w-full cursor-pointer items-start justify-between border-b border-[var(--color-border)] px-4 py-4 transition hover:bg-[rgba(0,0,0,0.03)]">
      <div className="flex max-w-[65%] min-w-0 flex-1 flex-col">
        <div className="mb-2 truncate text-base font-bold text-[var(--color-black)]">
          {post.title}
        </div>
        <div className="mb-1 line-clamp-2 text-sm leading-snug break-words text-[var(--color-subtext)]">
          {post.content}
        </div>
        <div className="mt-1 flex items-center gap-4 text-xs text-[var(--color-subtext)]">
          <span className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4 text-[var(--color-icon)]" />
            {post.createdAt}
          </span>
          <span className="flex items-center gap-1">
            <EyeIcon className="h-4 w-4 text-[var(--color-icon)]" />
            {post.views.toLocaleString()}
          </span>
        </div>
      </div>
      <div
        className="relative flex-shrink-0"
        style={{ width: 160, height: 80 }}
      >
        <img
          src={post.thumbnailUrl}
          alt="thumbnail"
          className="absolute top-1/2 right-0 h-20 w-32 -translate-y-1/2 rounded bg-[var(--color-border)] object-cover transition-transform duration-200 group-hover:-translate-x-8"
        />
        <ArrowRightIcon className="absolute top-1/2 right-0 z-10 h-5 w-5 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
      </div>
    </div>
  );
};

export default PostListItem;
