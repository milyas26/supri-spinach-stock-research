"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { useSidebar } from "@/components/sidebar-context";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  date?: string;
}

interface TickerNavGroup {
  ticker: string;
  tickerName?: string;
  tickerLogo?: string;
  latestHref: string;
  hasMultiple: boolean;
  items: NavItem[];
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

function TickerTreeItem({ group, activePath }: { group: TickerNavGroup; activePath: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLatestActive = activePath === group.latestHref;
  const hasChildActive = group.items.some(item => item.href === activePath);

  useEffect(() => {
    if (hasChildActive && group.hasMultiple) setExpanded(true);
  }, [hasChildActive, group.hasMultiple]);

  return (
    <li>
      <Link
        href={group.latestHref}
        className={`group flex items-center gap-2 pr-4 pl-4 py-1.5 text-sm transition-all duration-150 ${
          isLatestActive
            ? "text-[#C8963E] border-l-[3px] border-[#C8963E] bg-[#C8963E]/[0.08] font-semibold"
            : "text-[#5C5650] border-l-[3px] border-transparent hover:text-[#1E1C19] hover:bg-[#E3DDD0]"
        }`}
      >
        {group.tickerLogo ? (
          <Image
            src={group.tickerLogo}
            alt={group.ticker}
            width={22}
            height={22}
            className="shrink-0 rounded-full object-cover bg-white"
            unoptimized
          />
        ) : (
          <span className="text-[11px] font-bold tracking-widest text-[#8C857A]">$</span>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="text-xs font-bold leading-none">{group.ticker}</span>
          {group.tickerName && (
            <span className="truncate text-[9px] text-[#8C857A] leading-tight mt-0.5">{group.tickerName}</span>
          )}
        </div>
        {group.hasMultiple && (
          <>
            <span className="shrink-0 text-[9px] font-mono px-1 py-0.5 rounded bg-[#D6D0C5] text-[#8C857A]">
              {group.items.length}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-0.5 hover:bg-[#D6D0C5] rounded"
            >
              <ChevronRight
                className={`h-3 w-3 text-[#8C857A] transition-transform duration-200 ${
                  expanded ? "rotate-90" : ""
                }`}
                strokeWidth={2.5}
              />
            </button>
          </>
        )}
      </Link>

      {expanded && group.hasMultiple && (
        <ul>
          {group.items.map((item) => {
            const isActive = activePath === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-4 pl-10 py-1 text-xs transition-all duration-150 ${
                    isActive
                      ? "text-[#C8963E] bg-[#C8963E]/[0.06] font-semibold"
                      : "text-[#8C857A] hover:text-[#1E1C19] hover:bg-[#E3DDD0]"
                  }`}
                >
                  <span className="truncate text-[11px]">{item.label}</span>
                  {item.date && (
                    <span className={`ml-auto shrink-0 text-[9px] font-mono px-1 py-0.5 rounded ${
                      isActive ? "bg-[#C8963E]/20 text-[#C8963E]" : "bg-[#D6D0C5] text-[#8C857A]"
                    }`}>
                      {item.date}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

export function Sidebar({
  reportItems: _reportItems,
  deepResearchGroups,
  generalItems,
  marketOverviewItems,
}: {
  reportItems: NavItem[];
  deepResearchGroups: TickerNavGroup[];
  generalItems: NavItem[];
  marketOverviewItems: NavItem[];
}) {
  const pathname = usePathname();
  const { open, setOpen } = useSidebar();
  const [marketOverviewOpen, setMarketOverviewOpen] = useState(true);
  const [deepOpen, setDeepOpen] = useState(true);
  const [generalOpen, setGeneralOpen] = useState(true);
  const [marketOverviewExpanded, setMarketOverviewExpanded] = useState(false);
  const [deepExpanded, setDeepExpanded] = useState(false);
  const [generalExpanded, setGeneralExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const DEEP_LIMIT = 15;
  const GENERAL_LIMIT = 5;
  const MARKET_OVERVIEW_LIMIT = 2;

  const visibleMarketOverview = marketOverviewExpanded ? marketOverviewItems : marketOverviewItems.slice(0, MARKET_OVERVIEW_LIMIT);
  const visibleDeep = deepExpanded ? deepResearchGroups : deepResearchGroups.slice(0, DEEP_LIMIT);
  const visibleGeneral = generalExpanded ? generalItems : generalItems.slice(0, GENERAL_LIMIT);

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
              onClick={() => setMarketOverviewOpen(!marketOverviewOpen)}
              className="flex w-full items-center gap-1 px-5 py-2.5 text-[11px] font-bold text-[#8C857A] uppercase tracking-[0.2em] hover:text-[#1E1C19] transition-colors"
            >
              Market Overview
              <ChevronRight
                className={`h-3 w-3 transition-transform duration-200 ${marketOverviewOpen ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {marketOverviewOpen && (
              <ul>
                {visibleMarketOverview.map((item) => (
                  <NavFileItem
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                  />
                ))}
                {marketOverviewItems.length === 0 && (
                  <li className="px-5 py-2 text-[11px] text-[#B8B0A4] italic">
                    No overviews yet
                  </li>
                )}
                {marketOverviewItems.length > MARKET_OVERVIEW_LIMIT && (
                  <li>
                    <button
                      onClick={() => setMarketOverviewExpanded(!marketOverviewExpanded)}
                      className="flex w-full items-center gap-1 px-6 py-1.5 text-[10px] text-[#8C857A] hover:text-[#1E1C19] transition-colors"
                    >
                      {marketOverviewExpanded ? (
                        <><ChevronUp className="h-3 w-3" strokeWidth={2.5} /> Show less</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" strokeWidth={2.5} /> {marketOverviewItems.length - MARKET_OVERVIEW_LIMIT} more</>
                      )}
                    </button>
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
                {visibleDeep.map((group) => (
                  <TickerTreeItem
                    key={group.ticker}
                    group={group}
                    activePath={pathname}
                  />
                ))}
                {deepResearchGroups.length === 0 && (
                  <li className="px-5 py-2 text-[11px] text-[#B8B0A4] italic">
                    No research yet
                  </li>
                )}
                {deepResearchGroups.length > DEEP_LIMIT && (
                  <li>
                    <button
                      onClick={() => setDeepExpanded(!deepExpanded)}
                      className="flex w-full items-center gap-1 px-6 py-1.5 text-[10px] text-[#8C857A] hover:text-[#1E1C19] transition-colors"
                    >
                      {deepExpanded ? (
                        <><ChevronUp className="h-3 w-3" strokeWidth={2.5} /> Show less</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" strokeWidth={2.5} /> {deepResearchGroups.length - DEEP_LIMIT} more</>
                      )}
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div>
            <button
              onClick={() => setGeneralOpen(!generalOpen)}
              className="flex w-full items-center gap-1 px-5 py-2.5 text-[11px] font-bold text-[#8C857A] uppercase tracking-[0.2em] hover:text-[#1E1C19] transition-colors"
            >
              General
              <ChevronRight
                className={`h-3 w-3 transition-transform duration-200 ${generalOpen ? "rotate-90" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {generalOpen && (
              <ul>
                {visibleGeneral.map((item) => (
                  <NavFileItem
                    key={item.href}
                    item={item}
                    active={pathname === item.href}
                  />
                ))}
                {generalItems.length === 0 && (
                  <li className="px-5 py-2 text-[11px] text-[#B8B0A4] italic">
                    No content yet
                  </li>
                )}
                {generalItems.length > GENERAL_LIMIT && (
                  <li>
                    <button
                      onClick={() => setGeneralExpanded(!generalExpanded)}
                      className="flex w-full items-center gap-1 px-6 py-1.5 text-[10px] text-[#8C857A] hover:text-[#1E1C19] transition-colors"
                    >
                      {generalExpanded ? (
                        <><ChevronUp className="h-3 w-3" strokeWidth={2.5} /> Show less</>
                      ) : (
                        <><ChevronDown className="h-3 w-3" strokeWidth={2.5} /> {generalItems.length - GENERAL_LIMIT} more</>
                      )}
                    </button>
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
                {/* <span className="text-[10px] tracking-[0.15em] uppercase">Source</span> */}
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
