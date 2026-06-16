import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getDeepResearchFiles, getDeepResearchContent, getRelatedTickerFiles, extractMeta } from '@/lib/content';
import { processMarkdownWithToc } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';
import { TickerTimeline } from '@/components/ticker-timeline';
import { TableOfContents } from '@/components/table-of-contents';
import { BookmarkWrapper } from '@/components/bookmark-wrapper';
import { siteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateStaticParams() {
  const files = getDeepResearchFiles();
  return files.map((ticker) => ({ ticker }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ticker } = await params;
  let content: string;
  try {
    content = getDeepResearchContent(ticker);
  } catch {
    return {};
  }
  const { title, description } = extractMeta(content);
  const ogUrl = `${siteUrl}/api/og?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&type=${encodeURIComponent('Deep Research')}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/deep-research/${ticker}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl],
    },
  };
}

export default async function DeepResearchPage({ params }: PageProps) {
  const { ticker } = await params;

  let content: string;
  try {
    content = getDeepResearchContent(ticker);
  } catch {
    redirect('/');
  }

  const { html, toc } = await processMarkdownWithToc(content);
  const relatedFiles = getRelatedTickerFiles(ticker);

  const tocItems = toc.filter(i => i.level > 1);

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
        <BookmarkWrapper contentType="deep-research" contentSlug={ticker} label={ticker} />
        <HighlightedContent html={html} />
        {/* Mobile timeline: visible below xl */}
        <div className="xl:hidden">
          <TickerTimeline files={relatedFiles} />
        </div>
        <hr className="my-8 border-gray-300 max-w-[56rem] mx-auto" />
        <Comments />
      </div>
      {/* Desktop right column: TOC + Timeline, visible at xl+ */}
      <div className="hidden xl:flex xl:flex-col gap-8 w-[200px] shrink-0 sticky top-14 self-start">
        {tocItems.length > 0 && <TableOfContents items={tocItems} />}
        <TickerTimeline files={relatedFiles} />
      </div>
    </div>
  );
}
