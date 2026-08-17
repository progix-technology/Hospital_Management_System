const CACHE_NAME = 'hms-hero-cache-v1';
const PRECACHE_URLS = [
  'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925408/medisphere/about/about-hero-bg.png',
  'https://res.cloudinary.com/dbp97xecb/image/upload/v1785927339/departments_k7dwgb.png',
  'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925415/medisphere/about/doctors/doctors1.png',
  'https://res.cloudinary.com/dbp97xecb/image/upload/v1785925417/medisphere/about/emergency.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches if any
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
      await self.clients.claim();
    })()
  );
});

// Simple cache-first strategy for images
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          // Put a copy in cache
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        }).catch(() => {
          return cached || Response.error();
        });
      })
    );
  }
});
