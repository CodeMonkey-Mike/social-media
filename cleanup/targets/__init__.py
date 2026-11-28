"""The cleanup targets: one module per folder policy. Each has NAME and plan(repo_root, age_days) and returns
{"name", "recycle", "skipped", "prune_roots", "prune_skip_dirs"}; cleanup.py does the reporting and the move."""
