/* Static cache name */
var staticCacheName = 'rr-static-v1';

/* Cache static assets on install */ 
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(staticCacheName).then( cache => {
			return cache.addAll([
				'/',
				'/index.html',
				'/restaurant.html',
				'/data/restaurants.json',
				'/js/dbhelper.js',
				'/js/main.js',
				'/js/restaurant_info.js',
				'/css/styles.css',
				'/img/1.jpg',
				'/img/2.jpg',
				'/img/3.jpg',
				'/img/4.jpg',
				'/img/5.jpg',
				'/img/6.jpg',
				'/img/7.jpg',
				'/img/8.jpg',
				'/img/9.jpg',
				'/img/10.jpg'
			]);
		}).catch( err => console.log('caching failed', err))
	);
});

/* On activation, delete any deprecated caches */
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then( cacheNames => {
			return Promise.all(
				cacheNames.filter( cacheName => {
					return cacheName.startsWith('rr-') &&
					cacheName != staticCacheName;
				}).map( cacheName => {
					return caches.delete( cacheName );
				})
			);
		})
	);
});

/** If requested asset is cached, serve it; 
 * if not, fetch from network and then cache 
 */
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.open('rr-dynamic').then( cache => {
			return caches.match(event.request).then( response => {
				return response || fetch(event.request).then( response => {
					cache.put(event.request, response.clone());
					return response;
				});
			});
		})
	);
});