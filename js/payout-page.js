/**
 * Shared wiring for money guide pages (code.html, crypto-tax.html).
 * Buttons use data-payout="opencode" | "koinly" | "coinledger".
 */
(function () {
  'use strict';

  var clickStore =
    typeof createClickStore === 'function'
      ? createClickStore(typeof localStorage !== 'undefined' ? localStorage : null, {
          createClickEvent: createClickEvent,
          appendClickEvent: appendClickEvent
        })
      : null;

  function record(destination, label, kind) {
    if (!clickStore) return;
    try {
      clickStore.recordClick(destination, label, kind || 'outbound');
    } catch (e) {
      /* ignore */
    }
  }

  function payoutUrl(id) {
    if (typeof getPayoutUrl === 'function') return getPayoutUrl(id);
    if (typeof PAYOUT_LINKS !== 'undefined' && PAYOUT_LINKS[id]) return PAYOUT_LINKS[id].url;
    return '';
  }

  function wirePayoutButtons() {
    document.querySelectorAll('[data-payout]').forEach(function (a) {
      var id = a.getAttribute('data-payout');
      var url = payoutUrl(id);
      if (!url) return;
      a.setAttribute('href', url);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer sponsored');
      a.setAttribute('data-monetization', 'affiliate');
      a.addEventListener('click', function () {
        record(url, 'payout · ' + id, 'outbound');
      });
    });
  }

  function wireShare() {
    var btn = document.getElementById('pay-copy-btn');
    var status = document.getElementById('pay-copy-status');
    var msg = document.getElementById('pay-share-msg');
    var path = (location.pathname.split('/').pop() || 'index.html') || 'index.html';
    var shareUrl = 'https://michaeguadagno-cell.github.io/' + path;
    var shareText = (msg && msg.getAttribute('data-share')) || 'Free help: ' + shareUrl;
    if (shareText.indexOf('http') === -1) shareText = shareText + ' ' + shareUrl;
    if (msg) msg.textContent = shareText;
    if (!btn) return;
    btn.addEventListener('click', function () {
      function ok() {
        if (status) {
          status.hidden = false;
          status.textContent = 'Link copied!';
        }
        btn.textContent = 'Copied!';
        setTimeout(function () {
          btn.textContent = 'Copy link';
        }, 2000);
        record(shareUrl, 'share-copy-' + path, 'lead');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(ok).catch(function () {
          ok();
        });
      } else {
        ok();
      }
    });
  }

  function boot() {
    wirePayoutButtons();
    wireShare();
    document.documentElement.setAttribute('data-app-ready', 'true');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
