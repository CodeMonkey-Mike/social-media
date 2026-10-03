"""Rebuild remotion/src/captionsBeerKaspaBearCalled1Cent.ts from whisper-words-verified.json via the
canonical captions skill + ONE documented post-pass (<r> on the merged "one cent" token)."""
import subprocess, sys, os
ROOT = r"C:\Users\mnede\Documents\Claude\social-media"
COL = "g=kaspa,kas y=3.7,4.8,30,three,20,four,six,lunch gr=blew,water r=bears,wrong,downtrend,thesis"
WORDS = "video-creation/shorts/beer-and-kaspa/kaspa-bear-called-1-cent/whisper-words-verified.json"
args = [sys.executable, "video-creation/skills/captions/build_captions.py", "--words", WORDS,
        "--style", "montserrat", "--var", "CAPTIONS_KB1", "--colorize", COL]
s = subprocess.run(args, cwd=ROOT, capture_output=True, text=True, check=True).stdout
s = s[s.index("export const"):]
n = s.count("one cent"); s = s.replace("one cent", "<r>one&nbsp;cent</r>")
assert "\u2014" not in s and "\u2013" not in s, "em/en dash in captions"
hdr = f'''// batch beer-and-kaspa / clip #1 - `kaspa-bear-called-1-cent` (FULL). CANONICAL captions skill output, never hand-authored:
//   python video-creation/skills/captions/build_captions.py --words {WORDS} --style montserrat --var CAPTIONS_KB1 --colorize "{COL}"
// ONE documented post-pass (build_captions_kb1.py in the clip folder): the verified word stream carries "one cent"
// as a single merged TOKEN so the price call never splits across groups; --colorize is whitespace-split and cannot
// name a two-word token, so that token is wrapped in <r> (with &nbsp; so a 2-line wrap never splits it) after the build ({n} occurrences). Nothing else is edited.
// Word source = whisper-words-VERIFIED.json (medium.en whole-file + staggered medium.en/medium/small.en windows);
// patches documented in shorts/beer-and-kaspa/kaspa-bear-called-1-cent/make_verified.py.
// Gap scan: largest inter-word gap 0.46 s (breath after "oh man."), no omitted speech.
'''
open(os.path.join(ROOT, "video-creation/remotion/src/captionsBeerKaspaBearCalled1Cent.ts"), "w", encoding="utf-8").write(hdr + s)
print(s)
