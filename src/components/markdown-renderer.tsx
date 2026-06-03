import { renderMarkdown } from '@/lib/markdown';

function colorizeStatusSymbols(html: string): string {
  return html
    .replace(/🟢/g, '<span class="text-[#0D6B4E] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>')
    .replace(/🔴/g, '<span class="text-[#C11F2A] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>')
    .replace(/🟡/g, '<span class="text-[#C8963E] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>');
}

function fixExternalLinks(html: string): string {
  return html.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ');
}

function wrapTables(html: string): string {
  return html.replace(/<table/g, '<div class="md-table-wrapper"><table').replace(/<\/table>/g, '</table></div>');
}

export async function MarkdownRenderer({ content }: { content: string }) {
  const rawHtml = await renderMarkdown(content);
  const html = wrapTables(fixExternalLinks(colorizeStatusSymbols(rawHtml)));

  return (
    <article
      className="md-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
