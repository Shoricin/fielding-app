const CACHE_NAME = 'fielding-app-v1';
const ASSETS_TO_CACHE = [
  './INDEX.html',
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

// Activar y limpiar cachés antiguos si haces actualizaciones
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
  // Ignorar las peticiones a Google Sheets para que los datos siempre sean en vivo
  if (event.request.url.includes('docs.google.com/spreadsheets')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});