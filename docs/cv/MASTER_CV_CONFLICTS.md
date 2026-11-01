# Master CV — conflict report

Every discrepancy found while merging the ten supplied CV documents with the
website (`src/data/portfolio.ts`, mirrored from `https://andrewmk.is-a.dev`).
Each entry says what the sources say, what the Master CV does, and whether the
question is settled.

Status key: **Resolved** = a source decides it; **Unresolved** = needs a
confirmation from Andrew; nothing was guessed.

## 1. IHSMUN 2025 — committee, portfolio and awards · **Resolved (awards), committee open**

| Source                                 | Committee   | Portfolio         | Awards                                             |
| -------------------------------------- | ----------- | ----------------- | -------------------------------------------------- |
| Supplied CVs (all 4 content variants)  | Lok Sabha B | Kodikunnil Suresh | Honourable Mention · Best Position Paper           |
| Website `/achievements` (`munResults`) | FIA         | —                 | Verbal Commendation                                |
| Website certificate `mun-ihsmun-2025`  | —           | —                 | "Certificate of Participation", 24–26 October 2025 |

The documents agree with each other and disagree with the website, and the
certificate lists no award at all. **Andrew has ruled on the awards
(2026-11-01): he has won no MUN award other than Verbal Commendation** — never
Honourable Mention, Best Position Paper, Best Resolution, Outstanding Delegate
or Best Delegate. The supplied documents' award lines were wrong, so the Master
CV now records **Verbal Commendation** for IHSMUN 2025 and the website keeps the
same award. The committee/portfolio still differ (Lok Sabha B · Kodikunnil
Suresh in the documents, FIA on the website); that is an assignment, not an
award, and stays open.

## 2. Contact email · **UNRESOLVED**

The ten documents use one email address; the website publishes a different one
(`CONTACT_EMAIL`). The Master CV uses the website's published address, since it
is the current public contact, and does **not** copy the older address. If the
CV documents carry the address that should be used for applications, say so and
the value changes in one place (`src/data/cv.ts`).

## 3. Full name · **Resolved**

Documents: "Andrew Mathews Kalathil". Website: "Andrew Mathews". The Master CV
uses the full documented name; the website's own display name is unchanged.

## 4. Phone number · **Resolved (new information)**

Every supplied document lists `+971 54 347 4736`; the website publishes no phone
number. It is now part of the Master CV (and therefore the downloadable CV on
`/resume`). Remove it from `src/data/cv.ts` (`cv.phone`) if the website's CV
should stay phone-free.

## 5. Gavelling profile · **Resolved**

Only `#3` and `#7` carry the URL `gavelling.com/cv/andrew-cc2f1dc3`. It is now a
clickable link in the PDF/DOCX footer. The other eight files say only
"Gavelling.com Profile" with no address, so the URL would otherwise have been
lost.

## 6. Education level · **UNRESOLVED**

The supplied documents name the school but give no grade. The website CV says
"Grade 8, progressing to Grade 9 in the 2027 academic year", while the site's
journey timeline places 2025–2026 at "Grade 7". The Master CV keeps the CV
wording. One of the two should be corrected.

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
(domestic), so the claim is consistent. The Master CV states it without
attributing a type to a specific conference, since no document does.

## 10. Awards count · **Resolved (corrected 2026-11-01)**

Each MUN conference carries exactly one award: a Verbal Commendation (Novara MUN
2026, IHS UNSummit 2026, IHSMUN 2025). An earlier draft of this report repeated
the supplied documents' claim of two awards at IHS UNSummit 2026 and IHSMUN
2025; the second awards named there (Best Resolution, Honourable Mention, Best
Position Paper) were never won. They have been removed from the Master CV, the
website and the generated PDF/DOCX.
