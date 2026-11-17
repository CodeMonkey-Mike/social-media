# future-of-software-engineers: DATA (research dump; every number carries a source)
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift or not confirmed on a primary page, re-pull before recording/render._
_Compiled 2026-11-13 for the LOCKED brief "Software Engineers Who Only Code Are Running Out of Time" (around 8:00, accept 7:00 to 9:00; AI Engineering Simplified channel; "very simple": no clips, no captions, no ChatGPT images, no Envato b-roll, one drone bed, at most 2 system-design charts and 2 animated charts, receipts allowed and few). No em dashes._

_Shape: skills/doc-reference/DATA.reference.md. Format owner: charts.md section 1 (the CHART-SOURCE INDEX) + the data-researcher agent definition. Every row: statement, source URL (opened, not just found), read date, confidence. Nothing here is invented; not found = Open questions._

**Source access notes (read before citing):**
- **Anthropic's S-1 and S-1/A (sec.gov)** are too large for the page reader (over 10 MB). Both were downloaded straight from sec.gov and the quoted sentences were located in the filing text itself. S-1 "As filed with the Securities and Exchange Commission on October 26, 2026"; Amendment No. 1 "As filed ... on November 2, 2026". A further amendment around 2026-11-10 was reported in search results and NOT opened: [VERIFY] the quoted sentences still stand in the newest amendment before recording.
- **Alphabet Q3 2025 call transcript:** the AOL/Motley Fool transcript URL returned 404, and Pichai's own Q3 2025 remarks on blog.google (opened) do not contain a code-share figure. The "nearly half" line is the CFO's, known through one secondary article (opened). The primary for "50% last fall" is Pichai's own April 2026 post, which states it.
- **Alphabet Q1 2025 call:** Pichai's "well over 30%" is quoted from Diginomica's transcript-based report (opened), not from Alphabet's own transcript: [VERIFY] the wording against the official transcript if it is shown as a receipt.
- **Stanford "Canaries in the Coal Mine":** the August 2026 news post was opened and the August 2026 PDF (140 pages) was downloaded and text-searched. The old November 2025 PDF URL now serves the same August 2026 file. The widely repeated "software developers aged 22 to 25 down nearly 20%" sentence is NOT in the text of the current version (a software-developer headcount figure exists in the online appendix, with no percentage in the text): [VERIFY], see Do-not-air.
- **Axios (2026-06-04) and Fast Company (FDE "800%") returned HTTP 403.** Nothing here rests on them alone.
- **Dave McClure's deck:** the SlideShare page opened and shows the slides; it does not state the upload date or the event. The archived igniteshow.com page loaded empty. "Ignite Seattle, August 2007" is secondary only: [VERIFY].
- **Spotify squad paper:** the original PDF (Kniberg and Ivarsson, October 2012) was downloaded and its text read.
- **Primary documents opened and read (in the cited section):** Pichai's Cloud Next '26 post (blog.google); Pichai's Q3 2024 earnings remarks (blog.google); Anthropic Institute essay "When AI builds itself"; Anthropic S-1 and S-1/A; CFR transcript of Dario Amodei (2025-03-10); Indeed Hiring Lab posts of 2026-07-08, 2026-07-23 and 2026-11-12; BLS Occupational Outlook Handbook pages for Computer Programmers and Software Developers; Stanford Digital Economy Lab August 2026 post and PDF; the Scrum Guide 2020; the Spotify paper; the CNCF Platforms White Paper; PostHog's growth engineer and product engineer posts; Clay's GTM engineering post; Fortune on forward-deployed engineers (2026-09-03); McClure's SlideShare deck.

---

## 1. The thesis, sourced

Each row: statement, source URL, read date, confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | "Google says 75% of its code is written by AI." CONFIRMED, with its exact scope. Sundar Pichai, CEO of Google and Alphabet, 2026-04-22: "Today, 75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall." It is NEW code, and it is approved by engineers. | https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/ | 2026-11-13 | HIGH (primary, verbatim). No newer Google figure was found (Q3 2026 remarks searched, none). [VERIFY] for a newer figure before recording. |
| T2 | "Most code at Anthropic is being written by AI." CONFIRMED, two primary figures. (a) Anthropic Institute essay: "As of May 2026, more than 80% of the code we merge into Anthropic's codebase was authored by Claude." (b) Anthropic's S-1: "over 90% of the contributions to our codebase in September 2026 were written by Claude." | (a) https://www.anthropic.com/institute/recursive-self-improvement (b) https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm | 2026-11-13 | HIGH (primary, verbatim). The two use different measures ("code we merge" vs "contributions"); the S-1 does not define "contributions". Never merge them into one series without the labels. |
| T3 | "A lot of AI engineers are not necessarily coding anymore." SUPPORTED in the labs' own words. Anthropic S-1: Claude's long task horizons have "enabled our engineers to increasingly direct and review its work rather than write code line by line." Pichai: Google is moving to "truly agentic workflows" with engineers directing "fully autonomous digital task forces". | S-1 URL above; blog.google URL above | 2026-11-13 | HIGH for the two companies quoted. It is a statement about those labs, not a measured share of all engineers. |
| T4 | "We've reached a point of recursive self-improvement where the AIs can improve themselves." NOT what the sources say. Anthropic's own essay: "We are not there yet, and recursive self-improvement is not inevitable." What IS sourced: each Claude model helps build the next (the S-1 calls this "closing the loop"), and the S-1/A No.1 (2026-11-02) said Anthropic "may imminently meet" its own threshold for "dramatically accelerated progress attributable to AI". **ACCURACY PASS 2026-11-13: SUPERSEDED.** S-1/A No.2 (2026-11-10, https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm): "we made a determination that we have met this threshold" ... "based on what we expect from future models and our overall rate of progress, rather than on what we have observed from current models"; the "not designated" sentence was removed and "dramatically accelerated progress" became "a specified degree of accelerated progress". | essay URL above; S-1/A https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm | 2026-11-13 | MEDIUM as the brief words it; HIGH for "the loop has started" (E8). See Do-not-air and Open question 1. |
| T5 | "There will be less and less demand for software engineers who only want to sit there and code." PARTLY supported, and one popular version of it is false. Supported: BLS projects computer programmers (the occupation that "write, modify, and test code") to decline 7% from 2025 to 2035, while software developers grow 10%. Indeed: 71% of the May 2025 to May 2026 increase in software postings came from senior roles and 37% from AI-titled jobs; entry-level roles were 4.5% of software postings in 2026 Q1. NOT supported: "software jobs are disappearing". Software development postings are UP 23.8% year over year (to 2026-10-23), still 19.2% below February 2020. | BLS and Indeed URLs in section 2, pillar 4 | 2026-11-13 | MEDIUM. The angle survives as "the demand moved", never as "the demand is gone". See Open question 2. |
| T6 | "In the past a pod might have been a frontend engineer, a backend engineer, a QA engineer, a project manager, maybe a designer and a marketer." SUPPORTED in shape by the standard descriptions: a Spotify squad has "all the skills and tools needed to design, develop, test, and release to production" plus a product owner; a Scrum Team is cross-functional and "typically 10 or fewer people". The exact six-role list is Mike's own illustration; no primary source lists a marketer inside the squad. | https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf ; https://scrumguides.org/scrum-guide.html | 2026-11-13 | MEDIUM-HIGH. Say "a typical pod", in Mike's words, not "the Spotify squad had a marketer". |
| T7 | "Now one person can fill almost all of those roles." SUPPORTED as capability claims by the labs, not as a measured industry fact. Anthropic essay: "humans supply the goal, but they no longer need to supply the method". Anthropic S-1: engineers "direct and review". Pichai: a complex code migration by agents and engineers together was "completed six times faster than was possible a year ago with engineers alone". | essay, S-1 and blog.google URLs above | 2026-11-13 | MEDIUM. Conditional language: one engineer CAN now cover most of those jobs. Mike's own pipeline (E10) is first-person proof and needs no outside source. |
| T8 | "Younger people will enter with this mindset and it will be easier for them to adapt." The mindset half is Mike's view (no dataset measures it). The market half runs the other way: entry-level software hiring got harder. Stanford: employment of workers aged 22 to 25 in highly AI-exposed occupations is "about 19% below" where it would be had it kept pace with less-exposed peers, and the gap "operates primarily through reduced hiring of young workers". Indeed: entry-level roles were 4.5% of software development postings in 2026 Q1, senior roles 69.3%. | https://digitaleconomy.stanford.edu/news/canariesaug26/ ; https://hiringlab.indeed.com/2026/07/23/the-labor-market-is-tilting-toward-seniority/ | 2026-11-13 | HIGH for the data; the brief's E6 already carries the true form. |
| T9 | The AARRR funnel is Dave McClure's ("Startup Metrics for Pirates"): Acquisition, Activation, Retention, Referral, Revenue. The common AAARRR extension adds Awareness in front (added after McClure by someone unsourced, not Mike). | https://www.slideshare.net/slideshow/startup-metrics-for-pirates-long-version/89026 | 2026-11-13 | HIGH for author, title and the five stages (deck opened). The 2007 date and the Ignite Seattle venue are secondary only: [VERIFY]. |

---

## 2. Pillar facts

### Pillar 1: THE SHIFT (how much code AI writes, AI building AI, end of 2026 vs end of 2027)

**Google (every statement is the company's own; the wording of the measure shifts, so each point keeps its own label):**

| Date | Who, where | Verbatim | Source (read 2026-11-13) |
|---|---|---|---|
| 2024-10-29 | Sundar Pichai, Q3 2024 earnings call remarks | "Today, more than a quarter of all new code at Google is generated by AI, then reviewed and accepted by engineers." Next sentence: "This helps our engineers do more and move faster." | https://blog.google/inside-google/message-ceo/alphabet-earnings-q3-2024/ |
| 2025-04 (Q1 2025 earnings call; reported 2025-04-25) | Sundar Pichai | "I think the last time I had said the number was like 25% of code that's checked in involves people accepting AI suggested solutions. That number is well over 30% now." | https://diginomica.com/google-cloud-revenue-281-year-year-alphabet-shrugs-tariff-trauma-strong-q1 (Stuart Lauchlan; secondary carrying the transcript) [VERIFY wording and call day against Alphabet's transcript] |
| 2025-10-29 | Anat Ashkenazi, Alphabet CFO, Q3 2025 earnings call | "now nearly half of all code generated by AI" | https://officechai.com/ai/half-of-all-code-at-google-is-now-generated-by-ai-google-cfo (secondary, 2025-11-06) [VERIFY]. Pichai's own Q3 2025 remarks (https://blog.google/inside-google/message-ceo/alphabet-earnings-q3-2025/, opened) carry no code figure. |
| "last fall" (fall 2025) | Sundar Pichai, looking back from 2026-04-22 | "up from 50% last fall" | https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/ (primary) |
| 2026-04-22 | Sundar Pichai, "Cloud Next '26: Momentum and innovation at Google scale" | "Today, 75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall." Also: Google is moving to "truly agentic workflows"; engineers direct "fully autonomous digital task forces"; "Recently, a particularly complex code migration done by agents and engineers working together" was "completed six times faster than was possible a year ago with engineers alone." | same blog.google post (primary) |

- Latest Google figure found: 75% (2026-04-22). Searches for a newer figure (I/O 2026, Q2 2026 and Q3 2026 earnings) returned none. [VERIFY] before recording.
- Caveat the sources themselves raise: Microsoft's and Google's measures are not defined the same way ("it's unclear how Microsoft and Google measure AI-generated code", TechCrunch, 2025-04-29, URL below).

**Anthropic:**

| Date | Who, where | Verbatim | Source (read 2026-11-13) |
|---|---|---|---|
| 2025-03-10 | Dario Amodei, CEO, Council on Foreign Relations (uncorrected transcript) | "we are not far from the world, I think we'll be there in three to six months, where AI is writing 90 percent of the code. And then in twelve months, we may be in a world where AI is writing essentially all of the code." Then: "But the programmer still needs to specify" the conditions, "what is the overall app you're trying to make, what's the overall design decision?" (The transcript prints dashes around "I think we'll be there in three to six months"; commas used here.) | https://www.cfr.org/event/ceo-speaker-series-dario-amodei-anthropic |
| before 2025-02 | Anthropic Institute essay | "Before Claude Code launched in research preview in February 2025, this number was in the low single digits." | https://www.anthropic.com/institute/recursive-self-improvement |
| 2026-05 | Anthropic Institute essay "When AI builds itself" (Marina Favaro and Jack Clark; editorial support Santi Ruiz; the page shows "Update 9/18/2026"; Anthropic's X post announcing it and press coverage date it to 2026-06-04, [VERIFY] the first-publication day) | "As of May 2026, more than 80% of the code we merge into Anthropic's codebase was authored by Claude." Footnote 3: "Our >80% figure measures the share of lines merged to production that can be attributed to Claude." and leadership has estimated "that 90% or more of our code is written by Claude, including scripts and experimental code." | same essay |
| 2026 Q2 | same essay | "In the second quarter of 2026, the typical engineer was merging 8× as much code per day as they were in 2024." Its own caveat: this "is almost certainly an overstatement" of the true productivity gain, and "Lines of code is an imperfect measure, as it measures quantity over quality." | same essay |
| 2026-09 | Anthropic S-1, filed 2026-10-26 | "over 90% of the contributions to our codebase in September 2026 were written by Claude." and "the average daily volume of code contributed to our codebase per engineer in the three months ended September 30, 2026 was over 45 times the average daily volume in the year ended December 31, 2024." | https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm (repeated in the S-1/A of 2026-11-02) |

**Other labs (context only, older):**
- Microsoft, Satya Nadella, 2025-04-29, fireside chat at Meta's LlamaCon: 20% to 30% of the code in Microsoft's repositories was "written by software". Mark Zuckerberg, asked the same, said he did not know Meta's share. Microsoft CTO Kevin Scott had earlier projected 95% of code AI-generated by 2030. (https://techcrunch.com/2025/04/29/microsoft-ceo-says-up-to-30-of-the-companys-code-was-written-by-ai/, Maxwell Zeff, read 2026-11-13.) No 2026 Microsoft, Meta or OpenAI figure was found in a source that was opened.

**AI building AI (E8), in the labs' own words:**
- Anthropic's definition: recursive self-improvement is "an AI system capable of fully autonomously designing and developing its own successor". Its position: "We are not there yet, and recursive self-improvement is not inevitable." What is missing: "large performance gaps persist when it comes to Claude exercising judgement in choosing goals". What it expects if the trend holds: "If this happens, future versions of Claude could be continuously improved by Claude itself." (essay URL above, read 2026-11-13.)
- Anthropic's S-1 (2026-10-26): "Each version of a Claude model assists in building the next, helping to compress development timelines and produce compounding improvements in the speed at which we innovate. We refer to this recursive dynamic as "closing the loop,"". And: "Many aspects of the research, training, and testing of subsequent model generations now involve Claude, including running experiments, generating and processing training data, automating evaluations and safety audits, and writing and reviewing code." (S-1 URL above.)
- Anthropic's S-1/A (2026-11-02), risk factors: "our internal estimates and our expectations regarding future models, rather than our current models, indicate that we may imminently meet our Responsible Scaling Policy's definition of "dramatically accelerated progress attributable to AI." We have not designated any of our current models as exceeding this threshold, and we continue to assess the underlying data." (S-1/A URL above, read in the filing text.) TechCrunch (Julie Bort, 2026-11-02) also quotes the filing: "We do not anticipate being able to safely use Claude to fully autonomously design and build successive generations of frontier models without meaningful human supervision or understanding if and when that becomes technically possible." (https://techcrunch.com/2026/11/02/anthropic-warns-that-its-very-close-to-rsi-capability-aka-self-building-ai/, read 2026-11-13; this sentence was read on TechCrunch, not located by me in the filing: [VERIFY] before it is shown.)
- Dissent on record: Georgia Tech professor Mark Riedl called the labs' focus on recursive self-improvement a "hype train" (seen in a search summary of press coverage, article not opened: [VERIFY], do not quote on screen).

**End of 2026 vs end of 2027 (the projection, all conditional):**
- Anthropic essay: the length of task AI can complete "has been doubling roughly every four months, up from an earlier trend of doubling every seven months"; "If this trend holds, tasks that take a skilled person days could come into range this year."; "In 2027, AI systems could be capable of tasks that take a person weeks." (essay URL above.) These are Anthropic's own conditional statements ("if", "could"): the script keeps the "could".
- The run of dated points the viewer can check: Google more than 25% (Oct 2024), 50% (fall 2025), 75% (Apr 2026); Anthropic low single digits (before Feb 2025), more than 80% (May 2026), over 90% (Sep 2026).

**Plain-language summary the sources support (for the strategist, not a quote):** In 18 months Google's own number for AI-generated new code went from a quarter to three quarters, with engineers approving it. At Anthropic the share went from almost nothing to over 90% in around 19 months. Both companies describe the same change in the engineer's day: less typing, more directing and reviewing. Anthropic says plainly that full self-improving AI has not arrived, and in the same breath tells investors that each model already helps build the next and that its own acceleration threshold may be met soon. So the true line is: the loop has started closing, with people still in it. And the people in it are the ones who decide what to build.

### Pillar 2: THE POD (then and now)

- **Spotify squad (Henrik Kniberg and Anders Ivarsson, "Scaling Agile @ Spotify with Tribes, Squads, Chapters & Guilds", October 2012):** "The basic unit of development at Spotify is the Squad. A Squad is similar to a Scrum team, and is designed to feel like a mini-startup. They sit together, and they have all the skills and tools needed to design, develop, test, and release to production." "A squad doesn't have a formally appointed squad leader, but it does have a product owner. The product owner is responsible for prioritizing the work to be done by the team, but is not involved with how they do their work." Squads use "metrics and A/B testing to find out what really works and what doesn't". The authors' disclaimer: "We didn't invent this model." (https://blog.crisp.se/wp-content/uploads/2012/11/SpotifyScaling.pdf, read 2026-11-13.) The paper gives no fixed squad headcount in the pages read (1 to 4): do not air a squad size from it.
- **Scrum Guide (2020 edition, November 2020):** "The Scrum Team is small enough to remain nimble and large enough to complete significant work within a Sprint, typically 10 or fewer people." "Scrum Teams are cross-functional, meaning the members have all the skills necessary to create value each Sprint." "Scrum defines three specific accountabilities within the Scrum Team: the Developers, the Product Owner, and the Scrum Master." (https://scrumguides.org/scrum-guide.html, read 2026-11-13.)
- **What one engineer with agents now covers (the labs' own descriptions):** design-to-release direction by one person is described, not measured. Anthropic S-1: engineers "increasingly direct and review its work rather than write code line by line". Anthropic essay: "humans supply the goal, but they no longer need to supply the method"; it expects effort to move "towards oversight, validation, and verification" and warns "human review will become the bottleneck to AI development". Pichai: engineers direct "fully autonomous digital task forces". (URLs in pillar 1.)
- **The product engineer already absorbs PM and design work (pre-agent evidence that the pod was compressing):** PostHog lists product engineers as "opinionated on the roadmap and future of the product" and "able to make design decisions to create great experiences", and says talking to users "isn't only a job for product managers and salespeople." (https://posthog.com/blog/what-is-a-product-engineer, Ian Vanagas, 2022-12-01, read 2026-11-13.)
- **Mike's own proof (E10):** first-person, no outside source needed. One sentence, his words.
- **Plain-language summary (for the strategist, not a quote):** the textbook pod is a small cross-functional team, 10 people or fewer, holding every skill needed to design, build, test and release, with a product owner deciding what gets built. Mike's six boxes (frontend, backend, QA, PM, designer, marketer) are a fair picture of that team. What the labs now describe is the same set of jobs with one person supplying the goal and reviewing the result. The pod did not vanish; its seats are filled by agents and one engineer runs it.

### Pillar 3: THE VERSIONS OF THE ENGINEER (definitions, posting language, who hires)

**The funnel (origin):**
- Dave McClure, "Startup Metrics for Pirates", subtitle "AARRR!!! (Startup Metrics for Product Marketing & Product Management)". The five stages as written on his slides: Acquisition "users come to the site from various channels"; Activation "users enjoy 1st visit: 'happy' user experience"; Retention "users come back, visit site multiple times"; Referral "users like product enough to refer others"; Revenue "users conduct some monetization behavior". (https://www.slideshare.net/slideshow/startup-metrics-for-pirates-long-version/89026, read 2026-11-13.) Date and venue (Ignite Seattle, August 2007) are secondary only: [VERIFY]. One secondary article gives 2006 for the framework: do not put a month on screen; "2007" needs the verify.
- AAARRR (three A's: Awareness, Acquisition, Activation, Retention, Referral, Revenue) is the common later extension of McClure's five-stage AARRR; Awareness was added in front by someone after McClure, and the extension's author is not sourced. It is NOT Mike's invention (Mike, 2026-11-14: he learned it that way). "AARRR" appears only when citing McClure's deck.

**Growth engineer:**
- PostHog (Ian Vanagas, 2023-04-26): growth engineers "focus entirely on projects dedicated to driving as much growth as possible, no matter where they build those projects." Their targets: "signups, subscriptions, and revenue". Work named: SEO and landing pages, "Optimizing the signup funnels", A/B tests on "the signup and activation funnel". "Growth ideas need testing in the real world". Contrast with the product engineer: product engineers "focus on building products for specific users", growth engineers "focus on projects that drive growth." PostHog on its own team: "our growth team has always been entirely made up of them" (former technical founders). (https://posthog.com/blog/what-is-a-growth-engineer, read 2026-11-13.)
- From PostHog's newsletter, seen in search results only (not opened): "Many experiments fail. Often, a majority of experiments fail." [VERIFY] before quoting; it matches Mike's "scrapped or scaled".
- Growth hacker vs growth marketer: Mike's own definitions (his 2023 video, remade in the channel's "AI Growth Engineers vs. AI Product Engineers"). No outside source was opened for them; they air as his framing, two lines (E11).

**Product engineer:**
- PostHog (Ian Vanagas, 2022-12-01): "A product engineer, at its most basic, is a software engineer building products." "What makes them unique is their focus on creating a product for users." They "care about building a solution to problems that provides value to users." Quoting incident.io's job post: "Care more about outcomes and impact than the exact implementation, or the tools used to solve the problem." Job posts quoted in the article: incident.io, Fly.io, Ashby, Ghost. (https://posthog.com/blog/what-is-a-product-engineer, read 2026-11-13.)
- "Feature engineer" as a synonym (Mike: "some call it a feature engineer"): no source opened that uses it this way. Note for the accuracy pass: in machine learning, "feature engineering" means building model input features, a different thing. See Open question 5.
- Retention as the product engineer's stage is Mike's mapping (E1); McClure's own line for Retention is "users come back, visit site multiple times".

**Platform engineer:**
- CNCF Platforms White Paper (v1.0): a platform is "an integrated collection of capabilities defined and presented according to the needs of the platform's users". Its users are internal: "application developers, data scientists and information workers". "a few platform teams serve many product teams". "A platform exists to serve the requirements of its users". Platform teams own "the interfaces to and experiences with platform capabilities" and must "learn about the requirements of platform users". (https://tag-app-delivery.cncf.io/whitepapers/platforms/, read 2026-11-13.) This supports Mike's "there could be a PM for those teams": the paper treats the platform as a product with internal customers.
- No platform engineer job posting was opened; "who hires them" is not sourced here (Open question 6).

**GTM engineer:**
- Clay (Mishti Sharma and Varun Anand, 2026-04-21): "GTM engineering is the practice of building automated revenue systems using AI, data enrichment, and workflow automation." "GTM engineers build revenue engines using AI and automation." Origin, Clay's own claim: "Clay coined the term in 2023." Systems named in the article: a CRM (a script that "backfills Salesforce"), an email-sending platform, data warehouses, Slack digests for sellers. Employers named with GTM engineers: Rippling ("automating outbound and direct mail campaigns"), Verkada, Ramp, and Anthropic (a pod using Claude with Clay). Posting volume, Clay's own unsourced figure: "about 100 GTME job listings go live every month." (https://www.clay.com/blog/gtm-engineering, read 2026-11-13.) Clay sells the tool, so every claim on that page is self-reported.
- This matches Mike's split exactly: outbound, CRM and sales systems sit with the GTM engineer, never with the growth engineer.

**Forward-deployed engineer (E7, optional fifth version):**
- Fortune (Preston Fore, 2026-09-03): the role is "sending workers directly to customers to configure AI tools, integrate software, and solve complex business problems." Subheading: "The Palantir brainchild that's spreading across tech firms." Postings "rose more than 1000% between January and August 2026" compared to the same period a year earlier, and are up "more than 4,600% compared to 2023" (Lightcast). "Microsoft, Meta, Google, OpenAI and Anthropic currently all have openings for forward-deployed engineering roles." "Palantir currently has around four dozen open forward-deployed positions". Median advertised salary "more than $188,000" versus "roughly $145,000 for traditional software engineers" (Lightcast data shared by Paul Farnsworth, president of Dice). (https://fortune.com/2026/09/03/forward-deployed-engineers-fast-growing-six-figure-silicon-valley-job-integrate-ai-with-customers-tech-careers-palantir/, read 2026-11-13.) Lightcast's own page was not opened: the numbers are Fortune's report of Lightcast, [VERIFY] if shown as a stat.
- The earlier "up 800%" figure (January to September 2025, attributed variously to Indeed and the Financial Times) was NOT opened at a primary: Do-not-air.

**The outcome each version owns (E1; the mapping is the brief's, the stage definitions are sourced above):**

| Version | Owns (brief E1) | Sourced anchor |
|---|---|---|
| Growth engineer | awareness through activation, plus referral and revenue: conversion rates, experiments | PostHog: "signups, subscriptions, and revenue"; "the signup and activation funnel" |
| Product engineer | activation and retention: the customer keeps using it | PostHog: "outcomes and impact"; McClure Retention: "users come back, visit site multiple times" |
| Platform engineer | the company's own speed, reliability and cost: the internal customer | CNCF: users are "application developers, data scientists and information workers"; "a few platform teams serve many product teams" |
| GTM engineer | the sales pipeline and revenue systems | Clay: "automated revenue systems"; CRM, outbound |
| (FDE, optional) | the customer's deployment, on site | Fortune: "sending workers directly to customers" |

### Pillar 4: THE MARKET (who the demand is for) and the entry-level picture

**Dataset A (recommended for animated chart 2): the government separates "writes code" from "designs software".** BLS Occupational Outlook Handbook, both pages last modified 2026-08-27, read 2026-11-13:

| Occupation (BLS one-line description) | Jobs, 2025 | Projected change, 2025 to 2035 | Median pay, May 2025 |
|---|---|---|---|
| Computer programmers: "write, modify, and test code and scripts that allow computer software and applications to function" | 110,800 | minus 7% (minus 8,100) | $100,390 |
| Software developers, QA analysts and testers: "Software developers design computer applications or programs." | 1,905,400 | plus 10% (plus 185,400) | $134,040 (as printed on the page read; confirm which occupation the figure covers at capture) |

  - BLS on programmers: "Employment of computer programmers is projected to decline 7 percent from 2025 to 2035." "Computer programming work continues to be automated"; companies are expected to use technologies "including artificial intelligence (AI)" to "automate repetitive programming tasks". And the line that carries the thesis: "In addition, some higher skilled programming tasks will likely shift to other workers, such as software developers." (https://www.bls.gov/ooh/computer-and-information-technology/computer-programmers.htm)
  - BLS on developers: demand "is projected to be strong" "due to the continued expansion of software development for artificial intelligence (AI)". (https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm)
  - Caveats: these are 10-year PROJECTIONS, not counts of jobs already lost. "Computer programmer" is a small, narrow occupation (110,800 jobs) next to developers (1.9 million). Say "the government projects", and "the job that is only writing code".

**Dataset B (alternate for animated chart 2, or one supporting line): where the 2026 rebound in software postings went.** Indeed Hiring Lab:
- Guillermo Gallacher, "AI and Job Postings: From Destruction to Creation?", 2026-07-08: "71% of the increase in software development job postings between May 2025 and May 2026 is from senior roles and 37% is due to jobs that mention AI in their title" (the two overlap). "This suggests demand is growing for experienced professionals who can work with AI, not necessarily a broad-based recovery across all software roles." "US software development job postings have grown by almost 15% since the launch of Claude Code in late February, 2025, while overall job postings fell by 7% over the same period." At that date postings "remain about 27.5% below their pre-pandemic level". Caveats, its own: "the rebound has a low starting point"; "Correlation does not imply causation". Chart on the page: "The Software Development Rebound Is Concentrated in Senior and AI Roles". (https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/, read 2026-11-13.)
- Daniel Culbertson, "2026 Q3 US Tech Labor Market Update", 2026-11-12, postings through 2026-10-23: software development postings up 23.8% year over year ("compared with 3.1% for all postings"); "Since February 2020, all four remain lower, ranging from -19.2% for software development to -37.6% for data and analytics". "Somewhat unexpectedly, considering the concern over AI replacement, tech job categories are contributing to the recent uptick in job postings." Chart title: "Software Development job postings continue unexpected rebound". (https://hiringlab.indeed.com/2026/11/12/2026-q3-us-tech-labor-market-update/, read 2026-11-13.) [VERIFY]: live-drift.
- Felix Aidala and Sneha Puri, "The Labor Market Is Tilting Toward Seniority", 2026-07-23: "Software development tops the list, with senior-level positions accounting for 69.3% of job postings in Q1 2026"; entry-level share ranges "from 91.3% in personal care & home health to 4.5% in software development in Q1 2026". All sectors: "As of May 2026, senior-level job postings were up 14.7% year-over-year." "Entry-level job postings have been trending downwards since peaking in 2022, declining 7.5% year-over-year as of May 2026." On causes, the authors do not single out AI: "All of these factors may be at least partially at play" (AI, remote work, interest rates, post-pandemic right-sizing). (https://hiringlab.indeed.com/2026/07/23/the-labor-market-is-tilting-toward-seniority/, read 2026-11-13.)

**Dataset C (the entry-level picture, E6): Stanford Digital Economy Lab.** Erik Brynjolfsson, Bharat Chandar, Ruyu Chen, "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence", August 2026 revision, ADP payroll data through June 2026:
- "employment of young workers (ages 22-25) in AI-exposed occupations now stands 19% below where it would be had it kept pace with that of their less-exposed peers; experienced workers show no comparable gap." "It operates primarily through reduced hiring of young workers rather than increased separations." "Declines are concentrated in occupations where AI usage primarily substitutes for human tasks; where usage primarily complements workers, employment is flat or rising, especially for experienced workers." (PDF abstract, https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf, read 2026-11-13.)
- News post, 2026-08-12, title "No Widespread Displacement, but the AI Employment Gap for Young Workers Has Widened to 19%": "the shortfall was 15% at the July 2025 data vintage and is 19% as of June 2026." Mandatory caveats: "We do not see widespread, economy-wide job displacement associated with AI." "These are descriptive patterns, not causal estimates of the effect of AI." Also: "The divergence remains when we exclude technology firms and computer occupations." (https://digitaleconomy.stanford.edu/news/canariesaug26/, read 2026-11-13.)
- The 19% is a GAP against less-exposed peers of the same age, across all highly AI-exposed occupations. It is not "software developer employment fell 19%". In levels: employment of 22 to 25 year olds in the two most exposed groups "fell about 11% between November 2022 and June 2026" while the three least exposed "grew about 10%" (news post, footnote 1).
- Seed note: the 19% figure was used in the crypto channel's earlier AI-jobs videos (sibling DATA.md, "AI destroying lives"). This is a different channel; reuse is Mike's call.

**What an Indeed economist says the junior answer is (supports E6 and E9):** Sneha Puri, economist, Indeed Hiring Lab: "Being able to use AI in your work and improve your efficiency is a great place to start," "But communication, interpersonal skills and leadership are also really important," and she points to "the growing need for workers who can help businesses apply AI tools beyond simply building them." (CNBC, Corynn Winston, 2026-10-11, https://www.cnbc.com/2026/10/11/ai-software-developer-jobs.html, read 2026-11-13.) Same article, Eric Kutcher, North America chair, McKinsey: "It wasn't that long ago that we were reading the headline that there will be no more need for software developers," and "We're seeing much more growth in the places we thought we were gonna see the biggest displacement,".

**Titles that own an outcome are the ones growing (supporting lines, each self-reported or secondary):** forward-deployed engineer postings up "more than 1000%" January to August 2026 year over year (Lightcast via Fortune, above); "about 100 GTME job listings go live every month" (Clay's own figure, above). No primary posting-count series was found for growth engineer, product engineer or platform engineer titles (Open question 6).

**Plain-language summary the sources support (for the strategist, not a quote):** software jobs are not vanishing. Postings fell hard from 2022, are still around a fifth below early 2020, and have been climbing through 2026. The point is where the climb went: 71% of it to senior roles, 37% to jobs with AI in the title, and only 4.5% of software postings are entry level. The government's own 10-year outlook draws the same line: the occupation defined as writing code is projected to shrink 7%, the occupation defined as designing software to grow 10%, and BLS says the higher-skilled programming work shifts to developers. For people aged 22 to 25 in AI-exposed work, employment sits 19% behind their less-exposed peers, mostly because fewer are being hired. So the demand did not disappear; it moved up, toward people who direct the work and own a result.

### Pillar 5: WHAT TO DO NOW (the one number each version owns, E9)

These are the stage definitions and targets the sources above give; the "pick one, learn its number, ship one experiment" advice is the brief's (E9), not a quoted source.

| Stage or system | The number | Sourced wording |
|---|---|---|
| Acquisition | visitors by channel, signup conversion rate | McClure: "users come to the site from various channels"; PostHog: "Optimizing the signup funnels" |
| Activation | activation rate, time to value | McClure: "users enjoy 1st visit: 'happy' user experience"; PostHog: A/B tests on "the signup and activation funnel" |
| Retention | users who come back | McClure: "users come back, visit site multiple times" |
| Referral | users who refer others | McClure: "users like product enough to refer others" |
| Revenue | paying conversions, subscriptions, revenue | McClure: "users conduct some monetization behavior"; PostHog: "signups, subscriptions, and revenue" |
| Sales pipeline (GTM) | pipeline and meetings booked | Clay: "automated revenue systems"; Verkada's GTM engineers automate workflows so reps book more meetings (Clay's paraphrase, not a quote) |
| Internal platform | the speed, reliability and cost of the teams it serves | CNCF: "A platform exists to serve the requirements of its users". No metric set (for example deployment frequency or lead time) was opened at a primary: name the outcome, not a benchmark number |

- The experiment habit is sourced: Spotify squads use "metrics and A/B testing to find out what really works and what doesn't" (2012 paper); PostHog: "Growth ideas need testing in the real world".
- Awareness (Mike's first A) has no McClure line; it is Mike's stage and airs in his words.

### Where it stands (the dated timeline)

| Date | Event | Source (read 2026-11-13) |
|---|---|---|
| 2007 [VERIFY month and venue] | Dave McClure presents "Startup Metrics for Pirates: AARRR!" | SlideShare deck (opened); date secondary |
| 2012-10 | Kniberg and Ivarsson publish "Scaling Agile @ Spotify" (the squad) | blog.crisp.se PDF |
| 2020-11 | Scrum Guide 2020: a team is "typically 10 or fewer people" | scrumguides.org |
| 2022-12-01 | PostHog publishes "What is a product engineer" | posthog.com |
| 2023 | Clay says it coined "GTM engineer" | clay.com (self-reported) |
| 2023-04-26 | PostHog publishes "What is a growth engineer" | posthog.com |
| 2024-10-29 | Pichai: "more than a quarter of all new code at Google is generated by AI" | blog.google |
| 2025-02 | Claude Code research preview; Claude's share of Anthropic's merged code "in the low single digits" before it | anthropic.com essay |
| 2025-03-10 | Amodei at CFR: 90 percent "in three to six months", "essentially all" possibly in 12 | cfr.org |
| 2025-04 | Pichai: "well over 30% now" | diginomica.com [VERIFY] |
| 2025-04-29 | Nadella: 20% to 30% of Microsoft's repository code "written by software" | techcrunch.com |
| fall 2025 | Google at 50% (per Pichai, 2026-04-22) | blog.google |
| 2026-04-22 | Pichai: "75% of all new code at Google is now AI-generated and approved by engineers" | blog.google |
| 2026-05 | Anthropic: "more than 80% of the code we merge" authored by Claude | anthropic.com essay |
| 2026-07-08 | Indeed: 71% of the software-postings increase is senior roles, 37% AI-titled | hiringlab.indeed.com |
| 2026-08-12 | Stanford: the young-worker gap in AI-exposed jobs widens to 19% | digitaleconomy.stanford.edu |
| 2026-08-27 | BLS 2025 to 2035: programmers minus 7%, software developers plus 10% | bls.gov |
| 2026-09 | Anthropic: "over 90% of the contributions to our codebase" written by Claude | S-1, sec.gov |
| 2026-10-26 | Anthropic files its S-1 | sec.gov |
| 2026-11-02 | Anthropic S-1/A: "may imminently meet" its AI-acceleration threshold; no current model designated as exceeding it (SUPERSEDED 2026-11-10) | sec.gov |
| 2026-11-10 | Anthropic S-1/A No.2: "we made a determination that we have met this threshold", based on expected future models, not current ones | sec.gov |
| 2026-11-12 | Indeed: software postings up 23.8% year over year, 19.2% below February 2020 | hiringlab.indeed.com |

**Shipped vs planned (one-line ledger for the close):**
- SHIPPED (measured, company-reported): 75% of Google's new code AI-generated and engineer-approved (Apr 2026); over 90% of Anthropic's codebase contributions written by Claude (Sep 2026); each Claude model assists in building the next.
- THRESHOLD CALLED (the source's own words, S-1/A No.2, 2026-11-10): "we made a determination that we have met this threshold" ... "based on what we expect from future models and our overall rate of progress, rather than on what we have observed from current models". It was "may imminently meet" in No.1 (2026-11-02).
- PLANNED / PROJECTED (conditional): "In 2027, AI systems could be capable of tasks that take a person weeks."; BLS 2025 to 2035 projections.
- NOT ARRIVED (Anthropic's own position): "We are not there yet, and recursive self-improvement is not inevitable."

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **Sundar Pichai** | "CEO of Google and Alphabet"; author of the 2026-04-22 Cloud Next '26 post and the earnings remarks | blog.google byline |
| **Anat Ashkenazi** | Alphabet CFO; the "nearly half" line, 2025-10-29 | officechai.com (secondary) [VERIFY] |
| **Anthropic** | Maker of Claude and Claude Code; S-1 filed 2026-10-26, S-1/A 2026-11-02 | sec.gov filings |
| **Dario Amodei** | Anthropic CEO; CFR speaker, 2025-03-10 | cfr.org event page |
| **Marina Favaro, Jack Clark** | Authors of the Anthropic Institute essay "When AI builds itself" (editorial support: Santi Ruiz) | essay byline |
| **Satya Nadella** | Microsoft CEO; LlamaCon fireside chat, 2025-04-29 | techcrunch.com |
| **Dave McClure** | Author of "Startup Metrics for Pirates" (AARRR); his blog is "Master of 500 Hats" | SlideShare deck page |
| **Henrik Kniberg, Anders Ivarsson** | Authors of "Scaling Agile @ Spotify", October 2012 | the PDF's title page |
| **Scrum Guide** (Ken Schwaber, Jeff Sutherland) | 2020 edition, November 2020 | scrumguides.org (authors named on the guide; not re-read for this table, [VERIFY] if named on screen) |
| **PostHog** / **Ian Vanagas** | Product analytics company / author of both role posts | posthog.com bylines |
| **Clay** / **Mishti Sharma, Varun Anand** | GTM data and automation company, says it coined "GTM engineer" in 2023 / authors of the 2026-04-21 post | clay.com byline |
| **CNCF** (Cloud Native Computing Foundation), TAG App Delivery | Publisher of the Platforms White Paper v1.0 | tag-app-delivery.cncf.io |
| **Palantir** | Origin of the forward-deployed model per Fortune ("The Palantir brainchild") | fortune.com |
| **Lightcast** / **Paul Farnsworth** (president of Dice) | Labor-market data firm / shared the FDE figures with Fortune | fortune.com |
| **Indeed Hiring Lab**: **Guillermo Gallacher**, **Daniel Culbertson**, **Felix Aidala**, **Sneha Puri** | Authors of the three posts used | hiringlab.indeed.com bylines |
| **Erik Brynjolfsson, Bharat Chandar, Ruyu Chen** | Stanford Digital Economy Lab, "Canaries in the Coal Mine?" (August 2026 revision) | PDF title page |
| **U.S. Bureau of Labor Statistics (BLS)** | Occupational Outlook Handbook, pages last modified 2026-08-27 | bls.gov |
| **Eric Kutcher** | North America chair, McKinsey | cnbc.com |

Terminology for graphics: "AAARRR" on screen and in Mike's lines (Awareness, Acquisition, Activation, Retention, Referral, Revenue); "AARRR" only when citing McClure's deck. "growth engineer", "product engineer", "platform engineer", "GTM engineer" (go-to-market), "forward-deployed engineer (FDE)". "Claude", "Claude Code", "Anthropic", "Google", "Alphabet". Percentages exactly as the source words them: "more than a quarter", "well over 30%", "50%", "75%", "more than 80%", "over 90%". No em dashes. Never name or call out another creator.

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| "75% of Google's code is written by AI" (all of Google's code, or written with no human) | Pichai's sentence is about NEW code, "AI-generated and approved by engineers". The existing codebase is not covered | "Google's CEO says 75% of all NEW code at Google is AI-generated and approved by engineers" (2026-04-22) |
| "We've reached recursive self-improvement" / "the AIs can improve themselves now" (the brief's own wording) | Anthropic: "We are not there yet, and recursive self-improvement is not inevitable." Its S-1/A: no current model designated as past the threshold | "The loop has started closing": each Claude model already helps build the next, and Anthropic told investors it "may imminently meet" its own acceleration threshold (2026-11-02) |
| "AI writes 100% of the code at Anthropic" / "Claude Code is 100% written by Claude Code" | Attributed to Mike Krieger (Cisco AI Summit, Feb 2026) and Boris Cherny in secondary write-ups; neither statement was opened at a primary. Personal or single-product claims, not company-wide | Use the two primary figures: "more than 80%" merged (May 2026), "over 90% of the contributions" (Sep 2026) |
| "Amodei was right: 90% of all code is written by AI" (industry-wide) | His 2025-03-10 line was a forecast about the world; the sourced 90% is Anthropic's OWN codebase, September 2026, 18 months later. His later "absolutely true now" remark (Oct 2025) was not opened | "At Anthropic itself, over 90% by September 2026" |
| "Engineers at Anthropic are 45 times more productive" (or 8 times) | The S-1 figure is daily VOLUME of code per engineer, not productivity. The essay says its own 8x "is almost certainly an overstatement" of the productivity gain and that lines of code measure "quantity over quality" | If used at all: "45 times the volume of code per engineer", labelled as volume |
| "Microsoft is at 30%, Meta at 50%" as current facts | Nadella's 20% to 30% is from April 2025; Zuckerberg said he did not know Meta's share and gave only a forecast. No 2026 figure opened. "OpenAI is at 80%" (Brockman) seen in a search summary only | Leave them out, or "back in April 2025, Microsoft's CEO said 20 to 30%" |
| "Software engineering jobs are disappearing" / "nobody is hiring developers" | Indeed, 2026-11-12: software development postings UP 23.8% year over year. BLS projects software developers plus 10% to 2035 | "The demand didn't disappear, it moved": 71% of the increase went to senior roles, 4.5% of postings are entry level |
| "Software postings are 27.5% (or 30%, or 35%) below pre-pandemic" | Stale: 27.5% was the July 2026 reading. Latest is 19.2% below February 2020 (data to 2026-10-23) | "still around a fifth below early 2020" [VERIFY at record time] |
| "Employment of software developers aged 22 to 25 is down nearly 20% since late 2022" | From the first (August 2025) version of the Stanford paper and repeated by the press. The sentence is NOT in the text of the current August 2026 revision; only an appendix figure covers developers. CNBC attributes a "20%" to the Stanford 2026 AI Index, not opened | Use the current headline: young workers in AI-exposed jobs are 19% behind their less-exposed peers (August 2026), plus Indeed's 4.5% entry-level share |
| "AI cut young developers' jobs by 19%" | The 19% is a relative gap across ALL highly AI-exposed occupations, and the authors say "These are descriptive patterns, not causal estimates of the effect of AI." | "19% behind their peers in less-exposed jobs", with "mostly because fewer are being hired" |
| "It's easier for young people to get in now" (the brief's point 5, read literally) | Entry-level postings down 7.5% year over year (May 2026); 4.5% of software postings are entry level | E6: the next generation arrives with the mindset; with fewer junior openings, the ones who get hired show up able to own an outcome |
| "Forward-deployed engineer postings are up 800%" | The 2025 figure, attributed to Indeed and/or the Financial Times; no primary opened (Fast Company 403) | If the FDE airs: "up more than 1000% this year, per Lightcast data reported by Fortune" (Sep 2026), attributed |
| "3,000 GTM engineer jobs", "GTM engineer postings up 205%" | Vendor blogs and job boards with different windows and no method; not opened at a primary | Clay's own, attributed and labelled self-reported: "around 100 new listings a month, by Clay's count", or no number |
| "Spotify squads were 6 to 8 people" / "Amazon's two-pizza team" | No squad size in the pages of the Spotify paper read; the two-pizza source was not opened | "typically 10 or fewer people" (Scrum Guide 2020) |
| "The pirate funnel was invented in 2007 at Ignite Seattle" as an on-screen date | Date and venue are secondary only; one source says 2006 | "Dave McClure's Startup Metrics for Pirates" with no date, or the year after it is verified |
| "Clay invented the GTM engineer" as fact | Clay's own claim on Clay's own blog | "Clay says it coined the title in 2023" |
| Any percentage for how much of ALL the world's code AI writes (GitHub "half", "80% eventually") | CNBC notes GitHub "has not confirmed" the halfway claim; the 80% is a forecast | Stick to named companies with dated statements |

---

## 5. Market snapshot

Pulled 2026-11-14 02:48 UTC (2026-11-13 local) from the pages named. All [VERIFY] at record time and at render.

| Figure | Value at read | Note |
|---|---|---|
| Google, share of NEW code AI-generated and engineer-approved (latest public figure) | 75% (stated 2026-04-22) | [VERIFY] a newer statement may land (next Alphabet call, early 2027) |
| Anthropic, share of merged code authored by Claude | "more than 80%" (as of May 2026) | [VERIFY] essay is updated in place ("Update 9/18/2026") |
| Anthropic, share of codebase contributions written by Claude | "over 90%" (September 2026; S-1 filed 2026-10-26, repeated in S-1/A No.1 2026-11-02, No.2 2026-11-10 and the 2026-11-12 FWPs) | confirmed by the accuracy pass 2026-11-13; re-check only on a newer amendment |
| Anthropic, daily code volume per engineer, Q3 2026 vs 2024 | "over 45 times" | [VERIFY] newest amendment; volume, not productivity |
| Anthropic RSI threshold status | "have met this threshold", based on expected future models (S-1/A No.2, 2026-11-10; was "may imminently meet" on 2026-11-02) | [VERIFY] live: a new report or amendment can change this sentence any week |
| Indeed software development postings, year over year | plus 23.8% (to 2026-10-23, published 2026-11-12) | [VERIFY] monthly drift |
| Indeed software development postings vs February 2020 | minus 19.2% (to 2026-10-23) | [VERIFY] monthly drift |
| Indeed, senior share of the May 2025 to May 2026 increase in software postings | 71% (AI-titled: 37%, overlapping) | fixed window, not drifting |
| Indeed, entry-level share of software development postings | 4.5% (2026 Q1); senior 69.3% | quarterly; [VERIFY] if a Q3 reading is published |
| Stanford young-worker gap, AI-exposed occupations | 19% (data to June 2026, published 2026-08-12) | [VERIFY] the paper is revised a few times a year |
| BLS computer programmers, 2025 to 2035 | minus 7% (110,800 jobs in 2025, minus 8,100) | primary, fixed until the 2027 projections |
| BLS software developers, QA analysts and testers, 2025 to 2035 | plus 10% (1,905,400 jobs in 2025, plus 185,400) | primary, fixed until the 2027 projections |
| Forward-deployed engineer postings, Jan to Aug 2026 vs a year earlier | "more than 1000%" (Lightcast via Fortune, 2026-09-03) | [VERIFY] secondary; only if the FDE airs |
| Palantir open forward-deployed positions | "around four dozen" (Fortune, 2026-09-03) | [VERIFY] live count; better left unsaid |

---

## 6. Clip candidates

None, by Mike's call (2026-11-13: "very simple. no clips"). Not searched. The screenplay writes `## CLIP-INSERTS` as NONE with that reason.

| ID | Who / what is said (verbatim, opened) | Source URL + window | Length | Context check | Supports |
|---|---|---|---|---|---|
| (none) | none, by Mike's call; not searched | | | | |

---

## CHART-SOURCE INDEX

Mike's caps: at most 2 system-design charts and 2 animated charts. C1 to C4 are those four. Everything after is a receipt (allowed, keep them few; the screenplay picks).

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | SYSTEM-DESIGN CHART 1 (E2): the AAARRR funnel, six stages (Awareness, Acquisition, Activation, Retention, Referral, Revenue), with the engineers mapped on: growth engineer bracketing awareness to activation plus referral and revenue; product engineer on activation and retention; GTM engineer beside revenue (the sales side: CRM, outbound, pipeline); platform engineer as the floor under the whole funnel (internal customers). Spotlighted one role at a time. Stage one-liners from McClure's deck; role labels from pillar 3 | section 2, pillar 3 (funnel + outcome table) | **code** (Type 2 system-design, static states) |
| C2 | SYSTEM-DESIGN CHART 2 (E3): the pod, then and now. Left: six boxes, six people (frontend, backend, QA, PM, designer, marketer), labelled "a typical pod" with the sourced caption "cross-functional, typically 10 or fewer people". Right: one engineer node directing agent nodes that carry those jobs; arrows "supplies the goal" out and "reviews" back | section 2, pillar 2 (Scrum Guide, Spotify paper, Anthropic essay and S-1 wording) | **code** (Type 2 system-design, static states) |
| C3 | ANIMATED CHART 1 (E4): how much code AI writes, the dated public claims. Two labelled series over time, never merged. Google (new code, AI-generated, engineer-approved): more than 25% (2024-10-29), 50% (fall 2025), 75% (2026-04-22); the "well over 30%" point (2025-04) only if its wording is verified. Anthropic: low single digits (before 2025-02), more than 80% of merged code (2026-05), over 90% of contributions (2026-09). Each point carries who said it and when; "more than" and "over" values draw as floors, not exact marks | section 2, pillar 1 (both tables) | **code** (Type 1 animated) |
| C4 | ANIMATED CHART 2 (E5), RECOMMENDED: BLS 2025 to 2035, two bars diverging from zero. Computer programmers ("write, modify, and test code"): minus 7%. Software developers ("design computer applications or programs"): plus 10%. Sub-label: "Projected, U.S. Bureau of Labor Statistics, 2025 to 2035". Optional count-up line under it: BLS's own sentence that higher-skilled programming tasks "will likely shift to other workers, such as software developers" | section 2, pillar 4, Dataset A | **code** (Type 1 animated) |
| C4-ALT | ALTERNATE for the same single slot (Mike picks one, never both): Indeed, where the 2026 rebound in software postings went. 71% senior roles, 37% AI-titled (overlapping), against entry-level at 4.5% of postings | section 2, pillar 4, Dataset B | **code** (Type 1 animated) |
| C5 | Receipt: Pichai's Cloud Next '26 post, the sentence "Today, 75% of all new code at Google is now AI-generated and approved by engineers, up from 50% last fall." with the byline and date | https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/ (crop to the paragraph) | **screencap** |
| C6 | Receipt: Anthropic S-1, the sentence "over 90% of the contributions to our codebase in September 2026 were written by Claude." | https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm (search the page for "contributions to our codebase"; crop to the sentence) [VERIFY newest amendment] | **screencap** |
| C7 | Receipt: Anthropic essay "When AI builds itself", title plus the line "We are not there yet, and recursive self-improvement is not inevitable." (and, if wanted, the "more than 80%" sentence) | https://www.anthropic.com/institute/recursive-self-improvement | **screencap** |
| C8 | Receipt: BLS Computer Programmers page, the Job Outlook line "projected to decline 7 percent from 2025 to 2035" | https://www.bls.gov/ooh/computer-and-information-technology/computer-programmers.htm | **screencap** |
| C9 | Receipt: Indeed Hiring Lab chart "The Software Development Rebound Is Concentrated in Senior and AI Roles" | https://hiringlab.indeed.com/2026/07/08/ai-and-job-postings-from-destruction-to-creation/ | **screencap** (never restyle) |
| C10 | Receipt (optional): Stanford post headline "No Widespread Displacement, but the AI Employment Gap for Young Workers Has Widened to 19%" | https://digitaleconomy.stanford.edu/news/canariesaug26/ | **screencap** |
| C11 | Receipt (optional): Dave McClure's "Startup Metrics for Pirates" title slide or the AARRR slide | https://www.slideshare.net/slideshow/startup-metrics-for-pirates-long-version/89026 | **screencap** |
| C12 | Receipt (optional, one of): PostHog "What is a growth engineer" title, or Clay "GTM engineering" definition line | https://posthog.com/blog/what-is-a-growth-engineer ; https://www.clay.com/blog/gtm-engineering | **screencap** |
| C13 | Receipt (only if the FDE airs): Fortune headline on forward-deployed engineers | https://fortune.com/2026/09/03/forward-deployed-engineers-fast-growing-six-figure-silicon-valley-job-integrate-ai-with-customers-tech-careers-palantir/ | **screencap** |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. C1 to C4 are code-built, text-accurate and trace to section 2; every receipt is a real-site capture. No other chart or diagram is in budget.

---

## Open questions for Mike

1. **"Recursive self-improvement" (your wording vs the sources).** Anthropic's own line is "We are not there yet". What is sourced and strong: each Claude model helps build the next (Anthropic calls it "closing the loop"), over 90% of its code is written by Claude, and on 2026-11-02 it told investors it "may imminently meet" its own threshold for AI-accelerated progress. Recommendation: say "the loop has started closing" with that receipt, and keep "recursive self-improvement" as the thing the labs say is close, not the thing that has happened.
2. **Brief contradiction check (one soft contradiction, the angle survives).** "Less and less demand" is not what the newest posting data shows on its face: software development postings are up 23.8% year over year (Indeed, 2026-11-12). The angle holds in its true form: the demand moved to senior and AI-titled roles (71% and 37% of the increase), entry level is 4.5% of postings, and BLS projects the code-only occupation down 7% while developers grow 10%. Recommendation: the CH5 line is "the demand didn't disappear, it moved", never "the jobs are gone".
3. **Animated chart 2: which dataset.** Recommended C4 (BLS programmers minus 7% vs developers plus 10%): a government source that literally separates "writes code" from "designs software". Its weakness: a projection, and programmers are a small occupation (110,800 jobs). Alternate C4-ALT (Indeed 71% / 37% / 4.5%): real 2026 data, but it needs one more sentence of setup. Your pick.
4. **Which AI-code numbers air.** Confirmed and primary: Google 75% (new code, engineer-approved, 2026-04-22); Anthropic over 90% (September 2026) and more than 80% merged (May 2026). The Google mid-points "well over 30%" (April 2025) and the CFO's "nearly half" (October 2025) rest on secondary transcripts; the chart can run on the three primary Google points (more than 25%, 50%, 75%) without them.
5. **"Some call it a feature engineer."** No source was found that uses "feature engineer" for the product engineer, and in machine learning "feature engineering" means something else. On a channel about AI engineering that could read as a slip. Recommendation: drop the aside or say "feature teams".
6. **Not found: posting counts for growth, product and platform engineer titles, and a platform engineer job posting.** No primary source gives a title-level trend for them. The video can define them from the sources opened (PostHog, CNCF) and name hirers only where a source does (PostHog quotes job posts from incident.io, Fly.io, Ashby and Ghost for product engineers; Clay names Rippling, Verkada, Ramp and Anthropic for GTM engineers). If you want live postings as receipts, they need a capture at record time.
7. **The funnel's date.** McClure's deck is confirmed; "2007, Ignite Seattle" is secondary only. Recommendation: say "Dave McClure's pirate metrics" with no year, or have the receipt-capturer confirm the year before it goes on screen.
8. **The forward-deployed engineer (E7).** If it airs, the only opened figure is Lightcast's "more than 1000%" as reported by Fortune (2026-09-03), which must be attributed that way. The older "800%" is out.
9. **The 19% Stanford figure** was used on the crypto channel's AI-jobs videos. Different channel and audience; flagging it so the reuse is your decision.
10. **Sources that could not be opened:** Alphabet's own Q1 2025 and Q3 2025 call transcripts, the newest Anthropic S-1 amendment (around 2026-11-10), Axios (2026-06-04), Fast Company and the Financial Times on forward-deployed engineers, Lightcast's own page, LinkedIn's Jobs on the Rise 2026 list (secondary coverage shows none of growth, GTM or forward-deployed engineer on it; "AI engineers" is first), and the primaries for the Krieger and Cherny "100%" remarks. Nothing in sections 1 and 2 rests on them without a [VERIFY] tag.
