# Master CV — source audit

Audit of the ten CV documents supplied for the Master CV, plus the website
(`https://andrewmk.is-a.dev`, mirrored in `src/data/portfolio.ts`).

Every URL was fetched on 2026-10-31. All ten returned **HTTP 200**; none failed.
Each file was parsed directly (DOCX via `python-docx`, PDF via `pypdf`), and both
the raw bytes and the normalised text were compared — not the file names.

| #   | URL (cdn.imageurlgenerator.com/uploads/…)   | Format | Bytes   | MD5         | Normalised text (chars) | Content variant | Verdict                                    |
| --- | ------------------------------------------- | ------ | ------- | ----------- | ----------------------- | --------------- | ------------------------------------------ |
| 1   | `dd6502d1-ced1-46c4-9f3d-523e1f81cfcb.docx` | DOCX   | 37,426  | `c4d6f572…` | 1,128                   | **A**           | unique text, byte-identical to #6          |
| 2   | `b8c8a360-bd62-4ccf-b85c-c3053c8e5ebc.docx` | DOCX   | 28,388  | `a39e92af…` | 1,154                   | **B**           | unique text, byte-identical to #9          |
| 3   | `e7967e75-d7da-4be8-977b-e48b0c13a41f.pdf`  | PDF    | 2,517   | `c097a2e1…` | 1,047                   | **C**           | unique text, byte-identical to #7          |
| 4   | `479af1f9-21f6-493f-9ea9-a6ed268be446.pdf`  | PDF    | 176,802 | `4b303f86…` | 1,196                   | **D**           | unique text, byte-identical to #10         |
| 5   | `d6f5f9c6-f587-4414-829d-4d9a6c8c8882.docx` | DOCX   | 28,394  | `1c0e7cc5…` | 1,154                   | **B**           | byte-identical to #8; text identical to #2 |
| 6   | `9c82e0df-1a15-49a0-a8ce-d03433457ff9.docx` | DOCX   | 37,426  | `c4d6f572…` | 1,128                   | **A**           | duplicate of #1                            |
| 7   | `6c542bb5-4bb9-4c81-bf43-f739df1dc475.pdf`  | PDF    | 2,517   | `c097a2e1…` | 1,047                   | **C**           | duplicate of #3                            |
| 8   | `535cfb84-9be6-4b32-b80e-3658e8a2c3fa.docx` | DOCX   | 28,394  | `1c0e7cc5…` | 1,154                   | **B**           | duplicate of #5                            |
| 9   | `87304379-4ec6-496b-989e-1c45c6b2a11f.docx` | DOCX   | 28,388  | `a39e92af…` | 1,154                   | **B**           | duplicate of #2                            |
| 10  | `b62290c1-196d-4554-9f3a-7858b6317984.pdf`  | PDF    | 176,802 | `4b303f86…` | 1,196                   | **D**           | duplicate of #4                            |

## Result

- **10 files → 5 byte-identical pairs → 4 distinct contents.**
  - `#1 = #6`, `#2 = #9`, `#3 = #7`, `#4 = #10`, `#5 = #8`.
  - `#2` and `#5` are not byte-identical (six bytes of DOCX packaging metadata
    differ) but their extracted text is identical, so they are one content.
- **Only one document carries a fact no other supplied file has:** `#3`/`#7`
  contains the Gavelling profile URL `gavelling.com/cv/andrew-cc2f1dc3`. Every
  other file says only "Gavelling.com Profile" with no address.
- No file was skipped, and none failed to parse.

## What each variant contains

| Variant | Files          | Distinguishing content                                                                                                                                                                                                                |
| ------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A**   | #1, #6         | DOCX, bullet-list layout. Contact line: Dubai, email, phone. No school named. "Gavelling.com Profile" with no URL.                                                                                                                    |
| **B**   | #2, #5, #8, #9 | Same body as **A** plus `The Indian High School, Dubai, UAE` in the contact line.                                                                                                                                                     |
| **C**   | #3, #7         | PDF (ReportLab). Compressed prose layout. **Only source of the Gavelling URL.** Profile names "specialized, domestic, and crisis-style" committees; highlights mention "position papers, resolutions, and directives" and "teamwork". |
| **D**   | #4, #10        | PDF exported from Word (Microsoft 365 metadata). Body identical to **B**; no facts of its own.                                                                                                                                        |

## Facts extracted (every one is present in at least three of the four variants)

- Identity: **Andrew Mathews Kalathil**, Dubai, UAE, phone `+971 54 347 4736`,
  one email address, The Indian High School, Dubai.
- Profile: student delegate, awarded at every MUN attended; diplomacy, research,
  negotiation, public speaking, resolution writing.
- **MUN conferences (3):**
  - Novara MUN 2026 — Delegate, UNSC, Russia, Verbal Commendation, July 2026.
  - IHS UNSummit 2026 — Delegate, FIA, portfolio Liam Lawson, Verbal Commendation,
    June 2026.
  - IHSMUN 2025 — Delegate, Lok Sabha B, portfolio Kodikunnil Suresh, Verbal
    Commendation, October 2025.
  - The documents also name a second MUN award at the 2026 and 2025 conferences.
    Andrew has confirmed he did not receive it, so it is not recorded here, in
    the Master CV, or anywhere on the site.
- Highlights: awards at every conference; crisis, specialised and domestic
  committee experience; drafted resolutions, directives and position papers.

> **Correction (2026-11-01).** Andrew has confirmed these award lines are wrong:
> his only MUN award is a **Verbal Commendation** — no other MUN award was
> received. This list records what the supplied PDFs said; the Master CV and the
> website now carry the corrected award. See `MASTER_CV_CONFLICTS.md` §1 and §10.
- Leadership and activities (4): STEM Racing (F1 in Schools), Robotics & Coding
  Programme, ASDAN Environmental Short Course, Future UAE Exhibition.

The supplied CVs contain **no** education grade, no projects, no competition
results other than the MUN awards, and no dates. Those sections of the Master CV
come from the website, which remains the source of truth for portfolio content.

## Website (`andrewmk.is-a.dev`) contribution

Already mirrored in `src/data/portfolio.ts` and reused verbatim in the CV:
grade and school, technical skill groups, the 50+ projects claim, the six
selected projects, six competition/sport results (each backed by a certificate in
`src/data/certificates.ts`), Horizon Motorsports, FIRST LEGO League 2025–26 and
the robotics history from age nine.

## Independent re-verification (same day, second pass)

The ten URLs were downloaded again and re-parsed from scratch; the result is
identical to the table above:

- All ten returned **HTTP 200**; none timed out, redirected elsewhere or failed
  to parse.
- Five pairs are **byte-identical** (`#1=#6`, `#2=#9`, `#3=#7`, `#4=#10`,
  `#5=#8`), confirmed by MD5 of the raw bytes.
- Normalising whitespace gives **four distinct texts**: 1,196 / 1,154 / 1,047 /
  1,128 characters, matching variants **D / B / C / A**.
- The only fact that exists in a single content variant is still the Gavelling
  profile URL (`gavelling.com/cv/andrew-cc2f1dc3`, variant **C** only). It is in
  the Master CV footer, so nothing was lost by collapsing the duplicates.

## Layout inspection of the rendered PDF

The committed PDF was rendered page by page (A4, 140 dpi) and measured from its
text boxes; the DOCX was parsed for its real styles.

| Check                | Result                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------------- |
| Pages                | 2 × A4 (595 × 842 pt)                                                                    |
| Margins              | 46 pt left on both pages, 47 pt top on page 1 / 52 pt on page 2, longest line ends at 550 pt (45 pt right) — symmetric |
| Section hierarchy    | One 23 pt name, 10.5 pt subtitle, 9.2 pt body, 8.4–9.6 pt entry title/status/tech lines; Helvetica + Helvetica-Bold only |
| Page break           | Page 1 ends inside Development Experience; page 2 opens with the `SELECTED PROJECTS` heading — no heading stranded at the bottom of a page |
| Text clipping        | None: every line box is inside the page box, no line is cut by the right margin          |
| Overlapping text     | 0 boxes overlap (was 6 — see below)                                                      |
| Empty space          | Page 1 fills to 781 of 842 pt; page 2 ends at 630 pt, i.e. ~75 mm of white space after the last section, which is the normal end of a document, not a gap inside one |
| DOCX                 | A4, 0.5 in margins, 71 paragraphs, real `Heading 2`/`Heading 3` styles, 0 tables, 0 images — fully editable, no text boxes |

One defect was found and fixed while inspecting: in the project list the project
name was drawn at the cursor and the summary paragraph then advanced only
0.72 × its leading, so a 9.6 pt name sat **9 pt** above its own 9 pt summary
(the font's own line box overlapped the next line). The generator now drops the
cursor 3.6 pt between the two, giving a 12.6 pt baseline step, and the six
project blocks no longer overlap. Page count is unchanged.

## How to regenerate

```sh
docker compose -f docker-compose.base44.yml exec -T web \
  bunx tsx scripts/generate-master-cv.ts
```

This writes `Andrew_Mathews_Kalathil_Master_CV.pdf` and
`Andrew_Mathews_Kalathil_Master_CV.docx` into this directory from
`src/data/cv.ts` — the same source the website's `/api/cv/pdf` and
`/api/cv/docx` use.
