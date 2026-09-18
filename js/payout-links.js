/**
 * Live paying destinations — only real tracking URLs go here.
 * Network "direct" means the URL already has the partner's ref/via. Do not wrap it.
 *
 * Owner: paste new approved links here, then add a simple guide page that uses data-payout="id".
 */
var PAYOUT_LINKS = {
  opencode: {
    id: 'opencode',
    name: 'OpenCode',
    url: 'https://opencode.ai/go?ref=P09GVJ0ANH',
    ready: true,
    network: 'direct',
    page: 'code.html',
    pitch: 'Free AI that helps you write code.'
  },
  koinly: {
    id: 'koinly',
    name: 'Koinly',
    url: 'https://koinly.io/?via=62C62C62&utm_source=dealdoor&utm_medium=affiliate&utm_campaign=crypto-tax',
    ready: true,
    network: 'direct',
    page: 'crypto-tax.html',
    pitch: 'Turn messy coin trades into a tax report.'
  },
  coinledger: {
    id: 'coinledger',
    name: 'CoinLedger',
    url: 'https://coinledger.io/?fpr=zhcbzz',
    ready: true,
    network: 'direct',
    page: 'crypto-tax.html',
    pitch: 'US exchange trades into a tax report.'
  }
};

var LEAD_INBOX = 'onelifesolutions090118@gmail.com';

function getPayout(id) {
  if (!id || !PAYOUT_LINKS[id]) return null;
  return PAYOUT_LINKS[id];
}

function getPayoutUrl(id) {
  var p = getPayout(id);
  return p && p.url ? p.url : '';
}

function listReadyPayouts() {
  return Object.keys(PAYOUT_LINKS)
    .map(function (k) {
      return PAYOUT_LINKS[k];
    })
    .filter(function (p) {
      return p && p.ready && p.url && /^https:\/\//i.test(p.url);
    });
}

function isDirectPayoutUrl(url) {
  if (!url || typeof url !== 'string') return false;
  var ready = listReadyPayouts();
  for (var i = 0; i < ready.length; i++) {
    if (url.indexOf(ready[i].url) === 0 || ready[i].url.indexOf(url) === 0) return true;
  }
  return false;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PAYOUT_LINKS: PAYOUT_LINKS,
    LEAD_INBOX: LEAD_INBOX,
    getPayout: getPayout,
    getPayoutUrl: getPayoutUrl,
    listReadyPayouts: listReadyPayouts,
    isDirectPayoutUrl: isDirectPayoutUrl
  };
}
