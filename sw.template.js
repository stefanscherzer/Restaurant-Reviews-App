var staticCacheName = 'restaurants-v4';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/about.html',
        '/restaurant.html',
        '/css/styles.min.css',
        '/data/restaurants.json',
        '/js/index.min.js',
        '/js/restaurant.min.js',
        '/js/about.min.js',
        // injector:images
        // endinjector
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');

  var cacheWhitelist = [staticCacheName];

  event.waitUntil(
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

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open(staticCacheName).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function (error) {
        console.log('response failed with ' + error);
      });
    }
  }));
});
