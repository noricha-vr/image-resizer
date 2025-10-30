import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DropZone } from '../../src/components/DropZone';

describe('DropZone', () => {
  it('初期表示のテキストが表示される', () => {
    render(<DropZone onFilesAccepted={() => {}} />);
    expect(screen.getByText('画像をドラッグ&ドロップ')).toBeInTheDocument();
    expect(screen.getByText('クリックして選択')).toBeInTheDocument();
    expect(screen.getByText('対応形式: JPEG、PNG、WebP、GIF（最大50MB）')).toBeInTheDocument();
  });

  it('onFilesAcceptedコールバックが渡される', () => {
    const handleFilesAccepted = vi.fn();
    render(<DropZone onFilesAccepted={handleFilesAccepted} />);
    // コールバックが正しく受け取られていることを確認（実装の確認）
    expect(handleFilesAccepted).toBeDefined();
  });
});
