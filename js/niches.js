/**
 * Topic cards + partner links.
 * Simple words for visitors. Operators still set amazonTag / bookingAid / baseUrl for real payouts.
 */

var DEFAULT_AFFILIATE = {
  ref: 'YOUR_REF_CODE',
  aff: 'YOUR_AFF_ID',
  utmSource: 'niche-money-hub',
  utmMedium: 'affiliate',
  utmCampaign: 'directory',
  amazonTag: 'YOURTAG-20',
  amazonLinkCode: 'll1',
  bookingAid: 'YOUR_BOOKING_AID',
  defaultNetwork: 'generic'
};

/**
 * Big topic cards — short names, short pitches, big button text.
 */
var NICHES = [
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: '🧡',
    pitch: 'Free CRM. Free affiliate program. Grow a business.',
    color: '#ff5c35',
    primaryCta: {
      label: 'Open HubSpot guide →',
      baseUrl: 'hubspot.html',
      partner: 'DealDoor HubSpot Guide',
      network: 'internal'
    },
    partners: [
      {
        name: 'Join affiliates (you)',
        baseUrl: 'https://www.hubspot.com/partners/affiliates',
        blurb: 'Free to join HubSpot',
        network: 'generic'
      },
      {
        name: 'Free CRM',
        baseUrl: 'https://www.hubspot.com/products/crm',
        blurb: 'Visitor free signup',
        network: 'generic'
      }
    ]
  },
  {
    id: 'finance',
    name: 'Money',
    icon: '💰',
    pitch: 'Cards. Banks. Saving. Easy money tools.',
    color: '#14b8a6',
    primaryCta: {
      label: 'See money deals →',
      baseUrl: 'https://www.nerdwallet.com/',
      partner: 'NerdWallet (example)',
      network: 'generic'
    },
    partners: [
      { name: 'Free credit check', baseUrl: 'https://www.creditkarma.com/', blurb: 'See your score free', network: 'generic' },
      {
        name: 'Money books',
        baseUrl: 'https://www.amazon.com/s?k=personal+finance+books',
        blurb: 'Shop books',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'health',
    name: 'Health',
    icon: '💪',
    pitch: 'Isometrics. Budget wellness. Longevity stacks.',
    color: '#22c55e',
    primaryCta: {
      label: 'Open free health guide →',
      baseUrl: 'health.html',
      partner: 'DealDoor Health Guide',
      network: 'internal'
    },
    partners: [
      {
        name: '7-day checklist',
        baseUrl: 'checklist.html',
        blurb: 'Free print plan',
        network: 'internal'
      },
      {
        name: 'Shop vitamins',
        baseUrl: 'https://www.amazon.com/s?k=vitamins+supplements',
        blurb: 'Amazon health aisle',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'tech',
    name: 'Tech',
    icon: '📱',
    pitch: 'Budget picks. Earbuds. Laptops. Chargers.',
    color: '#3b82f6',
    primaryCta: {
      label: 'Open tech guide →',
      baseUrl: 'tech.html',
      partner: 'DealDoor Tech Guide',
      network: 'internal'
    },
    partners: [
      {
        name: 'Shop electronics',
        baseUrl: 'https://www.amazon.com/s?k=electronics',
        blurb: 'Amazon aisle',
        network: 'amazon'
      },
      {
        name: 'Laptops',
        baseUrl: 'https://www.amazon.com/s?k=laptops',
        blurb: 'Find a laptop',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'home',
    name: 'Home',
    icon: '🏠',
    pitch: 'Kitchen. Tools. Make home nicer.',
    color: '#f59e0b',
    primaryCta: {
      label: 'Shop home deals →',
      baseUrl: 'https://www.amazon.com/s?k=home+and+kitchen',
      partner: 'Amazon Associates',
      network: 'amazon'
    },
    partners: [
      { name: 'Furniture', baseUrl: 'https://www.wayfair.com/', blurb: 'Couches & more', network: 'generic' },
      {
        name: 'Smart home',
        baseUrl: 'https://www.amazon.com/s?k=smart+home',
        blurb: 'Lights & plugs',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: '✈️',
    pitch: 'Hotels. Trips. Fun getaways.',
    color: '#a855f7',
    primaryCta: {
      label: 'Find a hotel →',
      baseUrl: 'https://www.booking.com/',
      partner: 'Booking.com (aid format)',
      network: 'booking'
    },
    partners: [
      { name: 'Flights & hotels', baseUrl: 'https://www.expedia.com/', blurb: 'Book a trip', network: 'generic' },
      {
        name: 'Travel bags',
        baseUrl: 'https://www.amazon.com/s?k=travel+accessories',
        blurb: 'Shop bags',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: '✨',
    pitch: 'Skin. Makeup. Look good stuff.',
    color: '#ec4899',
    primaryCta: {
      label: 'Shop beauty →',
      baseUrl: 'https://www.amazon.com/s?k=skincare',
      partner: 'Amazon Associates',
      network: 'amazon'
    },
    partners: [
      { name: 'Ulta', baseUrl: 'https://www.ulta.com/', blurb: 'Makeup store', network: 'generic' },
      {
        name: 'Makeup',
        baseUrl: 'https://www.amazon.com/s?k=makeup',
        blurb: 'Shop makeup',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'education',
    name: 'Learn',
    icon: '📚',
    pitch: 'Classes. Skills. Get smarter online.',
    color: '#06b6d4',
    primaryCta: {
      label: 'Start a class →',
      baseUrl: 'https://www.coursera.org/',
      partner: 'Coursera (example)',
      network: 'generic'
    },
    partners: [
      { name: 'Cheap classes', baseUrl: 'https://www.udemy.com/', blurb: 'Learn anything', network: 'generic' },
      {
        name: 'Study books',
        baseUrl: 'https://www.amazon.com/s?k=programming+books',
        blurb: 'Shop books',
        network: 'amazon'
      }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    pitch: 'Car. Home. Life. Compare prices.',
    color: '#6366f1',
    primaryCta: {
      label: 'Compare prices →',
      baseUrl: 'https://www.nerdwallet.com/insurance',
      partner: 'Insurance compare (example)',
      network: 'generic'
    },
    partners: [
      { name: 'Life insurance', baseUrl: 'https://www.policygenius.com/', blurb: 'Get quotes', network: 'generic' },
      { name: 'Car insurance', baseUrl: 'https://www.thezebra.com/', blurb: 'Compare cars', network: 'generic' }
    ]
  }
];

var FEATURED_PARTNER = {
  title: 'Hot pick today',
  name: 'Shop Amazon',
  pitch: 'One store. Almost everything. Tap the big yellow button.',
  baseUrl: 'https://www.amazon.com/',
  ctaLabel: 'Shop Amazon now →',
  badge: '⭐ Top pick',
  network: 'amazon'
};

var LEAD_CAPTURE = {
  headline: 'Want free deal alerts?',
  subhead: 'We email good deals. Free. Easy to stop anytime.',
  buttonLabel: 'Send me deals',
  privacyNote: 'No spam. You can leave the list any time.'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NICHES: NICHES,
    DEFAULT_AFFILIATE: DEFAULT_AFFILIATE,
    FEATURED_PARTNER: FEATURED_PARTNER,
    LEAD_CAPTURE: LEAD_CAPTURE
  };
}
