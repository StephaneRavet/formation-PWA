const CACHE_NAME = 'my-site-cache-v2'
const urlsToCache = [
  '/',
  // '/assets/css/style.css',
  // '/assets/js/main.js',
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

self.addEventListener('activate', function(event) {

  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    // Check de toutes les clés de cache.
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

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

// ---------------

var db;
var request = indexedDB.open("pwaDatabase");
request.onerror = function(event) {
  alert("Pourquoi ne permettez-vous pas à ma web app d'utiliser IndexedDB?!");
};
request.onsuccess = function(event) {
  db = event.target.result;
};

const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
];

request.onupgradeneeded = function(event) {
  var db = event.target.result;

  var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });

  objectStore.transaction.oncomplete = function () {
    var customerObjectStore = db.transaction(['customers'], 'readwrite').objectStore('customers');
    for (var i in customerData) {
      customerObjectStore.add(customerData[i]);
    }

    for (var i in customerData) {
      db.transaction(['customers'], 'readwrite').objectStore('customers').add(customerData[i]);
    }
  }
};


