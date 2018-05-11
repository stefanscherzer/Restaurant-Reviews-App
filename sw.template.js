const version = '0.1.4';
const staticCacheName = `restaurants-${version}`;

self.addEventListener('install', function(event) {
  const timeStamp = Date.now();
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/',
        `/index.html?timestamp=${timeStamp}`,
        `/about.html?timestamp=${timeStamp}`,
        `/restaurant.html?timestamp=${timeStamp}`,
        `/css/styles.min.css?timestamp=${timeStamp}`,
        `/js/index.min.js?timestamp=${timeStamp}`,
        `/js/restaurant.min.js?timestamp=${timeStamp}`,
        `/js/about.min.js?timestamp=${timeStamp}`,
        // injector:images
        // endinjector
      ])
      .then(() => self.skipWaiting());
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
  console.log('WORKER: fetch event in progress.');

  /* We should only cache GET requests, and deal with the rest of method in the
     client-side, by handling failed POST,PUT,PATCH,etc. requests.
  */
  if (event.request.method !== 'GET') {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }

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
