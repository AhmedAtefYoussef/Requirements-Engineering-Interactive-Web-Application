/* Offline support: precache the app shell and every lecture; fonts are cached as they are fetched. */
var VERSION = 'rdt-v3';
var SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'icon.svg', 'css/app.css',
  'js/core.js', 'js/views.js', 'js/lecture.js', 'js/study.js', 'js/shell.js',
  'js/viz/l1.js', 'js/viz/l2.js', 'js/viz/l3.js', 'js/viz/l4.js', 'js/viz/l5.js',
  'content/l1.js', 'content/l2.js', 'content/l3.js', 'content/l4.js', 'content/l5.js'
];
var FONTS = 'rdt-fonts-v1';

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k !== FONTS; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  // Google Fonts: stale-while-revalidate so type survives going offline.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  // Same origin: cache first, refresh in the background.
  e.respondWith(caches.open(VERSION).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(req).then(function (res) { if (res.ok) c.put(req, res.clone()); return res; });
      if (hit) { net.catch(function () {}); return hit; }
      return net.catch(function () { return req.mode === 'navigate' ? c.match('index.html') : Response.error(); });
    });
  }));
});
