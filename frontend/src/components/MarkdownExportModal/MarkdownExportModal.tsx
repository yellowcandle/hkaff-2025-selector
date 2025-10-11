import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MarkdownExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
}

export const MarkdownExportModal: React.FC<MarkdownExportModalProps> = ({
  isOpen,
  onClose,
  markdownContent
}) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language === 'tc';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hkaff-2025-schedule-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 id="export-modal-title" className="text-2xl font-bold text-foreground">
            {isZh ? '匯出 Markdown' : 'Export Markdown'}
          </h2>
          <button
            onClick={onClose}
            className="group min-h-[44px] min-w-[44px] p-2 bg-gradient-to-br from-destructive/10 to-destructive/5 hover:from-destructive hover:to-primary text-destructive hover:text-white rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110 focus:ring-4 focus:ring-destructive/50 focus:ring-offset-2"
            aria-label={isZh ? '關閉匯出視窗' : 'Close export modal'}
          >
            <svg className="w-6 h-6 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="bg-muted rounded-lg p-4 border border-border">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
              {markdownContent}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 p-6 border-t border-border bg-muted">
          <button
            onClick={handleCopy}
            aria-label={isZh ? '複製 Markdown 內容到剪貼簿' : 'Copy Markdown content to clipboard'}
            className="group relative min-h-[48px] px-7 py-3 bg-gradient-to-br from-card via-card to-muted border-2 border-border hover:border-accent/50 text-foreground rounded-xl font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 focus:ring-4 focus:ring-accent/50 focus:ring-offset-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center gap-2">
              {copied ? (
                <>
                  <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {isZh ? '已複製' : 'Copied'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isZh ? '複製到剪貼簿' : 'Copy to Clipboard'}
                </>
              )}
            </div>
          </button>
          <button
            onClick={handleDownload}
            aria-label={isZh ? '下載 Markdown 檔案' : 'Download Markdown file'}
            className="group relative min-h-[48px] px-7 py-3 bg-gradient-to-br from-accent via-accent to-primary text-white rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 focus:ring-4 focus:ring-accent/50 focus:ring-offset-2 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {isZh ? '下載 .md 檔案' : 'Download .md File'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
