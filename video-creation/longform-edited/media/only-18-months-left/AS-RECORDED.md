# only-18-months-left - AS-RECORDED (build the edit to THIS, not the plan)

_REFERENCE SHAPE (skills/doc-reference, 2026-09-27). Format owner: `screenplay.md` § "AS-RECORDED.md - the as-BUILT variant". Lint: `skills/doc-reference/lint_as_recorded.py` (run by the longform graph's `as_recorded` node). Quote what was SAID; only Whisper mishears are corrected; timecodes are FINAL-spine seconds; no em dashes._

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (compress to LOW BPS -> defumble -> cover-blackout -> coarse desilence 700 ms with Mike's 300 ms pad (`--pad-tail 0.2 --pad-head 0.1`, cover cuts only) -> burst removal x1 ("the actor", 0.90 s) -> two-zone desilence 500 ms CH1 / 700 ms body with the 300 ms pad -> Adobe Enhance on the audio (Speech v2 30 percent, background 20, music 10; no timing change) -> hand repair x1 (the clipped "nothing" restored, +0.233 s at 332.50)). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

- **Final spine:** `spine/ALL.f.restored.mp4` - 610.13s (10:10), 1080p30 (1920x1080, 30/1, 18,304 frames). LOCKED (GATE spine approved by Mike 2026-10-26).
- **Transcript (cue source):** `spine/ALL.f.restored.medium-words.json` (Whisper medium, word-level, 1,649 words, NOT hand-edited). Human-review breakdown: `spine/ALL.f.restored.segments.txt` (174 segments, the transcriber's corrections applied to its TEXT only).
- **Timecode chain:** `ALL.a.defumbled.mp4.spans.json` (LOW BPS -> a: the defumbler's removed spans) -> `ALL.b.blackout.mp4.cover.json` (a -> b: picture blacked on the cover spans, NO time change) -> `ALL.c.desilenced.map.json` (b -> c: coarse 700 ms, 1277.33 s -> 614.39 s) -> `ALL.d.cleaned.mp4.cuts.json` (c -> d: one burst cut 25.223-26.123, every c time >= 26.123 shifts -0.90 s; 615.16 s -> 614.28 s) -> `ALL.e.desilenced.map.json` (d -> e: two-zone final, 10 cuts, 4.36 s removed, 614.28 s -> 609.92 s) -> `ALL.f.restored.json` (e -> f: 7 frames / 0.233 s of `ALL.b.blackout.mp4` 700.700-700.933 INSERTED at e 332.500; t_e = t_f below 332.500, t_e = t_f - 0.233 from 332.733 on). The Adobe Enhance swap (`spine/enhance/`) replaced the audio only, same length, no remap. **Every timecode below is already a FINAL-spine (f) coordinate; the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `ALL.lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` (`c.desilenced.bak-burst` = byte copy) -> `d.cleaned` -> `e.desilenced` (Adobe-enhanced audio; the un-enhanced take kept as `enhance/ALL.e.desilenced.original-audio.*`) -> `f.restored`.

## FACE windows

From `blackdetect=d=0.3:pix_th=0.10` on `spine/ALL.f.restored.mp4` (non-black = FACE), probed 2026-10-26; identical to the transcriber's d=0.1 pass. Everything else is BLACK VIDEO and must be covered in the comp. 11 windows, 61.27 s: Face 10.0% / cover 90.0%. Zero orphans: every window lands on a scripted `[FACE]` beat, and all 11 scripted `[FACE]` beats have a window (budget `--face-max 12`, one spare). The final frame (610.100-610.133) is the duplicated last frame from the restore, not a window.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-4.167 | "AI came for the first wave of jobs and almost nobody noticed." | CH1 Beat 1 `[FACE]` (locked hook) |
| 2 | 37.133-43.233 | "My own call is 18 months and by then most of all desk work will be done by AI." | CH1 Beat 3 `[FACE]` |
| 3 | 45.967-55.033 | "Imagine a world where prices are so cheap that it's almost impossible to make enough money and have more left over to put it into investments." | CH1 Beat 4 `[FACE]` (locked paradox, camera shake 1) |
| 4 | 99.500-112.233 | "I used to pay $50 for a thumbnail whenever I wanted a higher quality thumbnail better than what I would normally do. Because I'm not a graphics guy personally. And I tell you this, I don't pay that anymore." | CH2 Beat 2 `[FACE]` (the thumbnail receipt) |
| 5 | 159.500-161.833 | "In my book, those jobs are already gone." | CH2 Beat 2 `[FACE]` (the verdict, camera shake 2) |
| 6 | 165.667-171.833 | "With AI in my editing process, I get the job done in about a fifth of the amount of time that I used to." | CH3 Beat 1 `[FACE]` |
| 7 | 328.367-332.733 | "If there's no job at the end of it, those four years, buy you nothing." | CH5 Beat 2 `[FACE]` (window includes the restored "nothing") |
| 8 | 433.267-438.733 | "If your job is reading documents and writing documents, then your job is on this list." | CH6 Beat 5 `[FACE]` |
| 9 | 442.167-447.533 | "The real cost of healthcare is people needing it. But if you don't get sick, you don't need to pay." | CH7 Beat 1 `[FACE]` |
| 10 | 544.400-547.333 | "The money doesn't vanish from healthcare, it moves." | CH7 Beat 4 `[FACE]` |
| 11 | 566.167-568.733 | "own the assets before the paychecks run out." | CH8 Beat 1 `[FACE]` (the coin names before it, 564.09-566.07, are COVER) |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build. Lines 1 to 20 are the transcriber's list (already applied in `segments.txt`); the rest are added here.

- 84.84 "chat GPT" -> "ChatGPT" (spelling).
- 124.00 "The brief, the weight" -> "The brief, the wait" (homophone; the keyword pop must read WAIT).
- 136.28 "mid-journey" -> "Midjourney" (spelling).
- 138.94 "mid-journey" -> "Midjourney" (spelling).
- 180.62 "El Eternada" -> "El Eternauta" (proper name, the Netflix series; also the CLIP-5 set-up end).
- 223.95 "Particle 6" -> "Particle6" (studio name, one word; also the CLIP-4 set-up end).
- 247.55 "Pinnacle 6" -> "Particle6" (proper name).
- 235.81 "Elin van de Velen" -> "Eline Van der Velden" (proper name).
- 280.29 "Run the information" -> "One, the information" (the numbered first argument; matches "Two," at 290.01).
- 331.85 "are you nothing" -> "buy you nothing" (confirmed by the `ALL.f.restored.json` Whisper verify).
- 334.17 "selling man name first" -> "Suleyman named first" (proper name).
- 372.25 "selling man's" -> "Suleyman's" (proper name). NOT 537.01 "selling the cures", which is correct as spoken.
- 455.99 "John Hopkins" -> "Johns Hopkins" (spelling).
- 480.41 "Croic hepatitis" -> "chronic hepatitis".
- 492.51 "stoff magnetic" -> "soft magnetic".
- 513.41 "Science is called" -> "Scientists call".
- 527.59 "Albie de Grey" -> "Aubrey de Grey" (proper name).
- 565.25 "Casper" -> "Kaspa" (persona kaspa_spelling).
- 565.83 "Tao" -> "TAO" (persona tao_spelling).
- 575.31 "Crypto Rich" -> "CryptoRich" (Mike's group, one word).
- 19.24 "There already came" -> "It already came" (word prob 0.29; the script line and the PROJECT-LOG transcriber flag read "It"; confirm by ear at captions).
- 284.87 "a 20-month model" -> "a $20-a-month model" (the scripted figure, the ChatGPT Plus price; the JSON has "20" + "-month" with no "dollar" token, so CHECK BY EAR at captions: if he truly said "20-month", caption it as said and flag it, never print "20-month model" as a fact).
- 333.79 "the job's" -> "the jobs" (plural, not a possessive).
- 360.95 "had its graduate intake" -> keep "had" unless the ear says "cut" (the script reads "cut"; transcriber flag, ambiguous).

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE ROLL CALL (0.00-70.88) · card OFF · Bed A (`harvester` INTRO section, Mike 2026-10-26)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "AI came for the first wave of jobs and almost nobody noticed." | KEPT (locked `[SAY-EXACT]` FACE 1; minor wording drift: "already" not said, "AI came for" for "AI already came for") |
| 4.24 | "The next wave has a date on it." | KEPT (locked `[SAY-EXACT]` COVER, verbatim; H0 cues to "date") |
| 6.66 | "Last video, I showed you the robots coming for the cashier, the trucker, the warehouse, the electrician, the plumber, all the way up to the brain surgeon." | KEPT (verbatim; the video's one robot callback) · guard [!WARNING 4 roll-call labels] HELD (spoken shorthand only, the labels carry the BLS categories) · guard [!WARNING 11 spent] HELD |
| 17.46 | "But the brain went first." | KEPT |
| 19.24 | "There already came for the writer and the designer and now it's coming for the editor, the accountant and the lawyer." | CHANGED ("the actor" cut as a burst at the spine_review gate, Mike's ruling; "There" is the Whisper text, see mishears) |
| 26.08 | "In February, the CEO of Microsoft AI, Mustafa Suleyman, put a clock on it." | KEPT (verbatim) · guard [!WARNING 1 Suleyman tasks] HELD (names him and the date) |
| 32.26 | (clip insert CLIP-1 lands here; the set-up line ends "...Mustafa Suleyman, put a clock on it.") | KEPT · INSERT CLIP-1 (15.6 s, the speaker's own voice; the splice is the trough after "it." 32.26, next word "That" at 32.34: only 80 ms of trough, dry-run lint-pause-silence before the bake) |
| 32.34 | "That was February, so his clock runs out next year." | KEPT (verbatim) · guard [!WARNING 1] HELD ("That was February") |
| 37.14 | "My own call is 18 months and by then most of all desk work will be done by AI." | CHANGED (FACE 2; "most of all desk work will be done by AI" for "most of the work done at a desk gets done by AI"; "my own call" kept) · guard [!WARNING 1] HELD (18 months said as his forecast) |
| 43.26 | "And here's the part that has me on edge." | CHANGED ("has me on edge" for "scares me") |
| 46.06 | "Imagine a world where prices are so cheap that it's almost impossible to make enough money and have more left over to put it into investments." | CHANGED (locked `[SAY-EXACT]` FACE 3 reworded: "it's almost impossible to make enough money and have more left over to put it into investments" for "you can't possibly earn enough money to invest"; the camera shake was cued on "can't possibly", re-cue it to "almost impossible" 49.74-50.72) |
| 54.96 | "Because the paychecks disappear before the prices do. And the only people who make it through are the ones who already own assets today." | KEPT (locked `[SAY-EXACT]` COVER; minor wording drift: "own assets today" for "own the assets"; H1 cues "paychecks" 55.80, "prices" 57.80, "assets" 63.06) |
| 64.58 | "I'm going job by job and I'm putting a risk level on every one." | KEPT (verbatim) |
| 68.78 | "So let's get into the weeds a bit." | CHANGED (handoff "get into the weeds a bit" for "So, let's dive into all this.") |

### CH2 - ALREADY GONE: COPYWRITERS AND GRAPHIC DESIGNERS (70.88-162.00) · card ON "ALREADY GONE" · Bed B (`harvester` full cut)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 70.88 | "Start with the copywriters. Ads, blogs, product pages, emails." | KEPT |
| 75.82 | "A $20 a month model writes the first draft of all of it in seconds." | KEPT |
| 80.78 | "So the work didn't vanish. It got cheap." | CHANGED ("and it got scarce" not said) · guard [!WARNING 3 already gone as fact] HELD (never "zero") |
| 83.38 | "Within eight months of ChatGPT, freelance posts for writing and coding work dropped 21% compared with hands-on work." | KEPT ("writing and coding" said, as the DATA row requires) |
| 92.32 | "And the US government projects zero growth for writers. And it names a reason, artificial intelligence." | KEPT (minor wording drift: "a reason" for "the reason") |
| 99.48 | "I used to pay $50 for a thumbnail whenever I wanted a higher quality thumbnail better than what I would normally do. Because I'm not a graphics guy personally. And I tell you this, I don't pay that anymore." | CHANGED + AD-LIB (FACE 4, 12.73 s, the longest face hold: "a guy ... for every thumbnail ... I don't pay him" became "$50 for a thumbnail whenever I wanted a higher quality thumbnail"; "Because I'm not a graphics guy personally" and "And I tell you this" are ad-libs) |
| 112.12 | "I make them now myself on one small subscription. And I could make hundreds of graphics a month if I wanted to." | KEPT (minor wording drift; "if I wanted to" added) |
| 121.00 | "Think about what that replaced. The brief, the wait, the revisions, the invoice." | KEPT (keyword pops: brief 123.08, wait 124.00, revisions 124.82, invoice 125.96) |
| 126.76 | "All could have taken days for a single thumbnail going back and forth on a freelance site." | AD-LIB (not in the script) |
| 132.38 | "Now it's a prompt, a few seconds. And you have services like Midjourney starting at $10 a month." | CHANGED ("you have services like Midjourney starting at" for "Midjourney starts at") |
| 138.42 | "I don't use Midjourney, but I'm just saying." | AD-LIB (not in the script; see Flags: C8 must not imply his subscription is Midjourney) |
| 140.28 | "In 2025, the World Economic Forum put graphic designers just outside of its top 10 fastest declining jobs for the first time ever. In the edition before, it had them growing." | KEPT |
| 154.02 | "And freelance posts for image work fell 17% once the image generators showed up." | KEPT (verbatim) |
| 159.48 | "In my book, those jobs are already gone." | KEPT (FACE 5; "those jobs" for "that job"; camera shake 2 on "gone" 161.58) · guard [!WARNING 3] HELD ("In my book") |

### CH3 - NEXT: VIDEO EDITORS (162.00-215.33) · card ON "NEXT ON THE LIST" · Bed C (`leatherface`)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 162.00 | "Next, video editors. And I know this one from the inside." | KEPT (minor wording drift) |
| 165.44 | "With AI in my editing process, I get the job done in about a fifth of the amount of time that I used to." | CHANGED (FACE 6; "in my editing process, I get the job done in about a fifth of the amount of time" for "in my edit, I finish a video in around a fifth of the time"; keyword pop "A FIFTH OF THE TIME" on "fifth" 170.16) · crypto-channel rule (no pipeline detail) HELD |
| 171.96 | "And the studios are doing it too." | KEPT |
| 173.94 | "Here's Netflix on its July 2025 earnings interview. About a scene in its own series, El Eternauta." | KEPT ("El Eternauta" is the corrected text, see mishears) |
| 181.24 | (clip insert CLIP-5 lands here; the set-up line ends "...about a scene in its own series, El Eternauta.") | KEPT · INSERT CLIP-5 (9.2 s, the speaker's own voice; the splice is the trough after "Eternauta" 181.24, next word "That" at 181.68) · guard [!WARNING 9 Netflix 10x] HELD (the set-up never says "10 times faster") |
| 181.68 | "That was a visual effects shot, not an edit. But it's in the same post-production pipeline. And it's only getting faster." | KEPT |
| 190.00 | "Here's the thing. The government still projects editor jobs to grow about 4%." | KEPT ("about" added) |
| 195.33 | "I think that's wrong. From what I see in my own editing process, I give this job 18 months." | KEPT (minor wording drift: "editing process" for "edit") · guard [!WARNING 3 editors] HELD (his call, next to the BLS line) |
| 201.31 | "I do believe there is going to be a demand for a human touch in the editing process. So the job might not entirely disappear. But new jobs in that field will be just so rare that you might as well just call it dead." | AD-LIB (not in the script; a counterweight plus a verdict, said as his opinion; see Flags) |

### CH4 - NEXT: ACTORS AND MODELS (215.33-276.65) · card OFF · Bed C continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 215.33 | "Now, actors and models. This is where it gets creepy." | KEPT (minor wording drift) |
| 219.19 | "This is a comedy sketch from July of 2025. Made by an AI studio called Particle6." | KEPT |
| 224.91 | (clip insert CLIP-4 lands here; the set-up line ends "...made by an AI studio called Particle6.") | KEPT · INSERT CLIP-4 (10.1 s, the speaker's own voice; the splice is the trough after "Particle6" 224.91, next word "Nobody" at 225.21) |
| 225.21 | "Nobody is real in that clip. Not the faces, not the voices, not the actresses, and not the actress they're talking about. Tilly Norwood." | CHANGED ("not the actresses" added) |
| 233.57 | "Two months later, her creator, Eline Van der Velden, presented Tilly at the Zurich Summit." | KEPT (name corrected, see mishears) |
| 239.11 | (clip insert CLIP-3 lands here; the set-up line ends "...presented Tilly at the Zurich Summit.") | KEPT · INSERT CLIP-3 (11.9 s, the speaker's own voice; the splice is the trough after "Summit" 239.11, next word "The" at 239.41) |
| 239.41 | "The actors union fired back and said she's not an actor. She's a character generated by a computer program." | KEPT |
| 246.41 | "And in July, Particle6 announced a feature film with Tilly in the lead. It's in development." | KEPT · guard [!WARNING 9 Tilly] HELD (no agency signing, "in development") |
| 252.89 | "And the models? H&M signed up 30 real models to be cloned into AI twins." | KEPT |
| 258.77 | "Guess ran AI-generated models in Vogue." | KEPT |
| 261.85 | "And Coca-Cola made its holiday ad with AI two years in a row. And says the first one cost a tenth of what it used to." | KEPT · guard [!WARNING 9 a tenth] HELD (Coca-Cola is the subject of "says") |
| 269.69 | "And in April, China approved its first AI-made feature film for cinemas. 90 minutes long." | KEPT |

### CH5 - UNIVERSITIES (276.65-332.89) · card OFF · Bed C continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 276.65 | "Now, universities. And I see two arguments against them." | KEPT |
| 280.29 | "One, the information." | KEPT ("One," corrected from "Run", see mishears) |
| 282.69 | "Everything a lecture hall teaches, a 20-month model will explain. At three in the morning, as many times as you need." | KEPT (Whisper text "20-month"; scripted "20 dollar a month": check by ear, see mishears) |
| 290.01 | "Two, what are you even preparing for?" | KEPT |
| 292.41 | "Recent college grads are already at around 5.6% unemployed. And 42% of them are working in jobs that don't need a degree." | KEPT (minor wording drift: "unemployed" for "unemployment") |
| 302.01 | "Meanwhile, private university runs around $45,000 a year in tuition alone. That's $180,000 over four years before the dorm." | KEPT |
| 311.89 | "And Americans owe $1.65 trillion in student loans." | KEPT |
| 316.51 | "Now, people are still enrolling. But computer science enrollment is falling at every level." | KEPT · guard [!WARNING 7 enrollment] HELD |
| 321.93 | "And in China, universities are cutting language and translation programs. And adding AI majors." | KEPT · guard [!WARNING 7 China] HELD (no "12,000") |
| 328.41 | "If there's no job at the end of it, those four years, buy you nothing." | KEPT (FACE 7, verbatim; "nothing" restored by Mike's hand repair 2026-10-26) |

### CH6 - ACCOUNTANTS AND LAWYERS: THE RISK LEVELS (332.89-438.95) · card OFF · Bed C continues

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 332.89 | "Now, the jobs Suleyman named first. Lawyers and accountants. One card at a time." | KEPT ("jobs" and "Suleyman" corrected, see mishears) |
| 338.53 | "Bookkeepers first. There are around 1.5 million of them." | KEPT |
| 342.71 | "And the government projects that job to shrink around 6% because software already automated a lot of it." | KEPT (minor wording drift: "around 6%", "a lot of it") |
| 349.85 | "Risk level shrinking now." | KEPT (RL-6 MELT on "shrinking now") |
| 352.37 | "Accountants and auditors. Around 1.6 million. Goldman Sachs put them on its higher risk list." | KEPT |
| 358.89 | "And KPMG in the UK had its graduate intake from 1,399 down to 942. With AI, one of the reasons." | CHANGED ("had ... down to" for "cut ... to"; check "had" by ear) · guard [!WARNING 5 KPMG] HELD (no 29 percent, "AI one of the reasons" said) |
| 369.09 | "Risk level, entry level jobs go first. On Suleyman's 12 to 18 month clock." | KEPT (RL-7 card still needs Suleyman's name or MIKE'S CALL, PROJECT-LOG open flag) |
| 375.03 | "Paralegals, 404,000. Zero growth." | CHANGED ("404,000" said for the scripted "404,900"; see Flags) |
| 378.95 | "Again, the government names AI as what's holding it back. Risk level, stalled." | KEPT · guard [!WARNING 6 paralegals] HELD (BLS, never Microsoft) |
| 385.55 | "And lawyers, 863,700." | KEPT |
| 389.45 | "Back in 2023, Goldman estimated 44% of legal tasks could be automated by AI." | KEPT |
| 395.99 | "And Harvey, a legal AI company, says that 80% of the top 100 US law firms already use it." | KEPT · guard [!WARNING 6 Harvey] HELD ("Harvey ... says") |
| 403.55 | "And here's what people tend to miss. When you picture a lawyer, you picture a courtroom. But a lot of legal work never sees a judge." | KEPT (Mike's added line; minor wording drift: "people tend to miss") |
| 411.47 | "It's a lawyer working for a company drafting contracts, reviewing agreements, writing the fine print that nobody reads." | KEPT (minor wording drift) |
| 418.17 | "That's paperwork. And paperwork is exactly what AI eats." | KEPT (`hw-word-pop` "PAPERWORK" on 418.63) |
| 422.11 | "Now, on paper, lawyer jobs are still growing, but the work changes. And in my book, the headcount follows." | CHANGED ("the work changes" for "the work changes first") · guard [!WARNING 6 lawyers] HELD (never "shrinking") |
| 430.63 | "Risk level, the work changes first." | KEPT |
| 433.41 | "If your job is reading documents and writing documents, then your job is on this list." | KEPT (FACE 8; minor wording drift: "then your job is" for "you're") |

### CH7 - HEALTHCARE GETS CHEAPER (438.95-547.51) · card ON "THE FLIP SIDE" · Bed D (`a-most-unusual-discovery`)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 438.95 | "Okay, so here's the flip side. And it's a big one." | KEPT ("Okay, so" for "Now,") |
| 442.29 | "The real cost of healthcare is people needing it. But if you don't get sick, you don't need to pay." | KEPT (FACE 9; minor wording drift: "people needing it", "don't need to pay") |
| 447.75 | "Look at just the last 30 days." | KEPT (verbatim; date-bound, see Flags) |
| 449.99 | "On October 8th, a rejuvenation therapy reported its first human results." | KEPT · guard [!WARNING 8 medical] HELD (never "reversed aging") |
| 454.67 | "On October 12th, Johns Hopkins showed robots around the length of a grain of rice. They carry antibiotics straight to an infected heart." | KEPT · guard [!WARNING 8] HELD (grain-of-rice LENGTH, the Hopkins heart robots) |
| 462.57 | "If they work in people, four to six weeks of treatment could become a single day." | KEPT (conditional held) |
| 467.35 | "On October 19th, an immunotherapy where, for one type of rectal cancer, most patients skip surgery, chemo, and radiation." | KEPT ("skip" for "skipped"; the doubled "most" was defumbled out) · guard [!WARNING 8] HELD (never "cured") |
| 476.95 | "On October 20th, the first drug of its kind in chronic hepatitis B, where around one in five patients could stop treatment and keep the virus under control." | KEPT ("in" for "for") · guard [!WARNING 8] HELD (no cure wording) |
| 487.85 | "And one of my favorites from last year, the University of Waterloo built soft magnetic robots that can go inside of you and dissolve kidney stones." | CHANGED ("can go inside of you and dissolve kidney stones" for "get steered to one type of kidney stone, and dissolve it"; "one of my favorites" for "my favorite") · guard [!WARNING 8 Waterloo] HELD ("dissolve", "from last year", the next line says "tested in a model"), see Flags |
| 497.45 | "Tested in a model so far." | KEPT |
| 499.39 | "Every one of these is early or narrow, but put them together and the bill for staying healthy could start to drop." | KEPT (the chapter's one caveat line) |
| 506.23 | "And then there's the big one." | KEPT |
| 508.27 | "Right now, medicine gives you back around four months of every year we age." | CHANGED ("by Ray Kurzweil's count" NOT said) · guard DATA do-not-air "we gain back 4 months a year now (as a plain fact)" BROKEN at 508.27: OPEN for Mike, see Divergences |
| 513.41 | "Scientists call the next step, longevity escape velocity. It's a point where, for every year you live, medicine gives you back more than a year." | KEPT ("Scientists call" corrected, see mishears; `hw-word-pop` "ESCAPE VELOCITY" 514.81) |
| 522.09 | "Ray Kurzweil puts that somewhere around 2029 and 2035." | KEPT (minor wording drift: "around ... and" for "between ... and") |
| 527.59 | "Aubrey de Grey gives it even odds by late 2030s. Either way, it's within our lifetimes." | KEPT · guard DATA do-not-air "2033" / "live forever" HELD |
| 532.93 | "And here's what that does to money. Biotech goes through the roof, selling the cures and the therapies, and the hospital bed sits empty because of fewer people getting sick enough to need one." | KEPT (minor wording drift: "and" for "But", "because of fewer people getting") |
| 544.55 | "The money doesn't vanish from healthcare, it moves." | KEPT (FACE 10) |

### CH8 - OWN ASSETS. CRYPTO. FIND YOUR PEOPLE (547.51-610.13) · card ON "OWN THE ASSETS" · Bed E (`deceptive-cadence`)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 547.51 | "So where does this leave you?" | CHANGED (a question for "So here's where this leaves you.") |
| 549.43 | "Your labor is worth a little less every month." | KEPT (verbatim) |
| 552.17 | "The way through is to own things AI make more valuable, productive assets, and crypto, the one asset you can own from your phone with no gatekeeper." | KEPT (minor wording drift: "own things AI make more valuable", as said; keyword pops "PRODUCTIVE ASSETS" 555.83, "CRYPTO: NO GATEKEEPER" 557.51) |
| 561.71 | "I showed you some of my favorites in my last video. Bitcoin, Kaspa, and TAO" | CHANGED ("some of my favorites in my last video" for "mine last video"; coin marks on 564.09-566.07, COVER) |
| 566.07 | "own the assets before the paychecks run out." | KEPT (FACE 11, verbatim) |
| 568.95 | "And don't go through this alone. Get into a group of like-minded people who can see this coming." | KEPT (minor wording drift: "who can see") |
| 574.57 | "A group like CryptoRich, which is my group. A group of people who are going to stay ahead of the game." | AD-LIB (not in the script; names the group, matches the planned CryptoRich screens cover) |
| 579.73 | "So in a nutshell, in my book, writers and designers already gone. Editors and actors next." | KEPT · guard [!WARNING 3] HELD ("in my book") |
| 587.67 | "Universities, accountants, and lawyers on the clock. Healthcare could get a lot cheaper, and the way through this all is through owning assets." | KEPT (minor wording drift: "and the way through this all is through" for "but the way through is") |
| 596.39 | "Drop a comment below and let me know which job you think goes next." | CHANGED ("Drop a comment below and let me know" for "Comment below, and tell me") |
| 600.45 | "And click that like button if you like this content and subscribe if you're not subscribed." | CHANGED (persona CTA reworded; `hw-subscribe-like-bell` cues "subscribe" 603.23) |
| 605.65 | "And once again, click that link in the description to be involved in the greatest community ever." | CHANGED ("be involved in the greatest community ever" for "get involved in the best community ever"; the spine ends on "ever." 609.91) |
| 609.91 | (not said) | DROPPED: "I'm gonna catch you guys, later." (Bed E's epic_hit was right-aligned to "later.") |

## Divergences from SCREENPLAY.md

- **Dropped:** (1) 19.24 "the actor" in the roll-call line: RESOLVED by Mike 2026-10-26 (cut as a burst at the spine_review gate). (2) 80.78 "and it got scarce": OPEN (no ruling; the guard still holds without it). (3) 508.27 "by Ray Kurzweil's count": OPEN (see Guards). (4) 609.91 the sign-off "I'm gonna catch you guys, later.": OPEN (the take ends on "...the greatest community ever."; PROJECT-LOG 2026-10-26 noted it, no ruling yet; the edit re-aligns Bed E's epic_hit to "ever." unless Mike rules otherwise). The radiology beat and CH4 Beat 4 were cut from the screenplay before the take, so nothing is missing there: RESOLVED by Mike 2026-10-26.
- **Added (ad-libs):** 99.48 the longer thumbnail receipt on FACE 4 ("whenever I wanted a higher quality thumbnail ... Because I'm not a graphics guy personally. And I tell you this") · 126.76 "All could have taken days for a single thumbnail going back and forth on a freelance site." · 138.42 "I don't use Midjourney, but I'm just saying." · 201.31 the human-touch line and "you might as well just call it dead" · 574.57 the CryptoRich line. All OPEN for Mike's spine gate as rulings only; the spine is approved with them in it and nothing is proposed for cutting (house rule: a long ad-lib is content, not overrun).
- **Changed locked lines:** 46.06 the locked paradox `[SAY-EXACT]` was reworded on the take ("almost impossible to make enough money and have more left over to put it into investments"): OPEN (the camera-shake cue moves to "almost impossible"; H1 is unaffected, its cue words are in the next line). 0.00 the hook dropped "already": OPEN (no cue depends on it).
- **Guards:** [!WARNING 1] Suleyman tasks / 18 months: HELD at 26.08, 32.34, 37.14. [!WARNING 2] Amodei: HELD (not mentioned). [!WARNING 3] already gone as a fact / editors replaced now: HELD at 159.48 and 579.73 ("in my book"); 209.79 "you might as well just call it dead" is his opinion after the BLS line, HELD but flagged. [!WARNING 4] roll-call labels: HELD (on-screen only). [!WARNING 5] KPMG / CPA: HELD at 358.89. [!WARNING 6] paralegals / lawyers / Harvey: HELD at 378.95, 422.11, 395.99. [!WARNING 7] enrollment / China: HELD at 316.51, 321.93. [!WARNING 8] medical list: HELD at 449.99 to 497.45. [!WARNING 9] actors, Tilly, Coca-Cola, Netflix: HELD at 246.41, 261.85, 181.24. [!WARNING 10] Shapiro numbers: HELD (none said). [!WARNING 11] spent material: HELD (one callback, 6.66). DATA do-not-air "we gain back 4 months a year now (as a plain fact)": BROKEN at 508.27 (Kurzweil is first named at 522.09, one line later): OPEN for Mike (options are his: accept with the C35 dial labelled "TODAY (KURZWEIL)" on screen during the line, or a pickup).
- **Clip inserts (Convention 6):** CLIP-1 set-up line said -> KEPT at 32.26 · CLIP-5 set-up line said -> KEPT at 181.24 · CLIP-4 set-up line said -> KEPT at 224.91 · CLIP-3 set-up line said -> KEPT at 239.11. CLIP-2 and CLIP-6 REJECTED in the screenplay, CLIP-7 dropped with the radiology beat (Mike 2026-10-26). The four rows went through GATE screenplay as PROPOSED with no row-level ruling in PROJECT-LOG: per-row confirmation OPEN at GATE plan (CLIP-3 is the screenplay's first to drop).

## Flags carried into the edit

- 375.03 fact-framing trap: the VO says "404,000" paralegals; the RL-8 card must show the BLS figure "404,900" (DATA Pillar, BLS OOH), never copy the spoken round number.
- 508.27 fact-framing trap: the VO says "around four months of every year we age" with no attribution; C35 state 1 must carry "TODAY (KURZWEIL)" on the dial while the line plays (DATA do-not-air row; [VERIFY] Kurzweil's 4 months still open, the interview itself was never opened).
- 522.09 the VO says "somewhere around 2029 and 2035"; C35 state 3 shows "KURZWEIL 2029 TO 2035" ([VERIFY] against the 2024 Economist piece, still unopened).
- 487.85 fact-framing trap: the VO says the Waterloo robots "can go inside of you and dissolve kidney stones"; C30 must carry the "2025" tag and "TESTED IN A 3D-PRINTED MODEL, URIC ACID STONES" so it never reads as treating patients (DATA do-not-air row).
- 132.38 / 138.42: Mike says he does NOT use Midjourney. C8's price card must not read as his own subscription being Midjourney: show "$50 A THUMBNAIL" struck through and Midjourney as "services like", or use the ChatGPT Plus $20 row DATA C8 already allows.
- 467.35 the VO says "most patients skip"; the card keeps "ONE TUMOR TYPE" and never "cured" (FDA: nearly three-quarters, interim, dMMR / MSI-H only).
- 19.24 the roll-call ACTORS hit (C1 ROLL 2) no longer has a spoken word since "the actor" was cut; the hit plays on the list or drops (edit-plan call, OPEN).
- 46.06 the camera shake 1 cue word "can't possibly" was not said; re-cue on "almost impossible" (49.74-50.72).
- 609.91 the take ends on "ever." with no "later."; Bed E right-aligns its epic_hit to 609.91, and the end card plan follows the last word (house rule: end on the last word).
- 605.65 "once again, click that link" has no earlier link mention in the spine; as said, the community lower-third lands on it.
- 32.26 the CLIP-1 splice trough is only 80 ms ("it." 32.26 to "That" 32.34): run `lint-pause-silence.py` on the source spine before the bake; the other three troughs are 300 to 440 ms.
- Ambiguous audio / low-confidence words (check at captions): 19.24 "There" (0.29) · 284.87 "20-month" · 360.95 "had" · 222.01 "Made" (0.05) · 339.95 "are" (0.26) · 476.95 "On" (0.22) · 515.41 "escape" (0.21) · 590.73 "Healthcare" (0.01) · 40.48 "most of all desk work" (as heard).
- `[VERIFY]` items from DATA.md still open at render: ChatGPT Plus $20 a month · Midjourney Basic $10 a month · NY Fed recent grads 5.6 / 42 percent (quarterly) · student debt $1.65 trillion (the 2026:Q3 report lands in November) · Seedance 2.0's February 2026 date (C17) · CLIP-5's speaker on the frame at capture · Kurzweil's 4 months a year and his 2029 to 2035 window (C35) · "the last 30 days" (447.75) holds only until around 2026-11-07 · RL-7 "12 TO 18 MONTHS" carries Suleyman's name or MIKE'S CALL.
- Runtime measured: 10:10 (610.13 s) of spoken spine against the around 8:00 target (screenplay estimate 8:42); plus the four clip inserts (46.8 s) and four title-card pauses, around 11:00 delivered (measurement only).
