"""Rebuild remotion/src/captionsBeerKaspaFirstVprogLive.ts from whisper-words-verified.json via the
canonical captions skill. No post-pass edits: the output is written verbatim with a header."""
import subprocess, sys, os
ROOT = r"C:\Users\mnede\Documents\Claude\social-media"
COL = "g=kaspa,vprog,vprogs,l1,krc20s y=first,tic-tac-toe,anything gr=bullish,live,hotter,hot r=settlement,execution"
WORDS = "video-creation/shorts/beer-and-kaspa/first-vprog-live-on-kaspa/whisper-words-verified.json"
args = [sys.executable, "video-creation/skills/captions/build_captions.py", "--words", WORDS,
        "--style", "montserrat", "--var", "CAPTIONS_VP3", "--colorize", COL]
s = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=True).stdout
s = s[s.index("export const"):]
assert "\u2014" not in s and "\u2013" not in s, "em/en dash in captions"
hdr = f'''// batch beer-and-kaspa / clip #3 - `first-vprog-live-on-kaspa` (FULL). CANONICAL captions skill output, never hand-authored:
//   python video-creation/skills/captions/build_captions.py --words {WORDS} --style montserrat --var CAPTIONS_VP3 --colorize "{COL}"
// (regenerate with build_captions_vp3.py in the clip folder). No post-pass edits.
// Word source = whisper-words-VERIFIED.json (medium.en whole-file + staggered medium.en / small.en windows + the
// on-screen post); patches documented in shorts/beer-and-kaspa/first-vprog-live-on-kaspa/make_verified.py.
// PROTECTED_DOUBLES entry ("its","really","really","bullish") keeps the "really, really bullish" peak beat.
// Gap scan: largest inter-word gaps 0.92 s / 0.88 s are pauses between the tweet lines he reads; no omitted speech.
'''
open(os.path.join(ROOT, "video-creation/remotion/src/captionsBeerKaspaFirstVprogLive.ts"), "w", encoding="utf-8").write(hdr + s)
print(s)
