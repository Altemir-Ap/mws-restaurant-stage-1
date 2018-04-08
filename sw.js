//Var caches
var cache_restaurant = 'cache-restaurant';
var routesToCache = [
    '/',
    './index.html',
    './restaurant.html',
    './js/dbhelper.js',
    './js/main.js',
    './css/styles.css',
    './js/restaurant_info.js',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
];

//Adding cache
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cache_restaurant)
            .then(function (cache) {
                console.log('Added cache');
                return cache.addAll(routesToCache);
            })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(response => {
            return response || fetch(e.request);
        })
            .catch(err => console.log(err, e.request))
    );
});
