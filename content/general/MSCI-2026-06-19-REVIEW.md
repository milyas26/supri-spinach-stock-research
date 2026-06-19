# 🔎 Review: MSCI-2026-06-19 (General Report)

**Report di-review:** `content/general/MSCI-2026-06-19.md` (tanggal: 19 Juni 2026)
**Review date:** 19 Juni 2026
**Tipe:** General report (bukan deep research saham spesifik)

---

## Ringkasan Review

- Total klaim dicek: 15
- ✅ Terverifikasi: 13
- ⚠️ Perlu perhatian: 2
- 🔴 Masalah serius: 0

---

## Temuan

### 🔴 Critical Issues (harus diperbaiki sebelum publish)

**Gak ada.** Ini laporan bersih — gak ada fabricasi politik, gak ada klaim hubungan keluarga ngawur.

---

### ⚠️ Warnings (perlu dicek ulang)

**1. KPIG (MNC Land) hilang dari daftar Small Cap**

Report bilang `~43 saham` di MSCI Small Cap tapi cuma listing 42 ticker. Referensi `constituents-may-2026.md` mencantumkan **KPIG** (MNC Land Tbk, Property) sebagai konstituen Small Cap. KPIG gak muncul di daftar report.

- **Dampak:** Minor — gak ngaruh ke analisis, tapi bikin jumlah gak presisi
- **Fix:** Tambahin `KPIG` ke daftar Small Cap, jadi 43 total

**2. Beberapa bold di daftar Small Cap tanpa penjelasan**

5 ticker di-bold (ENRG, PTRO, RATU, RAJA, WIFI) tapi gak ada keterangan kenapa. Beda ama AMRT yang di-bold + di-annotate `(↓ downgrade dari Standard)`. Bisa bikin pembaca bingung — apa ini sinyal sesuatu?

- **Fix:** Kasih keterangan kenapa di-bold, atau un-bold kalau gak ada alasan khusus.

---

### 💡 Suggestions (nice-to-have)

**1. Perhitungan outflow $ gak konsisten sama kurs**

Report: `Foreign outflow YtD ~Rp80 triliun (~$4 miliar)`. Dengan kurs Rp20.000/USD (rupiah "rekor terendah") → Rp80T = $4B ✅. Tapi di section 4 disebut `outflow $8-13 miliar` — beda 2-3x lipat. Yang $8-13M itu outflow **potensial jika downgrade FM**, jadi emang konteksnya beda. Tapi karena dua-duanya ada kata "outflow", bisa bikin bingung pembaca awam.

- **Saran:** Di section 8 kasih penekanan "outflow **potensial jika downgrade FM**" (ini udah ada sih, cuma bisa lebih eksplisit).

**2. "Terburuk di dunia" perlu konteks**

`IHSG YtD -29% (terburuk di dunia)` — klaim ini agak absolut. Gak ada sumber spesifik yang diverifikasi buat ranking global. Biasanya data kayak gini dari Bloomberg World Index comparison.

- **Saran:** Tambahin `📎 Sumber:` buat klaim "terburuk di dunia" — atau soften jadi "salah satu yang terburuk".

**3. "18 indikator" vs referensi internal**

Report nyebut "18 indikator" di aksesibilitas, tapi referensi `methodology.md` cuma nyebutin 5 sub-kriteria. Harusnya 18 ini adalah breakdown lebih granular dari 5 sub-kriteria tadi. Tapi gak ada verifikasi independen buat pastiin jumlahnya persis 18.

- **Saran:** Kalau ada akses ke MSCI MAR PDF, confirm jumlah indikatornya dari situ.

---

### ✅ Verified Claims

| # | Klaim | Status | Bukti |
|---|-------|--------|-------|
| 1 | Indonesia tetap Emerging Market | ✅ | Kompas, CNN Indonesia, Bisnis — semua confirm |
| 2 | MSCI MAR Review 18 Juni 2026 | ✅ | Kompas: "Jumat (19/6/2026) dini hari WIB" = 18 Juni CEST |
| 3 | Information Flow downgrade "+" → "-" | ✅ | IDN Financials: "MSCI Cuts Indonesia Transparency Score" |
| 4 | Jeffrey Hendrik Dirut BEI 2026-2030 | ✅ | Tempo English: "OJK Taps Jeffrey Hendrik as New IDX Chief for 2026-2030" |
| 5 | RUPST 29 Juni 2026 | ✅ | Tempo English: "AGMS scheduled for June 29, 2026" |
| 6 | 11 saham Global Standard | ✅ | Match persis dengan `constituents-may-2026.md` |
| 7 | 6 saham didepak Standard (May 2026) | ✅ | Match persis: AMMN, BREN, TPIA, DSSA, CUAN, AMRT |
| 8 | Edi Chandren / Stockbit 4 skenario | ✅ | Bisnis: "Intip 4 Skenario... Edi Chandren 1x, Stockbit 1x" |
| 9 | Hasan Fawzi quote | ✅ | CNN Indonesia article confirms OJK response |
| 10 | Freeze belum dicabut | ✅ | Konsisten dengan semua sumber |
| 11 | "Foreign ownership RI lebih baik dari China & India" | ✅ | Dikutip dari Mirae Asset analyst (Wilbert Arifin) |
| 12 | MSCI Free Float Update 20 April 2026 | ✅ | URL MSCI aktif, 200 OK |
| 13 | MSCI MAR PDF link | ✅ | URL MSCI aktif, 200 OK |

---

## Source URL Verification

- **24/29 URLs** → HTTP 200 ✅
- **5/29 URLs** → HTTP 403 (blocked anti-bot):
  - `idnfinancials.com` (3x) — Cloudflare block, bukan broken
  - `jakartaglobe.id` (2x) — Cloudflare block, bukan broken
- **Semua 3 MSCI direct URLs** → 200 OK ✅
- **5 artikel Indonesia yang dicek kontennya** → isi cocok dengan klaim ✅

Gak ada broken link. Yang 403 itu typical news-site anti-scraping — tetep bisa dibuka di browser.

---

## Cross-Section Consistency

| Cek | Hasil |
|-----|-------|
| Jumlah Global Standard (section 9 vs reference) | ✅ 11 — match |
| Jumlah Small Cap (section 9 vs reference) | ⚠️ 42 di report, 43 di reference (KPIG missing) |
| 6 kicked Standard (section 9 vs reference) | ✅ match |
| Timeline kronologi (section 10) vs narasi (section 1-4) | ✅ konsisten |
| Freeze status konsisten antar section | ✅ konsisten (section 2, 9, 10 semua bilang freeze lanjut) |
| Harga IHSG 6.161 vs klaim YtD -29% | ✅ konsisten (ATH 9.134 → 6.161 = -32.5%, YtD dari ~8.670 = -29%) |

---

## Rekomendasi

### Wajib (sebelum publish ulang):

1. **Tambahin KPIG** ke daftar Small Cap section 9 — biar jadi 43 total (sesuai "~43")
2. **Kasih catatan** kenapa ENRG, PTRO, RATU, RAJA, WIFI di-bold — atau un-bold

### Nice-to-have:

3. Tambahin sumber buat klaim "IHSG terburuk di dunia"
4. Tambahin konfirmasi jumlah indikator MSCI (18) dari MAR PDF langsung

---

## Verdict

**LAPORAN BERKUALITAS TINGGI.** Gak ada fabricasi, gak ada halu politik, gak ada klaim hubungan keluarga ngaco. 15 klaim utama diverifikasi, 13 confirmed, cuma 2 minor issues (KPIG missing + bold tanpa penjelasan). Sumber berlimpah (29 URL) dan hampir semua diverifikasi aktif. Narasi objektif — gak overhype, gak doomposting.

Yang paling impressive: analisis **"Netral-Negatif" ala Stockbit** + timeline kronologi lengkap. Ini bukan cuma regurgitasi berita — ada synthesis framework yang jelas.

**Status:** ✅ Layak publish. Fix 2 ⚠️ issues di atas, langsung siap.
