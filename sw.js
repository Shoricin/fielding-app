const CACHE_NAME = 'fielding-app-v4'; 

const ASSETS_TO_CACHE = [
  './',
  './INDEX.html',
  './PROYECTOSMENSUALES.html',
  './manifest.json',
  './icono.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME)
              .map(key => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.includes('docs.google.com/spreadsheets')) {
    return; 
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
