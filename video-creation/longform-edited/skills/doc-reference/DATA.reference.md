# <project>: DATA (research dump; every number carries a source)
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift, re-pull before recording/render._
_Compiled <date> for the LOCKED brief "<title>" (<runtime>, <constraints>). Spelling per persona. No em dashes._

_REFERENCE SHAPE (skills/doc-reference, 2026-09-17). Copy this structure; replace the content. Format owner: `charts.md` §1 (the CHART-SOURCE INDEX) + the `data-researcher` agent definition (the sections). Every row: statement · source URL (opened, not just found) · read date · confidence. Nothing here is invented; not found = Open questions._

**Source access notes (read before citing):**
- <a domain that redirects / a paywall / a page that 404s, and what was done about it>
- <the primary document that was opened and read in full>

---

## 1. The thesis, sourced

Each row: statement · source URL · read date · confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | <the thesis claim, with the VERBATIM words of the primary source in quotes> | <URL> | <YYYY-MM-DD> | HIGH (primary, verbatim) |
| T2 | <a claim the brief makes that the sources only PARTLY support, and what they do support> | <URL> | <date> | MEDIUM (see Open question 2) |

---

## 2. Pillar facts

### Pillar 1: <the brief's first pillar>
- <fact> (<source URL>, read <date>). Verbatim where it matters: "<quote>".
- <fact> ... 

### Pillar 2: <the brief's second pillar>
- **<sub-topic>:** <fact with source>.
- **Plain-language summary the sources support (for the strategist, not a quote):** <one paragraph>.

### Pillar <n>: where it stands (the dated timeline)

| Date | Event | Source (read <date>) |
|---|---|---|
| <YYYY-MM-DD> | <shipped thing> | <URL> |
| <YYYY-MM-DD> | <announced thing, with who said it> | <URL> |

**Shipped vs planned (one-line ledger for the close):**
- SHIPPED: <items with dates>.
- IN PROGRESS: <items, with the source's own words for the stage>.
- PLANNED / RESEARCH: <items>.

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **<Person>** (X: @handle) | <role> | <where the role is stated> |
| **<Org>** | <what> | <source> |

Terminology for captions/graphics: <the spellings the persona mandates for this topic>.

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| "<popular claim>" | <second-hand / stale / superseded / unverifiable, with the evidence> | "<the airable line>" |
| "<a claim the BRIEF itself made>" | <what the sources actually say> | "<the honest reframing>" |

---

## 5. Market snapshot

Pulled <YYYY-MM-DD HH:MM UTC> from <API/page URL>. All [VERIFY] at render.

| Figure | Value at read | Note |
|---|---|---|
| <price / cap / count> | <value> | [VERIFY] |
| <a primary, non-drifting figure> | <value> | primary, not drifting |

---

## CHART-SOURCE INDEX

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | THE system-design diagram: <nodes, arrows, labels; every label traces to section 2> | section 2 | **code** (Type 2, static states) |
| C2 | <contrast / ladder graphic> | section 2 / 4 | **code** (Type 1 animated) |
| C3 | Receipt: <the primary document's title page> | <URL> | **screencap** |
| C4 | Receipt: <the quote as printed on the page that printed it> | <URL> (crop to the paragraph) | **screencap** |
| C5 | OPTIONAL: <price chart> if the close wants a market beat | <TradingView / CoinGecko page> | **screencap** [VERIFY]; never restyle |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. Code-built graphics are text-accurate and trace to section 2; everything else is a real-site capture.

---

## Open questions for Mike

1. **<a brief claim the research could not source>:** <what was found, what is airable>. Recommendation: <drop / reframe>.
2. **<a source that could not be opened>:** <what was used instead>.
3. **Brief contradiction check:** <none / the one soft contradiction and how the angle survives>.
