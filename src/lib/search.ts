import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export interface SearchResult {
  type: 'report' | 'deep-research';
  title: string;
  href: string;
  snippet: string;
  date?: string;
}

function getSnippet(content: string, query: string): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, 200).trim() + '...';

  const start = Math.max(0, idx - 80);
  const end = Math.min(content.length, idx + query.length + 80);
  let snippet = content.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet += '...';
  return snippet.trim();
}

function formatReportTitle(filename: string): string {
  return filename;
}

function formatDeepResearchTitle(filename: string): string {
  const timeMatch = filename.match(/_(\\d{2}-\\d{2})$/);
  const time = timeMatch ? timeMatch[1].replace('-', ':') : undefined;
  const label = timeMatch ? filename.replace(/_(\\d{2}-\\d{2})$/, '') : filename;
  return time ? `${label} (${time})` : label;
}

function extractDeepResearchTime(filename: string): string | undefined {
  const timeMatch = filename.match(/_(\\d{2}-\\d{2})$/);
  return timeMatch ? timeMatch[1].replace('-', ':') : undefined;
}

export function searchDocuments(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  const reportsDir = path.join(CONTENT_DIR, 'reports');
  if (fs.existsSync(reportsDir)) {
    const reportFiles = fs
      .readdirSync(reportsDir)
      .filter((f) => f.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a));

    for (const file of reportFiles) {
      const filename = file.replace('.md', '');
      const filePath = path.join(reportsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const titleMatch = filename.toLowerCase().includes(lowerQuery);
      const contentMatch = content.toLowerCase().includes(lowerQuery);

      if (titleMatch || contentMatch) {
        results.push({
          type: 'report',
          title: formatReportTitle(filename),
          href: `/reports/${filename}`,
          snippet: getSnippet(content, query),
        });
      }
    }
  }

  const deepResearchDir = path.join(CONTENT_DIR, 'deep-research');
  if (fs.existsSync(deepResearchDir)) {
    const deepResearchFiles = fs
      .readdirSync(deepResearchDir)
      .filter((f) => f.endsWith('.md'))
      .sort((a, b) => {
        const dateA = a.match(/(\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2})/)?.[1] ?? '';
        const dateB = b.match(/(\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2})/)?.[1] ?? '';
        return dateB.localeCompare(dateA);
      });

    for (const file of deepResearchFiles) {
      const filename = file.replace('.md', '');
      const filePath = path.join(deepResearchDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      const titleMatch = filename.toLowerCase().includes(lowerQuery);
      const contentMatch = content.toLowerCase().includes(lowerQuery);

      if (titleMatch || contentMatch) {
        results.push({
          type: 'deep-research',
          title: formatDeepResearchTitle(filename),
          href: `/deep-research/${filename}`,
          snippet: getSnippet(content, query),
          date: extractDeepResearchTime(filename),
        });
      }
    }
  }

  return results;
}
