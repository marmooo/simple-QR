var CACHE_NAME="2022-09-11 08:49",urlsToCache=["/simple-QR/","/simple-QR/scan/","/simple-QR/scan.js","/simple-QR/generate/","/simple-QR/generate.js","/simple-QR/favicon/favicon.svg","/simple-QR/jsQR.min.js","/simple-QR/node-qrcode.js","https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css","https://cdn.jsdelivr.net/npm/encoding-japanese@1.0.30/encoding.min.js"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})