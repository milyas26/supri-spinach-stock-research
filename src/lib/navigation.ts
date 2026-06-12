import { getReportFiles, getDeepResearchFiles, getGeneralFiles, getMarketOverviewFiles } from '@/lib/content';
import { getTickerInfo } from '@/lib/tickers';

export interface NavItem {
  label: string;
  href: string;
  date?: string;
  isActive?: boolean;
}

export interface TickerNavGroup {
  ticker: string;
  tickerName?: string;
  tickerLogo?: string;
  latestHref: string;
  hasMultiple: boolean;
  items: NavItem[];
}

function formatDate(dateStr: string): string {
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
}

export function getReportNav(): NavItem[] {
  const files = getReportFiles();
  return files.map((filename) => ({
    label: filename,
    href: `/reports/${filename}`,
  }));
}

export function getGeneralNav(): NavItem[] {
  const files = getGeneralFiles();
  return files.map((slug) => {
    // slug format: NAME_YYYY-MM-DD_HH-MM  or just NAME
    const match = slug.match(/^(.+?)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})$/);
    const label = match ? match[1].replace(/-/g, ' ') : slug.replace(/-/g, ' ');
    return {
      label,
      href: `/general/${slug}`,
    };
  });
}

export function getMarketOverviewNav(): NavItem[] {
  const files = getMarketOverviewFiles();
  return files.map((slug) => {
    // slug format: market-overview-YYYY_MM_DD  or similar
    const match = slug.match(/(\d{4})[_-](\d{2})[_-](\d{2})$/);
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const label = match
      ? `${parseInt(match[3])} ${months[parseInt(match[2]) - 1]} ${match[1]}`
      : slug.replace(/-/g, ' ');
    return {
      label,
      href: `/market-overview/${slug}`,
    };
  });
}

export function getDeepResearchNav(): TickerNavGroup[] {
  const files = getDeepResearchFiles(); // sorted newest first

  const groups = new Map<string, TickerNavGroup>();

  for (const filename of files) {
    const match = filename.match(/^([A-Z0-9]+)_(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})$/);
    if (!match) continue;
    const [, ticker, date, timeRaw] = match;
    const time = timeRaw.replace('-', ':');

    if (!groups.has(ticker)) {
      const info = getTickerInfo(ticker);
      groups.set(ticker, {
        ticker,
        tickerName: info?.name,
        tickerLogo: info?.logo,
        latestHref: `/deep-research/${filename}`,
        hasMultiple: false,
        items: [],
      });
    }

    const group = groups.get(ticker)!;
    group.items.push({
      label: formatDate(date),
      href: `/deep-research/${filename}`,
      date: time,
    });
  }

  for (const group of groups.values()) {
    if (group.items.length > 1) group.hasMultiple = true;
  }

  return Array.from(groups.values()).sort((a, b) => a.ticker.localeCompare(b.ticker));
}
