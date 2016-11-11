/**
 * Created by J on 16/09/2016.
 */
// Use a cacheName for cache versioning
var cacheName = 'v1.0.19:static';
var filesToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/js/main.js',
    '/js/picture.js',
    '/bower_components/jquery/dist/jquery.min.js',
    '/bower_components/sweetalert/dist/sweetalert.css',
    '/bower_components/sweetalert/dist/sweetalert.min.js',
    '/bower_components/bootstrap/dist/css/bootstrap.min.css',
    '/bower_components/bootstrap/dist/js/bootstrap.min.js',
    '/images/launcher-icon-48.png'
];

// During the installation phase, you'll usually want to cache static assets.
self.addEventListener('install', function(e) {
    // Once the service worker is installed, go ahead and fetch the resources to make this work offline.
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache).then(function() {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// when the browser fetches a URL…
self.addEventListener('fetch', function(event) {
    // … either respond with the cached object or go ahead and fetch the actual URL
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});