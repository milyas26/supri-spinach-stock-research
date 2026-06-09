# Feature 2: Auto-link Ticker ke Deep Research

## Context

Project ini adalah Next.js 16 app "Supri Spinach Terminal" yang serve markdown reports dan deep research saham IDX.

**Masalah:** Di halaman reports (`/reports/Report_YYYY-MM-DD.md`), ticker symbols (BRPT, SSIA, FILM, dll) yang muncul di konten cuma link ke Stockbit via `linkifyTickers()` di `src/components/markdown-renderer.tsx`. Padahal beberapa ticker udah punya deep research sendiri di `/deep-research/`. User harus manual navigate untuk baca riset mendalam.

**Goal:** Kalau ticker punya deep research file, tampilkan **badge/ikon kecil** di samping ticker yang clickable ke halaman deep research internal, SELAIN tetap link ke Stockbit.

## Current Behavior (file: `src/components/markdown-renderer.tsx`)

```tsx
function linkifyTickers(html: string): string {
  let insideAnchor = false;
  return html.replace(/(<[^>]+>)|(\b[A-Z]{3,5}\b)/g, (match, tag, word) => {
    if (tag) {
      if (/^<a[\s>]/i.test(tag)) insideAnchor = true;
      else if (/^<\/a/i.test(tag)) insideAnchor = false;
      return tag;
    }
    if (!insideAnchor && word && tickerSet.has(word)) {
      return `<a href="https://stockbit.com/symbol/${word}" target="_blank" rel="noopener noreferrer" class="ticker-link">${word}</a>`;
    }
    return match;
  });
}
```

`tickerSet` dibuat dari `src/lib/tickers.ts` (list ~300+ ticker IDX).

## Desired Behavior

1. **Buat fungsi baru** di `src/lib/content.ts`:
   ```ts
   export function getTickersWithResearch(): Set<string>
   ```
   Fungsi ini scan `content/deep-research/` directory, extract ticker dari filename pattern `{TICKER}_{YYYY-MM-DD}_{HH-MM}.md`, dan return Set<string> dari ticker yang punya riset.

2. **Modifikasi `linkifyTickers()`** di `src/components/markdown-renderer.tsx`:
   - Import `getTickersWithResearch` dari `@/lib/content`
   - Buat `researchTickers` set (cache, jangan panggil tiap render — gunakan module-level atau pass as prop)
   - Kalau ticker ada di `researchTickers`:
     - Tetap wrap dengan link Stockbit (behavior existing)
     - Tambah **badge kecil** setelah link: `<a href="/deep-research/{latest_filename}" class="research-badge" title="Ada deep research">📊</a>`
     - `latest_filename` = file deep research terbaru untuk ticker tersebut (ambil dari sorted list)
   - Kalau ticker TIDAK ada di `researchTickers`: behavior tetap seperti sekarang (link Stockbit doang)

3. **Style badge** di `src/app/globals.css`:
   ```css
   .ticker-link + .research-badge {
     font-size: 0.65rem;
     margin-left: 0.15rem;
     text-decoration: none;
     border-bottom: none;
     opacity: 0.7;
     transition: opacity 0.15s;
     vertical-align: middle;
   }
   .ticker-link + .research-badge:hover {
     opacity: 1;
   }
   ```
   Badge harus subtle, jangan ganggu reading flow. Pakai emoji 📊 atau icon kecil.

4. **Performance:** `getTickersWithResearch()` harus efficient:
   - Bisa dipanggil sekali di module level (server-side, ini RSC)
   - Atau pass sebagai prop dari page component ke markdown-renderer
   - JANGAN scan filesystem di setiap `linkifyTickers()` call

## Files to Modify

- `src/lib/content.ts` — tambah `getTickersWithResearch()`
- `src/components/markdown-renderer.tsx` — modifikasi `linkifyTickers()`
- `src/app/globals.css` — tambah `.research-badge` styles

## Constraints

- Jangan hapus behavior existing (Stockbit link tetap ada)
- Badge hanya muncul di **reports page**, bukan di deep research page (hindari self-link)
- Ticker yang muncul di dalam `<a>` tag existing jangan di-double-link (sudah di-handle oleh `insideAnchor` check)
- Design harus konsisten dengan existing: warm-toned, JetBrains Mono, minimal
- Server-side rendering only (ini bukan client component untuk markdown processing)

## Testing

1. Buka `/reports/Report_2026-06-09` — ticker FILM harus punya badge 📊 karena ada `FILM_2026-06-09_20-24.md`
2. Badge click → navigasi ke `/deep-research/FILM_2026-06-09_20-24`
3. Ticker yang TIDAK punya riset (misal ESIP) → tetap link Stockbit, tanpa badge
4. Di halaman deep research sendiri → badge TIDAK muncul
5. Cek mobile — badge jangan terlalu kecil/tersembunyi
