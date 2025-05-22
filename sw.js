const CACHE_NAME = 'shopping-app-cache-v1';  
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

// Installer service worker og cache alt indhold fra starten
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Preloading alle sider offline...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Intercepter netværksforespørgsler og server cache-filer
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, res.clone());
          return res;
        });
      });
    })
  );
});

// Opdater cache ved nye versioner
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Sletter gammel cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
