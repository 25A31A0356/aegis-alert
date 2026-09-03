/**
 * AEGIS ALERT Offline Service Worker (PWA)
 * Network-First Strategy: Always serves fresh files from server when online
 */

const CACHE_NAME = "aegis-alert-v6.0-live";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./src/app.js",
  "./src/i18n/languages.js",
  "./src/data/locations_data.js",
  "./src/telemetry/risk_fusion_engine.js",
  "./src/ai/aegis_assistant.js",
  "./src/ui/charts_controller.js",
  "./src/ui/map_controller.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Aegis SW] Caching fresh offline emergency assets...");
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn("Caching error:", err));
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Aegis SW] Purging old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Network-First with Cache Fallback for instant updates
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(JSON.stringify({ error: "Offline" }), { headers: { "Content-Type": "application/json" } }))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
