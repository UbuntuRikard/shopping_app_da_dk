const CACHE_NAME = 'shopping-app-cache-v1.0.1';

const urlsToCache = [
  '/shopping_app_da_dk/',
  '/shopping_app_da_dk/index.html',
  '/shopping_app_da_dk/about.html',
  '/shopping_app_da_dk/helpadm.html',
  '/shopping_app_da_dk/helpind.html',
  '/shopping_app_da_dk/kategorier.html',
  '/shopping_app_da_dk/manifest.json',
  '/shopping_app_da_dk/shopping_trolly_192x192.png',
  '/shopping_app_da_dk/shopping_trolly_512x512.png',
  '/shopping_app_da_dk/offline.html'
];

console.log('[SW] Service Worker loaded');

// Installer service worker
self.addEventListener('install', event => {
  console.log('[SW] Install event');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivér og ryd gammel cache
self.addEventListener('activate', event => {
  console.log('[SW] Activate event');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log(`[SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Intercept fetch og vis cache eller fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  console.log(`[SW] Fetch intercepted: ${event.request.url}`);

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
      if (cachedResponse) {
        console.log('[SW] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        console.log('[SW] Fetched from network:', event.request.url);
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        console.warn('[SW] Fetch failed; serving offline fallback');
        return caches.match('/offline.html') || caches.match('/index.html');
      });
    })
  );
});
