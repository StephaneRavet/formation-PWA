const CACHE_NAME = 'my-site-cache-v1'
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/js/main.js',
]

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch(error => console.error(error)),
  )
})

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response
        }

        // IMPORTANT: Cloner la requête.
        // Une requete est un flux et est à consommation unique
        // Il est donc nécessaire de copier la requete pour pouvoir l'utiliser et la servir
        var fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(
          function (response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // IMPORTANT: Même constat qu'au dessus, mais pour la mettre en cache
            var responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, responseToCache)
              })

            return response
          },
        )
      }),
  )
})
