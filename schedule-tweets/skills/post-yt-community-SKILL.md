---
name: post-yt-community
description: Post the next pending YouTube community post from data/yt-posts.json
---

## ⏱ Time guard — skip stale runs
Before doing anything else, check the current local time using bash: `date '+%H:%M'`. This task is scheduled for 9:30 PM. If the current time is later than 11:30 PM (23:30), stop immediately and report "Skipped: run fired more than 2 hours past scheduled time — treating as a missed run." Do not post anything or collect likes.

---

Your job has two parts: post the next pending YouTube community post, then collect like counts for mature posts. Always run both parts.

## PART 1 — Post the next pending community post

### Step 1: Read and lock the post
1. Read `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-posts.json`
2. Find the first post where `status` is `"pending"`. If none exist, skip to Part 2.
3. Update that post's `status` to `"posting"` in the file (crash safety).

### Step 2: Open the YouTube community posts composer
4. Navigate to `https://www.youtube.com/@CodeMonkeyMike/posts` in the browser.
5. Wait for the page to fully load (the compose area with "What's on your mind?" should be visible).
6. If the post has an `images` array (non-empty), click the **"Image"** button in the composer toolbar (the landscape-photo icon, NOT "Image poll"). This opens the drag-and-drop upload area.

### Step 3: Upload images (ONLY if the post has an `images` array)

**CRITICAL: All images must be uploaded in ONE call to the INITIAL file input. Do NOT use the "Add more images" secondary input — it is unreliable and replaces rather than adds.**

a. Use the Chrome MCP `find` tool with query: `"file input for image upload"`. This returns two refs — use the FIRST one (it's the initial multi-file input that accepts `multiple` files).

b. Collect all image absolute Windows paths in `seq` order. The `image_path` field in each `images[]` entry looks like `schedule-tweets/images/yt/filename.png`. The absolute path is: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\yt\<filename.png>`.

c. Call `file_upload` ONCE with the full `paths` array (all images together) and the file input ref. This injects all images at once directly, bypassing the OS file picker dialog.

d. **Wait 6 seconds.** YouTube's Polymer component processes files asynchronously and renders thumbnails with a significant delay. Do not skip this wait.

e. **PRE-POST IMAGE VERIFICATION (MANDATORY — DO NOT SKIP):** Take a screenshot. You should see a thumbnail strip on the left with one thumbnail per image. Count the thumbnails. If the count does not match the number of images in the `images` array, wait another 3–4 seconds and screenshot again. Do not proceed to post until ALL thumbnails are visible. If after 15 seconds thumbnails are still missing, do NOT post — stop and report the failure.

### Step 4: Enter the post body text

**CRITICAL: Do NOT use `computer.type` for long text.** YouTube community post bodies are often 2000–3000 characters. Typing character-by-character via CDP causes a 30-second timeout and a partial paste. Always use clipboard paste.

a. Click the text area at the top of the composer (the "What's on your mind?" area, above the image upload section if images are present).

b. Use `write_clipboard` to write the full `body` field text to the system clipboard.

c. Press `Ctrl+V` to paste. The full text should appear immediately.

d. Scroll through the text area to confirm the full body is present and not truncated.

### Step 5: Post

a. Scroll down to find the **"Post"** button (blue button at the bottom right of the composer).

b. **Do NOT navigate away from the page before clicking Post.** Navigating away while the composer is open discards ALL state — images and text both — and the post will never be published.

c. Click the **"Post"** button.

d. Wait 3–4 seconds. The composer clearing back to the empty "What's on your mind?" state confirms the post was submitted.

### Step 6: Capture the post URL
e. Scroll down to find the freshly published post at the top of the PUBLISHED list (it will say "0 seconds ago" or "just now").

f. Click the timestamp link to navigate to the individual post URL (format: `https://www.youtube.com/post/UgkxXXXXXXXX`). The URL will appear in the browser address bar.

g. Capture the URL from the tab's URL (visible in `tabs_context_mcp` result).

### Step 7: POST-POST IMAGE VERIFICATION (MANDATORY — DO NOT SKIP)

After navigating to the individual post URL:

a. Wait 2 seconds for the page to load.

b. Scroll down past the full text body until the image carousel is visible.

c. The first image should be showing with a ">" arrow on the right if there are multiple images.

d. Click the ">" arrow to advance through every image. Confirm each image renders correctly. You must see all N images (where N = length of the `images` array).

e. **If any image is missing or the post is text-only (no carousel visible), the post is BROKEN.** Delete it immediately (three-dot menu → Delete), set `status` back to `"pending"` in yt-posts.json, and report the failure. Do NOT mark it as posted.

f. Only after ALL images are confirmed visible on the live post may you proceed.

### Step 8: Update yt-posts.json
Update the post record:
- `status` → `"posted"`
- `posted_at` → current UTC datetime in ISO 8601 format
- `post_url` → the captured individual post URL
- `likes` → `null`
- `likes_captured_at` → `null`

Save the file.

---

## PART 2 — Collect likes for mature posts

1. Read `data/yt-posts.json` (re-read in case Part 1 updated it).
2. Find all posts where `status` is `"posted"`, `posted_at` is 48+ hours ago, and `likes` is `null`.
3. For each such post:
   a. Navigate to its `post_url` in the browser.
   b. Wait for the page to load.
   c. Read the like count from the thumbs-up button on the post. It appears as a number next to the thumbs-up icon (e.g. "42"). If the count shows as "0" or is not yet visible, record 0.
   d. Update `data/yt-posts.json` for this post:
      - `likes` → the like count as an integer (no commas)
      - `likes_captured_at` → current UTC datetime in ISO 8601 format
4. Save the file after all posts are updated.

---

## File location
`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-posts.json`

---

## Known YouTube community post quirks (hard-won lessons)

### Image upload mechanics
- YouTube's composer has **two** hidden `input[type="file"]` elements. The first (`multiple=true`) is the one to use. The second (inside `#add-image-button-container`) is for adding more images but behaves unreliably — it can replace the first image instead of adding, and cannot be reliably targeted. **Always use the first file input and upload all images at once.**
- YouTube uses a Polymer web component (`ytd-backstage-multi-image-select-renderer`) that processes files asynchronously. All images are uploaded to the internal `renderer.images` array immediately, but thumbnails render in the UI with a ~5-6 second delay. After upload, the screenshot may show only 1 thumbnail even though all 3 are uploaded internally. Wait the full 6 seconds before checking.
- Do NOT click the "+" button in the thumbnail strip to add more images. It was observed to add duplicate images rather than new ones.

### Text entry
- **Never use `computer.type` for text over ~300 characters.** CDP's `Input.dispatchKeyEvent` times out after 30 seconds. A 2929-character body causes a timeout mid-type, leaving partial text pasted with no Post click. Always use `write_clipboard` + `Ctrl+V`.
- Click the text area first to focus it, then paste. The text area is above the image section when in image mode.

### Navigation
- **Never navigate away from the YouTube tab while the composer is open.** Any navigation (including clicking a link or changing the URL) immediately and silently discards all composer state — text, images, everything. The post is gone. There is no confirmation dialog. Always click Post before doing anything else with the browser.

### Verification
- The pre-post thumbnail check and the post-post carousel check are both MANDATORY. The previous session's failure happened because images appeared to upload (1 thumbnail shown) but the post went live as text-only. The post-post verification is the safety net.
- When navigating to the individual post URL to verify, the URL is captured from `tabs_context_mcp` (it appears in the tab's URL field after clicking the timestamp).

### Error handling
- If the composer doesn't open after clicking "Image," try refreshing the page and repeating from Step 2.
- If the Post button appears disabled, click the text area again to re-focus, then try again.
- If posting fails or the composer clears without the post appearing in the feed, set `status` back to `"pending"` before exiting.
- If a post URL returns 404 (post was deleted), set `status` back to `"pending"` so it can be retried.
