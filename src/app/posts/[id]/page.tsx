import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import CommentSection from '../components/CommentSection';
import PostKebabMenuTrigger from './components/PostKebabMenuTrigger';
import Button from '@components/Button';
import CalendarIcon from '@icons/CalendarIcon';
import EyeIcon from '@icons/EyeIcon';
import CommentIcon from '@components/icons/CommentIcon';
import { getPostById } from '@api/posts';
import InlineUrlPreviewCards from '../components/InlineUrlPreviewCards';
import { linkifyText } from '@utils/textUtils';

/**
 * 게시글 상세 페이지
 */
const PostDetailPage = async ({ params }: { params: { id: string } }) => {
  const post = await getPostById(params.id);

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
        <PageHeader
          title="게시글 상세"
          showBackButton={true}
          backHref="/posts"
          rightButton={<PostKebabMenuTrigger post={post} />}
        />
        <div className="mt-8 flex flex-col">
          <div className="flex flex-col">
            <div className="relative mb-8 w-full overflow-hidden rounded">
              {post.thumbnailUrl ? (
                <img
                  src={post.thumbnailUrl}
                  alt="thumbnail"
                  className="h-48 w-full object-cover"
                  style={{ filter: 'blur(3px)' }}
                />
              ) : (
                <div className="h-48 w-full rounded bg-gray-50" />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />
              <div className="absolute bottom-0 left-0 flex w-full flex-col items-start gap-2 px-6 pb-4">
                <h3 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,1)]">
                  {post.title}
                </h3>
                <div className="mt-2 flex gap-4 text-xs font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    {post.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <EyeIcon className="h-4 w-4" />
                    {post.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <CommentIcon className="h-4 w-4 text-white opacity-80" />
                    {post.comments?.length ?? 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-10 min-h-[180px] px-2 text-base whitespace-pre-line text-[var(--color-black)]">
              {linkifyText(post.content)}
              <div className="mt-10">
                <InlineUrlPreviewCards lines={post.content.split('\n')} />
              </div>
            </div>
            {post.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {`#${tag}`}
                  </span>
                ))}
              </div>
            )}
            <CommentSection comments={post.comments ?? []} postId={post.id} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostDetailPage;
