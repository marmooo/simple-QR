const CACHE_NAME = "2023-08-28 08:50";
const urlsToCache = [
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
