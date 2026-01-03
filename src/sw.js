const cacheName = "2026-01-02 00:00";
const urlsToCache = [
  "/simple-QR/scan.js",
  "/simple-QR/generate.js",
  "/simple-QR/favicon/favicon.svg",
  "/simple-QR/zxing-worker.js",
  "https://cdn.jsdelivr.net/npm/zxing-wasm@2.2.4/reader/+esm",
  "https://fastly.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/reader/zxing_reader.wasm",
  "https://fastly.jsdelivr.net/npm/zxing-wasm@2.2.4/dist/writer/zxing_writer.wasm",
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
