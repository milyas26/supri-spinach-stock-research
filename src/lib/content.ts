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
