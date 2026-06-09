import { notFound } from 'next/navigation';
import { getReportFiles, getReportContent, getTickerToLatestDeepResearch } from '@/lib/content';
import { processMarkdownWithToc } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';
import { TableOfContents } from '@/components/table-of-contents';

interface PageProps {
  params: Promise<{ filename: string }>;
}

export async function generateStaticParams() {
  const files = getReportFiles();
  return files.map((filename) => ({ filename }));
}

export default async function ReportPage({ params }: PageProps) {
  const { filename } = await params;

  let content: string;
  try {
    content = getReportContent(filename);
  } catch {
    notFound();
  }

  const { html, toc } = await processMarkdownWithToc(content, getTickerToLatestDeepResearch());

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
      <HighlightedContent html={html} />
        <hr className="my-8 border-gray-300" />
        <Comments />
      </div>
      {/* Desktop TOC: sticky right sidebar, visible at xl+ */}
      {toc.length > 0 && (
        <div className="hidden xl:block w-[200px] shrink-0 sticky top-14 self-start">
          <TableOfContents items={toc} />
        </div>
      )}
    </div>
  );
}
