// ฟังก์ชันเรียก backend ใช้ร่วมกันทุกหน้า
(function () {
  'use strict';
  var TIMEOUT_MS = 20000;

  function newKey() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    var a = new Uint8Array(16); crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }

  function call(method, action, payloadOrQuery) {
    var base = window.WED_CONFIG.API_URL;
    var url = base;
    var t0 = Date.now();
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;
    var opts = { method: method, redirect: 'follow', cache: 'no-store' };
    if (ctrl) opts.signal = ctrl.signal;

    if (method === 'GET') {
      var qs = Object.keys(payloadOrQuery || {}).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(payloadOrQuery[k]);
      }).join('&');
      url += '?action=' + encodeURIComponent(action) + (qs ? '&' + qs : '');
    } else {
      opts.headers = { 'Content-Type': 'text/plain;charset=utf-8' }; // text/plain กัน CORS preflight
      opts.body = JSON.stringify(Object.assign({ action: action }, payloadOrQuery || {}));
    }

    return fetch(url, opts).then(function (res) {
      return res.text().then(function (text) {
        var data;
        try { data = JSON.parse(text); }
        catch (e) { return { ok: false, error: 'bad_response' }; }
        return data;
      });
    }).catch(function (err) {
      if (err && err.name === 'AbortError') return { ok: false, error: 'timeout' };
      return { ok: false, error: 'network_error' };
    }).then(function (r) { if (timer) clearTimeout(timer); return r; });
  }

  window.WED = { call: call, newKey: newKey };
})();
