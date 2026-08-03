/** Tech deals / comparison data — Amazon tag applied at render */
var TECH_OFFERS = {
  picks: [
    {
      rank: '1',
      name: 'Budget earbuds',
      why: 'Daily use. Big value. Easy gift.',
      tips: 'Check return window. Read recent 1-star noise complaints.',
      baseUrl: 'https://www.amazon.com/s?k=wireless+earbuds+budget',
      cta: 'Shop earbuds →',
      network: 'amazon'
    },
    {
      rank: '2',
      name: 'USB-C charger block',
      why: 'One brick beats a junk drawer of cables.',
      tips: 'Look for USB-C PD if you charge a laptop.',
      baseUrl: 'https://www.amazon.com/s?k=usb+c+gan+charger',
      cta: 'Shop chargers →',
      network: 'amazon'
    },
    {
      rank: '3',
      name: 'Laptop under mid budget',
      why: 'School, work, streaming — not gaming rigs.',
      tips: '16GB RAM if you can. SSD only.',
      baseUrl: 'https://www.amazon.com/s?k=laptop+16gb+ssd',
      cta: 'Shop laptops →',
      network: 'amazon'
    },
    {
      rank: '4',
      name: 'External SSD',
      why: 'Fast backup. Cheap insurance for photos.',
      tips: 'Name-brand enclosure + cable in box.',
      baseUrl: 'https://www.amazon.com/s?k=portable+ssd',
      cta: 'Shop SSDs →',
      network: 'amazon'
    },
    {
      rank: '5',
      name: 'Webcam or ring light',
      why: 'Work calls look clearer. Small spend.',
      tips: 'Window light first — gear second.',
      baseUrl: 'https://www.amazon.com/s?k=1080p+webcam',
      cta: 'Shop webcams →',
      network: 'amazon'
    }
  ],
  extras: [
    {
      name: 'Phone cases',
      blurb: 'Protect what you already own',
      baseUrl: 'https://www.amazon.com/s?k=phone+case',
      cta: 'Shop cases →',
      network: 'amazon'
    },
    {
      name: 'Cable pack',
      blurb: 'USB-C / multi-pack for the house',
      baseUrl: 'https://www.amazon.com/s?k=usb+c+cable+pack',
      cta: 'Shop cables →',
      network: 'amazon'
    },
    {
      name: 'Best Buy store',
      blurb: 'Price match / open-box sometimes',
      baseUrl: 'https://www.bestbuy.com/',
      cta: 'Open Best Buy →',
      network: 'generic'
    }
  ]
};
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TECH_OFFERS: TECH_OFFERS };
}
