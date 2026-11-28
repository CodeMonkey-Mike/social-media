# ai-engineering/covered-topics: what the AI voice-over videos already said

The final, voiced script of each video made on this track. They are kept so a new AI Engineering Simplified
script can be checked for overlap before it is written (`video-creation/todo/aiEngineeringSimplified.md`,
"Possible overlap to check before scripting").

The project folders these came from were deleted on 2026-11-27, once both videos were finished. The scripts are
kept word for word, so a pointer inside one to another project file (an outline, a long cut, a deck) leads
nowhere now. The decks themselves are in `../skills/deck-and-containers/reference-decks/`.

| Video | Script | Length | Made |
|---|---|---|---|
| Video 2: "When Do You Actually Need LangGraph? (A Real-World Walkthrough)" | `need-lang-graph.SCRIPT.md` | 11.7 min, 12 chapters, 44 chunks | July 2026 (final render 2026-07-07) |
| Video 3: saving tokens with sub-agents (the final title was not recorded in the project) | `save-tokens-by-using-sub-agents.SCRIPT.md` | 5.9 min, 10 chapters, 22 chunks | 2026-07-16 |

Video 1 of the channel (`python-ai-libraries`) was made the same way, according to the project log of video 2.
Its folder was never in git, so there is no script to keep here.

## Chapters (the quick way to see what was covered)

**Video 2, LangGraph**

```
0:00 Two libraries, one question
0:54 LangChain vs LangGraph, the one-liner
1:59 You don't need LangChain to use LangGraph
2:47 Mapping a real pipeline onto a StateGraph
4:18 Is a LangGraph a DAG?
4:50 Supervisor, swarm, and hierarchy
5:52 Checkpointing: crash, then resume
6:50 Idempotency: the hard part of resuming
7:59 Hard rules as graph structure
8:54 Human in the loop: interrupts
9:53 Do you actually need it?
10:54 Recap and the meta-lesson
```

**Video 3, sub-agents**

```
00:00 Hook: one livestream, a whole week of content
00:26 The problem: one agent, one context
01:00 Lever 1: context isolation
01:40 The operation: three lanes
02:11 Lever 2: the two dials (model + effort)
03:05 The roster: how the work gets assigned
04:13 Where this is going: the other two lanes
05:04 The payoff
05:23 The honest part
05:36 Build it + CTA
```

## Adding to it

When a video made on this track is finished and its `media/<video>/` folder is about to be deleted, move its
final `SCRIPT.md` here first (`<short-name>.SCRIPT.md`), add a row above and paste its chapters.
