# reset: slide state cues (slide-builder, 2026-10-29)

Every PNG is a full 1920x1080 frame (light theme, chapter accent). A state PNG holds from its cue to the next state's cue.
Cue times are final-spine seconds from COVER-PLAN.json + `spine/ALL.d.desilenced.medium-words.json`. Shared pixels are
identical across one id's states, so a hard swap (or a 4 to 6 frame dissolve) reads as the row lighting, not a new card.
Source: `containers.html` (all frames) · driver: `python _shot.py [frame-id ...]`.

| id | type | beat | states (cue) |
|---|---|---|---|
| H4 | CARD | CH1@33.57-40.16 | s1 both bars full (33.57) · s2 'Your dollars' shrinks ('shrink' 35.66) · s3 'The debt' shrinks ('debt' 38.38) |
| H3 | CARD (motion-type) | CH1@60.26-64.70 | single; the slam-in on 'on purpose' (62.76) is comp motion |
| H2 | CARD (motion-type) | CH1@96.90-99.44 | single |
| title-CH2 | TITLE | CH2@99.44-100.43 | single (pause + hold under 'Nobody can pay.') |
| card-1.1+1.2 | CARD | CH2@109.14-117.24 | s1 'Passed 40T' ON (109.14) · s2 '+6.7B a day' ON, row 1 back to resting (113.14) |
| card-2.1 | CARD | CH2@150.82-158.82 | s1 (150.82) · s2 (155.14) |
| card-2.2 | CARD | CH2@162.30-169.40 | s1 (162.30) · s2 (166.76) |
| card-3.1 | CARD | CH3@224.70-231.16 | s1 (224.70) · s2 (228.68) |
| C1-breakout | CARD (one card, declared who-pays / who-wins pair) | CH3@297.30-302.26 | s1 paycheck ON (297.30) · s2 Bondholders ON (298.04) · s3 Who wins + Asset owners ON (299.74) |
| card-4.5 | CARD | CH3@305.14-312.53 | s1 (305.14) · s2 (309.16) |
| card-5.1 | CARD | CH4@364.20-370.80 | s1 headline, items resting (364.20) · s2 (366.10) · s3 (367.12) · s4 (369.94) |
| card-6.2 | CARD | CH4@413.72-420.80 | s1 (413.72, row lights on 414.24) · s2 (416.08) |
| card-7.3 | CARD | CH5@434.84-440.54 | single |
| card-7.1 | CARD | CH5@442.76-447.66 | s1 (442.76) · s2 (445.38) |
| card-7.2 | CARD | CH5@447.66-453.94 | s1 date lit (447.66) · s2 WEF line ON (452.46) |
| card-8.3 | CARD | CH5@501.40-510.32 | s1 eyebrow, body resting (501.40) · s2 EU row ON (503.90) · s3 'Voluntary to use' ON (509.12) |
| card-9.1 | CARD (ANIMATED count-up) | CH6@617.64-628.30 | s1 11.7% (617.64) · n118..n137 = 11.8% .. 13.7%, one per step across 625.32-626.44 (around 1.7 frames each at 30 fps) · s2 13.8% landed + 'to 13.8%' lit (626.44) |
| card-9.3 | CARD | CH6@647.20-656.10 | s1 resting (647.20) · s2 lit ('record' 650.16) |
| card-10.3 | CARD (Kaspa teal) | CH6@672.62-677.17 | single |
| card-10.4 | CARD | CH6@695.48-701.66 | single |
| card-11.1 | CARD | CH7@701.66-717.90 | s1 (701.66, row on 'nutshell' 702.16) · s2 (707.72) · s3 (711.14) · s4 (715.82) |
