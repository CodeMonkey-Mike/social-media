# Video outline — "Save Tokens with Sub-Agents (Model + Effort Routing)"

**Channel:** AI Engineering Simplified (@aiEngineeringSimplified) — learn-in-public, explainer + hands-on.
**Register:** authority / practical-teacher, mostly Mike's own voice. Lighter edit than the main channel.
**Source:** a real session (2026-07-09) that repurposed one livestream into 7 vertical shorts using a
Claude Code orchestrator + sub-agents. All numbers below are REAL, pulled from that run.

**Working titles (pick one):**
- "I cut my agent's token bill by delegating to sub-agents (here's the pattern)"
- "Sub-agents, model routing, and effort levels: the token-saving stack"
- "Stop running everything on your biggest model at max effort"

**One-line thesis:** A single agent that does everything drags its ENTIRE growing transcript through
every step — that's the token bill. Split the work into sub-agents with ISOLATED contexts, and route
each slice to the cheapest model + lowest effort that can do it. The main agent keeps only the compact
result, not the sub-agent's 100K-200K-token working transcript.

---

## THE CORE IDEA (the thing to teach)

Two levers save the tokens:

1. **Context isolation.** Every sub-agent runs in its OWN fresh context window. It reads files, writes
   code, runs tools, self-checks — 30 to 77 tool calls, 100K-220K tokens of working transcript — and
   the orchestrator receives back ONLY its final message (a compact JSON plan or a build+QA report,
   ~1-2K tokens). The heavy transcript is disposable; it never bloats the main loop. This is the whole
   trick: **you pay for the sub-agent's context once, in isolation, instead of dragging it through the
   rest of the run.** (Bonus: it also avoids "context rot" — the quality drop a model suffers when its
   window fills with stale detail.)

2. **Model + effort routing.** Two dials on every sub-agent:
   - **Model:** cheap/fast (Fable) for JUDGMENT work; expensive (Opus) only for bug-sensitive CODE.
   - **Effort:** low → medium → high → xhigh → max. Match it to the task's difficulty. Don't run
     everything at max.
   The point: a judgment call ("which 7 moments become shorts?") does NOT need your most expensive
   model — but it may deserve high effort. A frame-perfect Remotion composition DOES need the strong
   model and precision effort. Decouple the two dials and set each per slice.

---

## THE PATTERN WE USED: advisor / executor split

| Role | Who | Model | Effort | Tools | Returns |
|---|---|---|---|---|---|
| **Orchestrator** | main loop / `repurpose-livestream` command | opus | medium | all | holds the task list, runs glue inline, delegates slices |
| **Advisor** | `clip-strategist` | **fable** | **max** | Read/Grep/Glob/Bash (READ-ONLY) | a JSON clip plan (which moments become shorts) |
| **Advisor** | `tighten-strategist` | **fable** | **max** | read-only | JSON removal spans (what to cut) |
| **Executor** | `remotion-builder` | **opus** | **xhigh** | Read/Write/Edit/Bash/Grep/Glob | rendered mp4 + gate output + self-QA report |

Rule of thumb to put on screen:
- **Judgment slice → cheap model, high effort, read-only, returns a plan.** (Fable advisor.)
- **Intricate execution slice → strong model, precision effort, can write + run, self-verifies.** (Opus executor.)

Why xhigh on the executor specifically: the composition code is bug-sensitive (frame math, overlay
collision, timing) — precision pays for itself. Why max-effort Fable on the advisor: the judgment
(scatter-gather the best moments) is hard reasoning, but it's cheap to run it hard on a small model.

---

## REAL NUMBERS FROM THE SESSION (the proof)

One livestream → 7 finished vertical shorts. The orchestrator delegated the heavy work to sub-agents.
Each sub-agent run below happened in an ISOLATED context; the orchestrator only absorbed the final
report (~1-2K tokens each).

| Sub-agent run | Tokens (isolated) | Tool calls | Wall time |
|---|---|---|---|
| clip 2 build (b-roll + render + QA) | 223,626 | 77 | ~28 min |
| clip 3 plan (BROLL-PLAN authoring) | 108,233 | 25 | ~10 min |
| clip 3 build | 165,311 | 49 | ~15 min |
| clip 4 plan (+2 revisions) | 94,263 (+156K +185K) | 19 | ~8 min |
| clip 4 build | 157,939 | 54 | ~20 min |
| clip 5 build | 205,706 | 49 | ~23 min |
| clip 6 build | 99,687 | 29 | ~9 min |
| clip 7 build | 132,447 | 38 | ~14 min |

**Headline stat:** ~1.5 MILLION tokens of working transcript ran inside disposable sub-agent contexts.
If the orchestrator had done that inline, its own context would have grown by ~1.5M tokens — expensive,
and long past the point where quality degrades. Instead the orchestrator absorbed only the compact
summaries (~15-20K tokens total). **Same output, a fraction of the context on the expensive main loop.**

(Numbers are output/subagent tokens as reported at each agent's completion; wall time is real elapsed.)

---

## VIDEO STRUCTURE (section-by-section outline)

**0. Cold open / hook (0-15s)** — "This one livestream became 7 finished shorts. The agent that ran it
never held more than a fraction of the work in its context. Here's the token trick: sub-agents."

**1. The problem (the naive way).** One big agent, one big context. Every file it reads, every tool
result, every render log stays in the window and gets re-sent on every subsequent step. Cost scales
with context, and quality drops as the window fills. Show a "context balloon" visual.

**2. Lever 1 — context isolation via sub-agents.** A sub-agent is a fresh window. It does the messy
work and hands back a compact answer. Diagram: orchestrator ↔ sub-agent; the fat transcript stays on
the sub-agent side, only the thin result crosses back. This is the core token save.

**3. Lever 2 — model + effort routing.** Two independent dials. Cheap model for judgment, strong model
for bug-sensitive code; effort matched to difficulty, not cranked to max by default. Table of the two
dials with examples.

**4. The advisor/executor pattern.** Read-only Fable advisors that return JSON plans vs. Opus executors
that write code and self-verify. Walk the table above. Emphasize: advisors can't touch the repo (safer,
cheaper); executors own a single well-scoped slice and prove their own work with a gate.

**5. Self-QA = trust without re-checking.** The executor runs a mechanical gate + QA on itself and
returns "PASS" + a report. The orchestrator trusts the verified result instead of re-inspecting
everything — which would re-bloat its context. (Verification pushed DOWN into the isolated context.)

**6. The receipts.** Drop the real token table. "~1.5M tokens of work, none of it on the main agent's
context." Contrast the ~1-2K report vs the 100-220K transcript per agent.

**7. Bonus — parallelism.** Because sub-agents are isolated, you can fan them out. In this run, clip 4's
plan was authored WHILE clip 3's b-roll was generating — different resources, no contention. Wall-clock
win on top of the token win. (Caveat: serialize anything that shares a scarce resource — we had ONE
browser profile + one CPU for renders, so image-gen and renders were sequenced.)

**8. Where NOT to delegate (the honest part — great learn-in-public content).**
   - **Fragile/interactive steps.** Our ChatGPT image generation runs a real browser that gets bot-detected
     and hangs; it took hardening (reload-after-80s, stable-id capture, modal dismissal) before a headless
     agent could run it unattended. Lesson: make the TOOL robust before you hand it to an agent.
   - **A sub-agent is only as good as its contract.** One rule (the b-roll coverage budget) lived in a
     different skill file than the one the sub-agents read, so they followed a gap and over-covered the
     screen. Lesson: put the rule where the agent actually reads it; a delegated agent won't infer your
     unwritten standards.
   - **Scope each agent to ONE slice with a clear "definition of done"** (ours = a mechanical gate that
     must print PASS). Vague scope = the sub-agent wanders and burns tokens.

**9. How to build it in Claude Code (hands-on).**
   - `.claude/agents/<name>.md` — a markdown file with YAML frontmatter: `name`, `description`,
     `tools`, `model`, `effort`. That's the whole sub-agent definition.
   - `.claude/commands/<name>.md` — a slash-command entry point (also has `model`/`effort`) that the
     orchestrator runs; it delegates to the agents.
   - The orchestrator calls sub-agents with the Agent tool; each returns its final message as the result.
   - Show the actual frontmatter (see Appendix A) — clip-strategist (fable/max, read-only) next to
     remotion-builder (opus/xhigh, read-write).

**10. Takeaways / CTA.**
   - Isolate heavy work in sub-agents → the big context never sees the mess.
   - Route model AND effort per slice; stop defaulting everything to your best model at max.
   - Advisors (cheap, read-only, return plans) + executors (strong, write, self-verify).
   - Make the tool robust and the contract explicit before you delegate.
   - CTA: link the repo pattern / next video.

---

## APPENDIX A — real agent configs (paste on screen)

`.claude/agents/clip-strategist.md` (JUDGMENT / advisor):
```yaml
name: clip-strategist
tools: Read, Grep, Glob, Bash      # read-only — cannot modify the repo
model: fable                        # cheap/fast model
effort: max                         # hard reasoning, cheap to run hot
# returns: a structured clip plan (JSON). Renders nothing.
```

`.claude/agents/tighten-strategist.md` (JUDGMENT / advisor): `model: fable`, `effort: max`, read-only,
returns JSON removal spans.

`.claude/agents/remotion-builder.md` (EXECUTION / executor):
```yaml
name: remotion-builder
tools: Read, Write, Edit, Bash, Grep, Glob   # can write code + run renders
model: opus                                   # strong model for bug-sensitive code
effort: xhigh                                 # frame math + overlay collisions -> precision pays
# returns: rendered mp4 + gate output + self-QA report. It executes; the human gates.
```

`.claude/commands/repurpose-livestream.md` (ORCHESTRATOR entry point): `model: opus`, `effort: medium`.

## APPENDIX B — the mental model (one slide)

> Orchestrator (Opus/medium) holds the plan + task list.
> ├─ delegates JUDGMENT → Fable/max advisor → returns a compact JSON plan
> └─ delegates EXECUTION → Opus/xhigh executor → returns mp4 + "gate: PASS" + QA
> The orchestrator keeps the ~1-2K reports; the 100K-220K working transcripts are thrown away.

## APPENDIX C — session facts to reference / show
- 1 livestream → 7 shorts, single session, 2026-07-09.
- ~11 sub-agent runs, 100K-224K tokens EACH, isolated from the main loop (~1.5M tokens total).
- Two dials: model (fable vs opus) and effort (low→max), set independently per agent.
- Definition-of-done = a mechanical gate script that must print PASS before an executor reports finished.
- The honest failure modes (great teaching): a fragile browser step needed tool-hardening before an
  agent could own it; a rule in the wrong skill file made agents over-cover the screen. Both fixed by
  putting robustness in the TOOL and rules in the CONTRACT the agent reads.

## APPENDIX D — pointers into the repo (for B-roll / screen-capture)
- Agents: `.claude/agents/{clip-strategist,tighten-strategist,remotion-builder}.md`
- Command: `.claude/commands/repurpose-livestream.md`
- Contract/gate the executor must pass: `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md`
  + `scripts/finalized_short_gate.py`
- Advisor/executor routing rationale: repo `CLAUDE.md` → "Advisor/executor model routing".

---

## NEXT STEP
Turn this outline into a script (per the ai-engineering pipeline: run the accuracy-pass skill on any
claims, then the screenplay). Keep the token table on screen as the proof beat; keep the two-dials
slide as the core teach.
