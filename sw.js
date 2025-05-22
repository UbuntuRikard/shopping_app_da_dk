const CACHE_NAME = 'shopping-app-cache-v2';  
const urlsToCache = [
  '/index.html',
  '/about.html',
  '/helpadm.html',
  '/helpind.html',
  '/kategorier.html',
  '/manifest.json',
  '/shopping_trolly_192x192.png',
  '/shopping_trolly_512x512.png',
  '/sw.js'
];

// Installer service worker og cache nødvendige filer
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app-filer...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercepter netværksforespørgsler og server cache-filer
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Opdater cache ved nye versioner
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Sletter gammel cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
