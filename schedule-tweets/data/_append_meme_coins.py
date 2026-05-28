"""Append the 5 meme-coins-2026-05-28 shorts to data/shorts.json.
Preserves field order and ordered dict structure. Idempotent: skips ids that already exist.
"""
import json
from collections import OrderedDict
from pathlib import Path

HERE = Path(__file__).parent
JSON_PATH = HERE / "shorts.json"

NEW_SHORTS = [
    {
        "id": "mc-20260528-keycat-vs-doginme",
        "slug": "keycat-vs-doginme",
        "source_clip": "keycat-vs-doginme",
        "video_path": "shorts/meme-coins-2026-05-28/1-keycat-vs-doginme.mp4",
        "duration_seconds": 53.94,
        "title": "Keycat or DogInMe? The one I'd actually buy",
        "hook": "If you had to pick between Keycat and DogInMe, which would you choose?",
        "caption": (
            "If you had to pick between Keycat and DogInMe, which would you choose?\n\n"
            "Keycat went higher and is cheaper right now.\n\n"
            "But DogInMe is the one I'd put my money on. Did an 8x with my community in a single day "
            "on the Coinbase listing. 12 centralized exchanges already.\n\n"
            "Not financial advice. Holy crap don't take this as financial advice — you out of your mind?\n\n"
            "$DIM $KEYCAT #DogInMe #Keycat #MemeCoins #Solana #Crypto"
        ),
        "tags": ["DogInMe", "Keycat", "MemeCoins", "Solana", "Crypto", "Altcoins", "Coinbase"],
    },
    {
        "id": "mc-20260528-stop-hating-build-business",
        "slug": "stop-hating-build-business",
        "source_clip": "stop-hating-build-business",
        "video_path": "shorts/meme-coins-2026-05-28/2-stop-hating-build-business.mp4",
        "duration_seconds": 38.43,
        "title": "Stop hating crypto. Go build a business.",
        "hook": "Sitting around hating crypto, watching other people get rich?",
        "caption": (
            "Sitting around hating crypto, watching other people get rich?\n\n"
            "Why not use that time to build a business instead?\n\n"
            "Doesn't have to be crypto. Could be online. Could be something with your hands.\n\n"
            "Cut the vices. Get 5 to 10 extra hours a week. Compound it.\n\n"
            "End of year, you're doing so much better.\n\n"
            "#Mindset #BuildABusiness #Productivity #Discipline #SelfImprovement"
        ),
        "tags": ["Mindset", "BuildABusiness", "Productivity", "Discipline", "Hustle", "SelfImprovement"],
    },
    {
        "id": "mc-20260528-pengu-flips-pepe",
        "slug": "pengu-flips-pepe",
        "source_clip": "pengu-flips-pepe",
        "video_path": "shorts/meme-coins-2026-05-28/3-pengu-flips-pepe.mp4",
        "duration_seconds": 32.29,
        "title": "PENGU is going to flip PEPE. Here's the math.",
        "hook": "PENGU is the best performing meme coin for this supercycle.",
        "caption": (
            "PENGU is the best performing meme coin for this supercycle.\n\n"
            "It's going to flip Pepe.\n\n"
            "PENGU is already 10x the market cap of Toshi. If you're chasing multipliers, sure, Toshi.\n\n"
            "But SHIB got to $40B. PENGU will get there too.\n\n"
            "Can Toshi do the same? Maybe. Maybe not. PENGU has a higher chance.\n\n"
            "$PENGU #Pengu #PudgyPenguins #Pepe #Toshi #MemeCoins #Crypto"
        ),
        "tags": ["Pengu", "PudgyPenguins", "Pepe", "Toshi", "SHIB", "MemeCoins", "Crypto"],
    },
    {
        "id": "mc-20260528-house-coin-1000x",
        "slug": "house-coin-1000x",
        "source_clip": "house-coin-1000x",
        "video_path": "shorts/meme-coins-2026-05-28/4-house-coin-1000x.mp4",
        "duration_seconds": 28.68,
        "title": "Everyone hates Housecoin. I see a 1000x.",
        "hook": "Other influencers hate on Housecoin. I like it.",
        "caption": (
            "Other influencers hate on Housecoin. I like it.\n\n"
            "Rock solid project. Centralized exchanges. Crazy amounts of content.\n\n"
            "It's surviving the bear market. 1000x play from that 600K market cap three months ago.\n\n"
            "Even if I'm half wrong, that's still 500x.\n\n"
            "Already went 600K → 3M. We just did a 5x in three months.\n\n"
            "$HOUSE #Housecoin #Kaspa #KRC20 #MemeCoins #Crypto"
        ),
        "tags": ["Housecoin", "Kaspa", "KRC20", "MemeCoins", "Crypto", "1000x", "Altcoins"],
    },
    {
        "id": "mc-20260528-pythia-28x",
        "slug": "pythia-28x",
        "source_clip": "pythia-28x",
        "video_path": "shorts/meme-coins-2026-05-28/5-pythia-28x.mp4",
        "duration_seconds": 26.72,
        "title": "My community 28x'd on a rat. It might rip again.",
        "hook": "We had Pythia. 28x. This was wild.",
        "caption": (
            "We had Pythia. 28x. This was wild.\n\n"
            "Brain interfaces. Bridging Neurobiology and AI. Decentralized Accelerator for Projects "
            "in Neuroscience.\n\n"
            "Not just a meme — there's actual research behind it. A rodent connected to a rodent's "
            "brain is literally the logo.\n\n"
            "You never know. This thing could make a comeback. We already did our 28x.\n\n"
            "If you were in my community, you would have done it too.\n\n"
            "$PYTHIA #Pythia #Bittensor #TAO #AI #Neuroscience #Crypto"
        ),
        "tags": ["Pythia", "Bittensor", "TAO", "AI", "Neuroscience", "Crypto", "Altcoins"],
    },
]

SOURCE_LIVESTREAM = "meme-coins-2026-05-28"
CREATED_AT = "2026-05-28T12:00:00"

PLATFORMS = ["yt_shorts", "ig_reels", "x", "tiktok", "facebook", "rumble", "bitchute"]


def platform_block():
    return OrderedDict([
        ("status", "pending"),
        ("posted_at", None),
        ("url", None),
        ("views", None),
        ("views_captured_at", None),
        ("caption_override", None),
    ])


def build_entry(s):
    return OrderedDict([
        ("id", s["id"]),
        ("slug", s["slug"]),
        ("source_livestream", SOURCE_LIVESTREAM),
        ("source_clip", s["source_clip"]),
        ("video_path", s["video_path"]),
        ("thumbnail_path", None),
        ("duration_seconds", s["duration_seconds"]),
        ("width", 1080),
        ("height", 1920),
        ("title", s["title"]),
        ("hook", s["hook"]),
        ("caption", s["caption"]),
        ("tags", s["tags"]),
        ("platforms", OrderedDict([(p, platform_block()) for p in PLATFORMS])),
        ("created_at", CREATED_AT),
    ])


def main():
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"), object_pairs_hook=OrderedDict)
    existing_ids = {s["id"] for s in data["shorts"]}
    added = 0
    skipped = 0
    for s in NEW_SHORTS:
        if s["id"] in existing_ids:
            print(f"SKIP (already present): {s['id']}")
            skipped += 1
            continue
        data["shorts"].append(build_entry(s))
        print(f"ADDED: {s['id']}")
        added += 1
    JSON_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"\nDone. Added {added}, skipped {skipped}. shorts.json now has {len(data['shorts'])} entries.")


if __name__ == "__main__":
    main()
