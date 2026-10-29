# growth-scale-up - BROLL-PLAN (acquisition + build worklists)
_Rendered 2026-10-28 from `COVER-PLAN.json` (the coverage-strategist's proposal, gated by Mike at GATE 3) by `scripts/render_cover_plan.py`. Format owner: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0. Every row is PLACED at the beat named, or marked REJECTED / BENCH: zero orphans. Status ticks are updated by the asset factory as it builds._

**Budget:** Envato video 12/12 · ChatGPT images 0/5. Envato 12/12 used (BR-1 to BR-12, each 2.08-4.0 s; BR-3 4.82 s and BR-10 4.19 s are the two leading-motion exceptions flagged lead: true, both under 5 s), ChatGPT 0/5 used (the screenplay's Mike-approved VISUAL-PLAN rules 'Envato b-roll only, no ChatGPT images needed' and the light 2023 kinetic look does not suit the Pixar house image; two slots are named in open_questions if Mike wants images). Receipts and code graphics are budget-exempt: 7 receipt captures (C6, C14, C14b, C15, C11, C12, C13), 2 diagrams (C1, C3), 8 card containers (K1, C2, K2, K3, C1-seats, L1, CHURN, L2). No asset appears twice: every BR-n, every receipt and every card id has exactly one slot except L2, whose five progressive returns are one declared anchor callback. Zero orphans: 33 consecutive cover beats tile every non-FACE second from 13.0 to 216.933 (13.0-23.4, 35.367-68.133, 73.833-99.6, 103.267-120.7, 125.567-138.567, 142.633-158.367, 161.867-216.933), every boundary is a FACE edge or a word boundary from the word JSON, no gap over 0.5 s, nothing past 229.72 s; the 216.933-229.715 tail is FACE window 8 to the last word. No title cards (every chapter OFF, one continuous bed) and no clip inserts, so no zero-length beats.

## CHAPTER THEMES (the visual differential per chapter, mirroring the music beds; Mike 2026-10-10)

_Each chapter lights its charts, slides, containers and title card with ITS accent (the locked stylesheet is otherwise unchanged; receipts and real marks keep their real pixels), and its ChatGPT images use ITS image style ('house' = the persona look). Envato video is not themed. The builders read the chapter off every row's beat._

| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 | #00c2ff (cyan (seat A, TEAM OF ONE; seat B TEAM OF FIVE = #ffd700 gold)) | none this video: Envato video only per the screenplay VISUAL-PLAN; if an image is ever added, flat vector / clean isometric on the light containers' warm off-white, never the Pixar house look | ONE bed, ONE look for the whole video; the differential is per SEAT, not per chapter: cyan #00c2ff (#006A9E on light containers) for everything TEAM OF ONE, gold #ffd700 (darkened on light containers) for everything TEAM OF FIVE, seat-neutral pops white with the drop shadow, the one punch word in the device's accent red. The two accents never swap. |
| CH2 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | none this video: Envato video only per the screenplay VISUAL-PLAN | same seat differential; C2 card fills in seat accent A, K2 card in seat accent B |
| CH3 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | none this video: Envato video only per the screenplay VISUAL-PLAN | same seat differential; C1 human nodes in accent A, the seats row in A and B |
| CH4 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | none this video: Envato video only per the screenplay VISUAL-PLAN | same seat differential; L1 is seat-neutral, the C14 paper panel is accent A, the BR-10 dark panel accent B |
| CH5 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | none this video: Envato video only per the screenplay VISUAL-PLAN | same seat differential; the C3 HUMAN node in accent A, the L2 seat tags in A and B |
| CH6 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | none this video: Envato video only per the screenplay VISUAL-PLAN | all FACE; the JUDGMENT payoff word in seat accent A with the glow |

## HOLDS before licensing (Mike rules at GATE 3)
- [x] ChatGPT images 0/5: the screenplay VISUAL-PLAN (approved at GATE 1) says Envato only and no images are needed; the 2023 light look would make a Pixar-style image an outlier. If you want images anyway, the two natural slots are BR-12 (the page grid at 201.56, a flat isometric grid of pages fanning out) and BR-2 (the agent screen at 16.5), each flipping an Envato clip to an image at the same seconds. **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): none: Envato only, no ChatGPT images on this video.**
- [x] Two leading-motion clips over 4 s (BR-3 at 4.82 s for the TEAM OF FIVE seat line, BR-10 at 4.19 s for 'that same doc keeps your people and their agents aligned'): confirm the lead: true exception, or the envato-sourcer cuts each at 4.0 s and the comp holds the seat panel's last frame for the remainder (0.82 s / 0.19 s). **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): the lead: true exception is approved for BR-3 (4.82 s) and BR-10 (4.19 s); no 4.0 s cut, no held frame.**
- [x] C14 own-repo receipt: DATA.md counted 29 agent definitions on 2026-10-25 and the count moves (the agents folder is edited every video). The spoken line says '29' and 'five'; the receipt will show whatever the count is on capture day, and the paper panel digits follow the receipt. If the count has drifted, decide: keep the spoken 29 with the real folder on screen (a visible mismatch), or re-record the one line. **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): count re-taken 2026-10-28: 29 agent definitions (`.claude/agents/**/*.md`), matches the spoken 29; the capturer re-checks on capture day and flags any drift.**
- [x] C1 state 4 is realised as a break-up container of the bottom seat row (C1-seats, 103.267-112.4), not a second showing of the full C1 (THE BALANCE; lint_slide_balance fails a deck slide shown twice). The screenplay wording was 'back onto C1, state 4'. Confirm the break-up. **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): the C1-seats break-up container is approved (THE BALANCE), no second showing of the full C1.**
- [x] L2 (the plays card) returns five times across CH5 (2.2 / 1.9 / 2.3 / 4.7 / 6.4 s) as the rapid-fire chapter's anchor; lint_covers will WARN container scatter and the comp declares it as a deliberate callback. Confirm, or collapse the three short returns into the receipts (the item pops then ride the receipt frames). **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): the five returns are a deliberate callback; the comp declares them.**
- [x] The optional C10 flash (Amplitude Custom Agents 'churn monitoring' template) under 'flags' is benched for pace; C7 Optimizely, C8 PostHog and C9 Clarity stay as the vendor marks on C3 only. Say the word if you want any of them as a 1.5 s flash. **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): C10 stays benched; C7 / C8 / C9 stay as vendor marks on C3 only, no flashes.**
- [x] Every receipt URL was opened on 2026-10-25 (DATA.md) and may have been restyled since; all seven captures carry verify: true and the capturer checks the quoted sentence is still on the page (Statsig page layout, the Evan Miller default inputs, the Stripe '8 tries within 2 weeks' default, the Google 'Last updated' date). **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): verify every quoted sentence at capture as planned.**
- [x] CH4 Beat 1: the Statsig receipt C6 comes in at 'That's low leverage' (116.1), a hair before the screenplay's 'writes a status update' cue (118.12), so the one-on-one clip stays under 4 s and the receipt gets a 4.6 s readable hold. Confirm the earlier entry. **RULED 2026-10-28 at GATE plan (Mike: proceed, the recommendation stands): the earlier entry at 116.1 is approved.**

## Envato video (12) - sourcing via `skills/envato-broll/SKILL.md` (agent: envato-sourcer)

| id | Beat (final spine) | Search query | Dur target | Motion | Status |
|---|---|---|---|---|---|
| BR-1 | CH1@13.0-16.5 | solo worker desk two monitors home office calm | 3.50s | any | ☑ sourced https://app.envato.com/search/stock-video/ac4c88db-8aa8-4fcb-ac8b-0fbd6dc5f20a?itemType=stock-video&term=person+working+alone+desk+two+monitors+home+office |
| BR-2 | CH1@16.5-18.58 | computer screen multiple chat windows AI assistant typing close up | 2.08s | any | ☑ sourced https://app.envato.com/search/stock-video/5f7d39d8-b71e-406c-ad44-cb717841ded1?itemType=stock-video&term=multiple+AI+chat+windows+computer+screen+close+up |
| BR-3 | CH1@18.58-23.4 | small team whiteboard meeting slow dolly push in five people | 4.82s | any | ☑ sourced https://app.envato.com/search/stock-video/c35359fb-5bc3-49db-9b5c-182d89304a40?itemType=stock-video&term=small+team+meeting+table+slow+push+in |
| BR-4 | CH2@35.367-39.36 | hand moving sticky notes whiteboard prioritization planning | 3.99s | any | ☑ sourced https://app.envato.com/search/stock-video/a88afd49-3203-46e3-a80f-4966e8624d07?itemType=stock-video&term=hand+moving+sticky+notes+whiteboard+prioritization |
| BR-5 | CH2@59.04-63.0 | startup team working laptops open office small group | 3.96s | any | ☑ sourced https://app.envato.com/search/stock-video/61c04ce3-cec7-4c7d-9ad8-ba441ab5a026?itemType=stock-video&term=startup+team+working+laptops+open+office |
| BR-6 | CH3@95.9-99.6 | scrolling long document laptop screen pages close up | 3.70s | any | ☑ sourced https://app.envato.com/search/stock-video/227f77ef-0cac-4e26-b135-f7501dbe6232?itemType=stock-video&term=scrolling+long+document+laptop+screen |
| BR-7 | CH4@112.4-116.1 | one on one meeting two people small table office conversation | 3.70s | any | ☑ sourced https://app.envato.com/search/stock-video/abd51f5f-c221-44c5-a09c-44a607c1c6c6?itemType=stock-video&term=one+on+one+meeting+two+people+office+table |
| BR-8 | CH4@125.567-129.4 | team planning whiteboard presenter pointing colleagues listening | 3.83s | any | ☑ sourced https://app.envato.com/search/stock-video/6e870a7a-46b3-4b32-a267-dfef4db98d07?itemType=stock-video&term=presenter+pointing+whiteboard+team+listening |
| BR-9 | CH4@129.4-132.46 | employee presenting at whiteboard manager listening nodding | 3.06s | any | ☑ sourced https://app.envato.com/search/stock-video/f1376236-3532-4a42-b4e1-366b51890b27?itemType=stock-video&term=employee+presenting+whiteboard+manager+nodding |
| BR-10 | CH4@154.18-158.367 | team looking at shared screen presentation meeting slow dolly in | 4.19s | any | ☑ sourced https://app.envato.com/search/stock-video/1c460216-b112-495a-b5ea-ca236c392b61?itemType=stock-video&term=team+looking+at+screen+meeting+dolly+in |
| BR-11 | CH5@192.86-196.86 | analytics dashboard monitor funnel chart office screen | 4.00s | any | ☑ sourced https://app.envato.com/search/stock-video/ff11afc5-fd22-44e7-9166-3bd35aae17d8?itemType=stock-video&term=analytics+dashboard+monitor+charts+office |
| BR-12 | CH5@201.56-204.0 | website pages grid multiplying browser windows animation sitemap | 2.44s | any | ☑ sourced https://app.envato.com/search/stock-video/edf25792-b91a-4662-b76f-465071ff7e39 |

## ChatGPT images (0) - house style: Pixar 3D CGI, deep navy near-black bg, rim light, no text (agent: image-gen)

_Every row whose beat names a REAL thing (token, project, company, person, product) carries a `Reference` path from `schedule-tweets/images/reference/`, or the explicit string `none exists (generic approved)`. Wording: use the REAL mark from the reference image; never invent one._

| id | Beat (final spine) | Prompt concept | Reference | Chapter style | Status |
|---|---|---|---|---|---|
| (none) | | | | | |

## RECEIPTS capture worklist (7) - real-site captures, verified opened (agent: receipt-capturer)

| id | Type | Claim it proves | Capture (URL + exact view) | Beats | Verify at capture | Status |
|---|---|---|---|---|---|---|
| C6 | R(other) | An agent writes the readout / status update: Statsig 'AI-Powered Experiment Summary' (12/19/2025), 'make a ship recommendation' | https://statsig.com/updates/update/ai_experiment_summary, desktop view, title + date + the 'make a ship recommendation' paragraph in one frame; treatment push | CH4@116.1-120.7 | yes | ☐ pending |
| C14 | R(other) | Mike's own content operation runs on 29 agent definitions in one folder (count re-taken on capture day) | local: VS Code explorer of C:/Users/mnede/Documents/Claude/social-media/.claude/agents/ fully expanded with the file count visible (explorer badge or a terminal count line in frame); treatment pan (library 3D pan) | CH4@142.633-151.1 | yes | ☐ pending |
| C14b | R(other) | with five human gates where judgment stays with me (the longform graph's 5 HITL gates) | local: repo-root CLAUDE.md in the editor at the 'Make a longform-edited video' row ('5 HITL gates (screenplay, spine, plan, blueprint, draft)'); treatment highlight on '5 HITL gates' | CH4@151.1-154.18 | yes | ☐ pending |
| C15 | R(other) | AI drafts more tests; it does not change the sample size a test needs (Evan Miller's calculator as it loads: 20% baseline, 5 points absolute MDE, 80% power, 5% significance, 1,030 per variation, the site's own numbers; corrected 2026-10-28) | https://www.evanmiller.org/ab-testing/sample-size.html AS IT LOADS (script running, defaults untouched), the inputs block + the per-variation result + the power and significance sliders in ONE 16:9 frame cropped tight to the content; treatment push to the figure | CH5@174.8-179.0 | yes | ☐ pending |
| C11 | R(other) | Flags who is likely to leave: Amplitude predictive cohorts 'forecast who is likely to convert, churn, or take an action' | https://amplitude.com/docs/analytics/behavioral-cohorts, crop to the predictive-cohort paragraph; treatment highlight on the sentence | CH5@180.88-184.1 | yes | ☐ pending |
| C12 | R(other) | Retries failed payments on the best schedule: Stripe Smart Retries 'Using AI ... chooses the best times', default '8 tries within 2 weeks' (on screen only) | https://docs.stripe.com/billing/revenue-recovery/smart-retries, the 'Using AI' paragraph and the recommended-default line in one frame; treatment highlight on 'chooses the best times' | CH5@184.1-186.9 | yes | ☐ pending |
| C13 | R(other) | Google's test is value to the user no matter how the page is made: spam policies, 'Scaled content abuse ... no matter how it's created' | https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse, the heading + definition paragraph; treatment highlight on 'no matter how it's created' | CH5@204.0-210.5 | yes | ☐ pending |

## CLIP INSERTS capture worklist (0) - a third-party clip plays with its OWN voice while the spine pauses; audio KEPT, context caption burned, words verified (agent: receipt-capturer; tool + rule: `skills/clip-inserts/clip-inserts.md`)

| id | Who / what plays | Source (URL + window) | Length | Splice at (final spine, after words) | Burned caption | Expect (Whisper) | Verify | Status |
|---|---|---|---|---|---|---|---|---|
| (none this video) | NONE: Mike ruled on 2026-10-25 that no third-party voice and no credit appears in this video (the four Capland clips in DATA.md section 6 and the unusable Altman clip are all out; SCREENPLAY CLIP-INSERTS = NONE, AS-RECORDED 'Clip inserts: none scripted'); the bed never dips and the continuous 2023 music pattern holds end to end. | | | | | | | |

## CHARTS build worklist (2) - Type 1 ANIMATED (code, animates for real) · Type 2 SYSTEM-DESIGN (code-rendered stills) (agent: chart-builder)

| id | Type | What moves / which states | Placement (beats) | Data source | Chapter accent | Status |
|---|---|---|---|---|---|---|
| C1-split-diagram | Type 2 SYSTEM-DESIGN | THE system-design diagram: STRATEGY -> EXECUTION -> ANALYSIS columns with owner badges HUMAN / AGENTS / AGENT DRAFTS, HUMAN DECIDES; verbs per column (what matters, which bets, what to stop + AI = SPARRING PARTNER; build variants, draft, instrument, ship; agent drafts the readout + SCRAP OR SCALE); three lit states on 74.12 / 81.58 / 86.12; bottom seat row dark (DATA.md C1, pillar 2) | CH3@73.833-90.48 | DATA.md | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| C3-experiment-loop-diagram | Type 2 SYSTEM-DESIGN | the experiment loop: MINE (sessions + funnel) -> BACKLOG (prioritized) -> PLAN (hypothesis, metrics, sizing) -> VARIANTS + FLAG -> READOUT -> HUMAN: SCRAP OR SCALE -> MINE; vendor marks Clarity / Amplitude; Optimizely; Optimizely; PostHog; Statsig / GrowthBook / PostHog; YOU; nodes light 164.28 / 166.94 / 168.64 / 169.66 / 171.56 / 172.34 (HUMAN in accent A) (DATA.md C3, pillar 6 play (a)) | CH5@164.06-174.8 | DATA.md | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |

## SLIDES build worklist (8) - TITLE SLIDES (no box) and CARD SLIDES (rounded card), locked stylesheet `skills/container-reference/container-canonical.css` (agent: slide-builder)

| id | Slide type | Eyebrow / headline / content | Placement (beats) | Chapter accent | Status |
|---|---|---|---|---|---|
| K1-better-move-card | CARD SLIDE | light card, seat-neutral: eyebrow THE BETTER MOVE, headline 'List the HIGHEST-IMPACT work', body 'the work that moves the business toward its growth goals' / 'then figure out how someone could spend their time on exactly that' (AS-RECORDED CH2 35.54; DATA.md pillar 1) | CH2@39.36-46.1 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| C2-agents-take-list | CARD SLIDE | kt-list-card on crumpled paper, light theme, seat accent A, header TEAM OF ONE + ONE PERSON icon, eyebrow WHAT THE AGENTS TAKE; six items with AAARRR sub-lines popping on their words: VARIANT COPY (ACQUISITION) 50.20 / ONBOARDING VARIANTS (ACTIVATION) 52.34 / WEEKLY FUNNEL READOUT (ALL) 53.78 / SESSION RECORDING REVIEW (ACTIVATION) 55.46 / CHURN FLAGS (RETENTION) 56.98 / FAILED PAYMENT RETRIES (REVENUE) 57.92; two columns of three (DATA.md C2, pillars 1 and 6) | CH2@46.1-59.04 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| K2-hire-into-impact-card | CARD SLIDE | light card, seat accent B, header TEAM OF FIVE + FIVE PEOPLE icon: headline 'HIRE INTO the highest-impact work', sub-line 'not the leftovers' (AS-RECORDED CH2 59.04; DATA.md pillar 1) | CH2@63.0-68.133 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| K3-anti-pattern-card | CARD SLIDE | light card, seat accent B header TEAM OF FIVE: eyebrow THE ANTI-PATTERN, headline 'A report prompts Claude or ChatGPT for a growth strategy' (AS-RECORDED CH3 90.48; DATA.md pillar 2; no page count) | CH3@90.48-95.9 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| C1-seats-row | CARD SLIDE | the BREAK-UP of C1's bottom row, enlarged: TEAM OF ONE + icon 'YOU HOLD THE STRATEGY' (accent A, lights 103.38) | TEAM OF FIVE + icon 'YOU WRITE THE GUARDRAILS: STRATEGY? EXECUTION? ANALYSIS?' (accent B, lights 105.72), a dimmed strip of the three column names above (DATA.md C1 bottom row) | CH3@103.267-112.4 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| L1-principles-list | CARD SLIDE | kt-list-card on crumpled paper, seat-neutral, header OPERATING PRINCIPLES, IN WRITING; items on their words: SPEED OR RIGOR 134.16 / POLISH OR ROUGH DRAFT 135.20 / SPEND OR PROTECT THE BUDGET 136.98 (DATA.md pillar 3, no count) | CH4@132.46-138.567 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| CHURN-agent-panel | CARD SLIDE | light card: eyebrow PLAY 2, CHURN AGENT + LIFEBUOY icon, lines FLAGS / RETRIES / DRAFTS (DRAFTS lights 186.90), bold YOU OWN THE TEMPLATE AND THE OFFER (lights 188.38) (AS-RECORDED CH5 179.18; DATA.md pillar 6 play (b), Open question 4) | CH5@186.9-190.58 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |
| L2-plays-list | CARD SLIDE | kt-list-card on crumpled paper, header THE PLAYS, four slots; items pop on their words: EXPERIMENT LOOP 163.06 / CHURN AGENT 179.92 / MONDAY DIGEST 191.74 / PROGRAMMATIC SEO 199.96; the NO STATUS / MEETING headline pop over the card at 197.78-198.94; FULL state with the TEAM OF ONE tag (210.72) and the FIVE PEOPLE icon + four owner marks (212.88). Five returns across CH5 = the chapter's declared anchor callback (SCREENPLAY CH5 L2) | CH5@161.867-164.06, CH5@179.0-180.88, CH5@190.58-192.86, CH5@196.86-201.56, CH5@210.5-216.933 | #00c2ff (cyan (seat A; seat B = #ffd700 gold)) | ☐ pending |

## Bench (swap-ins if a primary fails)

- CH1 0:13.00-0:16.50: envato: founder working alone at night laptop desk lamp
- CH1 0:16.50-0:18.58: envato: code terminal windows scrolling dark screen close up
- CH1 0:18.58-0:23.40: envato: startup team of five standing around table discussing slow push in; if no push-in exists, cut at 22.5 and hold the TEAM OF FIVE panel frame to 23.4
- CH2 0:35.37-0:39.36: envato: kanban board sticky notes close up team planning
- CH2 0:39.36-0:46.10: a second Envato clip (team ranking a backlog on a screen) if Mike prefers more motion here, at the cost of one clip elsewhere
- CH2 0:46.10-0:59.04: none needed (code-rendered, text-accurate); no b-roll reuse allowed here, so the card stays
- CH2 0:59.04-1:03.00: envato: five colleagues typing laptops coworking space
- CH2 1:03.00-1:08.13: holding BR-5 frozen is NOT allowed (rule #2); fallback is the K2 card with the headline only
- CH3 1:13.83-1:30.48: none (the two diagrams are the brief's allowed two); if C1 is cut by Mike, fall back to three single-point cards STRATEGY / EXECUTION / ANALYSIS spotlight-swapped on the same cues
- CH3 1:30.48-1:35.90: envato: person typing a prompt into a chatbot on a laptop (would be a 13th clip, over budget, so the card stays)
- CH3 1:35.90-1:39.60: envato: endless text pages scrolling monitor over shoulder
- CH3 1:43.27-1:52.40: re-showing the full C1 in state 4 (the screenplay's wording) is the bench ONLY if Mike overrules THE BALANCE; lint_slide_balance would flag the repeat
- CH4 1:52.40-1:56.10: envato: manager and employee talking across desk notebook
- CH4 1:56.10-2:00.70: C8 PostHog 'Analyze experiments with PostHog AI', the 'ship, extend, or stop' bullet (https://posthog.com/docs/experiments/analyze-experiments-ai)
- CH4 2:05.57-2:09.40: envato: manager explaining strategy whiteboard small team
- CH4 2:09.40-2:12.46: envato: young professional explaining chart to colleague office
- CH4 2:12.46-2:18.57: none needed (code-rendered)
- CH4 2:22.63-2:31.10: a terminal capture of the agent-file count (find .claude/agents -name '*.md' piped to wc -l) with the tree listing above it
- CH4 2:31.10-2:34.18: GRAPH-PROGRESS.json of this very project open in the editor, its gates block (screenplay / spine_review / spine approvals) as the proof the gates exist
- CH4 2:34.18-2:38.37: envato: colleagues gathered around monitor reading document push in; if no push-in exists, cut the clip at 158.18 and hold the panel frame 0.19 s
- CH5 2:41.87-2:44.06: none (the card is the chapter's anchor)
- CH5 2:44.06-2:54.80: none; if Mike keeps only one diagram, this beat rides L2 + flashes of C7 Optimizely / C8 PostHog with the FLASK icon (OPEN QUESTIONS 6)
- CH5 2:54.80-2:59.00: the Optimizely Experiment Planning agent doc, the 'statistical sizing guidance' line (https://docs.optimizely.com/agent-platform/docs/experiment-planning-agent)
- CH5 2:59.00-3:00.88: none
- CH5 3:00.88-3:04.10: C10 Amplitude changelog 'Custom Agents' (Jun 23, 2026), the 'churn monitoring' template line (https://amplitude.com/releases/custom-agents)
- CH5 3:04.10-3:06.90: the same page's 'Automate payment retries' heading block if the layout moved the default line
- CH5 3:06.90-3:10.58: stay on the C12 receipt (would push it to 6.5 s; a static page hold reads as a long still)
- CH5 3:10.58-3:12.86: none
- CH5 3:12.86-3:16.86: envato: business dashboard KPI charts laptop screen close up
- CH5 3:16.86-3:21.56: none
- CH5 3:21.56-3:24.00: envato: many web page thumbnails scrolling wall of screens; ChatGPT image candidate if Mike flips the no-image ruling (open_questions)
- CH5 3:24.00-3:30.50: the same page's 'Using generative AI tools or other similar tools to generate many pages without adding value for users' example bullet
- CH5 3:30.50-3:36.93: none

