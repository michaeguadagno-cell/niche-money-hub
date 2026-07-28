/**
 * Durable in-browser click store (localStorage) wrapping pure helpers.
 * Storage adapter is injectable for unit tests.
 */

var CLICK_STORE_KEY = 'nmh_click_events_v1';

/**
 * @param {{ getItem: Function, setItem: Function }|null} storage - localStorage-like; null = no-op memory
 * @param {object} helpers - { createClickEvent, appendClickEvent }
 */
function createClickStore(storage, helpers) {
  var mem = [];
  var store = storage || {
    getItem: function () {
      return JSON.stringify(mem);
    },
    setItem: function (_k, v) {
      try {
        mem = JSON.parse(v) || [];
      } catch (e) {
        mem = [];
      }
    }
  };

  function load() {
    try {
      var raw = store.getItem(CLICK_STORE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function save(events) {
    try {
      store.setItem(CLICK_STORE_KEY, JSON.stringify(events));
    } catch (e) {
      /* quota / private mode */
    }
  }

  /**
   * Record an outbound or ad-slot click.
   * @returns {object} the recorded event
   */
  function recordClick(destination, label, kind) {
    var event = helpers.createClickEvent(destination, label, kind);
    var next = helpers.appendClickEvent(load(), event);
    save(next);
    return event;
  }

  function getEvents() {
    return load();
  }

  function clear() {
    save([]);
  }

  return {
    recordClick: recordClick,
    getEvents: getEvents,
    clear: clear,
    KEY: CLICK_STORE_KEY
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createClickStore: createClickStore,
    CLICK_STORE_KEY: CLICK_STORE_KEY
  };
}
