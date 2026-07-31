# LIVE public site (canonical)

## One URL to open and share

**https://raw.githack.com/michaeguadagno-cell/niche-money-hub/main/index.html**

- Opens as a **real webpage** (`text/html`)
- Shows **DealDoor**: “Just pick a box” + topic cards + big buttons
- Safe to send to friends (copy from the Share section on the page too)

### Do NOT open these (look like code / broken)

| Avoid | Why |
|-------|-----|
| github.com/.../blob/.../index.html | Code viewer |
| raw.githubusercontent.com/... | Often plain text |
| cdn.jsdelivr.net/.../index.html | Often `text/plain` (source dump) |
| michaeguadagno-cell.github.io/... | Pages not enabled yet (optional later) |

### On this PC only

- Double-click `OPEN-SITE.bat` → http://127.0.0.1:8787/

---

## Where to paste real money IDs (one place)

File: **`js/niches.js`**

```js
amazonTag: 'yoursite-20',   // Amazon Associates Store ID after free approval
bookingAid: '1234567',      // Booking partner aid after free approval
ref: 'YOUR_REF_CODE',       // generic networks
aff: 'YOUR_AFF_ID',
```

1. Apply free: https://affiliate-program.amazon.com/
2. Replace `YOURTAG-20` with your Store ID
3. Push to GitHub main (or ask Grok: “set amazonTag to mytag-20”)
4. Public URL above updates after CDN refresh (usually minutes)

Ad network snippets: paste into HTML elements with `data-ad-slot` in `index.html`.

---

## Monetization surfaces on the live page

1. **Affiliate / deal CTAs** — every topic big button + partner links (`tag` / `ref` / `aff` / `aid`)
2. **CPC ad slots** — dashed “Sponsored” boxes (`data-ad-slot`)
3. **Featured / sponsored** — yellow hot pick
4. **Lead capture** — email form shell
5. **Share** — copy link / text a friend (traffic)

---

## Free path after the page is live

See `FREE-CHECKLIST.md` and `HOW-TO-SHARE.md`.

Honest limit: live page + tracking ≠ bank deposit. You still need free network approval + people visiting.
