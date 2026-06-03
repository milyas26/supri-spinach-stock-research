import { renderMarkdown } from '@/lib/markdown';

function colorizeStatusSymbols(html: string): string {
  return html
    .replace(/🟢/g, '<span class="text-[#0D6B4E] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>')
    .replace(/🔴/g, '<span class="text-[#C11F2A] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>')
    .replace(/🟡/g, '<span class="text-[#C8963E] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>');
}

export async function MarkdownRenderer({ content }: { content: string }) {
  const rawHtml = await renderMarkdown(content);
  const html = colorizeStatusSymbols(rawHtml);

  return (
    <article
      className="md-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
