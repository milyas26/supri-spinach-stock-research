export interface TocItem {
  id: string;
  text: string;
  level: number; // 1 | 2
}

/** Converts heading text to a URL-safe id slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // strip non-word chars
    .trim()
    .replace(/[\s_]+/g, '-')    // spaces/underscores → dash
    .replace(/-+/g, '-');        // collapse multiple dashes
}

/**
 * Extract headings (h1–h2) from a raw markdown string.
 * Returns TocItem[] in document order. Skips empty headings.
 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const idCount: Record<string, number> = {};

  const headingRe = /^(#{1,2})\s+(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = headingRe.exec(markdown)) !== null) {
    const level = match[1].length;
    const raw = match[2].trim();
    // strip inline markdown: bold, italic, code, links
    const text = raw
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();

    if (!text) continue;

    const baseSlug = slugify(text);
    // deduplicate: same slug gets suffix -2, -3, ...
    idCount[baseSlug] = (idCount[baseSlug] ?? 0) + 1;
    const id = idCount[baseSlug] === 1 ? baseSlug : `${baseSlug}-${idCount[baseSlug]}`;

    items.push({ id, text, level });
  }

  return items;
}
