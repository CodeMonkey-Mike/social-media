# remove-time-guards.ps1
# Strips the ⏱ Time guard section from all scheduled task SKILL.md files.

$tasks = @(
    "post-yt-community",
    "post-scheduled-tweet",
    "post-x-thread",
    "post-x-poll",
    "post-yt-poll"
)

$base = "$env:USERPROFILE\OneDrive\Documents\Claude\Scheduled"

foreach ($task in $tasks) {
    $path = Join-Path $base "$task\SKILL.md"

    if (-not (Test-Path $path)) {
        Write-Host "SKIP (not found): $path"
        continue
    }

    $content = Get-Content $path -Raw

    # Remove the time guard block: from the ## ⏱ line through the next --- separator (inclusive)
    $pattern = '(?ms)## ⏱ Time guard.*?^---\r?\n'
    $updated = [regex]::Replace($content, $pattern, '')

    # Clean up any double blank lines left behind
    $updated = $updated -replace '(\r?\n){3,}', "`n`n"

    Set-Content $path -Value $updated -NoNewline
    Write-Host "UPDATED: $task"
}

Write-Host "`nDone. All time guards removed."
