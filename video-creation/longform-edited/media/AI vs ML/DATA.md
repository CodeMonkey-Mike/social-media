# AI vs ML: DATA (research dump; every number carries a source)
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift, re-pull before recording/render._
_Compiled 2026-11-09 for the LOCKED brief "AI Engineer vs ML Engineer" (target 2:15, hard window 1:45 to 2:29, AI Engineering Simplified channel, full-screen gated face, kinetic-text-2023 theme, the money angle paid off honestly). Spelling per persona. No em dashes._

_REFERENCE SHAPE (skills/doc-reference, 2026-09-17). Every row: statement · source URL (opened, not just found) · read date · confidence. Nothing here is invented; not found = Open questions._

**Source access notes (read before citing):**
- **Levels.fyi** pages opened via WebFetch (raw curl returns an empty body to scripts). The ML Engineer US figure read slightly differently on two pages the same day: `/t/software-engineer/title/machine-learning-engineer` read a median of $285,800, the `/locations/united-states.md` page read $287,500 (same 1,012 data points, same percentiles). This file uses the US-location page ($287,500) and tags every Levels.fyi number [VERIFY].
- **Glassdoor** returned HTTP 403 (`glassdoor.com/Salaries/ai-engineer-salary-SRCH_KO0,11.htm`). No Glassdoor number appears in this file.
- **Indeed salary pages:** `indeed.com/career/ai-engineer/salaries` actually reports the title **"AI Developer"**, not AI Engineer (the page says so). Labelled that way below.
- **Indeed Hiring Lab** redirects twice (hiringlab.org to hiringlab.indeed.com, then trailing slash); the final page was opened.
- **anthropic.com/careers/jobs/<id>** 307-redirects to `job-boards.greenhouse.io/anthropic/jobs/<id>`; the Greenhouse page was opened and is the citation.
- **O'Reilly** book page returned 403; the AI Engineering vs ML Engineering passage was read on the Pragmatic Engineer excerpt (published with the author, Chip Huyen, as co-byline).
- **Karpathy's X post** read in full through the fxtwitter mirror API (`api.fxtwitter.com/karpathy/status/1674873002314563584`), which returns the post's own text and timestamp; the canonical URL is `https://x.com/karpathy/status/1674873002314563584`.
- **YouTube caption downloads hit HTTP 429** for three of four videos. Instead, the audio was pulled and transcribed locally with Whisper (small.en for the full windows, then **large-v3 with word timestamps** for every quoted window). All clip quotes in section 6 are the large-v3 reading of the audio; the capture script re-verifies them at capture time. Temp audio was deleted after.
- **Primary documents read in full or in the cited section:** Latent Space "The Rise of the AI Engineer" (2023-06-30); Pragmatic Engineer excerpt of Huyen's *AI Engineering* ch. 1 (2025-05-20); LinkedIn Jobs on the Rise 2026 (2026-01-07); BLS OOH pages for Software Developers and Computer and Information Research Scientists; Anthropic and Stripe job postings; Levels.fyi role pages; Indeed Hiring Lab January 2026 update.

---

## 1. The thesis, sourced

Each row: statement · source URL · read date · confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | AI engineers integrate models someone else trained; ML engineers build and train the models. Huyen (book ch. 1): "In short, AI engineering differs from ML engineering in that it's less about model development and more about adapting and evaluating models." and "With AI engineering, you use a model someone else has trained." | https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack | 2026-11-09 | HIGH (primary author, verbatim) |
| T2 | Same split, from Andrej Karpathy (X, 2023-06-30 20:10 UTC): "ML people train algorithms/networks, usually from scratch, usually at lower capability." and "One can be quite successful in this role without ever training anything." | https://x.com/karpathy/status/1674873002314563584 (text read via https://api.fxtwitter.com/karpathy/status/1674873002314563584) | 2026-11-09 | HIGH (primary, verbatim) |
| T3 | The money gap is real and it runs TOWARD the model-training side. At Levels.fyi US medians, ML Engineer $287,500 vs AI Engineer $155,500 total comp: a $132,000 gap in ML's favour. | https://www.levels.fyi/t/software-engineer/title/machine-learning-engineer/locations/united-states.md · https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/united-states.md | 2026-11-09 | HIGH as a read of Levels.fyi; [VERIFY] live; see caveat T6 |
| T4 | A gap of about **$340K a year** is TRUE in two specific, labelled framings (neither is median vs median): (a) Levels.fyi US, top-10% ML Engineer ($495,000, 90th percentile) minus the median AI Engineer ($155,500) = **$339,500**; (b) Anthropic's own posted ranges, San Francisco, 2026: Research Engineer, Pretraining Scaling "$350,000 - $850,000 USD" (midpoint $600,000) vs Applied AI Engineer, Enterprise "$200,000 - $320,000 USD" (midpoint $260,000) = **$340,000** between midpoints. | Levels.fyi pages above · https://job-boards.greenhouse.io/anthropic/jobs/4938432008 · https://job-boards.greenhouse.io/anthropic/jobs/5057647008 | 2026-11-09 | HIGH for the inputs; MEDIUM for the framing (constructed comparisons, see Open question 1) |
| T5 | AI engineering is the bigger, faster-growing door. LinkedIn Jobs on the Rise 2026 (US): #1 "AI Engineers", most common skills "LangChain, Retrieval-Augmented Generation (RAG), PyTorch". Karpathy (2023): "In numbers, there's probably going to be significantly more AI Engineers than there are ML engineers / LLM engineers." | https://www.linkedin.com/pulse/linkedin-jobs-rise-2026-25-fastest-growing-roles-us-linkedin-news-dlb1c · https://x.com/karpathy/status/1674873002314563584 | 2026-11-09 | MEDIUM: LinkedIn's #1 entry says "Can also be known as Machine learning engineers", so it does NOT separate the two roles (see do-not-air) |
| T6 | Caveat on T3: Levels.fyi's "AI Engineer" title is thin and junior-skewed. Levels.fyi (Hakeem Shibly, in writing to Let's Data Science, 2026-08-26) excluded the AI Engineer title from its premium analysis for thin data, mostly junior: "putting a number on it would misrepresent what we actually know." | https://letsdatascience.com/news/levelsfyi-tells-lds-the-ai-pay-premium-has-stopped-growing-a893d96e | 2026-11-09 | MEDIUM (Levels.fyi quoted by reputable secondary) |
| T7 | Mike's own work is the AI-engineer side: this repo spawns hosted Claude agents (`spawn_agent`, `video-creation/longform-edited/graph/common.py` line 576) and runs a pretrained Whisper model locally on his GPU (`whisper.load_model`, `video-creation/shorts/_tooling/whisper_jobs.py` line 133). It integrates models; it trains none. | local repo files (read with grep) | 2026-11-09 | HIGH for what the code does; "never trained a model" is Mike's own statement in the brief |

---

## 2. Pillar facts

### Pillar 1: What each role does all day (real job-description language)

**The definitions (primary authors):**
- Huyen, *AI Engineering* ch. 1, the three differences: (1) "Without foundation models, you have to train your own models for applications." (2) "AI engineering works with models that are bigger, consume more compute resources, and incur higher latency" (3) "AI engineering works with models that can produce open-ended outputs" ... "This makes evaluation a much bigger problem in AI engineering." Also: "This means AI engineering focuses less on modeling and training, and more on model adaptation." (https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack, excerpt published 2025-05-20, read 2026-11-09)
- Karpathy (X, 2023-06-30): "LLMs created a whole new layer of abstraction and profession." / "It's not just prompting alone, there's a lot of glue code/infra around it." / "ML people train algorithms/networks, usually from scratch, usually at lower capability." / "LLM training is becoming sufficently [sic] different from ML because of its systems-heavy workloads" (https://x.com/karpathy/status/1674873002314563584, read 2026-11-09)
- swyx, Latent Space essay (2023-06-30): "When it comes to shipping AI products, you want engineers, not researchers." and "MLR/MLEs handle foundation model concerns" while "AI Engineers should certainly view _product-specific data and evals_ as their job." (https://www.latent.space/p/ai-engineer, read 2026-11-09)
- Huyen on The Pragmatic Engineer podcast (2025-02-05), audio verbatim (Whisper large-v3): "So like before machine engineer, right. You go from a data model to product. And now with engineering, you go from product to data and to model." (she means "machine learning engineer" and "AI engineering"; https://www.youtube.com/watch?v=98o_L3jlixw at 15:09.5 to 15:16.9, read 2026-11-09)

**AI engineer, real posting (Anthropic, "Applied AI Engineer, Enterprise", San Francisco, CA | New York City, NY, posted range "$200,000 - $320,000 USD"):** (https://job-boards.greenhouse.io/anthropic/jobs/5057647008, read 2026-11-09) [VERIFY: postings close]
- "Serve as a specialist technical advisor to Anthropic customers as they deploy new products & workflows with our models"
- "Create scalable public and internal assets documenting the latest LLM prompting, eval, agentic, and architecture techniques"
- "Lead hands-on technical workshops and code reviews with customer engineering teams"
- Requirements: "4+ years of experience in technical roles such as Forward Deployed Engineer, Product Engineer, Software Engineer," / "Production experience with LLMs, including advanced prompt engineering, agent development and frameworks," / "Strong programming skills with proficiency in Python or TypeScript and experience building production applications"

**ML engineer, real posting (Stripe, "Machine Learning Engineer, Radar", Payments, New York, Seattle, South San Francisco HQ, "The annual US base salary range for this role is $212,000 - $318,000."):** (https://stripe.com/jobs/listing/machine-learning-engineer-radar/7983456, read 2026-11-09) [VERIFY]
- "Build, train, evaluate, and deploy models that detect fraud and abuse across Stripe's global network"
- "Design features, datasets, and evaluation strategies for noisy, delayed, and adversarial environments"
- "such as transformer models over payment data, graph intelligence across consumers, and LLMs that detect emerging attacks"
- Minimum: "5+ years of experience developing, evaluating, and deploying machine learning models in a production environment." No degree or PhD requirement stated.

**Model-training engineer at a frontier lab (Anthropic, "Research Engineer, Pretraining Scaling", San Francisco, CA, "$350,000 - $850,000 USD"):** (https://job-boards.greenhouse.io/anthropic/jobs/4938432008, read 2026-11-09) [VERIFY]
- "Own critical aspects of our production pretraining pipeline"
- "Design and run experiments to improve training efficiency, reduce step time"
- "Add new capabilities to the training codebase, such as long context support or novel architectures"
- Education: "Bachelor's degree or an equivalent combination of education, training, and/or experience." No PhD statement.

**The VERSUS pair the research supports (both are real, typical tasks):**
- A side (AI engineer): **a customer support chatbot on an existing model.** Huyen, audio (Whisper small.en reading, re-verify at capture): "So imagine you're building a customer support chatbot ... I see a lot of people raise their hand. They're very, very classic general applications." (https://www.youtube.com/watch?v=98o_L3jlixw ~17:06 to 17:16, read 2026-11-09). RAG is LinkedIn's #2 listed skill for AI engineers (LinkedIn page above).
- B side (ML engineer): **train a fraud-detection model.** Stripe Radar posting: "Build, train, evaluate, and deploy models that detect fraud and abuse". Huyen names fraud detection inside a banking/payment app as a classic pre-foundation-model ML application (same podcast, ~13:33, small.en reading).
- Airable label: "SHIP A SUPPORT CHATBOT ON CLAUDE vs TRAIN A FRAUD MODEL". "From scratch" is supported only as Karpathy's "usually from scratch"; the Stripe posting says "build, train", so keep "from scratch" out of the box or say "train your own".

**The CAN / SHOULD turn (sourced):** Huyen, audio (large-v3): "Now it's too expensive. Now I need to like develop my own model. So you start like hosting your own model using some open source alternative or like fine-tuned model." (https://www.youtube.com/watch?v=98o_L3jlixw 15:00.0 to 15:07.7). And earlier: fine-tuning "very rare ... I don't recommend most people do in the early days" (small.en reading, ~14:36 to 14:42). Supports: "start on someone else's model; as soon as the API bill or the product is big enough, you CAN and SHOULD host or fine-tune your own." The ML work arrives later, not first.

**Reference-video points, verified (for the strategist; do not credit the source on screen):**

| Reference point | Verdict | Evidence |
|---|---|---|
| AI engineers integrate existing models into apps (RAG, vector DB, LLM over reviews) | SUPPORTED | Huyen T1; Karpathy T2; LinkedIn skills "LangChain, Retrieval-Augmented Generation (RAG)" |
| No training from scratch, maybe a fine-tune | SUPPORTED, soften | Huyen: fine-tuning is rare early; later you may host or build your own model (15:00 to 15:07). Karpathy: "can" succeed "without ever training anything" (not "never") |
| ML engineers train from scratch, need math/stats, training pipelines, validation and test sets | SUPPORTED (training); MEDIUM (math depth) | Karpathy "usually from scratch"; Stripe "Build, train, evaluate"; Anthropic pretraining "production pretraining pipeline". Postings opened do not list a math degree |
| ML hiring competes with PhDs; steeper self-taught climb | PARTLY | Stanford AI Index 2026: new AI PhDs (US/Canada) rose 22% 2022 to 2024 and "Industry employs the largest share, reaching 62.75% in 2024" (https://hai.stanford.edu/ai-index/2026-ai-index-report/education, read 2026-11-09). But the ML postings opened (Stripe Radar, Anthropic pretraining) state NO PhD requirement. Airable: "you compete with PhDs", not "you need a PhD" |
| AI engineer = software engineer with a new superpower; self-teachable | SUPPORTED | Huyen audio: "You don't need data anymore. You don't need like a fancy AI degree, um, anymore." (13:08.5 to 13:13.2); swyx 2023: "we already know how to do code" (AI Engineer Summit, ~6:06); BLS: software developers typically need a bachelor's |
| ML engineer tests for model bias in validation; AI engineer runs A/B tests in production | REFRAME | Not found in a primary source as stated. Primary sources make EVALUATION the AI engineer's signature task (Huyen: "evaluation a much bigger problem in AI engineering"; Anthropic posting: "eval ... techniques"). ML side: Stripe "evaluation strategies for noisy, delayed, and adversarial environments" |
| AI engineers are future-proof | OPINION | No source can verify. Conditional language only (persona verified_claims_only) |

### Pillar 2: The money (the honest numbers behind the ~$350K)

**Levels.fyi, United States, total compensation (base + annualized stock + bonus), self-reported, read 2026-11-09, all [VERIFY]:**

| Title | 25th | Median | 75th | 90th | n | Page |
|---|---|---|---|---|---|---|
| AI Engineer | $110,000 | **$155,500** | $212,500 | $287,500 | 330 | https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/united-states.md |
| Machine Learning Engineer | $200,000 | **$287,500** | $388,000 | **$495,000** | 1,012 | https://www.levels.fyi/t/software-engineer/title/machine-learning-engineer/locations/united-states.md |
| Applied AI Engineer | $200,000 | $250,000 | $475,000 | $505,000 | 21 (thin) | https://www.levels.fyi/t/software-engineer/title/applied-ai-engineer |
| OpenAI, Software Engineer (all specialties) | | $640,000 (avg $730,000) | | | 249 | https://www.levels.fyi/companies/openai/salaries/software-engineer |

- OpenAI SWE by level (Levels.fyi medians): L2 $249,423 · L3 $349,417 · L4 $744,501 · L5 $933,750 · L6 $1,334,864 · L7 $1,886,250 (same page, read 2026-11-09) [VERIFY].
- Levels.fyi's own AI premium study (2025-07-17, Alina Kolesnikova): AI-focused software engineers vs non-AI, 2025: Entry ~6.2% (down from 10.74%), Engineer 11.9%, Senior 14.2%, Staff 18.7% (up from 15.8%). Average for AI-focused SWE in the US: $245,000 (labelled "on average", not median). (https://www.levels.fyi/blog/ai-engineer-compensation-trends-q3-2025.html, read 2026-11-09)
- Levels.fyi via Let's Data Science (2026-08-26): at L3, ML/AI median $383K vs non-AI $297K in mid 2026 (about 1.29x); Levels.fyi's read: "plateaued / mild compression. ML/AI flat, non-AI catching up." (https://letsdatascience.com/news/levelsfyi-tells-lds-the-ai-pay-premium-has-stopped-growing-a893d96e, read 2026-11-09)

**Indeed, US average BASE salary from job postings, past 36 months, updated 2026-11-02 [VERIFY]:**
- Machine Learning Engineer: **$185,920** (5.5k salaries) (https://www.indeed.com/career/machine-learning-engineer/salaries, read 2026-11-09)
- "AI Developer" (Indeed's page for the AI engineer query): **$151,074** (3.9k salaries) (https://www.indeed.com/career/ai-engineer/salaries, read 2026-11-09)
- Gap on base pay: $34,846 in ML's favour.

**BLS (government; neither title is its own occupation on the OOH pages opened):**
- Software Developers: median $135,980 (May 2025); projected growth 10% 2025 to 2035; bachelor's typical; demand driver includes "continued expansion of software development for artificial intelligence (AI)". (https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm, read 2026-11-09)
- Computer and Information Research Scientists: median $140,300 (May 2025); projected growth 22% 2025 to 2035; 38,600 jobs (2025); typically "at least a master's degree"; work "frequently using techniques from data science and machine learning." (https://www.bls.gov/ooh/computer-and-information-technology/computer-and-information-research-scientists.htm, read 2026-11-09)

**Posted ranges, same day, real companies (US, 2026) [VERIFY]:**

| Company · posting | Side | Posted range | Source |
|---|---|---|---|
| Anthropic · Applied AI Engineer, Enterprise (SF / NYC) | AI engineer | $200,000 - $320,000 USD | https://job-boards.greenhouse.io/anthropic/jobs/5057647008 |
| Stripe · Machine Learning Engineer, Radar | ML engineer | $212,000 - $318,000 (annual US base) | https://stripe.com/jobs/listing/machine-learning-engineer-radar/7983456 |
| Anthropic · Research Engineer, Pretraining Scaling (SF) | model training, frontier lab | $350,000 - $850,000 USD | https://job-boards.greenhouse.io/anthropic/jobs/4938432008 |

**The $350K arithmetic (every framing, labelled TRUE / NOT TRUE):**

| Framing | Math | Result | Verdict |
|---|---|---|---|
| Median vs median, Levels.fyi US | $287,500 - $155,500 | $132,000 (ML higher) | TRUE, but it is $132K, not $350K |
| Base vs base, Indeed US | $185,920 - $151,074 | $34,846 (ML higher) | TRUE, small |
| Typical ML engineer (Stripe) vs typical applied AI engineer (Anthropic), posted bands | $212K to $318K vs $200K to $320K | about zero | TRUE: at a strong company, the bands overlap |
| **Top-10% ML engineer vs the median AI engineer, Levels.fyi US** | $495,000 - $155,500 | **$339,500** | TRUE if labelled "top 10% vs typical" |
| **Same company, same city: Anthropic model-training engineer vs applied AI engineer, posted midpoints** | $600,000 - $260,000 | **$340,000** | TRUE if labelled "posted midpoints"; top vs top is $530,000, bottom vs bottom $150,000 |
| OpenAI engineer median vs US ML Engineer median | $640,000 - $287,500 | $352,500 | NOT an AI-vs-ML framing (OpenAI's SWE family mixes both); do not use |
| "AI engineers earn $350K more than ML engineers" | none | | NOT TRUE in any source: the gap runs toward the training side |

**Plain-language summary the sources support (for the strategist, not a quote):** At the median, ML engineers out-earn AI engineers (about $132K on Levels.fyi total comp, about $35K on Indeed base pay), partly because Levels.fyi's AI Engineer title skews junior. At a strong company the two bands overlap (Stripe ML vs Anthropic applied AI). The ~$340K gap appears only at the top: the engineers who train frontier models (Anthropic pretraining $350K to $850K posted) or the top 10% of ML engineers ($495K) against a typical AI engineer. So the money favours the trainers, and only the few at the top; the doors (job growth, entry barrier) favour AI engineers.

### Pillar 3: Who should pick which (the 3 decision criteria, with verdicts)

**Criterion 1: Your background (research math vs software).**
- If you have the research track (stats, math, graduate study) → **ML**. Evidence: BLS research scientists typically hold "at least a master's degree"; Stanford AI Index 2026: 62.75% of new AI PhDs (US/Canada) went to industry in 2024, so the ML pool includes them.
- If you are a software developer → **AI**. Evidence: Huyen "You don't need like a fancy AI degree, um, anymore." (13:10.0 to 13:13.2, audio); Anthropic Applied AI posting asks for software experience ("Python or TypeScript ... production applications"), no degree line; BLS software developers: bachelor's typical.

**Criterion 2: Do you want to train models or ship products?**
- Train → **ML**: Stripe "Build, train, evaluate, and deploy models"; Anthropic "Own critical aspects of our production pretraining pipeline".
- Ship → **AI**: Huyen "you use a model someone else has trained"; Anthropic "deploy new products & workflows with our models"; Huyen audio "you go from product to data and to model".

**Criterion 3: What the market is hiring for now.**
- LinkedIn Jobs on the Rise 2026 (published 2026-01-07; growth measured on jobs started 2023-01-01 to 2025-07-31): #1 AI Engineers; skills "LangChain, Retrieval-Augmented Generation (RAG), PyTorch"; median prior experience "3.7" years; top locations "San Francisco, New York City, Dallas"; "26.2% remote, 27.1% hybrid". Caveat: "Can also be known as Machine learning engineers". (LinkedIn page above, read 2026-11-09)
- Indeed Hiring Lab (Cory Stahle, 2026-01-22): postings mentioning AI "surged by more than 130%" in 2025; AI share of US postings hit "a high of 4.2% in December 2025"; AI-mentioning tech postings about 45% above February 2020 while all tech postings were 34% below. Keyword-based, not title-based. (https://hiringlab.indeed.com/2026/01/22/january-labor-market-update-jobs-mentioning-ai-are-growing-amid-broader-hiring-weakness/, read 2026-11-09)
- Verdict → **AI** for openings and entry; **ML** for the top of the pay curve.

**The two-part "if you have X but not Y" lines the sources support (side panels):**
- "If you have the code but not the math": AI (Huyen degree line; Anthropic requirements).
- "If you have the math but not the production code": ML still wants production; Stripe asks "5+ years of experience developing, evaluating, and deploying machine learning models in a production environment." So the honest line is that ML also expects shipping experience.

### Pillar 4: Where the terms come from (the dated timeline)

| Date | Event | Source (read 2026-11-09) |
|---|---|---|
| 2023-06-30 | Latent Space publishes "The Rise of the AI Engineer" (swyx) | https://www.latent.space/p/ai-engineer |
| 2023-06-30 | Karpathy: "Maybe 'AI Engineer' is ~usable" and "significantly more AI Engineers than there are ML engineers" | https://x.com/karpathy/status/1674873002314563584 |
| 2023-10 | AI Engineer Summit, San Francisco; swyx keynote "The 1,000x AI Engineer" (YouTube upload 2023-10-23, 9:26) | https://www.youtube.com/watch?v=qaJXBMwUkoE |
| 2025-02-05 | The Pragmatic Engineer podcast "AI Engineering with Chip Huyen" (1:14:44); chapter "11:35 A definition of AI Engineering and how it differs from Machine Learning Engineering" | https://newsletter.pragmaticengineer.com/p/ai-engineering-with-chip-huyen |
| 2025-05-20 | Pragmatic Engineer publishes the book excerpt "The AI Engineering Stack" | https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack |
| 2025-06-17 | Uncapped Ep. 13: Sam Altman on Meta's offers | https://www.youtube.com/watch?v=mZUG0pr5hBo |
| 2026-01-07 | LinkedIn Jobs on the Rise 2026: AI Engineers #1 (US) | LinkedIn page above |

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **Chip Huyen** | Author of *AI Engineering* (O'Reilly); Pragmatic Engineer excerpt co-bylined with Gergely Orosz | https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack |
| **Andrej Karpathy** (X: @karpathy) | Wrote the 2023-06-30 post on AI engineers vs ML engineers | https://x.com/karpathy/status/1674873002314563584 |
| **swyx (Shawn Wang)** | "co-founder and chief executive of AI Engineer"; editor and podcast co-host of Latent Space; founder of Smol AI | https://www.ai.engineer/speakers/swyx |
| **Sam Altman** | OpenAI CEO; guest on Uncapped Ep. 13 (2025-06-17) hosted by Jack Altman | https://www.youtube.com/watch?v=mZUG0pr5hBo |
| **Andrew Bosworth** | Meta CTO; disputed Altman's $100M claim at an all-hands (reported 2025-06-27) | https://www.entrepreneur.com/business-news/meta-cto-sam-altman-dishonest-for-100m-bonus-claim/493945 |
| **Levels.fyi** | Self-reported tech compensation; total comp = base + annualized stock + bonus | Levels.fyi pages above |
| **LinkedIn Economic Graph** | Jobs on the Rise 2026 | LinkedIn page above |
| **Indeed Hiring Lab** (Cory Stahle) | AI Tracker of postings | Hiring Lab page above |
| **Anthropic** · **Stripe** | Employers of the postings quoted | Greenhouse and Stripe pages above |
| **BLS** | Occupational Outlook Handbook | BLS pages above |

Terminology for captions/graphics: "AI engineer", "ML engineer" (or "machine learning engineer"), "RAG", "LangChain", "PyTorch", "Claude", "Whisper", "OpenAI", "Anthropic", "Levels.fyi". Dollar figures as "$155,500" or "$155.5K", never rounded past the source without saying "about". No em dashes. Do not name or show the reference video's creator.

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| "AI engineers make $350K more than ML engineers" | No source supports it. Every source has the gap running the OTHER way (Levels.fyi median, Indeed base, Anthropic posted ranges) | "The biggest checks go to the people who TRAIN the models" |
| "The gap between the two roles is $350,000" (as a median vs median fact) | Median gap is $132,000 (Levels.fyi total comp) and $34,846 (Indeed base). ~$340K exists only top-10% vs median, or between Anthropic's posted midpoints | "Up to about $340,000 a year, at the very top" with the framing on screen (C3 or C4) |
| "$350K" exact on screen as a sourced number | The nearest sourced results are $339,500 and $340,000 | "about $340K" (or "over $300K") |
| "Meta pays $100 million signing bonuses" (as fact, or as what ML engineers earn) | Sam Altman's claim (Uncapped, 2025-06-17). Meta CTO Bosworth: "Sam is just being dishonest here" and the offers are not for "every single person" (Entrepreneur, 2025-06-27, citing The Verge). A researcher who moved to Meta reportedly called it "fake news" (seen in search results only, not opened). Applies to a handful of frontier researchers, not ML engineers | If used at all: "OpenAI's CEO SAID Meta offered some of his researchers $100 million; Meta disputed it." Conditional, attributed, dated |
| "There are 10x as many ML Engineer jobs as AI Engineer jobs on Indeed" | Latent Space essay, June 2023: stale by three years; the live counts were not reproducible (Indeed search not opened) | Do not air. Use LinkedIn 2026 / Indeed Hiring Lab 2026 instead |
| "$300k/yr doing prompt engineering at Anthropic and $900k building software at OpenAI" | Latent Space 2023, second-hand links, stale | Use Levels.fyi or the 2026 postings |
| "AI engineer is the #1 fastest-growing job, beating ML engineer" | LinkedIn's #1 entry "Can also be known as Machine learning engineers": the list lumps the two titles | "LinkedIn's fastest-growing US job for 2026: AI engineer" (no head-to-head claim) |
| "ML engineers need a PhD" | Postings opened (Stripe Radar ML, Anthropic Pretraining Scaling) state no PhD; Anthropic: "Bachelor's degree or an equivalent combination of education, training, and/or experience." | "You'll be competing with PhDs" (AI Index: 62.75% of new AI PhDs went to industry, 2024) |
| "AI engineers never train models" / "no math at all" | Huyen: later you may host or fine-tune your own model; the reference video itself concedes some linear algebra for embeddings | "You CAN go a whole career without training a model" (Karpathy: "can be quite successful ... without ever training anything") |
| "AI engineers are future-proof" | Opinion; unverifiable | Conditional: "if models keep getting better, someone still has to wire them into products" (said as Mike's view) |
| "ML engineers test for bias, AI engineers run A/B tests" | Not found in a primary source as stated | "ML engineers evaluate the model; AI engineers evaluate the product" (Huyen: evaluation is "a much bigger problem in AI engineering") |
| Levels.fyi OpenAI Machine Learning Engineer "$1M-$1.4M+" | The page says it needs "4 more Software Engineer submissions"; no real ML-title median | Use OpenAI SWE median $640,000 only as "an engineer at OpenAI", never as ML-specific |
| "AI engineer job postings up 143% YoY", "19,297 AI and ML engineer vacancies Q1 2026", "$245K AI engineer average" (aggregators) | Seen in search snippets from aggregators (Outsource Accelerator, Broadbean, others), never opened against a primary | Do not air |
| swyx: "a hundred thousand card-carrying data science machine learning engineers" | His own rough estimate on stage ("I don't know what the real number is") | Only inside his clip, as his words; never on a card |
| Glassdoor anything | Page 403, not read | Do not air |
| Indeed "AI Engineer salary $151,074" | Indeed's page reports "AI Developer", not AI Engineer | Label it "AI Developer (Indeed)" or skip |

---

## 5. Market snapshot

Pulled 2026-11-09, about 19:40 to 20:10 local (2026-11-10 00:40 to 01:11 UTC), from the pages named. All [VERIFY] at render.

**Re-pull at render (2026-11-11, pages generated 09:28 UTC, "Last Updated: November 11, 2026"):** AI Engineer US median
$155,500 (unchanged; p25 $110,000 · p75 $212,000 · p90 $280,000 · n 331) · ML Engineer US median $287,500 (unchanged;
p25 $200,000 · p75 $390,000 · **p90 $500,000**, was $495,000 · n 1,025). Gap p90 minus AI median = $344,500 (was $339,500).
RULING (Mike, 2026-11-11): keep the 2026-11-09 read on the C3 chart ($495K, $339.5K, source line READ 2026-11-09): it is
accurate as dated data and matches the spoken "around $495,000" / "$340,000 gap". No rebuild.

| Figure | Value at read | Note |
|---|---|---|
| Levels.fyi US AI Engineer median TC | $155,500 (p25 $110,000 · p75 $212,500 · p90 $287,500 · n 330) | [VERIFY] page updated 2026-11-08/09 |
| Levels.fyi US ML Engineer median TC | $287,500 (p25 $200,000 · p75 $388,000 · p90 $495,000 · n 1,012) | [VERIFY] title page read $285,800 same day |
| Levels.fyi US Applied AI Engineer median TC | $250,000 (p90 $505,000 · n 21) | [VERIFY] thin sample |
| Levels.fyi OpenAI SWE median TC | $640,000 (avg $730,000 · n 249) | [VERIFY] |
| Gap: ML p90 minus AI median | $339,500 | [VERIFY] recompute at render |
| Gap: ML median minus AI median | $132,000 | [VERIFY] recompute at render |
| Anthropic Applied AI Engineer, Enterprise | $200,000 - $320,000 USD | [VERIFY] posting may close |
| Anthropic Research Engineer, Pretraining Scaling | $350,000 - $850,000 USD | [VERIFY] posting may close |
| Gap between those posted midpoints | $340,000 | [VERIFY] |
| Stripe ML Engineer, Radar base | $212,000 - $318,000 | [VERIFY] posting may close |
| Indeed ML Engineer avg base | $185,920 (5.5k) | [VERIFY] updated 2026-11-02 |
| Indeed "AI Developer" avg base | $151,074 (3.9k) | [VERIFY] updated 2026-11-02 |
| BLS Software Developers median | $135,980 (May 2025) | primary, not drifting until the next OOH release |
| BLS Computer and Information Research Scientists median | $140,300 (May 2025) | primary, not drifting until the next OOH release |
| LinkedIn Jobs on the Rise 2026 #1 | AI Engineers | primary, published 2026-01-07 |
| Indeed AI-mention postings growth 2025 | "more than 130%" | primary, published 2026-01-22 |

---

## 6. Clip candidates

Every real VIDEO CLIP of someone saying a thing this video could splice in with their own voice (`skills/clip-inserts/clip-inserts.md`). Words below are the Whisper large-v3 reading of the AUDIO (word timestamps), not a write-up. Runtime note: the hard window is 1:45 to 2:29, so any insert costs seconds of a tight budget.

| ID | Who / what is said (verbatim, opened) | Source URL + window | Length | Context check | Supports |
|---|---|---|---|---|---|
| CLIP-1 | swyx (Shawn Wang), keynote, AI Engineer Summit 2023: "so we are, we think there's gonna be much more AI engineers than ML engineers." | https://www.youtube.com/watch?v=qaJXBMwUkoE 5:41.1-5:45.8 | 4.7 s | In context: the close of his "demand and supply argument" (5:24.1 on): "something like a hundred thousand card-carrying data science machine learning engineers, and GitHub claims to have a hundred million, uh, registered developers ... I don't know what the real number is ... It's orders of magnitude more." It is a 2023 prediction, so the caption must date it ("swyx, AI Engineer Summit, October 2023"). The cut does not change his meaning. Do not extend into the head-count numbers (his estimate) | Pillar 3 criterion 3; T5 |
| CLIP-2 | Chip Huyen, author of *AI Engineering*, The Pragmatic Engineer podcast (2025-02-05): "So that's like really, really lowers the entry barrier to people. Like you don't need data anymore. You don't need like a fancy AI degree, um, anymore." | https://www.youtube.com/watch?v=98o_L3jlixw 13:05.0-13:13.3 (tight option 13:08.5-13:13.3, 4.8 s) | 8.3 s | In context: she is explaining that with foundation models you "can just like send it direct API calls" (13:00.1) to BUILD an application. It is about the entry barrier to building, not a claim that employers drop degree requirements (Anthropic's applied AI posting still asks 4+ years of technical experience). Caption: "Chip Huyen, author of AI Engineering, February 2025" | Pillar 3 criterion 1; reference point "self-teachable" |
| CLIP-3 | Chip Huyen, same episode: "You go from a data model to product. And now with engineering, you go from product to data and to model." | https://www.youtube.com/watch?v=98o_L3jlixw 15:10.7-15:16.9 | 6.2 s | Directly preceded by "So like before machine engineer, right." Both Whisper models hear "machine engineer" and "with engineering" where she means ML engineering / AI engineering: CHECK BY EAR before approving; a viewer may need the caption to carry "ML: data, model, product. AI: product, data, model." Context is fair: it is her stated core difference | Pillar 1; C2 |
| CLIP-4 | Sam Altman, OpenAI CEO, Uncapped Ep. 13 (2025-06-17): "they started making these like giant offers to, uh, you know, a lot of people on our team, um, you know, like a hundred million dollars signing bonuses, more than that comp per year." | https://www.youtube.com/watch?v=mZUG0pr5hBo 22:35.2-22:44.6 | 9.4 s | He continues: "It is crazy. I'm really happy that at least so far none of our best people have decided to take them up on that." The figure is HIS claim about Meta's offers to OpenAI research staff; Meta's CTO called it "dishonest" (2025-06-27). On do-not-air as a fact; if used, the caption must say "Sam Altman's claim, June 2025; Meta disputed it", and the resume line must say it is the extreme top of the TRAINING side, not ML-engineer pay | Pillar 2 (top of the curve) only, conditional |
| (searched, not used) | Lenny's Podcast "AI Engineering 101 with Chip Huyen" (2025-10-23, qbvY0dQgSJ4): found, captions 429, not transcribed. Karpathy "Software Is Changing (Again)", YC (LCEmiRjPEtQ): found, its topic is Software 3.0, not AI vs ML; not transcribed. Karpathy's AI-vs-ML lines exist only as an X post (text, use C10 receipt). No video found of anyone stating the AI vs ML pay gap with numbers | | | | |

---

## CHART-SOURCE INDEX

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | THE system-design split: AI ENGINEER lane: "model someone else trained" -> API -> your data (RAG) -> product -> evals; ML ENGINEER lane: data -> features -> train -> validate / test -> deploy the model. Labels trace to Huyen T1, Karpathy T2, Stripe and Anthropic postings | section 2 Pillar 1 | **code** (Type 2, static states) |
| C2 | Flow reversal: ML = DATA -> MODEL -> PRODUCT; AI = PRODUCT -> DATA -> MODEL (Huyen's words) | section 2 Pillar 1 (Huyen audio 15:10.7-15:16.9) | **code** (Type 1 animated, arrows re-order) |
| C3 | Money ladder, Levels.fyi US total comp: AI Engineer median $155,500 · ML Engineer median $287,500 · ML Engineer 90th pct $495,000; bracket "$339,500" between AI median and ML 90th. Source line: "Levels.fyi, US, total comp, read 2026-11-09" | section 2 Pillar 2 · section 5 | **code** (bars grow + count-up) [VERIFY] |
| C4 | Same-company range bars, Anthropic posted ranges, San Francisco, 2026: Applied AI Engineer $200K to $320K vs Research Engineer, Pretraining $350K to $850K; midpoints $260K vs $600K, bracket "$340,000" | section 2 Pillar 2 · section 5 | **code** (range bars fill) [VERIFY] |
| C5 | Receipt: Levels.fyi ML Engineer US page, median line | https://www.levels.fyi/t/software-engineer/title/machine-learning-engineer/locations/united-states | **screencap** [VERIFY] |
| C6 | Receipt: Levels.fyi AI Engineer US page, median line | https://www.levels.fyi/t/software-engineer/title/ai-engineer/locations/united-states | **screencap** [VERIFY] |
| C7 | Receipt: Anthropic "Applied AI Engineer, Enterprise" posting, crop to the responsibilities + "$200,000 - $320,000 USD" | https://job-boards.greenhouse.io/anthropic/jobs/5057647008 | **screencap** [VERIFY] |
| C8 | Receipt: Anthropic "Research Engineer, Pretraining Scaling" posting, crop to "$350,000 - $850,000 USD" | https://job-boards.greenhouse.io/anthropic/jobs/4938432008 | **screencap** [VERIFY] |
| C9 | Receipt: Stripe "Machine Learning Engineer, Radar", crop to "Build, train, evaluate, and deploy models that detect fraud" (the VERSUS B side) | https://stripe.com/jobs/listing/machine-learning-engineer-radar/7983456 | **screencap** [VERIFY] |
| C10 | Receipt: Karpathy's X post (2023-06-30), crop to "ML people train algorithms/networks, usually from scratch" + "One can be quite successful in this role without ever training anything." | https://x.com/karpathy/status/1674873002314563584 | **screencap** |
| C11 | Receipt: Huyen excerpt, crop to "less about model development and more about adapting and evaluating models" (candidate words for the paper "to sum it up" card, credited) | https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack | **screencap** |
| C12 | Receipt: LinkedIn Jobs on the Rise 2026, #1 AI Engineers entry (skills line visible) | https://www.linkedin.com/pulse/linkedin-jobs-rise-2026-25-fastest-growing-roles-us-linkedin-news-dlb1c | **screencap** |
| C13 | OPTIONAL: Indeed Hiring Lab, AI-mention postings "more than 130%" in 2025 | https://hiringlab.indeed.com/2026/01/22/january-labor-market-update-jobs-mentioning-ai-are-growing-amid-broader-hiring-weakness/ | **screencap** |
| C14 | OPTIONAL proof beat: Mike's own repo in VS Code: `spawn_agent` (common.py line 576) and `whisper.load_model` (whisper_jobs.py line 133) | local repo (section 1 T7) | **screencap** (Mike's own screen) |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. C3 and C4 are code-built from section 2; every salary label carries source, level/percentile, location and year. Everything else is a real-site capture.

---

## Open questions for Mike

1. **The $350K thumbnail promise:** no source supports exactly $350K. Two independent, honest framings land at **$339,500** (Levels.fyi US: top-10% ML engineer vs median AI engineer) and **$340,000** (Anthropic's posted midpoints, model-training engineer vs applied AI engineer, San Francisco, 2026). Recommendation: the video says "about $340,000" with the framing on screen (C3 or C4); the thumbnail either says "$340K" or treats $350K as rounded ("$300K+" is the safest). Median vs median is only $132,000.
2. **Which way the money runs vs the brief's verdict (soft contradiction, not a re-angle):** the brief closes on "how to become an AI engineer", and every pay source has the gap favouring the model-TRAINING side. The angle survives if the money answer is told straight: the top pay sits with the few who train frontier models (and they compete with PhDs); the openings and the low entry barrier sit with AI engineers. The strategist decides the wording; DATA does not.
3. **Seniority skew:** Levels.fyi's AI Engineer title (n 330) skews junior per Levels.fyi itself, so part of the $132K median gap is seniority mix, not the role. Applied AI Engineer (n 21) sits at $250,000 median. Worth one honest caveat line if the median gap airs.
4. **No title-level posting count found:** no primary source gives AI engineer vs ML engineer posting counts in 2026 (LinkedIn lumps them; Indeed Hiring Lab tracks keywords, not titles; Indeed search pages were not opened). If Mike wants a "X jobs vs Y jobs" number, it needs a live capture at record time.
5. **Glassdoor** could not be opened (403); the brief listed it as a source. Levels.fyi, Indeed, BLS and posted ranges cover the money without it.
6. **CLIP-3 audio:** both Whisper models hear "machine engineer" / "with engineering"; Mike should listen at 15:09 before approving it.
7. **CLIP-4 (Altman $100M):** airable only attributed and disputed; recommendation is to skip it on a 2:15 video unless the money chapter needs the "top of the curve" beat.
8. **Postings drift:** C7, C8, C9 must be captured soon; postings close. If one closes, the posted range in this file is the last read (2026-11-09).
