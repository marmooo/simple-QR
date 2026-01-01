const cacheName = "2026-01-01 00:00";
const urlsToCache = [
  "/simple-QR/scan.js",
  "/simple-QR/generate.js",
  "/simple-QR/favicon/favicon.svg",
  "/simple-QR/koder.js",
  "/simple-QR/koder/zbar.js",
  "/simple-QR/koder/zbar.wasm",
  "/simple-QR/koder/browser.js",
  "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.js",
];

async function preCache() {
  const cache = await caches.open(cacheName);
  await Promise.all(
    urlsToCache.map((url) =>
      cache.add(url).catch((err) => console.warn("Failed to cache", url, err))
    ),
  );
  self.skipWaiting();
}

async function handleFetch(event) {
  const cached = await caches.match(event.request);
  return cached || fetch(event.request);
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((name) => name !== cacheName ? caches.delete(name) : null),
  );
  self.clients.claim();
}

self.addEventListener("install", (event) => {
  event.waitUntil(preCache());
});
self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(cleanOldCaches());
});
