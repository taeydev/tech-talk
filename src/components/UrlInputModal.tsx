'use client';
import { useState } from 'react';
import Modal from '@components/Modal';
import Button from '@components/Button';
import Input from '@components/Input';
import { useModalStore } from '@store/useModalStore';
import { analyzeUrlWithOpenAI } from '@api/posts';

interface UrlInputModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (postData: any) => void;
}

/**
 * URL로 게시글 작성 모달창
 */
const UrlInputModal = ({ open, onClose, onSuccess }: UrlInputModalProps) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { closeModal } = useModalStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setIsLoading(true);
    try {
      const analysis = await analyzeUrlWithOpenAI(url);
      const postData = analysis
        ? {
            title: analysis.title,
            content: analysis.summary,
            tags: analysis.tags,
            url: url,
          }
        : {
            title: '',
            content: [],
            tags: [],
            url: url,
          };
      onSuccess(postData);
      closeModal();
    } catch (error) {
      // 실패 시에도 닫고, 빈 데이터 전달
      onSuccess({ title: '', content: [], tags: [], url });
      closeModal();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="URL로 간단하게 작성하기">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-sm font-normal text-[var(--color-subtext)]">
          입력하신 URL을 바탕으로{' '}
          <b className="text-[var(--color-button)]">AI</b>가 제목과 본문을{' '}
          <b className="text-[var(--color-button)]">자동 생성</b>합니다.
          <br />
          생성된 내용은 이후에 직접 수정하실 수 있습니다.
        </div>
        <Input
          type="url"
          className="w-full text-sm"
          placeholder="URL을 입력하세요"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isLoading}
        />
        {isLoading && (
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--color-subtext)]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-button)]"></div>
            AI로 내용을 분석하는 중...
          </div>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            className="px-4 py-1.5 text-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-4 py-1.5 text-sm"
            disabled={isLoading}
          >
            {isLoading ? '분석 중...' : '확인'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UrlInputModal;
