import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getGeneralFiles, getGeneralContent, extractMeta } from '@/lib/content';
import { processMarkdownWithToc } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';
import { TableOfContents } from '@/components/table-of-contents';
import { BookmarkWrapper } from '@/components/bookmark-wrapper';
import { siteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const files = getGeneralFiles();
  return files.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let content: string;
  try {
    content = getGeneralContent(slug);
  } catch {
    return {};
  }
  const { title, description } = extractMeta(content);
  const ogUrl = `${siteUrl}/api/og?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(description)}&type=${encodeURIComponent('Article')}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/general/${slug}`,
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

export default async function GeneralPage({ params }: PageProps) {
  const { slug } = await params;

  let content: string;
  try {
    content = getGeneralContent(slug);
  } catch {
    redirect('/');
  }

  const { html, toc } = await processMarkdownWithToc(content);
  const tocItems = toc.filter((i) => i.level > 1);

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
        <BookmarkWrapper contentType="general" contentSlug={slug} label={slug} />
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
