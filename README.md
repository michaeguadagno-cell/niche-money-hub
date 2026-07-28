# Niche Money Hub

Static landing page that directs visitors to major consumer niches and exposes **five monetization surfaces**:

1. **Niche affiliate redirects** — primary CTAs with `ref` / `aff` / `utm_*` tracking  
2. **Company / brand referral links** — partner links under each niche  
3. **CPC / display ad slots** — dashed placeholders for AdSense, Media.net, Ezoic, etc.  
4. **Featured / sponsored partner** — sellable placement or premium offer  
5. **Email / lead capture** — form shell for list building  

> **Honest scope:** This ships the *page and tracking hooks*. Live income needs affiliate/ad network accounts, approval, traffic, and compliance. There are no guaranteed earnings.

## Quick start

Open the page (no build step):

```bash
# Option A — double-click or open in browser
#   C:\Users\13475\niche-money-hub\index.html

# Option B — any static server
npx --yes serve .
# or: python -m http.server 8080
```

## Project layout

| Path | Role |
|------|------|
| `index.html` | Entry page — niche grid, ad slots, lead form, featured partner |
| `css/styles.css` | Layout and styling |
| `js/affiliate.js` | Pure helpers: `buildAffiliateUrl`, `createClickEvent`, `appendClickEvent` |
| `js/click-store.js` | `localStorage` click log wrapping pure helpers |
| `js/niches.js` | Niche + partner data, default affiliate params, lead/featured config |
| `js/app.js` | Renders cards, wires CTAs, records clicks |
| `tests/run-tests.js` | Node unit tests for shipped pure helpers |

## Operator: paste real affiliate links

### Amazon Associates (wired and ready)

1. Apply: [Amazon Associates](https://affiliate-program.amazon.com/)  
2. Open **`js/niches.js`** and set:

```js
amazonTag: 'yoursite-20',  // Store ID from Associates Central → Tracking IDs
```

3. Any link with `network: 'amazon'` becomes a real Associates URL:

```
https://www.amazon.com/s?k=electronics&tag=yoursite-20
https://www.amazon.com/dp/B08N5WRWNW?tag=yoursite-20
```

Helpers (shipped in `js/affiliate.js`):

- `buildAmazonAssociatesUrl(urlOr{asin|keywords}, tag)`
- `resolveOutboundUrl(baseUrl, config, { network: 'amazon' })`

### Booking.com

```js
bookingAid: '1234567',  // from Partner Hub
// links with network: 'booking' get ?aid=1234567
```

### Generic / other networks

```js
var DEFAULT_AFFILIATE = {
  ref: 'your-real-ref',
  aff: 'your-real-aff-id',
  utmSource: 'niche-money-hub',
  utmMedium: 'affiliate',
  utmCampaign: 'directory',
  amazonTag: 'yoursite-20',
  bookingAid: 'YOUR_BOOKING_AID'
};
```

Replace each niche/partner **`baseUrl`** with deep links from ShareASale, CJ, Impact, etc.  
Set `network: 'generic' | 'amazon' | 'booking'` per link.

## Operator: paste CPC / display ads

1. Get approved by an ad network (often requires original content + traffic).  
2. In **`index.html`**, find elements with **`data-ad-slot`**.  
3. Replace the placeholder inner content with the network’s HTML/JS snippet  
   (keep `data-ad-slot` and `data-monetization="cpc"` if you still want demo click logging).

Example networks: Google AdSense, Media.net, Ezoic, PropellerAds (check ToS for affiliate-heavy pages).

## Operator: connect email / leads

1. The form in `#lead-form` currently prevents default and logs a demo event.  
2. Point it at your ESP:

- **Mailchimp / ConvertKit / Beehiiv** — use their embedded form action URL, or  
- **Netlify Forms / Formspree** — add `action` + `method="POST"`, or  
- **Custom webhook** — small serverless function.

## How click monetization works (demo)

- Outbound CTA clicks and ad-slot clicks call `createClickEvent` → `appendClickEvent` and persist to **`localStorage`** key `nmh_click_events_v1`.  
- Use **Show recent clicks** on the page (Operator section) to inspect the log.  
- In production, you’d also send events to analytics (GA4) or a CPA network pixel — not included here.

## Tests

```bash
node tests/run-tests.js
```

Tests import the **shipped** `js/affiliate.js` and `js/click-store.js` (no re-implementation).

## Deploy (optional)

Upload the folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, S3, etc.). No Node runtime required for visitors.

## FTC / legal

The page includes a **minimal affiliate disclosure stub**. Replace with counsel-ready policies before monetizing public traffic.
