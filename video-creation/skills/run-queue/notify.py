#!/usr/bin/env python
"""notify.py — Windows DESKTOP notifications for video-production runs (Mike, 2026-10-27).

Sent by the SCRIPT itself, never by a Claude session, so an alert still arrives when the session is closed or its
watcher was reaped. Mike keeps Windows Do Not Disturb ON: toasts land silently in the notification centre and he reads
them after the fact, so every message is self-explanatory (project, what happened, what happens next). Never ask him to
turn DND off.

    from notify import notify
    notify("only-18-months-left", "Final render done. File ready in _previews.")

    python notify.py "<title>" "<body>"          # CLI (a test toast)

Every notification is also appended to state/notifications.log (the history, readable when the toast was missed).
A failed toast never raises: a notification is a convenience, never a reason for a run to fail.
"""
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape

HERE = Path(__file__).resolve().parent
STATE = Path(os.environ.get("RUN_QUEUE_STATE_DIR") or HERE / "state")   # tests point it at a temp dir
LOG = STATE / "notifications.log"
# the AppUserModelID of Windows PowerShell: always registered, so its toasts show without installing anything
APP_ID = r"{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe"
DISABLE_ENV = "RUN_QUEUE_NO_TOAST"   # tests set it so they never pop toasts


def notify(title: str, body: str) -> bool:
    title, body = str(title)[:120], str(body)[:400]
    try:
        STATE.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(f"{datetime.now():%Y-%m-%d %H:%M:%S}  {title}  |  {body}\n")
    except OSError:
        pass
    if os.environ.get(DISABLE_ENV) or os.name != "nt":
        return False
    xml = (f"<toast><visual><binding template=\"ToastGeneric\"><text>{escape(title)}</text>"
           f"<text>{escape(body)}</text></binding></visual></toast>")
    ps = ("[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null;"
          "[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null;"
          "$x = New-Object Windows.Data.Xml.Dom.XmlDocument; $x.LoadXml($env:RQ_TOAST_XML);"
          "[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($env:RQ_TOAST_APP)"
          ".Show([Windows.UI.Notifications.ToastNotification]::new($x))")
    try:
        r = subprocess.run(["powershell", "-NoProfile", "-NonInteractive", "-Command", ps], capture_output=True, text=True,
                           timeout=30, env={**os.environ, "RQ_TOAST_XML": xml, "RQ_TOAST_APP": APP_ID})
        return r.returncode == 0
    except Exception:
        return False


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(2)
    sys.exit(0 if notify(sys.argv[1], sys.argv[2]) else 1)
