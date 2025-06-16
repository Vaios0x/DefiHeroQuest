// public/sw.js
// 🚀 Service Worker para YIELD DApp - PWA & Offline Functionality

const CACHE_NAME = 'yield-dapp-v1'
const RUNTIME_CACHE = 'yield-runtime-v1'

// URLs esenciales para cache
const ESSENTIAL_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
]

// Patrones para cache automático
const CACHE_PATTERNS = [
  /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/,
  /\/static\//,
  /\/_next\/static\//,
  /\/fonts\//
]

// URLs que NO debemos cachear
const NO_CACHE_PATTERNS = [
  /\/api\//,
  /\.json$/,
  /hot-update/,
  /sockjs/
]

// 📦 INSTALACIÓN DEL SERVICE WORKER
self.addEventListener('install', (event) => {
  console.log('🚀 YIELD Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching essential files')
        return cache.addAll(ESSENTIAL_URLS.map(url => new Request(url, { cache: 'reload' })))
      })
      .then(() => {
        console.log('✅ YIELD Service Worker installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error)
      })
  )
})

// 🔄 ACTIVACIÓN DEL SERVICE WORKER
self.addEventListener('activate', (event) => {
  console.log('🔄 YIELD Service Worker activating...')
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('🧹 Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      self.clients.claim()
    ]).then(() => {
      console.log('✅ YIELD Service Worker activated successfully')
    })
  )
})

// 🌐 INTERCEPCIÓN DE REQUESTS
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return
  }
  
  if (NO_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return
  }
  
  event.respondWith(handleRequest(request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    if (request.mode === 'navigate' || request.destination === 'document') {
      return await handleNavigationRequest(request)
    }
    
    if (CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      return await handleStaticAssetRequest(request)
    }
    
    return await handleDefaultRequest(request)
    
  } catch (error) {
    console.error('Request handling failed:', error)
    return await handleOfflineFallback(request)
  }
}

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, networkResponse.clone())
      return networkResponse
    }
    
    throw new Error('Network response not ok')
  } catch (error) {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    return new Response(createOfflineHTML(), {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    return new Response('Asset not available offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

async function handleDefaultRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response('Content not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

async function handleOfflineFallback(request) {
  if (request.mode === 'navigate') {
    return new Response(createOfflineHTML(), {
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  return new Response('Offline - Content not available', {
    status: 503,
    statusText: 'Service Unavailable'
  })
}

function createOfflineHTML() {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YIELD - Offline</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      color: white;
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .container {
      max-width: 500px;
      padding: 40px;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(71, 85, 105, 0.3);
      border-radius: 12px;
    }
    h1 { 
      background: linear-gradient(45deg, #06b6d4, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 20px;
    }
    .emoji { font-size: 4rem; margin-bottom: 20px; }
    .status { 
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    button {
      background: #10b981;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 20px;
    }
    button:hover { background: #059669; }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">📱</div>
    <h1>YIELD DApp - Modo Offline</h1>
    <div class="status">
      <p><strong>⚠️ Sin conexión a internet</strong></p>
      <p>La aplicación está funcionando en modo offline usando datos cacheados.</p>
    </div>
    <p>Algunas funciones pueden estar limitadas:</p>
    <ul style="text-align: left; color: #cbd5e1;">
      <li>✅ Visualización de datos guardados</li>
      <li>✅ Configuración local</li>
      <li>✅ Historial de transacciones</li>
      <li>❌ Nuevas transacciones blockchain</li>
      <li>❌ Precios en tiempo real</li>
    </ul>
    <button onclick="window.location.reload()">
      🔄 Reintentar Conexión
    </button>
  </div>
  
  <script>
    window.addEventListener('online', () => {
      setTimeout(() => window.location.reload(), 1000)
    })
    
    if (navigator.onLine) {
      setTimeout(() => window.location.reload(), 2000)
    }
  </script>
</body>
</html>
  `
}

console.log('🚀 YIELD Service Worker script loaded successfully') 