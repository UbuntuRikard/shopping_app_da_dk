const CACHE_NAME = 'shopping-app-cache-v1.0.1';

const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/helpadm.html',
  '/helpind.html',
  '/kategorier.html',
  '/manifest.json',
  '/shopping_trolly_192x192.png',
  '/shopping_trolly_512x512.png',
  '/offline.html' // hvis du tilføjer en offline fallback
];

// Installer service worker og cache alle nødvendige filer
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivér og ryd gammel cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Intercept fetch og vis cache eller fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Fallback til offline-side ELLER index.html hvis du ikke har offline.html
        return caches.match('/offline.html') || caches.match('/index.html');
      });
    })
  );
});
