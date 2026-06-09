import { renderMarkdown } from '@/lib/markdown';
import { tickers } from '@/lib/tickers';
import { extractToc, slugify, type TocItem } from '@/lib/toc';

const tickerSet = new Set(tickers);

function linkifyTickers(html: string, deepResearchMap?: Map<string, string>): string {
  let insideAnchor = false;
  return html.replace(/(<[^>]+>)|(\b[A-Z]{3,5}\b)/g, (match, tag, word) => {
    if (tag) {
      if (/^<a[\s>]/i.test(tag)) insideAnchor = true;
      else if (/^<\/a/i.test(tag)) insideAnchor = false;
      return tag;
    }
    if (!insideAnchor && word && tickerSet.has(word)) {
      const deepFile = deepResearchMap?.get(word);
      if (deepFile) {
        return `<a href="/deep-research/${deepFile}" target="_self" class="ticker-link ticker-link--research">${word}</a>`;
      }
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

/**
 * Inject id attrs into h1–h3 tags in rendered HTML.
 * Uses same slugify logic as extractToc so IDs match.
 */
function injectHeadingIds(html: string): string {
  const idCount: Record<string, number> = {};
  return html.replace(/<(h[1-3])>([\s\S]*?)<\/h[1-3]>/gi, (match, tag, inner) => {
    // strip inner HTML tags to get plain text
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (!text) return match;
    const baseSlug = slugify(text);
    idCount[baseSlug] = (idCount[baseSlug] ?? 0) + 1;
    const id = idCount[baseSlug] === 1 ? baseSlug : `${baseSlug}-${idCount[baseSlug]}`;
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
}

export async function processMarkdown(content: string, deepResearchMap?: Map<string, string>): Promise<string> {
  const rawHtml = await renderMarkdown(content);
  return injectHeadingIds(wrapTables(fixExternalLinks(colorizeStatusSymbols(linkifyTickers(rawHtml, deepResearchMap)))));
}

/** Like processMarkdown but also returns extracted TOC items. */
export async function processMarkdownWithToc(
  content: string,
  deepResearchMap?: Map<string, string>
): Promise<{ html: string; toc: TocItem[] }> {
  const html = await processMarkdown(content, deepResearchMap);
  const toc = extractToc(content);
  return { html, toc };
}

export async function MarkdownRenderer({ content }: { content: string }) {
  const html = await processMarkdown(content);

  return (
    <article
      className="md-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
