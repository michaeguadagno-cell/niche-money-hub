/**
 * Unit tests for shipped pure helpers (affiliate.js + click-store.js).
 * Run: node tests/run-tests.js
 * No re-implementation — requires the real modules under ../js/
 */
'use strict';

var path = require('path');
var assert = require('assert');

var root = path.join(__dirname, '..');
var affiliate = require(path.join(root, 'js', 'affiliate.js'));
var clickStoreMod = require(path.join(root, 'js', 'click-store.js'));

var buildAffiliateUrl = affiliate.buildAffiliateUrl;
var buildAmazonAssociatesUrl = affiliate.buildAmazonAssociatesUrl;
var buildBookingAffiliateUrl = affiliate.buildBookingAffiliateUrl;
var resolveOutboundUrl = affiliate.resolveOutboundUrl;
var createClickEvent = affiliate.createClickEvent;
var appendClickEvent = affiliate.appendClickEvent;
var createClickStore = clickStoreMod.createClickStore;

var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log('  PASS  ' + name);
  } catch (err) {
    failed += 1;
    console.log('  FAIL  ' + name);
    console.log('        ' + (err && err.stack ? err.stack : err));
  }
}

console.log('Niche Money Hub — unit tests (shipped code)\n');

// --- buildAffiliateUrl ---
test('buildAffiliateUrl adds ref, aff, and utm_* params', function () {
  var url = buildAffiliateUrl('https://example.com/deals', {
    ref: 'hub42',
    aff: 'aff99',
    utmSource: 'niche-money-hub',
    utmMedium: 'affiliate',
    utmCampaign: 'directory'
  });
  var u = new URL(url);
  assert.strictEqual(u.origin + u.pathname, 'https://example.com/deals');
  assert.strictEqual(u.searchParams.get('ref'), 'hub42');
  assert.strictEqual(u.searchParams.get('aff'), 'aff99');
  assert.strictEqual(u.searchParams.get('utm_source'), 'niche-money-hub');
  assert.strictEqual(u.searchParams.get('utm_medium'), 'affiliate');
  assert.strictEqual(u.searchParams.get('utm_campaign'), 'directory');
});

test('buildAffiliateUrl preserves existing query and merges extra', function () {
  var url = buildAffiliateUrl('https://shop.example.com/p?sku=1', {
    ref: 'r1',
    extra: { subid: 'email-blast' }
  });
  var u = new URL(url);
  assert.strictEqual(u.searchParams.get('sku'), '1');
  assert.strictEqual(u.searchParams.get('ref'), 'r1');
  assert.strictEqual(u.searchParams.get('subid'), 'email-blast');
});

test('buildAffiliateUrl throws on empty or invalid baseUrl', function () {
  assert.throws(function () {
    buildAffiliateUrl('');
  }, TypeError);
  assert.throws(function () {
    buildAffiliateUrl('not-a-url');
  }, TypeError);
});

// --- Amazon Associates format ---
test('buildAmazonAssociatesUrl adds tag to search URL', function () {
  var url = buildAmazonAssociatesUrl('https://www.amazon.com/s?k=laptops', 'nichehub-20');
  var u = new URL(url);
  assert.strictEqual(u.searchParams.get('tag'), 'nichehub-20');
  assert.strictEqual(u.searchParams.get('k'), 'laptops');
  assert.ok(u.hostname.indexOf('amazon') !== -1);
});

test('buildAmazonAssociatesUrl builds ASIN product URL with tag', function () {
  var url = buildAmazonAssociatesUrl({ asin: 'B08N5WRWNW' }, 'mysite-20');
  var u = new URL(url);
  assert.ok(u.pathname.indexOf('B08N5WRWNW') !== -1);
  assert.strictEqual(u.searchParams.get('tag'), 'mysite-20');
});

test('buildAmazonAssociatesUrl builds keywords search with tag', function () {
  var url = buildAmazonAssociatesUrl({ keywords: 'wireless earbuds' }, 'mysite-20');
  var u = new URL(url);
  assert.strictEqual(u.searchParams.get('tag'), 'mysite-20');
  assert.ok(u.searchParams.get('k').indexOf('earbuds') !== -1);
});

test('buildBookingAffiliateUrl sets aid param', function () {
  var url = buildBookingAffiliateUrl('https://www.booking.com/', '1234567', {
    label: 'niche-travel'
  });
  var u = new URL(url);
  assert.strictEqual(u.searchParams.get('aid'), '1234567');
  assert.strictEqual(u.searchParams.get('label'), 'niche-travel');
});

test('resolveOutboundUrl routes amazon / booking / generic', function () {
  var cfg = {
    ref: 'r1',
    aff: 'a1',
    utmSource: 'hub',
    utmMedium: 'affiliate',
    utmCampaign: 'dir',
    amazonTag: 'demo-20',
    bookingAid: '999888',
    defaultNetwork: 'generic'
  };
  var amz = resolveOutboundUrl('https://www.amazon.com/s?k=tech', cfg, {
    network: 'amazon',
    campaign: 'niche-tech'
  });
  assert.strictEqual(new URL(amz).searchParams.get('tag'), 'demo-20');

  var book = resolveOutboundUrl('https://www.booking.com/', cfg, {
    network: 'booking',
    campaign: 'niche-travel'
  });
  assert.strictEqual(new URL(book).searchParams.get('aid'), '999888');

  var gen = resolveOutboundUrl('https://www.coursera.org/', cfg, {
    network: 'generic',
    campaign: 'niche-edu'
  });
  var gu = new URL(gen);
  assert.strictEqual(gu.searchParams.get('ref'), 'r1');
  assert.strictEqual(gu.searchParams.get('utm_campaign'), 'niche-edu');
});

// --- createClickEvent ---
test('createClickEvent returns destination, label, kind, timestamp', function () {
  var ts = 1700000000000;
  var ev = createClickEvent('https://partner.example/x?ref=1', 'Finance · Partner', 'outbound', ts);
  assert.strictEqual(ev.destination, 'https://partner.example/x?ref=1');
  assert.strictEqual(ev.label, 'Finance · Partner');
  assert.strictEqual(ev.kind, 'outbound');
  assert.strictEqual(ev.timestamp, ts);
});

test('createClickEvent defaults kind and uses numeric timestamp', function () {
  var before = Date.now();
  var ev = createClickEvent('ad-slot://hero', 'CPC slot hero');
  var after = Date.now();
  assert.strictEqual(ev.kind, 'outbound');
  assert.ok(typeof ev.timestamp === 'number');
  assert.ok(ev.timestamp >= before && ev.timestamp <= after);
});

// --- appendClickEvent ---
test('appendClickEvent is pure and caps length', function () {
  var original = [{ destination: 'a', label: 'A', kind: 'outbound', timestamp: 1 }];
  var next = appendClickEvent(original, createClickEvent('b', 'B', 'ad-slot', 2), 2);
  assert.strictEqual(original.length, 1); // not mutated
  assert.strictEqual(next.length, 2);
  assert.strictEqual(next[1].destination, 'b');

  var capped = appendClickEvent(next, createClickEvent('c', 'C', 'lead', 3), 2);
  assert.strictEqual(capped.length, 2);
  assert.strictEqual(capped[0].destination, 'b');
  assert.strictEqual(capped[1].destination, 'c');
});

// --- createClickStore (real store + pure helpers) ---
test('createClickStore records clicks with destination + label via shipped helpers', function () {
  var memory = {};
  var storage = {
    getItem: function (k) {
      return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null;
    },
    setItem: function (k, v) {
      memory[k] = String(v);
    }
  };
  var store = createClickStore(storage, {
    createClickEvent: createClickEvent,
    appendClickEvent: appendClickEvent
  });
  store.clear();
  var ev = store.recordClick(
    'https://example.com/out?ref=hub42&aff=aff99',
    'Tech · Best Buy',
    'outbound'
  );
  assert.strictEqual(ev.destination, 'https://example.com/out?ref=hub42&aff=aff99');
  assert.strictEqual(ev.label, 'Tech · Best Buy');
  assert.strictEqual(ev.kind, 'outbound');
  assert.ok(typeof ev.timestamp === 'number');

  var all = store.getEvents();
  assert.strictEqual(all.length, 1);
  assert.strictEqual(all[0].label, 'Tech · Best Buy');
  assert.ok(String(memory[store.KEY]).indexOf('Best Buy') !== -1);
});

test('createClickStore records ad-slot clicks', function () {
  var memory = {};
  var storage = {
    getItem: function (k) {
      return Object.prototype.hasOwnProperty.call(memory, k) ? memory[k] : null;
    },
    setItem: function (k, v) {
      memory[k] = String(v);
    }
  };
  var store = createClickStore(storage, {
    createClickEvent: createClickEvent,
    appendClickEvent: appendClickEvent
  });
  store.recordClick('ad-slot://leaderboard-top', 'CPC slot leaderboard-top', 'ad-slot');
  var all = store.getEvents();
  assert.strictEqual(all.length, 1);
  assert.strictEqual(all[0].kind, 'ad-slot');
  assert.ok(all[0].destination.indexOf('leaderboard-top') !== -1);
});

// --- niches data structural checks (shipped data module) ---
test('niches data has major niches with primary CTA baseUrls', function () {
  var niches = require(path.join(root, 'js', 'niches.js'));
  assert.ok(Array.isArray(niches.NICHES));
  assert.ok(niches.NICHES.length >= 6);
  assert.ok(niches.DEFAULT_AFFILIATE.amazonTag);
  assert.ok(niches.DEFAULT_AFFILIATE.bookingAid);
  niches.NICHES.forEach(function (n) {
    assert.ok(n.name && n.pitch && n.primaryCta && n.primaryCta.baseUrl);
    if (n.primaryCta.network === 'internal') {
      assert.ok(n.primaryCta.baseUrl.indexOf('.html') !== -1);
      return;
    }
    assert.ok(/^https?:\/\//.test(n.primaryCta.baseUrl));
    var built = resolveOutboundUrl(n.primaryCta.baseUrl, niches.DEFAULT_AFFILIATE, {
      network: n.primaryCta.network || 'generic',
      campaign: 'niche-' + n.id
    });
    var u = new URL(built);
    if (n.primaryCta.network === 'amazon') {
      assert.strictEqual(u.searchParams.get('tag'), niches.DEFAULT_AFFILIATE.amazonTag);
    } else if (n.primaryCta.network === 'booking') {
      assert.strictEqual(u.searchParams.get('aid'), niches.DEFAULT_AFFILIATE.bookingAid);
    } else {
      assert.strictEqual(u.searchParams.get('ref'), niches.DEFAULT_AFFILIATE.ref);
    }
  });
  // Health guide page ships with offers data
  var healthOffers = require(path.join(root, 'js', 'health-offers.js'));
  assert.ok(healthOffers.HEALTH_OFFERS.stacks.items.length >= 3);
  assert.ok(healthOffers.HEALTH_OFFERS.isometrics.items.length >= 1);
  var techOffers = require(path.join(root, 'js', 'tech-offers.js'));
  assert.ok(techOffers.TECH_OFFERS.picks.length >= 5);
  techOffers.TECH_OFFERS.picks.forEach(function (p) {
    var built = resolveOutboundUrl(p.baseUrl, niches.DEFAULT_AFFILIATE, {
      network: p.network || 'amazon',
      campaign: 'tech-test'
    });
    assert.strictEqual(new URL(built).searchParams.get('tag'), niches.DEFAULT_AFFILIATE.amazonTag);
  });
  var featured = resolveOutboundUrl(
    niches.FEATURED_PARTNER.baseUrl,
    niches.DEFAULT_AFFILIATE,
    { network: niches.FEATURED_PARTNER.network || 'amazon' }
  );
  assert.strictEqual(new URL(featured).searchParams.get('tag'), niches.DEFAULT_AFFILIATE.amazonTag);
  assert.ok(niches.LEAD_CAPTURE.headline);
});

console.log('\nResults: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) {
  process.exit(1);
}
process.exit(0);
