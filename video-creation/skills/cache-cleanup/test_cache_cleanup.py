"""Proves the rules that matter: blocked = nothing deleted, unmarked = in progress, only the allowlist is reachable.
Run: python test_cache_cleanup.py  (every path is a temp dir; the real caches, queue and processes are never touched)."""
import json
import os
import tempfile
import time
import unittest
from pathlib import Path

import cache_cleanup as CC


def touch(p, old=True):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(b"x" * 10)
    if old:
        t = time.time() - 3600
        os.utime(p, (t, t))
        os.utime(p.parent, (t, t))


class Base(unittest.TestCase):
    def setUp(self):
        self._t = tempfile.TemporaryDirectory()
        r = Path(self._t.name)
        self.r = r
        (r / "video/longform-edited/media").mkdir(parents=True)
        (r / "batches.json").write_text(json.dumps({"batches": [{"batch": "a", "status": "completed"}]}), encoding="utf-8")
        temp, dd = r / "Temp", r / "D-tmp"
        self.keep = [dd / "video-work/ALL.mkv", dd / "wb-beat/scene.png", dd / "build-quant/x.js", temp / "notes.txt",
                     r / "ae/26.5/Typesupport/f", temp / "Adobe/After Effects/26.5/Disk Cache/f"]
        self.gone = [r / "ae/26.5/Disk Cache - MSI.noindex/f", temp / "remotion-v4-assets/f", temp / "react-motion-renderX/f",
                     dd / "puppeteer_dev_chrome_profile-abc/f", dd / "chunked-render/Comp-key/chunk-0-1.mkv", temp / "chunked-render-test-1/f"]
        for p in self.keep + self.gone:
            touch(p)
        self.cfg = CC.Config(video=r / "video", batches=r / "batches.json", batch_marks=r / "completed-batches.json", ae_root=r / "ae", render_dirs=[temp, dd, r / "missing-D"], disk=str(r.anchor))

    def tearDown(self):
        self._t.cleanup()

    def run_it(self, found=(), live=()):
        return CC.cmd_run(self.cfg, all_check=lambda c: list(found), live_check=lambda: list(live))

    def assert_untouched(self):
        for p in self.keep + self.gone:
            self.assertTrue(p.exists(), p)


class Rules(Base):
    def test_clear_deletes_only_the_allowlist(self):
        self.assertEqual(self.run_it(), 0)
        for p in self.gone:
            self.assertFalse(p.exists(), p)
        for p in self.keep:
            self.assertTrue(p.exists(), p)
        self.assertTrue((self.r / "D-tmp/chunked-render").is_dir())

    def test_blocked_deletes_nothing(self):
        self.assertEqual(self.run_it(found=["project in progress: quant"]), 3)
        self.assert_untouched()

    def test_run_starting_mid_sweep_stops(self):
        self.assertEqual(self.run_it(live=["run queue: longform quant (running)"]), 3)
        self.assert_untouched()

    def test_fresh_files_are_kept(self):
        new = self.r / "Temp/remotion-just-now"
        new.mkdir()
        self.assertEqual(self.run_it(), 0)
        self.assertTrue(new.exists())

    def test_unmarked_project_blocks_until_marked(self):
        p = self.cfg.video / "longform-edited/media/quant"
        touch(p / "raw.mkv")
        self.assertEqual(len(CC.project_blockers(self.cfg)), 1)
        self.assertEqual(CC.cmd_complete(self.cfg, "quant", "Mike said so"), 0)
        self.assertEqual(CC.project_blockers(self.cfg), [])

    def test_nested_formats_and_empty_folders(self):
        root = self.cfg.video / "longform-presentation/media/standard"
        touch(root / "artifacts/f")
        (root / "empty").mkdir()
        got = CC.project_blockers(self.cfg)
        self.assertEqual(len(got), 1)
        self.assertIn("standard/artifacts", got[0])

    def test_active_batch_blocks(self):
        self.cfg.batches.write_text(json.dumps([{"batch": "kaspa", "status": "active"}]), encoding="utf-8")
        self.assertIn("kaspa", CC.batch_blockers(self.cfg)[0])

    def test_batch_mark_clears_it_and_leaves_batches_json_alone(self):
        self.cfg.batches.write_text(json.dumps([{"batch": "kaspa", "status": "active"}]), encoding="utf-8")
        before = self.cfg.batches.read_text(encoding="utf-8")
        self.assertEqual(CC.cmd_complete_batch(self.cfg, "kaspa", "Mike said so"), 0)
        self.assertEqual(CC.batch_blockers(self.cfg), [])
        self.assertEqual(self.cfg.batches.read_text(encoding="utf-8"), before)
        with self.assertRaises(SystemExit):
            CC.cmd_complete_batch(self.cfg, "typo", "x")

    def test_unreadable_batches_fail_closed(self):
        self.cfg.batches.write_text("{broken", encoding="utf-8")
        self.assertEqual(len(CC.batch_blockers(self.cfg)), 1)

    def test_no_force_flag_exists(self):
        src = Path(CC.__file__).read_text(encoding="utf-8")
        self.assertNotIn('"--force"', src)
        self.assertNotIn("pagefile.sys", src)


if __name__ == "__main__":
    unittest.main()
