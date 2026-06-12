import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getReportFiles(): string[] {
  const dir = path.join(CONTENT_DIR, 'reports');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
    .sort((a, b) => b.localeCompare(a));
}

export function getDeepResearchFiles(): string[] {
  const dir = path.join(CONTENT_DIR, 'deep-research');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
    .sort((a, b) => {
      const dateA = a.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2})/)?.[1] ?? '';
      const dateB = b.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2})/)?.[1] ?? '';
      return dateB.localeCompare(dateA);
    });
}

export function getLatestReportFilename(): string | null {
  const files = getReportFiles();
  return files.length > 0 ? files[0] : null;
}

export function getReportContent(filename: string): string {
  const filePath = path.join(CONTENT_DIR, 'reports', `${filename}.md`);
  if (!fs.existsSync(filePath)) throw new Error(`Report not found: ${filename}`);
  return fs.readFileSync(filePath, 'utf-8');
}

export function getDeepResearchContent(ticker: string): string {
  const filePath = path.join(CONTENT_DIR, 'deep-research', `${ticker}.md`);
  if (!fs.existsSync(filePath)) throw new Error(`Research not found: ${ticker}`);
  return fs.readFileSync(filePath, 'utf-8');
}

export interface DeepResearchFileInfo {
  filename: string; // without .md
  ticker: string;   // e.g. BRPT
  date: string;     // e.g. 2026-06-05
  time: string;     // e.g. 19:20
  href: string;
}

/**
 * Given an active filename (without .md), extract the ticker symbol
 * and return all files that share that same ticker, sorted newest first.
 * Returns empty array if ticker has fewer than 2 files.
 */
/**
 * Returns a map of ticker symbol → latest deep-research filename (without .md).
 * Uses the existing sort order (newest first) so the first match per ticker wins.
 */
export function getTickerToLatestDeepResearch(): Map<string, string> {
  const map = new Map<string, string>();
  const files = getDeepResearchFiles(); // already sorted newest first
  for (const f of files) {
    const m = f.match(/^([A-Z0-9]+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})$/);
    if (m && !map.has(m[1])) {
      map.set(m[1], f);
    }
  }
  return map;
}

export function getGeneralFiles(): string[] {
  const dir = path.join(CONTENT_DIR, 'general');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace('.md', ''))
    .sort((a, b) => b.localeCompare(a));
}

export function getGeneralContent(slug: string): string {
  const filePath = path.join(CONTENT_DIR, 'general', `${slug}.md`);
  if (!fs.existsSync(filePath)) throw new Error(`General content not found: ${slug}`);
  return fs.readFileSync(filePath, 'utf-8');
}

export interface ContentMeta {
  title: string;
  description: string;
}

/**
 * Extract title (first h1/h2 or first non-empty line) and description
 * (first substantive paragraph) from raw markdown, stripping emoji.
 */
export function extractMeta(markdown: string): ContentMeta {
  const stripEmoji = (s: string) =>
    s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
  const stripMd = (s: string) =>
    s.replace(/^#+\s*/, '').replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1').trim();

  const lines = markdown.split('\n').map((l) => l.trim()).filter(Boolean);

  let title = '';
  let description = '';

  for (const line of lines) {
    if (!title && (line.startsWith('#') || line.length > 0)) {
      title = stripEmoji(stripMd(line));
      if (title) continue;
    }
    if (title && !description && !line.startsWith('#') && line.length > 20) {
      description = stripEmoji(stripMd(line));
      break;
    }
  }

  return {
    title: title || 'Supri Spinach',
    description: description ? description.slice(0, 160) : 'IDX stocks deep research and analysis, powered by AI.',
  };
}

export function getRelatedTickerFiles(activeFilename: string): DeepResearchFileInfo[] {
  // Extract ticker: everything before the first _YYYY pattern
  const tickerMatch = activeFilename.match(/^([A-Z0-9]+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})$/);
  if (!tickerMatch) return [];
  const ticker = tickerMatch[1];

  const all = getDeepResearchFiles();
  const related = all.filter((f) => {
    const m = f.match(/^([A-Z0-9]+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})$/);
    return m && m[1] === ticker;
  });

  if (related.length < 2) return [];

  return related.map((f) => {
    const m = f.match(/^([A-Z0-9]+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})$/)!;
    return {
      filename: f,
      ticker: m[1],
      date: m[2],
      time: m[3].replace('-', ':'),
      href: `/deep-research/${f}`,
    };
  });
}
