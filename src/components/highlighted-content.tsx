'use client';

import { useMemo } from 'react';
import { useSearchStore } from '@/stores/search-store';

export function HighlightedContent({ html }: { html: string }) {
  const searchTerm = useSearchStore((s) => s.searchTerm);

  const highlightedHtml = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return html;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(<[^>]*>)|(${escaped})`, 'gi');
    return html.replace(regex, (_match, tag) => {
      if (tag) return tag;
      return `<mark class="search-highlight">${_match}</mark>`;
    });
  }, [html, searchTerm]);

  return (
    <article
      className="md-content"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
}
