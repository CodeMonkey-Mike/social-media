# longform-discussion: routing (auto-loaded when working in this folder)

_Thin pointer. **`longform-discussion.md` is canonical**; do not duplicate its rules here._

Research for a video Mike records freeform on the crypto channel, talking over browser tabs he shares. This track makes
no video: it ends when the tabs are ready and he has his talking points.

- **Mike hands over a video:** INGEST it into the ongoing dataset, `longform-discussion.md` Flow A.
- **Mike wants things to talk about:** a SESSION, Flow B. `python scripts/discussion.py scan` first.
- **Mike gates the list in Word.** He deletes what he does not want from `TOPICS.docx`, then `discussion.py approve --from-doc`
  reads what is left. Nothing downloads and no tabs open until then, and the CLI enforces it.
- Dataset: `circumstances/circumstances.json` (view: `circumstances/CIRCUMSTANCES.md`). Sessions: `media/<session>/`.
