var staticCacheName = 'restaurants-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/about.html',
        '/css/styles.css',
        '/data/restaurants.json',
        '/js/main.js',
        '/js/dbhelper.js',
        '/js/restaurant_info.js',
        '/js/sidebar.js',
        '/img/'
      ]);
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
