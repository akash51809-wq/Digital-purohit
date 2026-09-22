const CACHE_NAME = 'veliora-techworks-v1'
const STATIC_CACHE = 'static-v1'
const API_CACHE = 'api-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/favicon.svg',
  '/Favicon.jpg',
  '/manifest.json'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => 
              cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== API_CACHE
            )
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE)
        .then((cache) => {
          return fetch(request)
            .then((response) => {
              // Cache successful GET requests for 5 minutes
              if (request.method === 'GET' && response.ok) {
                const responseClone = response.clone()
                cache.put(request, responseClone)
              }
              return response
            })
            .catch(() => {
              // Return cached version if network fails
              return cache.match(request)
            })
        })
    )
    return
  }

  // Handle static assets
  if (request.destination === 'image' || 
      request.destination === 'script' || 
      request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(request)
            .then((response) => {
              if (response.ok) {
                const responseClone = response.clone()
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone))
              }
              return response
            })
        })
    )
    return
  }

  // Handle page requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request)
      })
  )
})