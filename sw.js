const CACHE_NAME = "boki-v0.55";
let urlsToCache = [
		"/",
		"/index.html",

		"/css/materialize.min.css",
		"/css/main.css",

		"/fonts/AirbnbCereal-Bold.ttf",
		"/fonts/AirbnbCereal-Book.ttf",
		"/fonts/MaterialIcons-Regular.ttf",

		"/img/icon-192.png",
		"/img/icon-512.png",

		"/js/materialize.min.js",
		"/js/idb.js",
		"/js/functions.js",
		"/js/api.js",
		"/js/main.js",

		"/pages/home.html",
		"/pages/teams.html",
		"/pages/favorite.html",
		"/pages/about.html",

		"/shell/nav.html",
		"/shell/footer.html",

		"manifest.json"
];

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener("fetch", function(event) {
	const BASE_URL = "https://api.football-data.org/v2";

	if (event.request.url.indexOf(BASE_URL) > -1) {
		event.respondWith(
			caches.open(CACHE_NAME).then(function(cache) {
				return cache.match(event.request).then(function (response) {
					return response || fetch(event.request).then(function(response) {
						cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	}	else {
		event.respondWith(
			caches.match(event.request, { ignoreSearch: true }).then(function(response) {
				return response || fetch (event.request);
			})
		)
	}
});

self.addEventListener("activate", function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheName) {
			return Promise.all(
				cacheName.map(function(cacheName) {
					if (cacheName !== CACHE_NAME) {
						console.log(`ServiceWorker: cache ${cacheName} dihapus`);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener('push', function(event) {
	let title = "BOKI - Info Sepak Bola";
	let body;

	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message tanpa payload';
	}

	let options = {
		body: body,
		badge: '/img/icon-192.png',
		icon: '/img/icon-192.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};

	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});