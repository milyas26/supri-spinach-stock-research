import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getMarketOverviewFiles, getMarketOverviewContent, extractMeta } from '@/lib/content';
import { processMarkdownWithToc } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';
import { TableOfContents } from '@/components/table-of-contents';
import { siteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const files = getMarketOverviewFiles();
  return files.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let content: string;
  try {
    content = getMarketOverviewContent(slug);
  } catch {
    return {};
  }
  const { title, description } = extractMeta(content);
  const ogUrl = `${siteUrl}/api/og?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&type=${encodeURIComponent('Market Overview')}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/market-overview/${slug}`,
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

export default async function MarketOverviewPage({ params }: PageProps) {
  const { slug } = await params;

  let content: string;
  try {
    content = getMarketOverviewContent(slug);
  } catch {
    redirect('/');
  }

  const { html, toc } = await processMarkdownWithToc(content);
  const tocItems = toc.filter((i) => i.level > 1);

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
        <HighlightedContent html={html} />
        <hr className="my-8 border-gray-300" />
        <Comments />
      </div>
      {tocItems.length > 0 && (
        <div className="hidden xl:block w-[200px] shrink-0 sticky top-14 self-start">
          <TableOfContents items={tocItems} />
        </div>
      )}
    </div>
  );
}
