'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, FlaskConical } from 'lucide-react';
import { useSearchStore } from '@/stores/search-store';
import type { SearchResult } from '@/lib/search';

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

function HighlightSnippet({ text, query }: { text: string; query: string }) {
  if (!query) return <span>{text}</span>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber/20 text-text font-semibold rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results);
        setSelectedIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setSearchTerm(query);
      router.push(result.href);
      onClose();
    },
    [query, router, setSearchTerm, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, effectiveResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(effectiveResults[selectedIndex]);
    }
  };

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const effectiveResults = query.length >= MIN_QUERY_LENGTH ? results : [];
  const marketOverviews = effectiveResults.filter((r) => r.type === 'market-overview');
  const deepResearch = effectiveResults.filter((r) => r.type === 'deep-research');

  const showResults = !loading && query.length >= MIN_QUERY_LENGTH;
  const showEmpty = showResults && effectiveResults.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
         onKeyDown={handleKeyDown}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-surface border border-border-strong rounded-lg
                      shadow-2xl overflow-hidden mx-4">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search market overviews & deep research..."
            className="flex-1 py-3 bg-transparent text-text outline-none font-mono text-sm
                       placeholder:text-text-muted"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-text-muted hover:text-text transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2" ref={listRef}>
          {query.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Search size={32} className="text-text-muted mb-3 opacity-30" strokeWidth={1.5} />
              <p className="text-text-muted text-sm font-mono">
                Search market overviews & deep research
              </p>
              <p className="text-text-muted text-xs mt-1.5 font-mono opacity-50">
                Search by document title or content
              </p>
            </div>
          )}

          {loading && (
            <p className="text-text-muted text-sm text-center py-10 font-mono">Searching...</p>
          )}

          {showEmpty && (
            <p className="text-text-muted text-sm text-center py-10 font-mono">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}

          {showResults && effectiveResults.length > 0 && (
            <div className="space-y-3">
              {marketOverviews.length > 0 && (
                <Section
                  label="Market Overviews"
                  icon={<FileText size={12} className="text-accent" />}
                  results={marketOverviews}
                  query={query}
                  baseIndex={0}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                />
              )}
              {deepResearch.length > 0 && (
                <Section
                  label="Deep Research"
                  icon={<FlaskConical size={12} className="text-amber" />}
                  results={deepResearch}
                  query={query}
                  baseIndex={marketOverviews.length}
                  selectedIndex={selectedIndex}
                  onSelect={handleSelect}
                />
              )}
            </div>
          )}

          {query.length > 0 && query.length < MIN_QUERY_LENGTH && (
            <p className="text-text-muted text-sm text-center py-10 font-mono">
              Type at least {MIN_QUERY_LENGTH} characters to search
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-text-muted font-mono">
          <span>
            <kbd className="px-1 py-0.5 rounded border border-border bg-sidebar-bg">↑↓</kbd> Navigate
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded border border-border bg-sidebar-bg">↵</kbd> Open
          </span>
          <span>
            <kbd className="px-1 py-0.5 rounded border border-border bg-sidebar-bg">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  icon,
  results,
  query,
  baseIndex,
  selectedIndex,
  onSelect,
}: {
  label: string;
  icon: React.ReactNode;
  results: SearchResult[];
  query: string;
  baseIndex: number;
  selectedIndex: number;
  onSelect: (r: SearchResult) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-3 py-1">
        {icon}
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </h3>
        <span className="text-[10px] text-text-muted">({results.length})</span>
      </div>
      {results.map((r, i) => {
        const globalIndex = baseIndex + i;
        const isSelected = globalIndex === selectedIndex;
        return (
          <button
            key={r.href}
            onClick={() => onSelect(r)}
            className={`w-full text-left px-3 py-2 rounded transition-colors group ${
              isSelected ? 'bg-sidebar-hover ring-1 ring-border' : 'hover:bg-sidebar-hover'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text truncate">{r.title}</span>
              {r.date && (
                <span className="text-[10px] text-text-muted shrink-0 ml-auto">{r.date}</span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5 line-clamp-2 font-mono">
              <HighlightSnippet text={r.snippet} query={query} />
            </p>
          </button>
        );
      })}
    </div>
  );
}
