import { getReportFiles, getDeepResearchFiles } from '@/lib/content';

export interface NavItem {
  label: string;
  href: string;
  date?: string;
  isActive?: boolean;
}

export function getReportNav(): NavItem[] {
  const files = getReportFiles();
  return files.map((filename) => ({
    label: filename,
    href: `/reports/${filename}`,
  }));
}

export function getDeepResearchNav(): NavItem[] {
  return getDeepResearchFiles().map((ticker) => ({
    label: ticker,
    href: `/deep-research/${ticker}`,
  }));
}
