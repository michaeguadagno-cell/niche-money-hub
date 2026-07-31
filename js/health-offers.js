/**
 * Health & longevity offer data — Amazon search links (tag applied at render).
 * Not medical advice. No cure claims.
 */
var HEALTH_OFFERS = {
  isometrics: {
    title: 'Isometric workout gear (cheap)',
    items: [
      {
        name: 'Yoga mat',
        blurb: 'Soft floor for wall sits & planks',
        baseUrl: 'https://www.amazon.com/s?k=yoga+mat',
        network: 'amazon',
        cta: 'Shop yoga mats →'
      },
      {
        name: 'Resistance bands',
        blurb: 'Add hard holds without a gym',
        baseUrl: 'https://www.amazon.com/s?k=resistance+bands+set',
        network: 'amazon',
        cta: 'Shop bands →'
      },
      {
        name: 'Door pull-up bar',
        blurb: 'Hang holds at home',
        baseUrl: 'https://www.amazon.com/s?k=doorway+pull+up+bar',
        network: 'amazon',
        cta: 'Shop bars →'
      }
    ]
  },
  budget: {
    title: 'Healthy for less',
    items: [
      {
        name: 'Food scale',
        blurb: 'See real portions — saves money',
        baseUrl: 'https://www.amazon.com/s?k=kitchen+food+scale',
        network: 'amazon',
        cta: 'Shop scales →'
      },
      {
        name: 'Water bottle',
        blurb: 'Drink more water, skip soda',
        baseUrl: 'https://www.amazon.com/s?k=insulated+water+bottle',
        network: 'amazon',
        cta: 'Shop bottles →'
      },
      {
        name: 'Sleep mask + ear plugs',
        blurb: 'Cheap sleep upgrade',
        baseUrl: 'https://www.amazon.com/s?k=sleep+mask+ear+plugs',
        network: 'amazon',
        cta: 'Shop sleep kit →'
      },
      {
        name: 'Walking shoes',
        blurb: 'Daily walks beat fancy gear',
        baseUrl: 'https://www.amazon.com/s?k=comfortable+walking+shoes',
        network: 'amazon',
        cta: 'Shop shoes →'
      }
    ]
  },
  stacks: {
    title: 'Supplement stacks (general wellness)',
    note:
      'These are common “feel better / longevity interest” stacks people research. They are NOT cures. Ask a doctor or pharmacist—especially if you have illness, take medicine, or are pregnant.',
    items: [
      {
        id: 'foundation',
        name: 'Foundation stack',
        priceLabel: 'Usually lowest cost',
        bullets: [
          'Vitamin D3 (if you get little sun)',
          'Omega-3 fish oil (or algae oil)',
          'Basic multivitamin (food first, then fill gaps)',
          'Magnesium at night (many people are low)'
        ],
        baseUrl: 'https://www.amazon.com/s?k=vitamin+D3+omega+3+magnesium+multivitamin',
        network: 'amazon',
        cta: 'Shop foundation stack →'
      },
      {
        id: 'energy',
        name: 'Feel-good energy stack',
        priceLabel: 'Mid cost',
        bullets: [
          'Creatine monohydrate (well studied, cheap)',
          'Caffeine only if you already use coffee/tea',
          'Electrolytes / salt if you sweat a lot',
          'Protein powder if you under-eat protein'
        ],
        baseUrl: 'https://www.amazon.com/s?k=creatine+monohydrate+protein+powder+electrolytes',
        network: 'amazon',
        cta: 'Shop energy stack →'
      },
      {
        id: 'longevity',
        name: 'Longevity interest stack',
        priceLabel: 'Costs more — optional',
        bullets: [
          'Fiber (psyllium or eat beans/oats instead)',
          'Green tea or matcha (cheap habit)',
          'Quality sleep still beats most pills',
          'Talk to a clinician before “anti-aging” hype products'
        ],
        baseUrl: 'https://www.amazon.com/s?k=psyllium+husk+green+tea+extract+longevity+supplements',
        network: 'amazon',
        cta: 'Shop longevity aisle →'
      }
    ]
  },
  wellnessSupport: {
    title: 'Body care & recovery (support habits)',
    items: [
      {
        name: 'Foam roller',
        blurb: 'Gentle recovery after holds',
        baseUrl: 'https://www.amazon.com/s?k=foam+roller',
        network: 'amazon',
        cta: 'Shop rollers →'
      },
      {
        name: 'Blood pressure cuff',
        blurb: 'Know your numbers at home',
        baseUrl: 'https://www.amazon.com/s?k=home+blood+pressure+monitor',
        network: 'amazon',
        cta: 'Shop monitors →'
      }
    ]
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HEALTH_OFFERS: HEALTH_OFFERS };
}
