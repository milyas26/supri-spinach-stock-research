"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TocItem } from "@/lib/toc";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  // track heading visibility ratios
  const visibleHeadings = useRef<Map<string, number>>(new Map());

  const updateActive = useCallback(() => {
    if (visibleHeadings.current.size === 0) return;
    // pick heading with highest intersection ratio
    let best = "";
    let bestRatio = -1;
    visibleHeadings.current.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        best = id;
      }
    });
    if (best) setActiveId(best);
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id");
          if (!id) return;
          if (entry.isIntersecting) {
            visibleHeadings.current.set(id, entry.intersectionRatio);
          } else {
            visibleHeadings.current.delete(id);
          }
        });
        updateActive();
      },
      {
        rootMargin: "-10% 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items, updateActive]);

  if (items.length === 0) return null;

  const handleClick = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const TocList = () => (
    <ol className="space-y-0.5">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const indent = item.level === 2 ? "pl-3" : "";
        return (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={[
                "group w-full text-left transition-colors duration-150 py-[3px] pr-1 rounded-sm",
                indent,
                isActive
                  ? "text-[#C11F2A] font-semibold"
                  : "text-[#8C857A] hover:text-[#1E1C19]",
              ].join(" ")}
            >
              {/* active indicator bar */}
              <span className="relative">
                {isActive && (
                  <span className="absolute -left-2 top-[1px] bottom-[1px] w-[2px] rounded bg-[#C11F2A]" />
                )}
                <span
                  className={[
                    "text-[10px] font-mono leading-snug",
                    item.level === 1 ? "font-bold" : "",
                  ].join(" ")}
                >
                  {item.text}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div className="hidden xl:block">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-[#8C857A] tracking-[0.2em] uppercase">
          Contents
        </span>
        <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[9px] font-bold bg-[#C11F2A]/10 text-[#C11F2A] rounded-full">
          {items.length}
        </span>
      </div>
      <TocList />
    </div>
  );
}
