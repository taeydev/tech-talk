import PageHeader from '../components/PageHeader';
import CommentSection from '../components/CommentSection';
import PostKebabMenuTrigger from './components/PostKebabMenuTrigger';
import Button from '@components/Button';
import Link from 'next/link';
import CalendarIcon from '@icons/CalendarIcon';
import EyeIcon from '@icons/EyeIcon';
import { Post } from '@models/post';

const mockPosts: Post[] = [
  {
    id: 1,
    thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
    title:
      '기술 공유 예시 게시글 제목입니다. 기술 공유 예시 게시글 제목입니다. 기술 공유 예시 게시글 제목입니다. 기술 공유 예시 게시글 제목입니다. 기술 공유 예시 게시글 제목입니다.',
    content:
      '이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다. 이곳은 게시글의 내용이 들어가는 부분입니다.',
    createdAt: '2025-07-01',
    views: 1234,
    tags: ['React', 'Next.js'],
  },
  {
    id: 2,
    thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
    title: '두 번째 게시글 제목',
    content: '짧은 내용',
    createdAt: '2025-06-22',
    views: 567,
    tags: ['TypeScript'],
  },
  {
    id: 3,
    thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
    title: '세 번째 게시글 제목',
    content: '세 번째 게시글의 내용입니다.',
    createdAt: '2025-05-03',
    views: 890,
    tags: ['JavaScript', 'Web'],
  },
];

const PostDetailPage = ({ params }: { params: { id: string } }) => {
  const post = mockPosts.find((p) => String(p.id) === params.id);

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
            {post.thumbnailUrl && (
              <img
                src={post.thumbnailUrl}
                alt="thumbnail"
                className="mb-4 h-48 w-full rounded border border-[var(--color-border)] bg-[var(--color-border)] object-cover"
              />
            )}
            <div className="my-2 mt-6 text-lg font-bold text-[var(--color-black)]">
              {post.title}
            </div>
            <div className="mb-6 flex flex-col gap-3 border-b-1 border-[var(--color-border)] py-3 text-xs text-[var(--color-subtext)]">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4 text-[var(--color-icon)]" />
                  {post.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4 text-[var(--color-icon)]" />
                  {post.views.toLocaleString()}
                </span>
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
            <div className="mb-6 min-h-[180px] text-base whitespace-pre-line text-[var(--color-black)]">
              {post.content}
            </div>
            <CommentSection />
          </div>
        </div>
      </div>
    </main>
  );
};

export default PostDetailPage;
