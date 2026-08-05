(function () {
  'use strict';
  var store =
    typeof createClickStore === 'function'
      ? createClickStore(typeof localStorage !== 'undefined' ? localStorage : null, {
          createClickEvent: createClickEvent,
          appendClickEvent: appendClickEvent
        })
      : null;

  function wire(a, kind, label) {
    var url = typeof buildHubSpotUrl === 'function' ? buildHubSpotUrl(kind) : a.getAttribute('href');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer sponsored');
    a.setAttribute('data-monetization', 'affiliate');
    a.addEventListener('click', function () {
      if (store) {
        try {
          store.recordClick(url, label || kind, 'outbound');
        } catch (e) {}
      }
    });
  }

  function boot() {
    document.querySelectorAll('[data-hubspot]').forEach(function (a) {
      var kind = a.getAttribute('data-hubspot') || 'primary';
      wire(a, kind, 'HubSpot · ' + kind);
    });

    var ad = document.querySelector('[data-ad-slot="hubspot-top"]');
    if (ad) {
      ad.addEventListener('click', function () {
        if (store) {
          try {
            store.recordClick('ad-slot://hubspot-top', 'CPC hubspot', 'ad-slot');
          } catch (e) {}
        }
      });
    }

    var shareUrl = 'https://michaeguadagno-cell.github.io/hubspot.html';
    var shareText = 'Free HubSpot CRM guide (great for small business): ' + shareUrl;
    var msg = document.getElementById('hs-share-msg');
    if (msg) msg.textContent = shareText;
    var btn = document.getElementById('hs-copy-btn');
    var st = document.getElementById('hs-copy-status');
    if (btn) {
      btn.addEventListener('click', function () {
        function ok() {
          if (st) {
            st.hidden = false;
            st.textContent = 'Copied!';
          }
          if (store) {
            try {
              store.recordClick(shareUrl, 'share-hubspot', 'lead');
            } catch (e) {}
          }
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareText).then(ok).catch(ok);
        } else ok();
      });
    }

    var form = document.getElementById('hs-lead');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = (document.getElementById('hs-email') || {}).value || '';
        if (store) {
          try {
            store.recordClick('lead-capture://hubspot', 'lead:' + email, 'lead');
          } catch (err) {}
        }
        var s = document.getElementById('hs-lead-status');
        if (s) {
          s.hidden = false;
          s.textContent = 'Saved on this device (demo). Connect free email tool later.';
        }
        form.reset();
      });
    }

    document.documentElement.setAttribute('data-app-ready', 'true');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
