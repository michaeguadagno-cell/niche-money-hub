/**
 * DealDoor — simple cards, big buttons, click logging.
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
    if (typeof resolveOutboundUrl === 'function') {
      return resolveOutboundUrl(baseUrl, DEFAULT_AFFILIATE, {
        network: network || DEFAULT_AFFILIATE.defaultNetwork || 'generic',
        campaign: campaign || DEFAULT_AFFILIATE.utmCampaign
      });
    }
    return buildAffiliateUrl(baseUrl, {
      ref: DEFAULT_AFFILIATE.ref,
      aff: DEFAULT_AFFILIATE.aff,
      utmSource: DEFAULT_AFFILIATE.utmSource,
      utmMedium: DEFAULT_AFFILIATE.utmMedium,
      utmCampaign: campaign || DEFAULT_AFFILIATE.utmCampaign
    });
  }

  function record(destination, label, kind) {
    if (!clickStore) return;
    try {
      clickStore.recordClick(destination, label, kind);
      updateClickCount();
    } catch (e) {
      /* ignore */
    }
  }

  function updateClickCount() {
    var el = document.getElementById('click-count');
    if (!el || !clickStore) return;
    el.textContent = String(clickStore.getEvents().length);
  }

  function el(tag, className, attrs) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function wireOutbound(anchor, destination, label, kind) {
    anchor.setAttribute('href', destination);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer sponsored');
    anchor.addEventListener('click', function () {
      record(destination, label, kind || 'outbound');
    });
  }

  function renderChips() {
    var root = document.getElementById('topic-chips');
    if (!root || !NICHES) return;
    root.innerHTML = '';
    NICHES.forEach(function (n) {
      var a = el('a', 'topic-chip', {
        href: '#card-' + n.id,
        text: n.icon + ' ' + n.name
      });
      a.style.setProperty('--chip-color', n.color);
      root.appendChild(a);
    });
  }

  function renderNicheCard(niche) {
    var card = el('article', 'niche-card', {
      id: 'card-' + niche.id,
      'data-niche': niche.id
    });
    card.style.setProperty('--niche-color', niche.color);

    var header = el('div', 'niche-card__header');
    header.appendChild(
      el('span', 'niche-card__icon', { text: niche.icon, 'aria-hidden': 'true' })
    );
    header.appendChild(el('h2', 'niche-card__title', { text: niche.name }));
    card.appendChild(header);

    card.appendChild(el('p', 'niche-card__pitch', { text: niche.pitch }));

    var ctaUrl = tracked(
      niche.primaryCta.baseUrl,
      'niche-' + niche.id,
      niche.primaryCta.network
    );
    var cta = el('a', 'btn btn--primary niche-card__cta', {
      text: niche.primaryCta.label,
      'data-monetization': 'affiliate',
      'data-network': niche.primaryCta.network || 'generic'
    });
    wireOutbound(cta, ctaUrl, niche.name + ' · ' + niche.primaryCta.partner, 'outbound');
    card.appendChild(cta);

    if (niche.partners && niche.partners.length) {
      var list = el('ul', 'niche-card__partners');
      niche.partners.forEach(function (p) {
        var li = el('li');
        var link = el('a', 'partner-link', {
          'data-monetization': 'affiliate',
          'data-network': p.network || 'generic'
        });
        link.appendChild(document.createTextNode(p.name));
        if (p.blurb) {
          link.appendChild(document.createElement('br'));
          var sm = document.createElement('small');
          sm.textContent = p.blurb;
          link.appendChild(sm);
        }
        var url = tracked(p.baseUrl, 'partner-' + niche.id, p.network);
        wireOutbound(link, url, niche.name + ' · ' + p.name, 'outbound');
        li.appendChild(link);
        list.appendChild(li);
      });
      card.appendChild(list);
    }

    return card;
  }

  function renderNiches() {
    var grid = document.getElementById('niche-grid');
    if (!grid) return;
    grid.innerHTML = '';
    NICHES.forEach(function (n) {
      grid.appendChild(renderNicheCard(n));
    });
  }

  function renderFeatured() {
    var root = document.getElementById('featured-partner');
    if (!root || !FEATURED_PARTNER) return;
    root.innerHTML = '';

    root.appendChild(
      el('span', 'badge badge--sponsored', { text: FEATURED_PARTNER.badge })
    );
    root.appendChild(el('h2', 'panel__title', { text: FEATURED_PARTNER.title }));
    root.appendChild(el('p', 'featured__name', { text: FEATURED_PARTNER.name }));
    root.appendChild(el('p', 'featured__pitch', { text: FEATURED_PARTNER.pitch }));

    var url = tracked(
      FEATURED_PARTNER.baseUrl,
      'featured-partner',
      FEATURED_PARTNER.network || 'amazon'
    );
    var cta = el('a', 'btn btn--accent', {
      text: FEATURED_PARTNER.ctaLabel,
      'data-monetization': 'sponsored',
      'data-network': FEATURED_PARTNER.network || 'amazon'
    });
    wireOutbound(cta, url, 'Featured · ' + FEATURED_PARTNER.name, 'sponsored');
    root.appendChild(cta);
  }

  function renderLeadCapture() {
    var form = document.getElementById('lead-form');
    if (!form || !LEAD_CAPTURE) return;

    var h = document.getElementById('lead-headline');
    var s = document.getElementById('lead-subhead');
    var btn = document.getElementById('lead-submit');
    var note = document.getElementById('lead-privacy');
    if (h) h.textContent = LEAD_CAPTURE.headline;
    if (s) s.textContent = LEAD_CAPTURE.subhead;
    if (btn) btn.textContent = LEAD_CAPTURE.buttonLabel;
    if (note) note.textContent = LEAD_CAPTURE.privacyNote;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value : '';
      record('lead-capture://newsletter', email ? 'lead:' + email : 'lead:empty', 'lead');
      var status = document.getElementById('lead-status');
      if (status) {
        status.textContent = 'Got it! (Demo — real email list comes later.)';
        status.hidden = false;
      }
      form.reset();
    });
  }

  function wireAdSlots() {
    document.querySelectorAll('[data-ad-slot]').forEach(function (slot) {
      var id = slot.getAttribute('data-ad-slot') || 'unknown';
      slot.addEventListener('click', function () {
        record('ad-slot://' + id, 'CPC slot ' + id, 'ad-slot');
        var note = slot.querySelector('.ad-slot__note');
        if (note) {
          note.textContent = 'Click saved. Real ads can go here later.';
        }
      });
    });
  }

  function initNavScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href').slice(1);
        if (!id) return;
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showOperatorPanel() {
    var panel = document.getElementById('operator-clicks');
    var btn = document.getElementById('toggle-clicks');
    if (!btn || !panel || !clickStore) return;
    btn.addEventListener('click', function () {
      var open = panel.hidden;
      panel.hidden = !open;
      if (open) {
        var events = clickStore.getEvents();
        panel.innerHTML =
          events.length === 0
            ? '<p class="tiny">No clicks yet. Tap a big button first.</p>'
            : '<ul class="click-log">' +
              events
                .slice()
                .reverse()
                .slice(0, 20)
                .map(function (ev) {
                  return (
                    '<li><strong>' +
                    escapeHtml(ev.label) +
                    '</strong> · ' +
                    escapeHtml(ev.kind) +
                    '<br><span class="tiny">' +
                    escapeHtml(ev.destination) +
                    '</span></li>'
                  );
                })
                .join('') +
              '</ul>';
      }
    });
  }

  function boot() {
    renderChips();
    renderNiches();
    renderFeatured();
    renderLeadCapture();
    wireAdSlots();
    initNavScroll();
    showOperatorPanel();
    updateClickCount();
    document.documentElement.setAttribute('data-app-ready', 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
