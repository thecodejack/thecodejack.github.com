// Chrome's currently missing some useful cache methods,
// this polyfill adds them.
importScripts('sw-cache-polyfill.js');

// Here comes the install event!
// This only happens once, when the browser sees this
// version of the ServiceWorker for the first time.
self.addEventListener('install', function(event) {
    // We pass a promise to event.waitUntil to signal how 
    // long install takes, and if it failed
    event.waitUntil(
        // We open a cache…
        caches.open('adi-sw-v7').then(function(cache) {
            // And add resources to it
            return cache.addAll([
                './',
                'js/modernizer.js',
                'css/bootstrap.css',
                'css/hint.css',
                'css/style.css',
                'images/a.png',
                'images/d1.png',
                'logging.js',
                'images/i1.png',
                // Cache resources can be from other origins.
                // This is a no-cors request, meaning it doesn't need
                // CORS headers to be stored in the cache
                new Request('//fonts.googleapis.com/css?family=Days+One', {
                    mode: 'no-cors'
                }),
                new Request('//fonts.googleapis.com/css?family=Merriweather', {
                    mode: 'no-cors'
                }),
                new Request('//maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css', {
                    mode: 'no-cors'
                }),
                new Request('//code.jquery.com/jquery-1.11.0.min.js', {
                    mode: 'no-cors'
                })
            ]);
        })
    );
});

// The fetch event happens for the page request with the
// ServiceWorker's scope, and any request made within that
// page
self.addEventListener('fetch', function(event) {
    // Calling event.respondWith means we're in charge
    // of providing the response. We pass in a promise
    // that resolves with a response object
    event.respondWith(
        // First we look for something in the caches that
        // matches the request
        caches.match(event.request).then(function(response) {
            // If we get something, we return it, otherwise
            // it's null, and we'll pass the request to
            // fetch, which will use the network.
            return response || fetch(event.request);
        })
    );
});
