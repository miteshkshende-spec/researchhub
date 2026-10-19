
const CACHE_NAME = "researchhub-shell-v1";

const APP_SHELL = [
  "/researchhub/",
  "/researchhub/manifest.json",
  "/researchhub/icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Leave external services, including Supabase, untouched.
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match("/researchhub/")
      )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
