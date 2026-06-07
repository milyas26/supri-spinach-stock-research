import { notFound } from 'next/navigation';
import { getDeepResearchFiles, getDeepResearchContent } from '@/lib/content';
import { processMarkdown } from '@/components/markdown-renderer';
import { HighlightedContent } from '@/components/highlighted-content';
import { Comments } from '@/components/comments';

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

  return (
    <div>
      <HighlightedContent html={html} />
      <hr className="my-8 border-gray-300" />
      <Comments />
    </div>
  );
}
