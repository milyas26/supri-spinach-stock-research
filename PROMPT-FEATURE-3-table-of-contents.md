# Feature 3: Floating Table of Contents (TOC)

## Context

Project ini adalah Next.js 16 app "Supri Spinach Terminal" yang serve markdown reports dan deep research saham IDX. Deep research files bisa sangat panjang (14+ sections), dan user kesulitan navigasi antar section.

**Goal:** Tambah floating Table of Contents (TOC) yang auto-generated dari headings markdown. Desktop: sticky sidebar di kanan. Mobile: collapsible top bar.

## Current Structure

### Deep Research Page (`src/app/deep-research/[ticker]/page.tsx`)

```tsx
export default async function DeepResearchPage({ params }: PageProps) {
  const { ticker } = await params;
  let content: string;
  try {
    content = getDeepResearchContent(ticker);
  } catch {
    notFound();
  }
  const html = await processMarkdown(content);
  const relatedFiles = getRelatedTickerFiles(ticker);

  return (
    <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
      <div className="flex-1 min-w-0">
        <HighlightedContent html={html} />
        <div className="xl:hidden">
          <TickerTimeline files={relatedFiles} />
        </div>
        <hr className="my-8 border-gray-300" />
        <Comments />
      </div>
      <div className="hidden xl:block w-[200px] shrink-0 sticky top-14 self-start">
        <TickerTimeline files={relatedFiles} />
      </div>
    </div>
  );
}
```

### Reports Page (`src/app/reports/[filename]/page.tsx`)

```tsx
export default async function ReportPage({ params }: PageProps) {
  const { filename } = await params;
  let content: string;
  try {
    content = getReportContent(filename);
  } catch {
    notFound();
  }
  const html = await processMarkdown(content);
  return (
    <div>
      <HighlightedContent html={html} />
      <hr className="my-8 border-gray-300" />
      <Comments />
    </div>
  );
}
```

### Heading Patterns di Content

Deep research headings:
```
## 🔍 Deep Research: FILM (MD Entertainment Tbk)
### 1️⃣ Profil Emiten
### 2️⃣ Ringkasan Keuangan
### 3️⃣ VPA Analysis
...
### 1️⃣4️⃣ Verdict
## 🟡 ACCUMULATE DENGAN HATI-HATI
## 📎 Sumber Data
```

Reports headings:
```
# 📊 Report Watchlist — 31 Saham
## 🔥 Sinyal Terkuat Hari Ini
### 🟢 SUPA — Suparma (650 | +8.3%)
### 🟢 BUVA — Bukit Uluwatu (685 | +24.6%)
...
## 📋 Ringkasan 31 Saham
## 🔴 Red Flags
## ⚡ Kandidat Potensial
## 📰 Market Overview
```

### Existing Layout Context

- Sidebar ada di kiri (file navigation)
- Main content area di kanan
- Deep research page sudah punya `TickerTimeline` component di desktop right side (200px width, sticky)
- `xl:flex-row` breakpoint: 1280px
- Design system: warm tones, `--color-accent: #C11F2A`, JetBrains Mono

## Implementation Plan

### 1. Buat utility: extract headings dari HTML (`src/lib/markdown.ts` atau file baru `src/lib/toc.ts`)

```ts
export interface TocItem {
  id: string;      // slugified heading text
  text: string;    // clean text (no emoji optional — bisa keep emoji)
  level: number;   // 1 = h1, 2 = h2, 3 = h3
}

export function extractToc(html: string): TocItem[]
```

- Parse HTML string, cari semua `<h1>`, `<h2>`, `<h3>` tags
- Generate `id` dari text (slugify: lowercase, strip emoji, dash-case) — PASTIKAN id unik
- Return array of TocItem
- Exclude h1 dari TOC (hanya h2 dan h3 — h1 terlalu top-level)

### 2. Inject `id` attributes ke heading tags

Modifikasi `processMarkdown()` di `src/components/markdown-renderer.tsx`:

Tambah post-processing step yang inject `id` ke setiap `<h2>` dan `<h3>` tag:

```ts
function injectHeadingIds(html: string): string {
  return html.replace(/<h([23])>(.*?)<\/h\1>/g, (match, level, content) => {
    const text = content.replace(/<[^>]+>/g, ''); // strip inner HTML tags
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // strip emoji & special chars
      .replace(/\s+/g, '-')       // spaces to dashes
      .replace(/-+/g, '-')        // collapse dashes
      .trim();
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}
```

Tambahkan ini di pipeline `processMarkdown()`.

### 3. Buat component: `src/components/table-of-contents.tsx`

```tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { List, ChevronDown } from 'lucide-react';
import type { TocItem } from '@/lib/toc';

interface TableOfContentsProps {
  items: TocItem[];
}

// Desktop: sticky sidebar
export function DesktopToc({ items }: TableOfContentsProps) {
  // Implementasi: sticky, scroll spy (highlight active section)
  // Width: ~180px, position di paling kanan
}

// Mobile: collapsible top bar  
export function MobileToc({ items }: TableOfContentsProps) {
  // Implementasi: fixed top bar, click to expand dropdown
  // Default collapsed, show "Daftar Isi" button
}
```

**Scroll Spy behavior:**
- Track scroll position via `IntersectionObserver` atau scroll event
- Highlight heading yang sedang visible di viewport
- Active item punya accent color highlight (`var(--color-accent)`)
- Click heading → smooth scroll ke section (`scrollIntoView({ behavior: 'smooth' })`)

### 4. Integrasi ke Pages

**Deep Research Page** — modifikasi layout:

```
Desktop layout (>xl):
┌──────────────────────────────────────────────────────────┐
│ [Main Content: flex-1]           [TOC: 180px sticky]    │
│                                [Timeline: 200px sticky]  │
│                                                          │
└──────────────────────────────────────────────────────────┘

→ TOC dan Timeline berdampingan di right side, atau TOC di paling kanan, Timeline di tengah.
→ Pilihan: gabung TOC + Timeline jadi satu right sidebar panel (tabbed atau stacked)
```

```
Mobile layout (<xl):
┌────────────────────┐
│ [MobileToc: fixed] │ ← collapsible, di atas content
│ [Content]          │
│ [Timeline]         │ ← existing mobile behavior
│ [Comments]         │
└────────────────────┘
```

**Reports Page** — tambah TOC juga (reports juga punya banyak headings):

```tsx
// Modifikasi src/app/reports/[filename]/page.tsx
export default async function ReportPage({ params }: PageProps) {
  // ... existing code ...
  const html = await processMarkdown(content);
  const toc = extractToc(html);

  return (
    <div>
      <MobileToc items={toc} />  {/* visible < xl */}
      <div className="flex flex-col xl:flex-row gap-8 xl:items-start">
        <div className="flex-1 min-w-0">
          <HighlightedContent html={html} />
          <Comments />
        </div>
        <div className="hidden xl:block w-[180px] shrink-0 sticky top-14 self-start">
          <DesktopToc items={toc} />
        </div>
      </div>
    </div>
  );
}
```

### 5. Styles (`src/app/globals.css`)

```css
/* TOC Desktop */
.toc-desktop {
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  font-size: 0.7rem;
  border-left: 2px solid var(--color-border);
  padding-left: 0.75rem;
}

.toc-item {
  display: block;
  padding: 0.2rem 0;
  color: var(--color-text-muted);
  text-decoration: none;
  border-bottom: none;
  transition: color 0.15s;
  line-height: 1.4;
}

.toc-item:hover {
  color: var(--color-text);
}

.toc-item.active {
  color: var(--color-accent);
  font-weight: 600;
  border-left: 2px solid var(--color-accent);
  margin-left: -0.75rem;
  padding-left: calc(0.75rem - 2px);
}

.toc-item-level-3 {
  padding-left: 0.75rem; /* indent h3 */
}

/* TOC Mobile */
.toc-mobile-trigger {
  position: sticky;
  top: 3.5rem;
  z-index: 20;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-soft);
  cursor: pointer;
}

.toc-mobile-dropdown {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  max-height: 60vh;
  overflow-y: auto;
}
```

## Files to Create/Modify

**Create:**
- `src/components/table-of-contents.tsx` — DesktopToc + MobileToc components
- `src/lib/toc.ts` — `extractToc()` utility

**Modify:**
- `src/components/markdown-renderer.tsx` — tambah `injectHeadingIds()` ke pipeline
- `src/app/deep-research/[ticker]/page.tsx` — integrasi TOC
- `src/app/reports/[filename]/page.tsx` — integrasi TOC
- `src/app/globals.css` — TOC styles

## Design Constraints

- Warna konsisten: warm palette, JetBrains Mono
- TOC jangan ganggu reading flow — subtle, fade kalau tidak di-hover
- Mobile: jangan makan banyak screen space — collapsed by default
- Smooth scroll behavior (sudah ada `scroll-behavior: smooth` di html)
- Heading ID harus stable (deterministic dari text content)
- Handle emoji di headings: strip untuk ID generation, keep untuk display text
- Handle duplicate headings (reports bisa punya banyak `### 🟢` — append counter: `green-supa`, `green-buva`, dll)

## Edge Cases

1. **Content tanpa headings** → jangan render TOC sama sekali
2. **Cuma 1-2 headings** → jangan render TOC (terlalu sedikit, gak useful)
3. **Heading dengan emoji** → ID strip emoji, display keep emoji
4. **Heading dengan pipe `|`** → di reports ada `### 🟢 SUPA — Suparma (650 | +8.3%)`, handle `|` di ID
5. **Very long TOC** (reports bisa 40+ headings) → scrollable container, max-height
6. **Deep research page yang sudah punya TickerTimeline di right side** → gimana coexist? Options:
   a. Stack: TOC di atas, Timeline di bawah (dalam satu right sidebar)
   b. Tabbed: switch antara TOC dan Timeline
   c. TOC di left side (sebelum content), Timeline tetap di right
   → Rekomendasi: **option (a) stack** — paling simple, kedua info visible simultaneously
