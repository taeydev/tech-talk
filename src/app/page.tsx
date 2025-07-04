import PostListItem from '@components/PostListItem';
import { Post } from '@/app/models/post';

export default function Home() {
  // 예시 데이터
  const posts: Post[] = [
    {
      id: 1,
      thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
      title:
        '기술 공유 예시 게시글 제목입니다. 한 줄까지만 보여집니다. 길어질 경우 그 이후는 ... 으로 생략됩니다.',
      content:
        '이곳은 게시글의 내용이 들어가는 부분입니다. 내용이 길어질 경우 두 줄까지만 보여지고, 그 이후는 ... 으로 생략됩니다. 기술적인 내용, 코드, 설명 등 자유롭게 작성할 수 있습니다.',
      createdAt: '2025-07-01',
      views: 1234,
    },
    {
      id: 2,
      thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
      title: '두 번째 게시글 제목',
      content: '짧은 내용',
      createdAt: '2025-06-22',
      views: 567,
    },
    {
      id: 3,
      thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
      title: '세 번째 게시글 제목',
      content: '세 번째 게시글의 내용입니다.',
      createdAt: '2025-05-03',
      views: 890,
    },
    {
      id: 4,
      thumbnailUrl: 'https://placehold.co/400x200?text=썸네일',
      title: '네 번째 게시글 제목',
      content: '네 번째 게시글의 내용입니다.',
      createdAt: '2024-11-04',
      views: 321,
    },
  ];

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--color-bg)] py-10">
      <div className="mx-auto w-full max-w-4xl px-4 md:px-12">
        <div className="mb-2 w-full">
          <h2 className="text-2xl font-bold text-[var(--color-black)]">
            Tech Posts
          </h2>
        </div>
        <div className="mb-4 w-full text-right">
          <span className="text-sm text-[var(--color-subtext)]">
            Total: {posts.length}
          </span>
        </div>
        <div className="flex flex-col divide-y divide-[var(--color-border)] rounded-lg border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
