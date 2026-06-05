import { renderMarkdown } from '@/lib/markdown';
import { tickers } from '@/lib/tickers';

const tickerSet = new Set(tickers);

function linkifyTickers(html: string): string {
  let insideAnchor = false;
  return html.replace(/(<[^>]+>)|(\b[A-Z]{3,5}\b)/g, (match, tag, word) => {
    if (tag) {
      if (/^<a[\s>]/i.test(tag)) insideAnchor = true;
      else if (/^<\/a/i.test(tag)) insideAnchor = false;
      return tag;
    }
    if (!insideAnchor && word && tickerSet.has(word)) {
      return `<a href="https://stockbit.com/symbol/${word}" target="_blank" rel="noopener noreferrer" class="ticker-link">${word}</a>`;
    }
    return match;
  });
}

function colorizeStatusSymbols(html: string): string {
  return html
    .replace(/🟢/g, '<span class="text-[#0D6B4E] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>')
    .replace(/🔴/g, '<span class="text-[#C11F2A] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>')
    .replace(/🟡/g, '<span class="text-[#C8963E] inline-flex items-center"><span class="mr-1.5 text-lg leading-none">●</span></span>');
}

function fixExternalLinks(html: string): string {
  return html.replace(/<a (?![^>]*target=)/g, '<a target="_blank" rel="noopener noreferrer" ');
}

function wrapTables(html: string): string {
  return html.replace(/<table/g, '<div class="md-table-wrapper"><table').replace(/<\/table>/g, '</table></div>');
}

export async function MarkdownRenderer({ content }: { content: string }) {
  const rawHtml = await renderMarkdown(content);
  const html = wrapTables(fixExternalLinks(colorizeStatusSymbols(linkifyTickers(rawHtml))));

  return (
    <article
      className="md-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
