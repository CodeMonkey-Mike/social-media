"""MOVED -> video-creation/livestream-repurpose/skills/remotion-shorts-build/scripts/finalized_short_gate.py
Thin shim so an in-flight build using the old path still gates correctly. Delete with this folder."""
import os, runpy, sys

NEW = os.path.normpath(os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "..", "..",
    "livestream-repurpose", "skills", "remotion-shorts-build", "scripts", "finalized_short_gate.py"))
sys.argv[0] = NEW
runpy.run_path(NEW, run_name="__main__")
