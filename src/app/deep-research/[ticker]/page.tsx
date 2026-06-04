import { notFound } from 'next/navigation';
import { getDeepResearchFiles, getDeepResearchContent } from '@/lib/content';
import { MarkdownRenderer } from '@/components/markdown-renderer';

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

  return (
    <div>
      <MarkdownRenderer content={content} />
    </div>
  );
}
