// Service Worker for caching and performance
const CACHE_NAME = "portfolio-v1";
const STATIC_CACHE_NAME = "portfolio-static-v1";

// Resources to cache immediately
const STATIC_RESOURCES = [
  "/",
  "/manifest.json",
  "/_next/static/css/",
  "/_next/static/chunks/",
];

// Resources to cache on first visit
const DYNAMIC_RESOURCES = ["/api/profile", "/api/projects", "/api/skills"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache strategy for different resource types
  if (request.method === "GET") {
    // Cache static assets with cache-first strategy
    if (url.pathname.startsWith("/_next/static/")) {
      event.respondWith(
        caches.match(request).then((response) => {
          return (
            response ||
            fetch(request).then((response) => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
              return response;
            })
          );
        })
      );
      return;
    }

    // Cache API requests with network-first strategy
    if (url.pathname.startsWith("/api/")) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
      return;
    }

    // Cache images with cache-first strategy
    if (request.destination === "image") {
      event.respondWith(
        caches.match(request).then((response) => {
          return (
            response ||
            fetch(request).then((response) => {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
              return response;
            })
          );
        })
      );
      return;
    }
  }
});
