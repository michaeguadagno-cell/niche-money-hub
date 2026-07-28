/**
 * Niche directory + partner data.
 *
 * REAL MONEY SETUP (Amazon Associates example — most multi-niche sites start here):
 * 1. Apply at https://affiliate-program.amazon.com/ (US) or your local Associates site
 * 2. After approval, copy your Store ID / tracking ID (looks like yoursite-20)
 * 3. Replace DEFAULT_AFFILIATE.amazonTag below with that Store ID
 * 4. Links marked network: 'amazon' will append ?tag=yoursite-20 automatically
 *
 * Other networks:
 *  - Booking Partner Hub → set bookingAid, use network: 'booking'
 *  - ShareASale / CJ / Impact → paste their full tracked URLs as baseUrl, network: 'generic'
 */

var DEFAULT_AFFILIATE = {
  // Generic query-param networks (ShareASale deep links, custom landing pages, etc.)
  ref: 'YOUR_REF_CODE',
  aff: 'YOUR_AFF_ID',
  utmSource: 'niche-money-hub',
  utmMedium: 'affiliate',
  utmCampaign: 'directory',

  /**
   * Amazon Associates Store ID / tracking ID.
   * Format is usually something like: myblog-20  or  nichehub-20
   * Replace YOURTAG-20 with yours from Associates Central → Account → Tracking IDs
   */
  amazonTag: 'YOURTAG-20',
  /** Optional SiteStripe-style defaults */
  amazonLinkCode: 'll1',

  /**
   * Booking.com affiliate ID (Partner Hub → aid)
   * Replace after you join https://www.booking.com/affiliate-program/
   */
  bookingAid: 'YOUR_BOOKING_AID',

  /** Default when a link does not set network */
  defaultNetwork: 'generic'
};

/**
 * Major consumer niches with primary CTA + optional company partners.
 * network: 'amazon' | 'booking' | 'generic' selects URL format in resolveOutboundUrl.
 */
var NICHES = [
  {
    id: 'finance',
    name: 'Finance & Money',
    icon: '💰',
    pitch: 'Credit cards, banking, investing, and personal finance tools that people search for every day.',
    color: '#0d9488',
    primaryCta: {
      label: 'Explore top finance deals',
      baseUrl: 'https://www.nerdwallet.com/',
      partner: 'NerdWallet (example)',
      network: 'generic'
    },
    partners: [
      { name: 'Credit Karma', baseUrl: 'https://www.creditkarma.com/', blurb: 'Free credit scores & card matches', network: 'generic' },
      {
        name: 'Amazon Finance books',
        baseUrl: 'https://www.amazon.com/s?k=personal+finance+books',
        blurb: 'Associates-tagged finance reads',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🏃',
    pitch: 'Supplements, fitness gear, telehealth, and wellness programs with strong affiliate programs.',
    color: '#059669',
    primaryCta: {
      label: 'Shop health essentials on Amazon',
      baseUrl: 'https://www.amazon.com/s?k=vitamins+supplements',
      partner: 'Amazon Associates',
      network: 'amazon'
    },
    partners: [
      { name: 'MyFitnessPal', baseUrl: 'https://www.myfitnesspal.com/', blurb: 'Calorie tracking & plans', network: 'generic' },
      {
        name: 'Fitness gear (Amazon)',
        baseUrl: 'https://www.amazon.com/s?k=home+gym+equipment',
        blurb: 'Dumbbells, bands, mats',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'tech',
    name: 'Tech & Gadgets',
    icon: '📱',
    pitch: 'Phones, laptops, software, and smart home gear — high AOV and evergreen demand.',
    color: '#2563eb',
    primaryCta: {
      label: 'Browse tech picks on Amazon',
      baseUrl: 'https://www.amazon.com/s?k=electronics',
      partner: 'Amazon Associates',
      network: 'amazon'
    },
    partners: [
      { name: 'Best Buy', baseUrl: 'https://www.bestbuy.com/', blurb: 'Electronics & appliances', network: 'generic' },
      {
        name: 'Laptops (Amazon)',
        baseUrl: 'https://www.amazon.com/s?k=laptops',
        blurb: 'Associates-tagged laptop search',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'home',
    name: 'Home & DIY',
    icon: '🏠',
    pitch: 'Furniture, tools, smart home, and home improvement — big baskets, repeat buyers.',
    color: '#d97706',
    primaryCta: {
      label: 'Shop home deals on Amazon',
      baseUrl: 'https://www.amazon.com/s?k=home+and+kitchen',
      partner: 'Amazon Associates',
      network: 'amazon'
    },
    partners: [
      { name: 'Wayfair', baseUrl: 'https://www.wayfair.com/', blurb: 'Furniture & décor', network: 'generic' },
      {
        name: 'Smart home (Amazon)',
        baseUrl: 'https://www.amazon.com/s?k=smart+home',
        blurb: 'Bulbs, plugs, cameras',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Stays',
    icon: '✈️',
    pitch: 'Flights, hotels, car rentals, and experiences — high commissions on bookings.',
    color: '#7c3aed',
    primaryCta: {
      label: 'Find hotels (Booking affiliate format)',
      baseUrl: 'https://www.booking.com/',
      partner: 'Booking.com (aid format)',
      network: 'booking'
    },
    partners: [
      { name: 'Expedia', baseUrl: 'https://www.expedia.com/', blurb: 'Flights + hotels packages', network: 'generic' },
      {
        name: 'Travel gear (Amazon)',
        baseUrl: 'https://www.amazon.com/s?k=travel+accessories',
        blurb: 'Luggage & packing cubes',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty & Fashion',
    icon: '✨',
    pitch: 'Skincare, makeup, apparel, and accessories with loyal repeat customers.',
    color: '#db2777',
    primaryCta: {
      label: 'Shop beauty on Amazon',
      baseUrl: 'https://www.amazon.com/s?k=skincare',
      partner: 'Amazon Associates',
      network: 'amazon'
    },
    partners: [
      { name: 'Ulta', baseUrl: 'https://www.ulta.com/', blurb: 'Furniture & décor', network: 'generic' },
      {
        name: 'Makeup (Amazon)',
        baseUrl: 'https://www.amazon.com/s?k=makeup',
        blurb: 'Associates-tagged beauty search',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'education',
    name: 'Education & Skills',
    icon: '📚',
    pitch: 'Online courses, certifications, and learning platforms with recurring affiliate payouts.',
    color: '#0891b2',
    primaryCta: {
      label: 'Start learning today',
      baseUrl: 'https://www.coursera.org/',
      partner: 'Coursera (example)',
      network: 'generic'
    },
    partners: [
      { name: 'Udemy', baseUrl: 'https://www.udemy.com/', blurb: 'Affordable skill courses', network: 'generic' },
      {
        name: 'Study books (Amazon)',
        baseUrl: 'https://www.amazon.com/s?k=programming+books',
        blurb: 'Associates-tagged textbooks',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance & Protection',
    icon: '🛡️',
    pitch: 'Auto, home, life, and pet insurance quotes — some of the highest CPA payouts online.',
    color: '#4f46e5',
    primaryCta: {
      label: 'Compare insurance quotes',
      baseUrl: 'https://www.nerdwallet.com/insurance',
      partner: 'Insurance compare (example)',
      network: 'generic'
    },
    partners: [
      { name: 'Policygenius', baseUrl: 'https://www.policygenius.com/', blurb: 'Life & home insurance', network: 'generic' },
      { name: 'The Zebra', baseUrl: 'https://www.thezebra.com/', blurb: 'Auto insurance comparison', network: 'generic' }
    ]
  }
];

/**
 * Featured / sponsored partner slot — Amazon Associates homepage with tag.
 */
var FEATURED_PARTNER = {
  title: 'Featured Partner',
  name: 'Amazon Associates',
  pitch:
    'Cross-niche bestsellers with Amazon’s Associates tag format (?tag=YOURTAG-20). Replace amazonTag in js/niches.js after you are approved.',
  baseUrl: 'https://www.amazon.com/',
  ctaLabel: 'Shop Amazon (tagged)',
  badge: 'Sponsored · Amazon format',
  network: 'amazon'
};

/**
 * Lead capture config (email / newsletter — secondary monetization path).
 */
var LEAD_CAPTURE = {
  headline: 'Get weekly deal digests',
  subhead: 'Niche picks, coupon alerts, and partner offers — free. (Connect your email tool later.)',
  buttonLabel: 'Join free list',
  privacyNote: 'No spam. Unsubscribe anytime. This form is a front-end shell until you add an ESP.'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NICHES: NICHES,
    DEFAULT_AFFILIATE: DEFAULT_AFFILIATE,
    FEATURED_PARTNER: FEATURED_PARTNER,
    LEAD_CAPTURE: LEAD_CAPTURE
  };
}
