// Production Hard Reload Service Worker
// This service worker aggressively prevents caching

const CACHE_NAME = "no-cache-sw";

// Install event - immediately activate
self.addEventListener("install", (event) => {
  console.log("Hard Reload SW installing");
  self.skipWaiting();
});

// Activate event - take control immediately and clear all caches
self.addEventListener("activate", (event) => {
  console.log("Hard Reload SW activating");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log("Deleting cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - never cache, always fetch fresh
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  console.log("SW intercepting:", event.request.url);

  event.respondWith(
    fetch(event.request.clone(), {
      cache: "no-store",
      headers: {
        ...event.request.headers,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
      .then((response) => {
        // Clone the response and modify headers to prevent caching
        const modifiedResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            ...response.headers,
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            Pragma: "no-cache",
            Expires: "0",
            "Last-Modified": new Date().toUTCString(),
            ETag: Date.now().toString(),
          },
        });

        return modifiedResponse;
      })
      .catch((error) => {
        console.error("SW fetch failed:", error);
        // Return a basic response on network failure
        return new Response("Network Error", {
          status: 500,
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Content-Type": "text/plain",
          },
        });
      })
  );
});

// Message event - handle cache clearing requests
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    console.log("SW clearing all caches");
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});
