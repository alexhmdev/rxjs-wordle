const staticDevDrits = "drits-wordle";
const assets = [
  "/",
  "/index.html",
  "/style.css",
  "/bundle.js",
  "/images/favicon.ico",
  "/images/favicon-32x32.png",
  "/images/favicon-16x16.png",
  "/images/favicon-16x16.png",
  "/images/apple-touch-icon.png",
  "/images/android-chrome-512x512.png",
  "/images/android-chrome-192x192.png",
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticDevDrits).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
