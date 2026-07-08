# accuracy-pass — fact-check & currency check for written claims

_Canonical, track-agnostic skill. A pre-publish gate that verifies the **factual claims** in a script (or
any written content) against **live sources**, and flags anything wrong, out of date, or over-stated. Built
because model-written copy states plausible-but-stale things confidently, and my knowledge has a cutoff while
the world (especially fast-moving tech: library names, defaults, model IDs, pricing) moves every few months._

**Operationalizes** the persona rule `verified_claims_only` for factual/technical content. Highest value on
the **ai-engineering channel** (fast-moving, factual, authority-framed — a wrong fact in an authoritative
voice is worse than a hedge) but usable anywhere claims are made.

**Validated 2026-07-01** on `ai-engineering/media/python-ai-libraries/SCRIPT.md`: 0 factual errors, caught the
`google-generativeai`→`google-genai` deprecation risk, an over-stated `uv` claim, and surfaced real 2026
changes past my cutoff (OpenAI acquired Astral; Polars). It did NOT invent problems on clean input — that's
the bar: a good checker mostly returns ✅.

---

## When to run
- **As a GATE: after the script/content is drafted, BEFORE generating VO or rendering.** Never voice a claim
  that hasn't passed. (For a video, that means before batch-generating the narration chunks.)
- Scale effort to the piece: flagship/foundational → verify every checkable claim; quick/throwaway →
  spot-check only the **volatile** classes (see taxonomy). `log`/note what you did NOT check.

## The loop
1. **Extract** every checkable claim from the content — one assertion at a time. Ignore opinion, analogy,
   and voice ("it's basically Zod for Python" is an analogy, not a claim; "pydantic validates data" is).
2. **Classify** each claim (taxonomy below) — this sets how volatile it is and where to verify it.
3. **Verify** each against a live source (source hierarchy below).
4. **Verdict** per claim: ✅ confirmed / ⚠️ stale-or-imprecise / ❌ wrong / ❓ unverifiable — each with a
   **citation** and, if not ✅, a **suggested fix**.
5. **Apply** the clearly-warranted fixes (wrong facts, stale names, over-stated claims). **Leave judgment
   calls** (stylistic softening, optional additions) for the author with a recommendation. Report the table.

## Claim taxonomy (what to check, and how volatile it is)
| Class | Example | Volatility | Verify with |
|---|---|---|---|
| **Existence / name / install** | package is `pinecone` (not `pinecone-client`) | HIGH (renames happen) | PyPI / GitHub |
| **Currency / status** | latest version, deprecated?, EOL? | HIGH | PyPI release date + deprecation notice |
| **Capability** | "pydantic validates data" | LOW | official docs |
| **"Recommended / default / most common"** | "uv is the default" | **HIGHEST** | recent (≤6-12mo) sources; SOFTEN to accurate framing |
| **Comparative** | "X is faster than Y", "X beats Y" | HIGH | cited benchmark/source, else soften |
| **Numbers / pricing / model IDs** | model name, context window, price | HIGH | official; **Anthropic/Claude → defer to `claude-api` skill** |

The two classes that bite most: **package renames** (install-command facts a viewer will hit) and
**"recommended/default" claims** (the ecosystem's opinion shifts; state it as "becoming the default for new
projects" not "has replaced", unless a source supports the stronger claim).

## Source hierarchy (trust order)
1. **Official docs / PyPI project page / GitHub releases** — for existence, version, release date, deprecation.
2. **Recent reputable articles** (dated within ~6-12 months) — for "recommended/default" and comparative claims;
   corroborate across 2+ before asserting.
3. Blog aggregators / listicles — weak; corroboration only, never the sole basis.

Tooling: `WebFetch` a PyPI page for name+version+release-date+deprecation in one shot; `WebSearch` for the
volatile opinion/comparative claims. Batch calls in parallel. For deep digs, hand off to the `deep-research`
skill. For **anything Claude/Anthropic (models, pricing, API)**, do NOT answer from memory — use the
`claude-api` skill (per root CLAUDE.md triggers).

## Separate timeless facts from volatile claims
"numpy handles array math" is stable, spot-check at most. "uv has replaced poetry" or "X is the best" is
time-sensitive, always verify or soften. Spend the budget on the volatile classes.

## Output format
A claim-by-claim verdict table (claim · verdict · citation · fix), most-severe first, then apply the
warranted fixes and report what changed vs. what's left for the author. On clean input, a short "N claims
checked, all ✅, here are M optional currency notes" is the correct, expected result — do not manufacture
findings.

## Guardrails
- **Don't over-formalize / don't invent problems.** If the input is clean, say so. (Method kept lean on
  purpose; it's a checklist + web verification + reasoning, not a heavy script.)
- **Cite everything.** A verdict without a source is just another unverified claim.
- **Apply only clearly-warranted fixes automatically**; recommend the judgment calls. Softening an
  over-stated claim = warranted. Adding a whole new tool the author didn't mention = recommend, don't impose.
