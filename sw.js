// Butterfly Maths — offline cache. Serves the saved copy instantly,
// refreshes it in the background whenever the network is available.
const CACHE = "hk-v1";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "./index.html", "./icon.png"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(cached => {
      const fresh = fetch(e.request).then(r => {
        if (r.ok) {
          const copy = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return r;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
