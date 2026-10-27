# kcc20 VERTICAL b-roll: sources, licence trail, comp tables

Sourced 2026-10-22 by envato-sourcer per `skills/vertical-repurpose/vertical-repurpose.md` §1. Every file is in
`assets/vertical/vid/`, named exactly like its 16:9 twin, 1080x1920 H.264 yuv420p, video only (no audio), trimmed to slot +
handles. The comp plays each file from frame 0, so the useful action starts at the head.

## Licence trail (Envato Elements item URLs)

| id | file | source | Envato item |
|---|---|---|---|
| BR-1 | BR-1-teal-particles.mp4 | NATIVE vertical: "Abstract Blue Light Rays and Falling Particles Background" (StrokeVorkz) | https://app.envato.com/search/stock-video/e043a3a1-4972-4822-82c7-a4d60346fd7b |
| BR-2 | BR-2-server-corridor.mp4 | NATIVE vertical: "Futuristic Neon Digital Server Room Corridor Background" (MegiasD) | https://app.envato.com/search/stock-video/4d8ed422-a8c9-440b-9784-4aa51511adbd |
| BR-4 | BR-4-network-nodes.mp4 | NATIVE vertical: "Abstract Technology Network Background with Dynamic Connected Points" (WolfCity) | https://app.envato.com/search/stock-video/f551f215-0825-4659-bf6b-c928b22c38ff |
| BR-5 | BR-5-phone-hand-cyan.mp4 | NATIVE vertical: "Close up of a Hand Scrolling on a Smartphone at Night" (brodski) | https://app.envato.com/search/stock-video/fdf14b6b-19cf-49f0-93ae-6c262b97ee3c |
| BR-6 | BR-6-envelope-handoff.mp4 | NATIVE vertical (rebuild 2026-10-22, replaces the failed centre crop): "Hand Placing a Brown Paper Envelope on a Workspace Table" (YuriArcursPeopleimages), source 0.60-5.00 s, 25 fps | https://app.envato.com/search/stock-video/b50f4657-3c99-450a-a448-72d0b6a26d9d |
| BR-7 | BR-7-stadium-roar.mp4 | NATIVE vertical: "Passionate Fans Cheering and Drumming at a Soccer Stadium" (DC_Studio) | https://app.envato.com/search/stock-video/c0d880a0-11e8-4ff0-84ec-9f1b84fef3f8 |
| BR-8 | BR-8-board-game-hop.mp4 | NATIVE vertical: "Hand Placing a White Pawn on a Wooden Chessboard" (africaimages) | https://app.envato.com/search/stock-video/09288f7b-5217-4850-8b86-861bbfac4ea9 |
| BR-11 | BR-11-earth-pullback.mp4 | NATIVE vertical: "Planet Earth Rotating in Space Vertical View" (icetray) | https://app.envato.com/search/stock-video/4fb60604-3978-4fb8-925f-c24a6939769a |
| BR-12 | BR-12-coders-night.mp4 | NATIVE vertical: "Young Adult Typing Code in Dark Office" (DC_Studio) | https://app.envato.com/search/stock-video/40ebdda2-9c6f-4498-bd7f-1b5f50353a5a |
| BR-13 | BR-13-steam-night-teal.mp4 | NATIVE vertical: "Industrial Engine Room Vertical Pan with Rising Steam" (icetray) | https://app.envato.com/search/stock-video/e4f22467-533c-466a-b694-93d91c157ef5 |
| BR-14 | BR-14-asic-mining-rigs.mp4 | NATIVE vertical: "Futuristic GPU Mining Rig with Spinning Fans and Blue Lights" (icetray) | https://app.envato.com/search/stock-video/059bbaa7-259d-4cdc-b4db-431cf0228007 |
| BR-15 | BR-15-ridge-flight-twilight.mp4 | NATIVE vertical (rebuild 2026-10-22, replaces the failed centre crop): the already-licensed pick, source 0.00-5.10 s (darkest, teal-dusk opening of a 28 s climb) | https://app.envato.com/search/stock-video/571081dd-83d3-42bd-a85a-606e0f6e376b |

## Comp tables for the vertical comp (DO NOT copy the 16:9 VID_FPS / VID_DUR: frame rates changed; BR-6 + BR-15 re-probed after the 2026-10-22 rebuild)

```ts
const VID_FPS_V: Record<string, number> = {
  'BR-1-teal-particles': 30000 / 1001, 'BR-2-server-corridor': 25, 'BR-4-network-nodes': 30000 / 1001,
  'BR-5-phone-hand-cyan': 25, 'BR-6-envelope-handoff': 25, 'BR-7-stadium-roar': 24000 / 1001,
  'BR-8-board-game-hop': 30000 / 1001, 'BR-11-earth-pullback': 30, 'BR-12-coders-night': 24000 / 1001,
  'BR-13-steam-night-teal': 30, 'BR-14-asic-mining-rigs': 30, 'BR-15-ridge-flight-twilight': 30000 / 1001,
};
const VID_DUR_V: Record<string, number> = {
  'BR-1-teal-particles': 4.5045, 'BR-2-server-corridor': 4.72, 'BR-4-network-nodes': 4.1041, 'BR-5-phone-hand-cyan': 5.6,
  'BR-6-envelope-handoff': 4.4, 'BR-7-stadium-roar': 3.5035, 'BR-8-board-game-hop': 5.2052, 'BR-11-earth-pullback': 4.4,
  'BR-12-coders-night': 5.5055, 'BR-13-steam-night-teal': 4.9, 'BR-14-asic-mining-rigs': 5.5, 'BR-15-ridge-flight-twilight': 5.1051,
};
```
(Re-probe with ffprobe before pasting; these are the values measured at sourcing.)
