import { getPosts } from '@api/posts';
import PageHeader from '@posts/components/PageHeader';
import PostListClient from '@posts/components/PostListClient';

/**
 * 게시글 목록 페이지
 */
const PostListPage = async () => {
  const initialData = await getPosts(0, 20);
  return (
    <main className="flex min-h-[60vh] flex-col items-center bg-[var(--color-bg)] py-10">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-12">
        <PageHeader title="Tech Posts" />
        <div className="mb-4 w-full text-right">
          <span className="text-sm text-[var(--color-subtext)]">
            Total: {initialData.total}
          </span>
        </div>
        <PostListClient
          initialPosts={initialData.posts}
          total={initialData.total}
        />
      </div>
    </main>
  );
};

export default PostListPage;
