# Feature: Deep Research Sidebar Tree (Group by Ticker)

## Context

Project: Next.js 16 "Supri Spinach Terminal" — dashboard saham IDX.

**Masalah sekarang:** Sidebar "Deep Research" menampilkan flat list semua file riset diurutkan tanggal. Contoh:
```
Deep Research
  $ SUPA_2026-06-07    05:20
  $ FILM_2026-06-09    20:24
  $ VKTR_2026-06-07    22:33
  $ BRPT_2026-06-05    19:20
  $ SUPA_2026-06-03    19:30
  $ BRPT_2026-06-03    22:13
  $ ENRG_2026-06-08    08:00
  ... (bakal makin panjang seiring waktu)
```

**Problem:**
- List makin panjang seiring bertambahnya riset
- Ticker yang sama muncul berulang (BRPT 2x, SUPA 2x)
- Gampang lost scrolling cari ticker tertentu

**Goal:** Ubah jadi tree structure yang dikelompokkan per ticker (A-Z):
```
Deep Research
  $ ADMR                    → click: ke riset terbaru ADMR
  $ BREN                    → click: ke riset terbaru BREN
  $ BRPT ▸                  → expand/collapse
      05 Jun 2026  19:20    → click: ke riset BRPT 05 Jun
      03 Jun 2026  22:13    → click: ke riset BRPT 03 Jun
  $ CUAN                    → click: ke riset terbaru CUAN
  $ FILM                    → click: ke riset terbaru FILM
  $ SUPA ▸                  → expand/collapse
      07 Jun 2026  05:20    → click: ke riset SUPA 07 Jun
      03 Jun 2026  19:30    → click: ke riset SUPA 03 Jun
  $ VKTR                    → click: ke riset terbaru VKTR
```

Klik nama ticker → navigasi ke deep research terbaru.
Ticker dengan 1 riset saja → tidak ada expand arrow, langsung navigate.
Ticker dengan 2+ riset → ada chevron, bisa expand untuk lihat semua versi.

## Current Implementation

### `src/lib/navigation.ts`
```ts
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
```

Returns flat list sorted by date (newest first). Each item:
- `label`: e.g. `"SUPA_2026-06-07"` (ticker + date, tanpa waktu)
- `href`: e.g. `"/deep-research/SUPA_2026-06-07_05-20"`
- `date`: e.g. `"05:20"` (waktu, ditampilkan di badge)

### `src/components/sidebar.tsx`

`NavTickerItem` — render single ticker item dengan $ prefix, label, date badge:
```tsx
function NavTickerItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link href={item.href} className={`...${active ? 'active styles' : 'default styles'}`}>
        <span className="text-[11px] font-bold tracking-widest text-[#8C857A]">$</span>
        <span className="truncate text-xs">{item.label}</span>
        {item.date && (
          <span className={`ml-auto shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded ...`}>
            {item.date}
          </span>
        )}
      </Link>
    </li>
  );
}
```

Sidebar section renders flat list:
```tsx
{deepOpen && (
  <ul>
    {deepResearchItems.map((item) => (
      <NavTickerItem key={item.href} item={item} active={pathname === item.href} />
    ))}
  </ul>
)}
```

### Layout props flow

`src/app/layout.tsx` calls `getDeepResearchNav()` and passes to `<Sidebar>`:
```tsx
const deepResearchItems = getDeepResearchNav();
<Sidebar reportItems={reportItems} deepResearchItems={deepResearchItems} />
```

### Data source

Deep research files in `content/deep-research/`:
```
ADMR_2026-06-04_22-50.md
BNBR_2026-06-04_22-42.md
BRPT_2026-06-03_22-13.md
BRPT_2026-06-05_19-20.md
FILM_2026-06-09_20-24.md
SUPA_2026-06-03_19-30.md
SUPA_2026-06-07_05-20.md
...
```

Filename pattern: `{TICKER}_{YYYY-MM-DD}_{HH-MM}.md`

### Existing dependency

`src/lib/content.ts` already has `getDeepResearchFiles()` which returns all filenames sorted newest first.

## Implementation Plan

### Step 1: New data structure in `src/lib/navigation.ts`

Replace `getDeepResearchNav()` with grouped structure:

```ts
export interface TickerNavGroup {
  ticker: string;                    // e.g. "BRPT"
  latestHref: string;                // e.g. "/deep-research/BRPT_2026-06-05_19-20"
  hasMultiple: boolean;              // true if 2+ research files
  items: NavItem[];                  // all versions, newest first
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
      groups.set(ticker, {
        ticker,
        latestHref: `/deep-research/${filename}`,
        hasMultiple: false,
        items: [],
      });
    }
    
    const group = groups.get(ticker)!;
    group.items.push({
      label: formatDate(date),      // e.g. "05 Jun 2026"
      href: `/deep-research/${filename}`,
      date: time,                    // e.g. "19:20"
    });
    
    // latestHref already set to first (newest) file since files are sorted newest first
  }
  
  // Mark groups with multiple items
  for (const group of groups.values()) {
    if (group.items.length > 1) group.hasMultiple = true;
  }
  
  // Sort alphabetically by ticker
  return Array.from(groups.values()).sort((a, b) => a.ticker.localeCompare(b.ticker));
}
```

Helper:
```ts
function formatDate(dateStr: string): string {
  // "2026-06-05" → "05 Jun 2026"
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${months[parseInt(m)-1]} ${y}`;
}
```

### Step 2: New component `TickerTreeItem` in `src/components/sidebar.tsx`

```tsx
interface TickerNavGroup {
  ticker: string;
  latestHref: string;
  hasMultiple: boolean;
  items: NavItem[];
}

function TickerTreeItem({ group, activePath }: { group: TickerNavGroup; activePath: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLatestActive = activePath === group.latestHref;
  const hasChildActive = group.items.some(item => item.href === activePath);
  
  // Auto-expand if a child is currently active
  useEffect(() => {
    if (hasChildActive && group.hasMultiple) setExpanded(true);
  }, [hasChildActive, group.hasMultiple]);

  return (
    <li>
      {/* Ticker row — click navigates to latest */}
      <Link
        href={group.latestHref}
        className={`group flex items-center gap-2 pr-4 pl-6 py-1.5 text-sm transition-all duration-150 ${
          isLatestActive
            ? "text-[#C8963E] border-l-[3px] border-[#C8963E] bg-[#C8963E]/[0.08] font-semibold"
            : "text-[#5C5650] border-l-[3px] border-transparent hover:text-[#1E1C19] hover:bg-[#E3DDD0]"
        }`}
      >
        <span className="text-[11px] font-bold tracking-widest text-[#8C857A]">$</span>
        <span className="truncate text-xs font-bold">{group.ticker}</span>
        
        {/* Chevron for expandable — toggle without navigating */}
        {group.hasMultiple && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="ml-auto p-0.5 hover:bg-[#D6D0C5] rounded"
          >
            <ChevronRight
              className={`h-3 w-3 text-[#8C857A] transition-transform duration-200 ${
                expanded ? "rotate-90" : ""
              }`}
              strokeWidth={2.5}
            />
          </button>
        )}
        
        {/* Count badge for multiple */}
        {group.hasMultiple && (
          <span className="shrink-0 text-[9px] font-mono px-1 py-0.5 rounded bg-[#D6D0C5] text-[#8C857A]">
            {group.items.length}
          </span>
        )}
      </Link>
      
      {/* Expanded children */}
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
```

### Step 3: Update Sidebar component

Change prop type and render logic:

```tsx
// Props change:
export function Sidebar({
  reportItems,
  deepResearchGroups,    // was: deepResearchItems: NavItem[]
}: {
  reportItems: NavItem[];
  deepResearchGroups: TickerNavGroup[];
}) {
  // ...
  
  // Replace flat list render with tree:
  {deepOpen && (
    <ul>
      {deepResearchGroups.map((group) => (
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
    </ul>
  )}
}
```

### Step 4: Update layout.tsx

```tsx
// Before:
const deepResearchItems = getDeepResearchNav();
<Sidebar reportItems={reportItems} deepResearchItems={deepResearchItems} />

// After:
const deepResearchGroups = getDeepResearchNav();
<Sidebar reportItems={reportItems} deepResearchGroups={deepResearchGroups} />
```

## Files to Modify

- `src/lib/navigation.ts` — new types + grouped `getDeepResearchNav()`
- `src/components/sidebar.tsx` — new `TickerTreeItem`, update `Sidebar` props/render
- `src/app/layout.tsx` — update prop name

## Design Constraints

- Warna konsisten: amber (#C8963E) untuk deep research, warm palette
- JetBrains Mono font
- Chevron icon dari lucide-react (sudah di-import)
- Child items lebih ke-indent dari parent (pl-10 vs pl-6)
- Auto-expand kalau child sedang active (user klik versi lama → tree otomatis buka)
- Ticker dengan 1 riset: TIDAK ada chevron, langsung navigate (clean & simple)
- Count badge: subtle, kecil, di sebelah kanan ticker name
- Alphabetical sort: A-Z berdasarkan ticker symbol
- Mobile: behavior sama, tree juga bisa expand di mobile sidebar

## Edge Cases

1. **Ticker dengan 1 riset** → tampil seperti sekarang, tanpa chevron/expand
2. **Auto-expand on active child** → kalau user buka `/deep-research/BRPT_2026-06-03_22-13` (bukan yang terbaru), BRPT tree auto-expand
3. **Chevron click vs Link click** → chevron click harus `e.preventDefault()` supaya tidak navigate, hanya toggle expand
4. **Empty state** → "No research yet" text (sama seperti sekarang)
5. **File tanpa pattern yang match** → skip, jangan render

## Visual Mockup

```
┌─────────────────────────┐
│  $ ADMR                 │  ← 1 riset, langsung link
│  $ BREN                 │  ← 1 riset
│  $ BRPT           [2] ▸ │  ← 2 riset, expandable
│    05 Jun 2026    19:20  │    ← child: versi terbaru
│    03 Jun 2026    22:13  │    ← child: versi lama
│  $ CUAN                 │  ← 1 riset
│  $ FILM                 │  ← 1 riset
│  $ SUPA           [2] ▸ │  ← 2 riset, expandable
│    07 Jun 2026    05:20  │
│    03 Jun 2026    19:30  │
│  $ VKTR                 │  ← 1 riset
└─────────────────────────┘
```
