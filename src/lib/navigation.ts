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
  return getDeepResearchFiles().map((filename) => {
    const timeMatch = filename.match(/_(\d{2}-\d{2})$/);
    const time = timeMatch ? timeMatch[1].replace('-', ':') : undefined;
    const label = timeMatch ? filename.replace(/_\d{2}-\d{2}$/, '') : filename;
    return {
      label,
      href: `/deep-research/${filename}`,
      ...(time && { date: time }),
    };
  });
}
