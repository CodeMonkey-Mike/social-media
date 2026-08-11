"""tutorial / clip 4 (freaking-early-not-degen) — write the four ChatGPT b-roll genlists.

One item per file so `generate-broll-reload.js` is invoked once per image (the batch's rule while
several builders share the `chatgpt` stage lock), all inside ONE held lock.

`file` is joined onto video-creation/assets by the generator, so the `../shorts/...` prefix lands the
PNG in this batch's own public dir. Forward slashes on purpose: a JSON string with Windows separators
turns "\t" / "\r" into control characters.

REFERENCE-IMAGE GATE: this clip names NO project, coin, exchange or person (the subject is "this
particular token", deliberately unnamed), so NO reference image is attached to any prompt and no real
mark may appear. Every prompt therefore bans text, digits, logos, coins, crypto symbols and faces.
Run from the repo root:
  python video-creation/shorts/tutorial/freaking-early-not-degen/_write_genlists.py
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
P = "../shorts/tutorial/render-assets/"

NO_MARKS = ("NO text, NO words, NO letters, NO numbers, NO watermark, NO logos or brand marks, "
            "NO coins, NO cryptocurrency symbols, NO people, NO faces")

ITEMS = {
    # Frame-0 cover ART ONLY — the title and chip are drawn in CODE on top (SKILL: never bake text
    # into a ChatGPT image). Two divergent routes = the clip's whole argument.
    "cover": (P + "thumb-tutfed.png",
              "Vertical 9:16 cinematic poster art, deep black to charcoal background with volumetric fog "
              "and a heavy vignette. In the LOWER CENTRE of the frame a glowing path splits into two "
              "divergent routes. The LEFT route is a short, jagged, burning red line that rockets steeply "
              "upward, snaps off in mid air and crumbles downward into scattered dying embers. The RIGHT "
              "route is a long, smooth, cool teal cyan line that climbs steadily and calmly away into the "
              "far distance toward a faint sunrise glow on a low horizon. Dramatic cinematic rim light, "
              "sharp 3D render, lots of empty dark sky in the upper third of the frame. Absolutely "
              + NO_MARKS + ", NO animals."),
    # Beat 1, 1.95-4.55 s: "pump in the next two weeks ... and then die".
    "spike": (P + "broll-tut-fed-ov-spike.png",
              "Square image on a PURE SOLID BLACK #000000 background and nothing else, no checkerboard. "
              "Centered subject: a brightly glowing neon red and orange candlestick chart shape, fully "
              "opaque, showing a violent pump and collapse. A steep run of tall candles rockets up to a "
              "sharp peak at the top, then the candles collapse almost vertically down the right side into "
              "a flat row of tiny dead candles that dissolve into faint drifting embers. Strong outer glow "
              "that feathers into the black. NO grid lines, NO axis, NO price labels, "
              + NO_MARKS + ", NO background scenery, nothing but the glowing chart shape on pure black."),
    # Beat 4, 14.30-16.55 s: "when retail starts coming back in ... everybody's coming back in".
    # Persona rule: crowds are FACELESS silhouettes.
    "crowd": (P + "broll-tut-fed-ov-crowd.png",
              "Square image on a PURE SOLID BLACK #000000 background and nothing else, no checkerboard. "
              "Centered subject: a brightly glowing teal cyan wave made of a dense crowd of simple "
              "featureless human silhouettes seen from behind, fully opaque, surging forward and upward "
              "from the lower left toward the upper right like a cresting wave of people. Every figure is a "
              "plain solid silhouette with absolutely NO facial features, NO eyes, NO mouths, NO detail. "
              "Strong outer glow feathering into the black. NO text, NO words, NO letters, NO numbers, "
              "NO logos or brand marks, NO coins, NO cryptocurrency symbols, NO signs or banners, "
              "NO background scenery, nothing but the glowing crowd wave on pure black."),
    # Beat 7, 30.40-32.30 s: "I was so freaking early". A sunrise carries EARLY with no number and no
    # claim in it, which is what the 700M/1.8M content guard needs.
    "dawn": (P + "broll-tut-fed-ov-dawn.png",
             "Square image on a PURE SOLID BLACK #000000 background and nothing else, no checkerboard. "
             "Centered subject: a brilliant glowing sunrise just cresting a dark jagged mountain ridge "
             "line, fully opaque, with a small intensely bright sun disc on the ridge throwing long warm "
             "gold rays upward that cool to teal at their tips, and a thin glowing band along the ridge. "
             "Strong outer glow feathering into the black. " + NO_MARKS
             + ", NO animals, NO buildings, NO clouds filling the frame, nothing but the glowing sunrise "
               "and ridge on pure black."),
}

for key, (f, prompt) in ITEMS.items():
    out = os.path.join(HERE, f"_genlist-tutfed-{key}.json")
    json.dump([{"file": f, "prompt": prompt}], open(out, "w", encoding="utf-8"), indent=1)
    print(f"wrote {os.path.basename(out)}  file={f}  prompt={len(prompt)} chars")
