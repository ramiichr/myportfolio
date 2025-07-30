const CACHE_NAME = "portfolio-v2";
const STATIC_ASSETS = [
  "/",
  "/about",
  "/projects",
  "/contact",
  "/github",
  "/globals.css",
  "/rami.png",
  "/profile.png",
  "/portfolio.png",
  "/chatapp.png",
  "/exchangeflow.png",
  "/weather.png",
];

const API_CACHE_NAME = "portfolio-api-v1";
const API_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error("Service Worker install failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle API requests with shorter cache
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            // Check if cached response is still fresh
            const cachedTime = new Date(
              response.headers.get("cached-time") || 0
            );
            if (Date.now() - cachedTime.getTime() < API_CACHE_TIME) {
              return response;
            }
          }

          // Fetch fresh data
          return fetch(event.request)
            .then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                // Add timestamp to response
                const headers = new Headers(responseClone.headers);
                headers.set("cached-time", new Date().toISOString());

                const modifiedResponse = new Response(responseClone.body, {
                  status: responseClone.status,
                  statusText: responseClone.statusText,
                  headers: headers,
                });

                cache.put(event.request, modifiedResponse.clone());
                return modifiedResponse;
              }
              return fetchResponse;
            })
            .catch(() => {
              // Return stale cache if network fails
              return response || new Response("Network Error", { status: 500 });
            });
        });
      })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            // Cache successful responses
            if (fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return fetchResponse;
          })
        );
      })
      .catch(() => {
        // Return a fallback for navigation requests when offline
        if (event.request.mode === "navigate") {
          return caches.match("/");
        }
      })
  );
});
