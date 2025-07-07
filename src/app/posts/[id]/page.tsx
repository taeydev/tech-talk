import ArrowLeftIcon from '@icons/ArrowLeftIcon';
import Button from '@components/Button';
import Link from 'next/link';

const mockPosts = [
  {
    id: '1',
    title: '첫 번째 게시글',
    content: '이것은 첫 번째 게시글의 내용입니다.',
    tags: ['React', 'Next.js'],
  },
  {
    id: '2',
    title: '두 번째 게시글',
    content: '두 번째 게시글의 내용입니다.',
    tags: ['TypeScript'],
  },
  {
    id: '3',
    title: '세 번째 게시글',
    content: '세 번째 게시글의 내용입니다.',
    tags: ['JavaScript', 'Web'],
  },
];

/**
 * 게시글 상세 페이지
 */
const PostDetailPage = ({ params }: { params: { id: string } }) => {
  const post = mockPosts.find((p) => p.id === params.id);

  if (!post) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--color-bg)] py-10">
        <div className="text-xl font-bold text-[var(--color-black)]">
          게시글을 찾을 수 없습니다.
        </div>
        <Link href="/posts" className="mt-6">
          <Button variant="outline">목록으로 돌아가기</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] flex-col items-center bg-[var(--color-bg)] py-10">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-12">
        <div className="mb-2 flex w-full items-center justify-between">
          <Link href="/posts" aria-label="뒤로가기">
            <button
              type="button"
              className="mr-4 flex items-center text-[var(--color-black)]"
            >
              <ArrowLeftIcon className="h-5 w-5 cursor-pointer" />
            </button>
          </Link>
          <h2 className="flex-1 text-2xl font-bold text-[var(--color-black)]">
            게시글 상세
          </h2>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="my-2 text-lg font-bold text-[var(--color-black)]">
              {post.title}
            </div>
            <div className="min-h-[180px] whitespace-pre-line text-[var(--color-black)]">
              {post.content}
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostDetailPage;
