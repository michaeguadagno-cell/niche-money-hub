/**
 * Pure affiliate / referral URL helpers — no DOM.
 * Operators swap base URLs for real network links; tracking params stay stable.
 *
 * Network formats supported by resolveOutboundUrl:
 *  - generic / impact-style: ref, aff, utm_* query params
 *  - amazon: Associates `tag` param (real Amazon payouts require an approved Associates account)
 *  - booking: Booking.com affiliate `aid` param
 */

/**
 * Build a tracked affiliate/referral URL from a base URL and tracking options.
 * @param {string} baseUrl - Destination URL (http/https)
 * @param {object} [opts]
 * @param {string} [opts.ref] - Referral / affiliate code (ref param)
 * @param {string} [opts.aff] - Affiliate id (aff param)
 * @param {string} [opts.utmSource]
 * @param {string} [opts.utmMedium]
 * @param {string} [opts.utmCampaign]
 * @param {Record<string,string>} [opts.extra] - Additional query params
 * @returns {string} Fully qualified URL with tracking query params
 */
function buildAffiliateUrl(baseUrl, opts) {
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new TypeError('baseUrl must be a non-empty string');
  }
  opts = opts || {};
  var url;
  try {
    url = new URL(baseUrl);
  } catch (e) {
    throw new TypeError('baseUrl must be a valid absolute URL: ' + baseUrl);
  }

  if (opts.ref) url.searchParams.set('ref', String(opts.ref));
  if (opts.aff) url.searchParams.set('aff', String(opts.aff));
  if (opts.utmSource) url.searchParams.set('utm_source', String(opts.utmSource));
  if (opts.utmMedium) url.searchParams.set('utm_medium', String(opts.utmMedium));
  if (opts.utmCampaign) url.searchParams.set('utm_campaign', String(opts.utmCampaign));

  if (opts.extra && typeof opts.extra === 'object') {
    Object.keys(opts.extra).forEach(function (key) {
      if (opts.extra[key] != null && opts.extra[key] !== '') {
        url.searchParams.set(key, String(opts.extra[key]));
      }
    });
  }

  return url.toString();
}

/**
 * Amazon Associates link format.
 * Real commissions require an approved Associates tag from https://affiliate-program.amazon.com/
 *
 * Examples:
 *   buildAmazonAssociatesUrl('https://www.amazon.com/s?k=laptops', 'yourtag-20')
 *   buildAmazonAssociatesUrl('https://www.amazon.com/dp/B08N5WRWNW', 'yourtag-20')
 *   buildAmazonAssociatesUrl({ keywords: 'wireless earbuds' }, 'yourtag-20')
 *   buildAmazonAssociatesUrl({ asin: 'B08N5WRWNW' }, 'yourtag-20')
 *
 * @param {string|object} target - Absolute Amazon URL, or { keywords }, or { asin }
 * @param {string} associateTag - Your Associates store ID (e.g. yoursite-20)
 * @param {object} [opts]
 * @param {string} [opts.marketplace='www.amazon.com'] - Host without protocol
 * @param {Record<string,string>} [opts.extra]
 * @returns {string}
 */
function buildAmazonAssociatesUrl(target, associateTag, opts) {
  if (!associateTag || typeof associateTag !== 'string') {
    throw new TypeError('associateTag must be a non-empty string (e.g. yourtag-20)');
  }
  opts = opts || {};
  var marketplace = opts.marketplace || 'www.amazon.com';
  var base;

  if (typeof target === 'string') {
    base = target;
  } else if (target && typeof target === 'object') {
    if (target.asin) {
      base = 'https://' + marketplace + '/dp/' + encodeURIComponent(String(target.asin));
    } else if (target.keywords) {
      base =
        'https://' +
        marketplace +
        '/s?k=' +
        encodeURIComponent(String(target.keywords));
    } else {
      throw new TypeError('target object needs asin or keywords');
    }
  } else {
    throw new TypeError('target must be an Amazon URL string or { asin|keywords }');
  }

  var url;
  try {
    url = new URL(base);
  } catch (e) {
    throw new TypeError('Invalid Amazon URL: ' + base);
  }

  // Associates tracking param (required for commission attribution)
  url.searchParams.set('tag', String(associateTag));

  // Optional link-code style params used by SiteStripe / Product Advertising API exports
  if (opts.linkCode) url.searchParams.set('linkCode', String(opts.linkCode));
  if (opts.camp) url.searchParams.set('camp', String(opts.camp));
  if (opts.creative) url.searchParams.set('creative', String(opts.creative));

  if (opts.extra && typeof opts.extra === 'object') {
    Object.keys(opts.extra).forEach(function (key) {
      if (opts.extra[key] != null && opts.extra[key] !== '') {
        url.searchParams.set(key, String(opts.extra[key]));
      }
    });
  }

  return url.toString();
}

/**
 * Booking.com affiliate-style URL (aid = affiliate ID from Booking Partner Hub).
 * @param {string} baseUrl
 * @param {string} aid
 * @param {object} [opts]
 * @returns {string}
 */
function buildBookingAffiliateUrl(baseUrl, aid, opts) {
  if (!aid || typeof aid !== 'string') {
    throw new TypeError('aid must be a non-empty string');
  }
  opts = opts || {};
  var extra = Object.assign({ aid: String(aid) }, opts.extra || {});
  if (opts.label) extra.label = String(opts.label);
  return buildAffiliateUrl(baseUrl, {
    utmSource: opts.utmSource,
    utmMedium: opts.utmMedium,
    utmCampaign: opts.utmCampaign,
    extra: extra
  });
}

/**
 * Resolve an outbound URL using network-specific formats.
 * @param {string} baseUrl
 * @param {object} config - Affiliate config (DEFAULT_AFFILIATE shape)
 * @param {object} [linkMeta] - { network?: 'amazon'|'booking'|'generic', campaign?: string }
 * @returns {string}
 */
function resolveOutboundUrl(baseUrl, config, linkMeta) {
  config = config || {};
  linkMeta = linkMeta || {};
  var network = linkMeta.network || config.defaultNetwork || 'generic';
  var campaign = linkMeta.campaign || config.utmCampaign || 'directory';

  if (network === 'amazon') {
    var tag = config.amazonTag || config.tag;
    if (!tag) {
      throw new TypeError('Amazon network requires config.amazonTag (Associates store ID)');
    }
    return buildAmazonAssociatesUrl(baseUrl, tag, {
      linkCode: config.amazonLinkCode || 'll1',
      extra: config.utmSource
        ? {
            // Amazon ignores most UTMs for commissions; tag is what pays.
            // Keep ref for your own analytics if you add a redirect layer later.
          }
        : undefined
    });
  }

  if (network === 'booking') {
    var aid = config.bookingAid || config.aid;
    if (!aid) {
      throw new TypeError('Booking network requires config.bookingAid');
    }
    return buildBookingAffiliateUrl(baseUrl, aid, {
      label: campaign,
      utmSource: config.utmSource,
      utmMedium: config.utmMedium,
      utmCampaign: campaign
    });
  }

  // generic / shareasale / impact-style query tracking
  return buildAffiliateUrl(baseUrl, {
    ref: config.ref,
    aff: config.aff,
    utmSource: config.utmSource,
    utmMedium: config.utmMedium,
    utmCampaign: campaign
  });
}

/**
 * Shape a click event for outbound affiliate or ad-slot clicks.
 * @param {string} destination - Full destination URL (or ad-slot id)
 * @param {string} label - Niche / product / slot label
 * @param {string} [kind] - 'outbound' | 'ad-slot' | 'lead' | 'sponsored'
 * @param {number} [timestamp] - ms since epoch (defaults to Date.now())
 * @returns {{ destination: string, label: string, kind: string, timestamp: number }}
 */
function createClickEvent(destination, label, kind, timestamp) {
  if (!destination || typeof destination !== 'string') {
    throw new TypeError('destination must be a non-empty string');
  }
  if (!label || typeof label !== 'string') {
    throw new TypeError('label must be a non-empty string');
  }
  return {
    destination: destination,
    label: label,
    kind: kind || 'outbound',
    timestamp: typeof timestamp === 'number' ? timestamp : Date.now()
  };
}

/**
 * Append a click event to an existing events array (pure; does not mutate input).
 * @param {Array} events
 * @param {object} event
 * @param {number} [maxEvents=500]
 * @returns {Array}
 */
function appendClickEvent(events, event, maxEvents) {
  var list = Array.isArray(events) ? events.slice() : [];
  list.push(event);
  var max = typeof maxEvents === 'number' && maxEvents > 0 ? maxEvents : 500;
  if (list.length > max) {
    list = list.slice(list.length - max);
  }
  return list;
}

// UMD-style export for browser + Node tests
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildAffiliateUrl: buildAffiliateUrl,
    buildAmazonAssociatesUrl: buildAmazonAssociatesUrl,
    buildBookingAffiliateUrl: buildBookingAffiliateUrl,
    resolveOutboundUrl: resolveOutboundUrl,
    createClickEvent: createClickEvent,
    appendClickEvent: appendClickEvent
  };
}
