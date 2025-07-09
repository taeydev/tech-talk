import PostListItem from '@posts/components/PostListItem';
import PageHeader from '@posts/components/PageHeader';
import { getPosts } from '@api/posts';

/**
 * 게시글 목록 페이지
 */
const PostListPage = async () => {
  const posts = await getPosts();

  return (
    <main className="flex min-h-[60vh] flex-col items-center bg-[var(--color-bg)] py-10">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-12">
        <PageHeader title="Tech Posts" />
        <div className="mb-4 w-full text-right">
          <span className="text-sm text-[var(--color-subtext)]">
            Total: {posts.length}
          </span>
        </div>
        <div className="flex flex-col">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-lg font-medium text-[var(--color-subtext)]">
              아직 게시글이 없습니다.
              <br />첫 게시글을 작성해보세요!
            </div>
          ) : (
            posts.map((post) => <PostListItem key={post.id} post={post} />)
          )}
        </div>
      </div>
    </main>
  );
};

export default PostListPage;
