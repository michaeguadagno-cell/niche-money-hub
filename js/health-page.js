/**
 * Health guide page — render offers with affiliate tracking + click log.
 */
(function () {
  'use strict';

  var clickStore =
    typeof createClickStore === 'function'
      ? createClickStore(
          typeof localStorage !== 'undefined' ? localStorage : null,
          {
            createClickEvent: createClickEvent,
            appendClickEvent: appendClickEvent
          }
        )
      : null;

  function tracked(baseUrl, campaign, network) {
    if (!baseUrl) return '#';
    if (network === 'internal' || !/^https?:\/\//i.test(baseUrl)) return baseUrl;
    if (typeof resolveOutboundUrl === 'function' && typeof DEFAULT_AFFILIATE !== 'undefined') {
      return resolveOutboundUrl(baseUrl, DEFAULT_AFFILIATE, {
        network: network || 'amazon',
        campaign: campaign || 'health-guide'
      });
    }
    if (typeof buildAmazonAssociatesUrl === 'function' && DEFAULT_AFFILIATE && DEFAULT_AFFILIATE.amazonTag) {
      return buildAmazonAssociatesUrl(baseUrl, DEFAULT_AFFILIATE.amazonTag);
    }
    return baseUrl;
  }

  function record(destination, label, kind) {
    if (!clickStore) return;
    try {
      clickStore.recordClick(destination, label, kind || 'outbound');
    } catch (e) {
      /* ignore */
    }
  }

  function wire(a, url, label) {
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer sponsored');
    a.addEventListener('click', function () {
      record(url, label, 'outbound');
    });
  }

  function el(tag, className, text) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderOfferList(rootId, items, campaign) {
    var root = document.getElementById(rootId);
    if (!root || !items) return;
    root.innerHTML = '';
    items.forEach(function (item) {
      var card = el('article', 'stack-card');
      card.appendChild(el('h3', '', item.name));
      if (item.blurb) card.appendChild(el('p', 'tiny', item.blurb));
      var url = tracked(item.baseUrl, campaign, item.network || 'amazon');
      var a = el('a', 'btn btn--health', item.cta || 'Shop →');
      a.setAttribute('data-monetization', 'affiliate');
      wire(a, url, 'Health · ' + item.name);
      card.appendChild(a);
      root.appendChild(card);
    });
  }

  function renderStacks() {
    var root = document.getElementById('stack-grid');
    if (!root || !HEALTH_OFFERS || !HEALTH_OFFERS.stacks) return;
    root.innerHTML = '';
    var note = document.getElementById('stack-note');
    if (note) note.textContent = HEALTH_OFFERS.stacks.note;
    HEALTH_OFFERS.stacks.items.forEach(function (item) {
      var card = el('article', 'stack-card');
      card.appendChild(el('h3', '', item.name));
      if (item.priceLabel) {
        var tag = el('span', 'price-tag', item.priceLabel);
        card.appendChild(tag);
      }
      var ul = document.createElement('ul');
      (item.bullets || []).forEach(function (b) {
        var li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
      card.appendChild(ul);
      var url = tracked(item.baseUrl, 'health-stack-' + item.id, item.network || 'amazon');
      var a = el('a', 'btn btn--health', item.cta || 'Shop →');
      a.setAttribute('data-monetization', 'affiliate');
      wire(a, url, 'Stack · ' + item.name);
      card.appendChild(a);
      root.appendChild(card);
    });
  }

  function boot() {
    if (typeof HEALTH_OFFERS === 'undefined') return;
    renderOfferList('iso-offers', HEALTH_OFFERS.isometrics.items, 'health-iso');
    renderOfferList('budget-offers', HEALTH_OFFERS.budget.items, 'health-budget');
    renderOfferList('support-offers', HEALTH_OFFERS.wellnessSupport.items, 'health-support');
    renderStacks();
    document.documentElement.setAttribute('data-app-ready', 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
