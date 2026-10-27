# faithful-crypto-intro - BROLL-PLAN (acquisition worklists)
_Authored 2026-10-17 by hand from `timeline.json` (a 44 s channel intro, no coverage-strategist pass: the cover layer is only the 32 s voice-over section). Every row is PLACED at the beat named: zero orphans. Format mirrors `longform-edited/skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0. Project root for outputs = THIS folder (`video-creation/yuli-y-ana/media/faithful-crypto-intro/`), NOT longform-edited/media._

**Channel:** Faithful Crypto (Yuli y Ana). **Hard rule (channel CLAUDE.md):** NO b-roll reuse across Mike's channels: every clip and image here must be FRESH (new concept + new file), never one already used in a @CodeMonkeyMike video.
**Budget:** Envato video 6 · ChatGPT images 6. The face scenes (0-8.45 s) and the end card (40.79-44.03 s) are comp-built, no b-roll.
**Look:** dark, moody grading; the studio is magenta / hot-pink, so pink, magenta and teal accents sit well. Beats are on the VO timeline (`timeline.json`, 30 fps). Every b-roll item is 4.0 s or less.

## Voice-over beats (what is being said while each slot plays)
| Beat | t (s) | Speaker | Line |
|---|---|---|---|
| VO05 | 8.45-14.77 | Yuli | On this channel we talk about the cryptos we truly believe in. The ones we hold through everything. |
| VO06 | 15.07-22.37 | Ana | Some of our favorites are Kaspa, Tao, Canton, and a few others you will hear a lot about. |
| VO07 | 22.67-31.00 | Yuli | We break down what each one does, why we are excited, and what is coming next. In plain, simple words. |
| VO08 | 31.30-36.80 | Ana | We keep it simple, we keep it fun, and we always do the homework. |
| VO09 | 37.10-40.49 | Yuli | So hit subscribe, and come be faithful with us. |

## Envato video (6) - sourcing via `skills/envato-broll/SKILL.md` (agent: envato-sourcer)
Output: `assets/vid/<id>-<slug>.mp4` in THIS project folder (1080p H.264, audio stripped, ~slot + 1 s handles).

| id | Beat (final spine) | Search query | Dur target | Motion | Status |
|---|---|---|---|---|---|
| BR-1 | VO05@8.45-11.6 ("the cryptos we truly believe in") | glowing blockchain network nodes connecting dark background | 3.15s | any | ☑ sourced assets/vid/BR-1-blockchain-network.mp4 |
| BR-2 | VO06@20.0-22.37 ("a few others you will hear a lot about") | many crypto coins falling slow motion dark background | 2.40s | any | ☑ sourced assets/vid/BR-2-glowing-orbs-floating.mp4 (re-sourced after visual-qa: abstract, no branded coins) |
| BR-3 | VO07@22.67-25.5 ("we break down what each one does") | exploded view mechanical parts disassembling hologram blueprint | 2.85s | LEAD | ☑ sourced assets/vid/BR-3-hologram-disassembly.mp4 |
| BR-4 | VO07@28.2-31.0 ("what is coming next. In plain, simple words") | road ahead night driving headlights forward motion | 2.80s | LEAD | ☑ sourced assets/vid/BR-4-night-road-forward.mp4 |
| BR-5 | VO08@31.3-34.2 ("we keep it simple, we keep it fun") | two women friends laughing laptop cozy evening | 2.90s | any | ☑ sourced assets/vid/BR-5-hands-neon-keyboard.mp4 (re-sourced after visual-qa: hands only, no faces) |
| BR-6 | VO09@37.1-40.49 ("so hit subscribe, and come be faithful with us") | neon pink light bokeh studio abstract slow | 3.40s | any | ☑ sourced assets/vid/BR-6-pink-bokeh-light.mp4 |

Bench phrasings if a query is dry: BR-1 "digital network particles connecting lines" · BR-2 "gold coins falling slow motion" · BR-3 "3d hologram blueprint rotating" · BR-4 "highway night timelapse forward" · BR-5 "friends laughing couch laptop" · BR-6 "pink neon bokeh lights abstract".

### Envato license trail (sourced 2026-10-17, envato-sourcer)
| id | Envato item | Title | In-point in original |
|---|---|---|---|
| BR-1 | https://app.envato.com/search/stock-video/52c52e7a-634f-4f8c-8698-3e08975a43a2 | A Rotating Three Dimensional Network (Kasper_KD) | 2.0 s |
| BR-2 | https://app.envato.com/search/stock-video/6744243f-9b17-432a-a00c-6322e910ee4a | Abstract Neon Glowing Orbs Floating on Black Background (ProximaCreate) | 1.0 s |
| BR-3 | https://app.envato.com/search/stock-video/ebb94c31-8280-41cd-926f-a138221b5c2f | Futuristic Hologram Disassembly of a Tech Device Animation (juan-ledezma) | 2.0 s |
| BR-4 | https://app.envato.com/search/stock-video/3b36088b-c9b8-45d6-a973-4ab4acb62d9a | Fast Night Road Trip Through a Tunnel (Stockagent_io) | 4.0 s |
| BR-5 | https://app.envato.com/search/stock-video/1657b690-a76e-4242-8c82-5e40e0dddbd9 | Hand Typing on Neon Pink Computer Keyboard (KinoMaster) | 6.0 s |
| BR-6 | https://app.envato.com/search/stock-video/a4b55df7-5b3e-4a96-856f-b9775c4e3ec8 | Pink Sparkling Lights with Bokeh Background (YB_x) | 3.0 s |
Rejected by visual-qa and deleted (still licensed to the account): BR-2 d7b1e75e (branded coins, readable lettering), BR-5 d6c244ef (real women read as the hosts, bright interior).
Untrimmed originals kept in `assets/vid/_orig/` for re-trims (recycle after delivery).

## ChatGPT images (6) - generation via the canonical browser pipeline (agent: image-gen)
Output: `assets/img/<id>-<slug>.png` in THIS project folder. House style per `persona/persona.json` `image_generation` (Pixar 3D CGI, navy near-black, rim light, no text) with magenta/pink rim accents welcome (the channel's studio is hot-pink). No text, no invented logos. `image_style`: house.

| id | Beat (final spine) | Prompt concept | Reference | Chapter style | Status |
|---|---|---|---|---|---|
| IMG-1 | VO05@11.6-14.77 ("the ones we hold through everything") | two steady hands cupping a cluster of glowing crypto coins while a dark storm of wind and rain rages around them, the coins warm and safe, Pixar 3D CGI, navy near-black, magenta rim light | none exists (generic approved) | house | ☑ generated assets/img/IMG-1-hands-storm-coins.png |
| IMG-2 | VO06@15.07-17.2 ("Kaspa") | the Kaspa coin hero shot: a teal coin with the backwards-K mark, floating over a dark reflective floor, teal glow, Pixar 3D CGI, navy near-black | `schedule-tweets/images/reference/kaspa-logo.png` (teal backwards-K, never gold) | house | ☑ generated assets/img/IMG-2-kaspa-coin.png |
| IMG-3 | VO06@17.2-18.6 ("Tao") | the Bittensor TAO coin hero shot: a white coin with the black tau mark, floating over a dark reflective floor, cool white glow, Pixar 3D CGI, navy near-black | `schedule-tweets/images/reference/bittensor-tao.png` | house | ☑ generated assets/img/IMG-3-tao-coin.png |
| IMG-4 | VO06@18.6-20.0 ("Canton") | a network of glass bank towers at night connected by golden light threads, institutional finance feel, one bright hub, Pixar 3D CGI, navy near-black (NO logo, NO text: no reference mark held for Canton) | none exists (generic approved, say so in the report) | house | ☑ generated assets/img/IMG-4-canton-glass-towers.png |
| IMG-5 | VO07@25.5-28.2 ("why we are excited") | a rocket shaped like a coin lifting off a launchpad with pink and teal exhaust, confetti sparks, joyful, Pixar 3D CGI, navy near-black, magenta rim | none exists (generic approved) | house | ☑ generated assets/img/IMG-5-coin-rocket.png |
| IMG-6 | VO08@34.2-36.8 ("and we always do the homework") | a cozy desk at night: a stack of thick books, a magnifying glass held over a glowing green candlestick chart on a tablet, warm lamp, Pixar 3D CGI, navy near-black | none exists (generic approved) | house | ☑ generated assets/img/IMG-6-homework-desk.png |
