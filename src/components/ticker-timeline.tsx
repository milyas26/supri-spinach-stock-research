"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DeepResearchFileInfo } from "@/lib/content";

interface TickerTimelineProps {
  files: DeepResearchFileInfo[];
}

export function TickerTimeline({ files }: TickerTimelineProps) {
  const pathname = usePathname();

  if (files.length === 0) return null;

  const ticker = files[0].ticker;

  return (
    <div className="mt-6 xl:mt-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 xl:mb-5">
        <span className="text-[10px] font-bold text-[#8C857A] tracking-[0.2em] uppercase">
          ${ticker} History
        </span>
        <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[9px] font-bold bg-[#C8963E]/20 text-[#C8963E] rounded-full">
          {files.length}
        </span>
      </div>

      {/* Timeline list */}
      <ol className="relative border-l-2 border-[#D6D0C5] ml-[5px]">
        {files.map((file, i) => {
          const isActive = pathname === file.href;
          const isFirst = i === 0;

          return (
            <li key={file.filename} className="relative pl-5 pb-5 last:pb-0">
              {/* Dot */}
              <span
                className={`absolute -left-[7px] top-[4px] h-3 w-3 rounded-full border-2 transition-all duration-150 ${
                  isActive
                    ? "bg-[#C8963E] border-[#C8963E]"
                    : "bg-[#EDE9E0] border-[#B8B0A4]"
                }`}
              />

              <Link
                href={file.href}
                className={`group block transition-colors duration-150 ${
                  isActive ? "text-[#C8963E]" : "text-[#5C5650] hover:text-[#1E1C19]"
                }`}
              >
                <div className={`text-[10px] font-mono leading-tight ${
                  isActive ? "text-[#C8963E]" : "text-[#8C857A] group-hover:text-[#5C5650]"
                }`}>
                  {file.ticker + " " + file.date}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[11px] font-mono font-semibold ${
                    isActive ? "text-[#C8963E]" : "text-[#5C5650] group-hover:text-[#1E1C19]"
                  }`}>
                    {file.time}
                  </span>
                  {isFirst && !isActive && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#8C857A] bg-[#D6D0C5] px-1 py-0.5 rounded">
                      latest
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#C8963E] bg-[#C8963E]/15 px-1 py-0.5 rounded">
                      active
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
