const CACHE_NAME = 'my-site-cache-v1'
const urlsToCache = [
  '/',
]

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      }),
  )
})

self.addEventListener('activate', function (event) {

  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    // Check de toutes les clés de cache.
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request.clone()) // Une requête est un flux, à consommation unique, il est donc nécessaire de la cloner pour la réutiliser
      .then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone())) // Clonage de la réponse (idem ci-dessus)
        return response
      })
      .catch(() => caches.match(event.request.clone())),
  )
})
