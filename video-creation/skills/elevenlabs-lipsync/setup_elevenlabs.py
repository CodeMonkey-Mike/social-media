#!/usr/bin/env python
"""
setup_elevenlabs.py: ONE-TIME setup. Opens real Chrome with the dedicated elevenlabs-profile pointed at
ElevenLabs so Mike can log in. The session is saved in the profile (no auth file written). Re-run only
if Chrome wipes elevenlabs-profile or logs you out. Python port of setup-elevenlabs.js (2026-11-23).

    python setup_elevenlabs.py

Run from a terminal it waits for Enter; run by an agent (no keyboard) it waits for the Chrome window to
be closed.
"""
import sys

from _el import launch, run


def main():
    print("Launching Chrome with elevenlabs-profile...")
    with launch() as (ctx, page):
        page.goto("https://elevenlabs.io/app/home")
        print("\n=================================================")
        print("Sign in to ElevenLabs in the browser window.")
        print("When you can see the app dashboard,")
        if sys.stdin.isatty():
            print("come back here and press Enter to close.")
            print("=================================================\n", flush=True)
            try:
                input("Press Enter when done: ")
                return
            except EOFError:
                # stdin is the NUL device (an agent run): Windows reports it as a terminal, but nobody
                # can press Enter there. Fall through to waiting for the window.
                print("\nNo keyboard on this run: just CLOSE the Chrome window. The session is saved in the profile.",
                      flush=True)
        else:
            print("just CLOSE the Chrome window. The session is saved in the profile.")
            print("=================================================\n", flush=True)
        try:
            ctx.wait_for_event("close", timeout=0)
        except Exception:
            pass


if __name__ == "__main__":
    run(main, "Setup")
