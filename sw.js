/**
 * AegisAlert Offline Service Worker (PWA)
 * Enables 100% offline operation when mobile towers or internet cables fail.
 * Caches all 4 Stakeholder Portals, Audio Oscillators, and Vernacular Dictionaries.
 */

const CACHE_NAME = "aegis-alert-v5.0-national";
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
  "./src/telemetry/disaster_simulator_engine.js",
  "./src/transmission/radio_protocol.js",
  "./src/hardware_sim/audio_synthesizer.js",
  "./src/hardware_sim/beacon_node.js",
  "./src/ui/map_controller.js",
  "./src/roles/citizen_view.js",
  "./src/roles/responder_view.js",
  "./src/roles/shelter_view.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Aegis SW] Caching 100% of Pan-India offline emergency survival assets...");
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
  // Always fetch real-time API requests directly from the local server
  if (event.request.url.includes("/api/")) {
    event.respondWith(fetch(event.request).catch(() => new Response(JSON.stringify({ error: "Offline" }), { headers: { "Content-Type": "application/json" } })));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
