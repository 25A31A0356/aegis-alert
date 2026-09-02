/**
 * AegisAlert Offline Service Worker (PWA)
 * Enables 100% offline operation when mobile towers or internet cables fail.
 */

const CACHE_NAME = "aegis-alert-v2.5";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./src/app.js",
  "./src/config.js",
  "./src/i18n/languages.js",
  "./src/telemetry/official_feeds.js",
  "./src/telemetry/risk_engine.js",
  "./src/transmission/radio_protocol.js",
  "./src/hardware_sim/audio_synthesizer.js",
  "./src/hardware_sim/beacon_node.js",
  "./src/ui/map_controller.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Aegis SW] Caching offline emergency survival assets...");
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn("Asset caching error:", err));
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
            console.log("[Aegis SW] Removing stale cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stale-while-revalidate strategy with offline fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // If offline and request is HTML, return cached index
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
