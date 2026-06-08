'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchModal } from './search-modal';

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [isMac] = useState(() => {
    if (typeof window === 'undefined') return true;
    return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-20 flex h-9 w-9 items-center justify-center
                   bg-sidebar-bg border-2 border-border-strong rounded
                   hover:bg-sidebar-hover transition-colors md:hidden
                   active:scale-[0.95]"
        aria-label="Search documents"
      >
        <Search size={15} className="text-text" strokeWidth={2.5} />
      </button>

      <div className="hidden md:flex fixed top-10 right-10 z-20">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-border
                     rounded bg-surface hover:bg-sidebar-hover text-text-soft transition-colors
                     active:scale-[0.98]"
          aria-label="Search documents"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] rounded
                          border border-border bg-sidebar-bg text-text-muted font-mono">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>
      </div>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}
