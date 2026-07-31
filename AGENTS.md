# DealDoor / Niche Money Hub — rules for every AI

Project path: `C:\Users\13475\niche-money-hub`  
Public preview: https://raw.githack.com/michaeguadagno-cell/niche-money-hub/main/index.html  
GitHub: https://github.com/michaeguadagno-cell/niche-money-hub

## Who this is for

Visitors who may not read well or know tech words. Owner is building under tight money and needs free tools only when possible.

## Visitor-facing copy (always)

- Use short, common words. Prefer grade-school reading level.
- Prefer: money, deals, tap, button, free, shop, pick.
- Avoid for visitors: monetization, affiliate, CPA, CPC, funnel, conversion, utm, ref code, ESP.
- Big buttons. Clear 1-2-3 steps. High contrast colors.
- One main action per section: pick topic → tap big button → leave site to deals.

## Owner / operator only

- Real affiliate tags live in `js/niches.js` (`amazonTag`, `bookingAid`, `DEFAULT_AFFILIATE`).
- Click tracking: `js/affiliate.js`, `js/click-store.js`, localStorage.
- Ad slots: elements with `data-ad-slot` in `index.html`.
- Keep operator tools collapsed or labeled "site owner" so visitors ignore them.

## Tech constraints

- Static site only: `index.html` + `css/` + `js/`. No required build step for visitors.
- Classic `<script src>` (no ES modules required for file:// / simple server).
- Pure helpers stay testable in Node (`tests/run-tests.js`).
- Do not commit secrets or real API keys.

## Free hosting notes

- Do not tell users to open GitHub "code" view or raw.githubusercontent (shows source as text).
- Prefer: local `OPEN-SITE.bat` / `http://127.0.0.1:8787/` or raw.githack.com HTML URL.
- GitHub Pages needs one manual enable in Settings → Pages.

## When changing the page

1. Keep simple language.
2. Run `node tests/run-tests.js` after affiliate/URL logic changes.
3. Push to `michaeguadagno-cell/niche-money-hub` main when possible.
