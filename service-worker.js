self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    // Jika gagal parse JSON (misal: string biasa), fallback ke text
    data = {
      title: 'Notifikasi',
      body: event.data ? event.data.text() : 'Ada pesan baru!'
    };
  }
  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.body || 'Ada notifikasi baru untuk Anda!',
    icon: 'img/icons/icon-192x192.png',
    badge: 'img/icons/badge-72x72.png'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

const CACHE_NAME = 'story-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
  );
});
