# Master CV — conflict report

Every discrepancy found while merging the ten supplied CV documents with the
website (`src/data/portfolio.ts`, mirrored from `https://andrewmk.is-a.dev`).
Each entry says what the sources say, what the Master CV does, and whether the
question is settled.

Status key: **Resolved** = a source decides it; **Open** = needs a confirmation
from Andrew; nothing was guessed.

## Reconciliation summary — finalised 2026-11-01

Eleven findings, ten closed. The Master CV data (`src/data/cv.ts`) now agrees with
the site records on every field that a source settles: name, phone, Gavelling
profile, education, committee types, the four MUN roles and their awards, the six
competition results, the six project summaries and statuses, and every skill line.
The reconciliation was checked against the live source routes (`/resume`,
`/profile`, `/achievements`) and the certificate gallery on 2026-11-01, not only
against the earlier notes in `MASTER_CV_SOURCE_AUDIT.md`.

| #   | Finding                                  | Status                                        |
| --- | ---------------------------------------- | --------------------------------------------- |
| 1   | IHSMUN 2025 committee and portfolio      | Resolved — Lok Sabha B (2026-11-02)           |
| 2   | Contact email                            | **Open** — needs Andrew's decision            |
| 3   | Full name                                | Resolved — full documented name               |
| 4   | Phone number                             | Resolved — documents are the only source      |
| 5   | Gavelling profile URL                    | Resolved — taken from two of the documents    |
| 6   | Education level                          | Resolved — CV year and site timeline agree    |
| 7   | "RoundSquare MUN 2026"                   | Resolved — removed, unsupported               |
| 8   | IHS UNSummit 2026 portfolio              | Resolved — merged committee + portfolio       |
| 9   | Committee types                          | Resolved — consistent with the three roles    |
| 10  | Awards count                             | Resolved — one Verbal Commendation each       |
| 11  | "Best Resolution" still on the live site | Resolved in content, **source not yet fixed** |

**Authority order used:** an explicit owner ruling beats every document; for
facts no one has ruled on, the supplied CV documents beat the website only where
they carry detail the site never publishes (phone, Gavelling URL, portfolios);
everything the site publishes stays as the site publishes it.

**What is still open, in one line each:**

1. Which email address should the CV carry — the older one in the supplied
   documents, or the address the website publishes (`CONTACT_EMAIL`)?

Nothing else in the Master CV is waiting on an answer.

## 1. IHSMUN 2025 — committee, portfolio and awards · **Resolved**

| Source                                         | Committee   | Portfolio         | Awards                                     |
| ---------------------------------------------- | ----------- | ----------------- | ------------------------------------------ |
| Supplied CVs (all 4 content variants)          | Lok Sabha B | Kodikunnil Suresh | Two awards claimed — neither held (see §1) |
| Website `/achievements`, `/resume`, `/profile` | FIA         | —                 | Verbal Commendation                        |
| Website certificate `mun-ihsmun-2025`          | —           | —                 | "Certificate of Participation", Oct 2025   |

The documents agree with each other and disagree with the website, and the
certificate lists no award at all. **Andrew has ruled on the awards
(2026-11-01): he has won no MUN award other than Verbal Commendation** — never
Honourable Mention, Best Position Paper, Best Resolution, Outstanding Delegate
or Best Delegate. The supplied documents' award lines were wrong, so the Master
CV records **Verbal Commendation** for IHSMUN 2025 and the website keeps the
same award.

**Committee resolved 2026-11-02 — Lok Sabha B · Kodikunnil Suresh.** The
website's `munResults` said **FIA**, which is the committee of IHS UNSummit 2026
and sits two lines below it in the same list, so the site record had copied its
neighbour's committee. All four supplied CV documents name Lok Sabha B and the
portfolio Kodikunnil Suresh, and the IHSMUN certificate is a domestic Indian
conference record. `munResults` in `src/data/portfolio.ts` now reads
**Lok Sabha B · Verbal Commendation**, so the site and `cv.mun` agree on
committee, portfolio and award; `src/data/cv.ts` needed no change.

This also settles §9: "domestic" is the Lok Sabha simulation, alongside UNSC
(crisis) and FIA (specialised), so `cv.munHighlights` keeps all three committee
types with a conference behind each one.

## 2. Contact email · **Open**

The ten documents use one email address; the website publishes a different one
(`CONTACT_EMAIL`). The Master CV uses the website's published address, since it
is the current public contact, and does **not** copy the older address. If the
CV documents carry the address that should be used for applications, say so and
the value changes in one place (`src/data/cv.ts`).

## 3. Full name · **Resolved**

Documents: "Andrew Mathews Kalathil". Website: "Andrew Mathews". The Master CV
uses the full documented name; the website's own display name is unchanged.

## 4. Phone number · **Resolved (new information)**

Every supplied document lists a UAE mobile number; the website publishes no phone
number. It is now part of the Master CV (and therefore the downloadable CV on
`/resume`), held in `CV_PHONE` in `src/data/cv.ts`. Remove that constant's value
if the website's CV should stay phone-free.

## 5. Gavelling profile · **Resolved**

Only two of the ten documents carry the URL `gavelling.com/cv/andrew-cc2f1dc3`.
It is a clickable link in the PDF/DOCX footer. The other eight files say only
"Gavelling.com Profile" with no address, so the URL would otherwise have been
lost.

## 6. Education level · **Resolved (no conflict)**

The supplied documents name the school but give no grade. An earlier draft of
this report read the CV's "Grade 8, progressing to Grade 9 in the 2027 academic
year" as contradicting the site timeline's "2025-2026 · Grade 7". They are two
different academic years and both are correct:

- the site timeline entry describes **2025-2026**, when Andrew was in Grade 7 —
  the same year the Annual Athletic Meet certificate records ("Third position,
  Shot Put (Grade 7)", 12 November 2025);
- the CV statement describes **2026-27** (now), which makes him Grade 8, moving
  to Grade 9 in the 2027-28 year.

No wording change was needed. Keep the CV line relative to the current academic
year when it is next refreshed.

## 7. "RoundSquare MUN 2026" · **Resolved (removed)**

The earlier CV draft listed a fourth MUN, "RoundSquare MUN 2026 — participation
with positive chair feedback". Neither the ten supplied documents nor the
website mentions it. It has been removed from the Master CV as unsupported. Add
it back only with a source.

## 8. IHS UNSummit 2026 portfolio · **Resolved (merged)**

Documents add "Liam Lawson" as the represented portfolio; the website records
only the FIA committee and the Verbal Commendation. Both are true, so the Master
CV lists committee, portfolio and award together.

## 9. Committee types · **Resolved**

The documents claim "crisis, specialised and domestic" committee experience. The
three conferences map to UNSC (crisis), FIA (specialised) and Lok Sabha
(domestic), so the claim is consistent. §1 resolving IHSMUN 2025 to Lok Sabha B
keeps the domestic claim backed by a real conference; had it gone the other way
the highlight line would have lost its domestic committee. The Master CV states
the claim without attributing a type to a specific conference, since no document
does.

## 10. Awards count · **Resolved (corrected 2026-11-01)**

Each MUN conference carries exactly one award: a Verbal Commendation (Novara MUN
2026, IHS UNSummit 2026, IHSMUN 2025). An earlier draft of this report repeated
the supplied documents' claim of two awards at IHS UNSummit 2026 and IHSMUN
2025; the second awards named there were never won. They have been removed from
the Master CV, the website and the generated PDF/DOCX.

## 11. "Best Resolution" still published by the live site · **Resolved in content, source not fixed**

`https://andrewmk.is-a.dev/achievements` and `/resume` still print
"IHS UNSummit 2026 — FIA · Verbal Commendation + **Best Resolution**". That
contradicts the owner ruling recorded in §1 and §10, and it is the only award
the site adds beyond a Verbal Commendation. The Master CV and this repo's
`munResults` carry the Verbal Commendation alone — do not import the extra award
if the site is re-mirrored. The live site itself needs the edit.

## Re-running the reconciliation

1. Fetch `https://andrewmk.is-a.dev/sitemap.xml`, then `/resume`, `/profile`,
   `/achievements` and each `/projects/<slug>`, and compare names, dates, roles,
   awards, results and statuses against `src/data/cv.ts` and
   `src/data/portfolio.ts`.
2. Check the MUN and competition rows against the certificate gallery
   (`/achievements#certificates`); a certificate is the only record of what a
   conference actually printed.
3. Re-check the open item above before regenerating the deliverables with
   `docker compose -f docker-compose.base44.yml exec -T web bunx tsx
scripts/generate-master-cv.ts`.
