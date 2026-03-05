// CAMBIAMOS A V3 PARA FORZAR LA ACTUALIZACIÓN
const CACHE_NAME = 'fielding-app-v3'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './PROYECTOSMENSUALES.html',
  './manifest.json',
  './icono.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación: Guardar en caché
self.addEventListener('install', event => {
  self.skipWaiting(); // FUERZA a este SW a convertirse en el activo
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activación: Limpiar cachés viejas (v1, v2, etc.)
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Toma control de las pestañas abiertas de inmediato
      caches.keys().then(keys => {
        return Promise.all(
          keys.filter(key => key !== CACHE_NAME)
              .map(key => caches.delete(key))
        );
      })
    ])
  );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
  // No cachear las llamadas a Google Sheets (necesitamos datos frescos siempre)
  if (event.request.url.includes('docs.google.com/spreadsheets')) {
    return; 
  }
  
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
