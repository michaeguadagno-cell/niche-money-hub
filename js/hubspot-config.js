/**
 * HubSpot affiliate config — FREE program (not Amazon).
 *
 * 1. Join free: https://www.hubspot.com/partners/affiliates
 * 2. After approval, copy YOUR personal affiliate link from the dashboard (Impact).
 * 3. Paste it below as HUBSPOT_AFFILIATE_URL (replace the placeholder).
 * 4. Redeploy / push so the live site uses it.
 *
 * Official marketing site (no pay): https://www.hubspot.com/
 * Free CRM: https://www.hubspot.com/products/crm
 */
var HUBSPOT_AFFILIATE = {
  /** PASTE your real HubSpot affiliate URL here after you join */
  affiliateUrl: 'https://www.hubspot.com/?utm_source=dealdoor&utm_medium=affiliate&utm_campaign=hubspot-page&ref=YOUR_HUBSPOT_AFF_ID',
  /** Public join page (for you, the site owner) */
  joinProgramUrl: 'https://www.hubspot.com/partners/affiliates',
  /** Free CRM landing (visitor-facing; swap to affiliate deep link when you have one) */
  freeCrmUrl: 'https://www.hubspot.com/products/crm',
  marketingHubUrl: 'https://www.hubspot.com/products/marketing',
  salesHubUrl: 'https://www.hubspot.com/products/sales',
  pricingUrl: 'https://www.hubspot.com/pricing',
  utmSource: 'dealdoor',
  utmMedium: 'affiliate',
  utmCampaign: 'hubspot-guide'
};

/**
 * Build tracked HubSpot URL. If affiliateUrl is set, use it for primary CTAs.
 * Otherwise fall back to public HubSpot pages with UTM params.
 */
function buildHubSpotUrl(kind) {
  var cfg = HUBSPOT_AFFILIATE;
  var base;
  if (kind === 'join') base = cfg.joinProgramUrl;
  else if (kind === 'crm') base = cfg.freeCrmUrl;
  else if (kind === 'marketing') base = cfg.marketingHubUrl;
  else if (kind === 'sales') base = cfg.salesHubUrl;
  else if (kind === 'pricing') base = cfg.pricingUrl;
  else if (kind === 'primary') base = cfg.affiliateUrl;
  else base = cfg.affiliateUrl;

  try {
    var u = new URL(base);
    if (cfg.utmSource) u.searchParams.set('utm_source', cfg.utmSource);
    if (cfg.utmMedium) u.searchParams.set('utm_medium', cfg.utmMedium);
    if (cfg.utmCampaign) u.searchParams.set('utm_campaign', cfg.utmCampaign + (kind && kind !== 'primary' ? '-' + kind : ''));
    return u.toString();
  } catch (e) {
    return base;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HUBSPOT_AFFILIATE: HUBSPOT_AFFILIATE,
    buildHubSpotUrl: buildHubSpotUrl
  };
}
