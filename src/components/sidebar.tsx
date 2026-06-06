"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, BarChart3, Search, Menu, X } from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  date?: string;
}

function NavFileItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={`
          group flex items-center gap-3 px-4 pl-6 py-1.5 text-sm transition-all duration-150
          ${
            active
              ? "text-[#C11F2A] border-l-[3px] border-[#C11F2A] bg-[#C11F2A]/[0.06] font-semibold"
              : "text-[#5C5650] border-l-[3px] border-transparent hover:text-[#1E1C19] hover:bg-[#E3DDD0]"
          }
        `}
      >
        <span className="truncate text-xs">{item.label}</span>
        {active && <span className="ml-auto h-1.5 w-1.5 bg-[#C11F2A]" />}
      </Link>
    </li>
  );
}

function NavTickerItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        className={`
          group flex items-center gap-3 pr-4 pl-6 py-1.5 text-sm transition-all duration-150
          ${
            active
              ? "text-[#C8963E] border-l-[3px] border-[#C8963E] bg-[#C8963E]/[0.08] font-semibold"
              : "text-[#5C5650] border-l-[3px] border-transparent hover:text-[#1E1C19] hover:bg-[#E3DDD0]"
          }
        `}
      >
        <span className="text-[11px] font-bold tracking-widest text-[#8C857A]">
          $
        </span>
        <span className="truncate text-xs">{item.label}</span>
        {active && <span className="ml-auto h-1.5 w-1.5 bg-[#C8963E]" />}
      </Link>
    </li>
  );
}

export function Sidebar({
  reportItems,
  deepResearchItems,
}: {
  reportItems: NavItem[];
  deepResearchItems: NavItem[];
}) {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const [reportsOpen, setReportsOpen] = useState(true);
  const [deepOpen, setDeepOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-20 flex h-9 w-9 items-center justify-center bg-[#EDE9E0] border-2 border-[#2D2A26] md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-4 w-4 text-[#1E1C19]" strokeWidth={2.5} />
      </button>

      <div
        className={`sidebar-overlay ${open ? "active" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`
          fixed md:relative z-40 flex h-full w-[272px] shrink-0 flex-col border-r-2 border-[#2D2A26] bg-[#EDE9E0] overflow-hidden
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:transition-none
        `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b-2 border-[#2D2A26]">
          <Image
            src="/logo.png"
            width={45}
            height={45}
            alt="supri-spinach"
            className="rounded-full"
          />
          <div>
            <div className="text-base font-bold text-[#1E1C19] tracking-tight leading-none">
              Supri Spinach
            </div>
            <div className="text-[10px] text-[#8C857A] tracking-[0.2em] uppercase mt-0.5">
              Terminal
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto flex h-7 w-7 items-center justify-center hover:bg-[#E3DDD0] md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-[#5C5650]" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          <div className="mb-2">
            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className="flex w-full items-center gap-1 px-5 py-2.5 text-[11px] font-bold text-[#8C857A] uppercase tracking-[0.2em] hover:text-[#1E1C19] transition-colors"
            >
              Report
              <ChevronRight
                className={`h-3 w-3 transition-transform duration-200 ${reportsOpen ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {reportsOpen && (
              <ul>
                {reportItems.map((item) => (
                  <NavFileItem
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                  />
                ))}
                {reportItems.length === 0 && (
                  <li className="px-5 py-2 text-[11px] text-[#B8B0A4] italic">
                    No reports yet
                  </li>
                )}
              </ul>
            )}
          </div>

          <div>
            <button
              onClick={() => setDeepOpen(!deepOpen)}
              className="flex w-full items-center gap-1 px-5 py-2.5 text-[11px] font-bold text-[#8C857A] uppercase tracking-[0.2em] hover:text-[#1E1C19] transition-colors"
            >
              Deep Research
              <ChevronRight
                className={`h-3 w-3 transition-transform duration-200 ${deepOpen ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {deepOpen && (
              <ul>
                {deepResearchItems.map((item) => (
                  <NavTickerItem
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                  />
                ))}
                {deepResearchItems.length === 0 && (
                  <li className="px-5 py-2 text-[11px] text-[#B8B0A4] italic">
                    No research yet
                  </li>
                )}
              </ul>
            )}
          </div>
        </nav>

        <div className="border-t-2 border-[#2D2A26] px-5 py-3.5 flex items-center justify-between">
          {mounted && (
            <>
              <a
                href="https://github.com/milyas26/supri-spinach-stock-research"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-[#8C857A] hover:text-[#1E1C19] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="text-[10px] tracking-[0.15em] uppercase">Open Source</span>
              </a>
              <a
                href="https://saweria.co/tanamanrawa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#8C857A] hover:text-[#1E1C19] transition-colors"
                title="Nih buat beli kopi :)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" x2="6" y1="2" y2="4" />
                  <line x1="10" x2="10" y1="2" y2="4" />
                  <line x1="14" x2="14" y1="2" y2="4" />
                </svg>
                <span className="text-[10px] tracking-[0.15em] uppercase">Beliin kopi</span>
              </a>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
