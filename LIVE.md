# LIVE affiliate page (ready to earn after network approval)

## Canonical public URL (open & share)

**https://michaeguadagno-cell.github.io/tech.html**

- Real webpage (`text/html`) — not GitHub code view  
- Affiliate marketing page: budget tech picks + big shop CTAs  
- Also live: hub https://michaeguadagno-cell.github.io/ · health · checklist  

### Do NOT open

| Avoid | Why |
|-------|-----|
| github.com/.../blob/... | Code viewer |
| raw.githubusercontent.com/... alone | Plain text |
| jsDelivr / raw.githack | Plain text or browser interstitial |

### On this PC

`OPEN-SITE.bat` → http://127.0.0.1:8787/tech.html

---

## Where to paste real Amazon tag (one place)

**File:** `js/niches.js` (and same file on github.io after push)

```js
amazonTag: 'yoursite-20',  // your Associates Store ID
```

1. Free apply: https://affiliate-program.amazon.com/  
2. Replace `YOURTAG-20`  
3. Redeploy / ask Grok to push  

All tech CTAs use `buildAmazonAssociatesUrl` / `resolveOutboundUrl` → `?tag=...`

---

## Monetization surfaces on tech.html

1. **Affiliate CTAs** — Top 5 picks + extras (Amazon `tag`)  
2. **CPC ad slot** — `data-ad-slot="tech-top"` (paste AdSense later)  
3. **Share** — copy link for free traffic  

Hub also has lead form + more ad slots.

---

## Honest limit

Live + tracking ≠ bank deposit. Need free network approval + visitors.
