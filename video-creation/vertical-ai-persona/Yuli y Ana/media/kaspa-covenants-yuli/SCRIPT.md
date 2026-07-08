# kaspa-covenants-yuli — SCRIPT (~60s vertical, Yuli)

**Persona:** Yuli, seated in her pink cat-ear chair, talking to camera (start frame =
`../../MASTER/studio-shots/yuli-pinkchair-webcam.png`). Casual, warm, energetic explainer in her
voice (Dominican accent) — NOT Mike's declarative register. Content mirrors Mike's long-form
"Kaspa's Covenants Put It Lightyears Ahead Of Every Other Crypto" (`longform-edited/media/kaspa-covenants/`).

**Format:** 9:16, target ~60s. FACE (Yuli on camera) on the hook / Toccata / close; cutaways
(containers + b-roll) over the dense explainer beats, same gated pattern as the Ana Toccata video.
**No em dashes.** Captions: Whisper hears "Kaspa" as "caspa" -> always correct to Kaspa; watch "Toccata".

---

## VO (verbatim — this is what Yuli says) — ~150 words

> Ok, Kaspa just did something Bitcoin has been arguing about for years. It is called a covenant.
> A covenant is a rule that lives inside the coin itself. The coin carries its own rules and enforces
> them. Send only here. Locked until later. Royalties you cannot skip.
> This is the Toccata hardfork, the biggest upgrade to Kaspa since Crescendo, and the whole network
> moves together with no chain split.
> Ethereum needs a full virtual machine on every node, a giant attack surface. Kaspa does not. It
> teaches the coins the rules directly. Same proof of work security as Bitcoin, with the
> programmability Bitcoin still cannot agree on.
> That unlocks native tokens, real DeFi, NFTs, vaults and escrow, on the fastest base layer in crypto.
> The story that Kaspa is just a fast payments coin is over.
> Covenants put Kaspa lightyears ahead of every other crypto. This changes what a coin can be.

(~152 words; at Yuli's accented pace ~58-62s.)

---

## Beat breakdown (for the edit)

| t (approx) | On screen | VO |
|---|---|---|
| 0:00-0:06 | **FACE** Yuli, pink chair | "Ok, Kaspa just did something Bitcoin has been arguing about for years. It is called a covenant." |
| 0:06-0:18 | COVER: rule-list container (send-only / time-lock / royalties) | "A covenant is a rule that lives inside the coin itself. The coin carries its own rules and enforces them. Send only here. Locked until later. Royalties you cannot skip." |
| 0:18-0:26 | **FACE** or Toccata title card | "This is the Toccata hardfork, the biggest upgrade to Kaspa since Crescendo, and the whole network moves together with no chain split." |
| 0:26-0:40 | COVER: Ethereum-VM vs Kaspa comparison | "Here is why it is huge. Ethereum needs a full virtual machine running on every node, heavy and a giant attack surface. Kaspa does not. It teaches the coins the rules directly. Same proof of work security as Bitcoin, with the programmability Bitcoin still cannot agree on." |
| 0:40-0:52 | COVER: ecosystem unlock (tokens / DeFi / NFTs / vaults) | "That unlocks native tokens, real DeFi, NFTs, vaults and escrow, on the fastest base layer in crypto. The story that Kaspa is just a fast payments coin is over." |
| 0:52-0:60 | **FACE** Yuli, close | "Covenants put Kaspa lightyears ahead of every other crypto. This changes what a coin can be." |

FACE beats = Yuli to camera in the pink chair; COVER beats = cutaways (system-design containers like the
longform C3b/C5b + b-roll) with her VO over them. Reuse / restyle the longform containers for 9:16.

---

## Production notes (per ../../YULI-SPEC.md + ../../CLAUDE.md)
- **Voice:** preferred = lip-sync to a pre-made Yuli clone track (Higgsfield Audio Seed Speech) via
  Seedance `--audio` + a MINIMAL prompt; else Seedance-native with the Dominican-accent line. Match
  clip duration to each spoken chunk (a too-long clip makes Seedance invent gibberish).
- **Video:** Seedance 2.0 image-to-video off the pink-chair still, **9:16, 480p ONLY** (Remotion
  upscales free). FACE beats = generate from the still; the close can chain from the hook's last frame.
- **Edit:** Remotion, mirror `AnaToccata.tsx` scene-comp; captions (Kaspa not caspa), music + SFX, QA.
- Channel = the Yuli/Ana IG persona channel (NOT Mike's main schedule-tweets queue).

## Status
- 2026-06-22: start-frame still DONE (`yuli-pinkchair-webcam.png`). Script drafted (this file) -> awaiting Mike's OK before producing audio/video.
