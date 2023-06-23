var CACHE_NAME = "2023-06-23 09:25";
var urlsToCache = [
  "/simple-QR/",
  "/simple-QR/scan/",
  "/simple-QR/scan.js",
  "/simple-QR/generate/",
  "/simple-QR/generate.js",
  "/simple-QR/favicon/favicon.svg",
  "/simple-QR/koder.js",
  "/simple-QR/koder/zbar.js",
  "/simple-QR/koder/zbar.wasm",
  "/simple-QR/koder/browser.js",
  "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
