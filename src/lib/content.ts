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
      const dateA = a.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? '';
      const dateB = b.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? '';
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
