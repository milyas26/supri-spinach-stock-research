import { notFound } from 'next/navigation';
import { getGeneralFiles, getGeneralContent } from '@/lib/content';
import { processMarkdownWithToc } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';
import { TableOfContents } from '@/components/table-of-contents';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const files = getGeneralFiles();
  return files.map((slug) => ({ slug }));
}

export default async function GeneralPage({ params }: PageProps) {
  const { slug } = await params;

  let content: string;
  try {
    content = getGeneralContent(slug);
  } catch {
    notFound();
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
