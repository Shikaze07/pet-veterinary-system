// Dummy service worker to handle browser PWA requests and prevent 404 errors in dev logs.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});
