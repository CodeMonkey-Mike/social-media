# BitChute Longform Upload — Notes & Open Issues

**Status (2026-05-20):** First attempt succeeded as "Posted" but user later said the video was not visible. Subsequent attempts: form fills correctly, file uploads, but **Proceed button click does not actually submit the form**. The page stays on the upload form with the Proceed button still visible. Paused.

Script: `scripts/upload-longform-bitchute.js`
Profile: `C:\Users\mnede\AppData\Local\Google\Chrome\bitchutebot-profile`
Source: `C:\Users\mnede\Documents\Claude\social-media\uploading\new\` (video + thumbnail + metadata.json)

## Key difference from shorts uploader

The **shorts** BitChute upload form is a two-step wizard:
1. First Proceed → reveals "Publish Right Away" checkbox
2. Second Proceed → actually submits

The **longform** BitChute upload form (per user-inspected HTML) is a **single-page form** with everything in one column:
```html
<div class="col-md-7 order-md-2 mb-4">
  <input id="title" type="title"...>
  <textarea id="description"...>
  <select id="sensitivity"...>
  <input id="hashtags" type="hashtags"...>
  <input id="publish" type="checkbox" checked>
  <button class="btn btn-primary" type="submit">Proceed</button>  <!-- ONE button -->
</div>
```

## What we've tried

| Attempt | Outcome |
|---|---|
| `proceedBtn.click()` (Playwright pointer) twice | All clicks fired but URL never changed — clicks were no-ops because they happened BEFORE upload completed (see ROOT CAUSE below) |
| `el.click()` via evaluate | Same — no URL change |
| `form.submit()` via evaluate | **DESTRUCTIVE.** Bypassed BitChute's JS upload handler and submitted empty form data → URL went to `?videoInput=&thumbnailInput=undefined&sensitivity=10` → server 500 error |
| Playwright `.click()` + `.click({force:true})` + `mouse.click(x,y)` at correct coords | All fired successfully but URL still unchanged → upload was still in progress |

## ROOT CAUSE (discovered 2026-05-20, late evening)

**The Proceed button becomes enabled BEFORE the file finishes uploading.** It only gates on the form fields being filled (title/desc/sensitivity/search terms). My script was polling the button's `disabled` attribute and treating "enabled" as "upload done" — wrong. The actual upload runs in parallel and clicking Proceed early is a silent no-op (BitChute's handler ignores it).

User confirmed: even after my script reports "Proceed enabled ✓" and clicks Proceed 3 times, the upload was still at 70%. **The clicks did nothing because the upload hadn't finished.**

## Correct signal for upload completion

User notes: **the upload progress indicator (circle/bar) lives in the right corner of the video preview area** in the upload form. The script needs to watch THAT element, not the Proceed button's disabled state.

## Cycle time problem

Each test attempt requires uploading the 388 MB file from scratch (~6 min @ ~1 MB/s). The script does:
1. Fresh Chrome launch
2. Re-upload the entire 388 MB file
3. Wait for upload completion
4. Try the Proceed click
5. Observe failure

That's >7 min per iteration. **Need a way to test the Proceed click without re-uploading.**

## What to try next time

### Option A — Watch the right-corner progress indicator (RECOMMENDED)
Before clicking Proceed, wait for the upload-progress UI element to disappear or hit 100%. User noted it's at the right corner of the video preview area. Need DOM inspection to capture the selector — likely something like a `<svg>` ring/circle with a `data-progress` attribute or `class*="progress"`.

```js
// Pseudocode — selector needs to be confirmed
await uploadPage.waitForFunction(() => {
  const progress = document.querySelector('[class*="progress"], [class*="uploadProgress"]');
  if (!progress) return true; // already disappeared = upload done
  const txt = progress.innerText || '';
  return /100\s*%/.test(txt);
}, null, { timeout: 30 * 60 * 1000 });
```

Once that returns, the Proceed click (Playwright `.click()`) should actually take effect.

### Option B — Watch the body text for "Uploading" → disappear
```js
await uploadPage.waitForFunction(
  () => !/uploading/i.test(document.body.innerText),
  null, { timeout: 30 * 60 * 1000 }
);
```

### Option C — DO NOT use `form.submit()`
This was destructive in our test — bypasses BitChute's JS upload handler and sends empty form data, returns 500. Never use this approach.

### Option D — Manual click fallback (current state)
The script fills all fields, polls (wrongly) on Proceed-enabled, and clicks too early. The clicks are silent no-ops. Once upload finishes, the user must manually click Proceed. The script's `/content` redirect detection then catches the success.

## Reference

- Inspected Proceed button HTML:
  ```html
  <button class="btn btn-primary" type="submit">Proceed</button>
  ```
- Inspected parent context: form with title, description, sensitivity, search terms, publish checkbox (already checked by default), and the Proceed button
- Shorts version (which works): `scripts/post-bitchute-short.js` — uses two-step wizard pattern
- Python reference: `C:\Users\mnede\Documents\Claude\social-media\uploading\uploaders\bitchute_upload.py` — also clicks "Proceed" twice; may not have been tested against longform form

## Bottom line

The shorts uploader's two-Proceed assumption is wrong for longform. The single-page longform form needs a different submit strategy. **Recommend Option B (`form.submit()`) as first re-attempt next time**, with manual click fallback (Option D) if that fails.
