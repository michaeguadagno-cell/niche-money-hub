(function () {
  'use strict';
  var clickStore =
    typeof createClickStore === 'function'
      ? createClickStore(typeof localStorage !== 'undefined' ? localStorage : null, {
          createClickEvent: createClickEvent,
          appendClickEvent: appendClickEvent
        })
      : null;

  function tracked(baseUrl, campaign, network) {
    if (!baseUrl) return '#';
    if (network === 'internal' || !/^https?:\/\//i.test(baseUrl)) return baseUrl;
    if (typeof resolveOutboundUrl === 'function' && typeof DEFAULT_AFFILIATE !== 'undefined') {
      return resolveOutboundUrl(baseUrl, DEFAULT_AFFILIATE, {
        network: network || 'amazon',
        campaign: campaign || 'tech-guide'
      });
    }
    return baseUrl;
  }

  function wire(a, url, label) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer sponsored';
    a.addEventListener('click', function () {
      if (clickStore) try { clickStore.recordClick(url, label, 'outbound'); } catch (e) {}
    });
  }

  function boot() {
    if (typeof TECH_OFFERS === 'undefined') return;
    var list = document.getElementById('tech-picks');
    if (list) {
      list.innerHTML = '';
      TECH_OFFERS.picks.forEach(function (p) {
        var art = document.createElement('article');
        art.className = 'stack-card';
        art.innerHTML =
          '<span class="price-tag">#' + p.rank + '</span>' +
          '<h3></h3><p class="tiny"></p><p class="tiny"></p>';
        art.querySelector('h3').textContent = p.name;
        var tips = art.querySelectorAll('.tiny');
        tips[0].textContent = p.why;
        tips[1].textContent = 'Tip: ' + p.tips;
        var a = document.createElement('a');
        a.className = 'btn btn--health';
        a.style.background = 'linear-gradient(135deg,#60a5fa,#818cf8)';
        a.textContent = p.cta;
        a.setAttribute('data-monetization', 'affiliate');
        var url = tracked(p.baseUrl, 'tech-pick-' + p.rank, p.network);
        wire(a, url, 'Tech · ' + p.name);
        art.appendChild(a);
        list.appendChild(art);
      });
    }
    var ex = document.getElementById('tech-extras');
    if (ex) {
      ex.innerHTML = '';
      TECH_OFFERS.extras.forEach(function (p) {
        var art = document.createElement('article');
        art.className = 'stack-card';
        var h = document.createElement('h3');
        h.textContent = p.name;
        var bl = document.createElement('p');
        bl.className = 'tiny';
        bl.textContent = p.blurb;
        var a = document.createElement('a');
        a.className = 'btn btn--ghost';
        a.textContent = p.cta;
        a.setAttribute('data-monetization', 'affiliate');
        wire(a, tracked(p.baseUrl, 'tech-extra', p.network), 'Tech · ' + p.name);
        art.appendChild(h);
        art.appendChild(bl);
        art.appendChild(a);
        ex.appendChild(art);
      });
    }
    document.documentElement.setAttribute('data-app-ready', 'true');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
