import { notFound } from 'next/navigation';
import { getDeepResearchFiles, getDeepResearchContent, getRelatedTickerFiles } from '@/lib/content';
import { processMarkdown } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';
import { TickerTimeline } from '@/components/ticker-timeline';

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateStaticParams() {
  const files = getDeepResearchFiles();
  return files.map((ticker) => ({ ticker }));
}

export default async function DeepResearchPage({ params }: PageProps) {
  const { ticker } = await params;

  let content: string;
  try {
    content = getDeepResearchContent(ticker);
  } catch {
    notFound();
  }

  const html = await processMarkdown(content);
  const relatedFiles = getRelatedTickerFiles(ticker);

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
        <HighlightedContent html={html} />
        {/* Mobile timeline: visible below xl */}
        <div className="xl:hidden">
          <TickerTimeline files={relatedFiles} />
        </div>
        <hr className="my-8 border-gray-300" />
        <Comments />
      </div>
      {/* Desktop timeline: visible at xl+ */}
      <div className="hidden xl:block w-[200px] shrink-0 sticky top-14 self-start">
        <TickerTimeline files={relatedFiles} />
      </div>
    </div>
  );
}
