'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import PostListItem from '@posts/components/PostListItem';
import { getPosts } from '@api/posts';
import type { Post } from '@models/post';

const LIMIT = 10;

interface PostListClientProps {
  initialPosts: Post[];
  total: number;
}

/**
 * 게시글 목록 클라이언트 컴포넌트 (무한스크롤)
 */
const PostListClient = ({ initialPosts, total }: PostListClientProps) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasNext, setHasNext] = useState(initialPosts.length < total);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasNext) return;
    setIsLoading(true);
    try {
      const res = await getPosts(posts.length, LIMIT);
      setPosts((prev) => [...prev, ...res.posts]);
      setHasNext(res.has_next);
    } finally {
      setIsLoading(false);
    }
  }, [posts.length, hasNext, isLoading]);

  useEffect(() => {
    if (!hasNext || isLoading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchPosts, hasNext, isLoading]);

  return (
    <>
      <div className="flex flex-col">
        {posts.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center text-lg font-medium text-[var(--color-subtext)]">
            아직 게시글이 없습니다.
            <br />첫 게시글을 작성해보세요!
          </div>
        ) : (
          posts.map((post) => <PostListItem key={post.id} post={post} />)
        )}
      </div>
      <div ref={loaderRef} className="h-10" />
      {isLoading && (
        <div className="py-4 text-center text-sm text-[var(--color-subtext)]">
          불러오는 중...
        </div>
      )}
      {!hasNext && posts.length > 0 && (
        <div className="py-4 text-center text-sm text-[var(--color-subtext)]">
          마지막 글입니다.
        </div>
      )}
    </>
  );
};

export default PostListClient;
