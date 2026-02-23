// CAMBIAMOS a v2 PARA FORZAR LA ACTUALIZACIÓN EN LOS CELULARES
const CACHE_NAME = 'fielding-app-v2'; 
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './icono.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalar y guardar en caché la interfaz
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activar y limpiar cachés antiguos (Borrará el v1 que tenía error)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

// Interceptar peticiones para cargar rápido
self.addEventListener('fetch', event => {
  if (event.request.url.includes('docs.google.com/spreadsheets')) {
    return; 
  }
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
