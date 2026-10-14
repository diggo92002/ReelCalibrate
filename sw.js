// 修改網站內容時，請同步更新版本號，讓舊快取自動清除。
const CACHE_PREFIX = 'reel-converter-';
const CACHE_NAME = CACHE_PREFIX + 'v1';
const ROOT = new URL('./', self.location.href);
const PAGE = new URL('./index.html', ROOT).href;
const ASSETS = ['index.html', 'manifest.webmanifest'].map(path => new URL(path, ROOT).href);

self.addEventListener('install', event => {
  // 圖示尚未補上時不影響網站安裝快取。
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== ROOT.origin || !url.pathname.startsWith(ROOT.pathname)) return;
  const allowed = ['index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'].map(path => new URL(path, ROOT).pathname);
  if (url.pathname !== ROOT.pathname && !allowed.includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const page = await cache.match(PAGE);
        if (page) return page;
      }
      return Response.error();
    }
  })());
});
