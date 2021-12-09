var CACHE_NAME = '2021-12-09 11:10';
var urlsToCache = [
  "/simple-QR/",
  "/simple-QR/scan/",
  "/simple-QR/scan.js",
  "/simple-QR/generate/",
  "/simple-QR/generate.js",
  "/simple-QR/favicon/favicon-48x48.png",
  // https://github.com/cozmo/jsQR/tree/8e6a036beafa7053dd44b1b76ac578d22b1b3311
  "/simple-QR/jsQR.min.js",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/encoding-japanese@1.0.30/encoding.min.js",
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
