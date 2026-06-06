import { notFound } from 'next/navigation';
import { getReportFiles, getReportContent } from '@/lib/content';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Comments } from '@/components/comments';

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

  return (
    <div>
      <MarkdownRenderer content={content} />
      <hr className="my-8 border-gray-300" />
      <Comments />
    </div>
  );
}
