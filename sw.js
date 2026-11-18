// SERVICE WORKER: guarda los archivos en el celular para usar la app sin internet

// Si cambias algo en la app, sube el número (v1 -> v2) para que se actualice
var VERSION = "tareas-v1";

// Archivos que se guardan en el celular
var ARCHIVOS = ["./", "./index.html", "./manifest.json", "./icono-192.png", "./icono-512.png"];

// 1) Al instalar: guarda los archivos
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSION).then(function (cache) { return cache.addAll(ARCHIVOS); })
  );
  self.skipWaiting();
});

// 2) Al activar: borra versiones viejas
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (nombres) {
      return Promise.all(
        nombres.filter(function (n) { return n !== VERSION; })
               .map(function (n) { return caches.delete(n); })
      );
    })
  );
});

// 3) Al abrir la app: usa lo guardado; si no está, lo pide a internet
self.addEventListener("fetch", function (e) {
  e.respondWith(
    caches.match(e.request).then(function (guardado) { return guardado || fetch(e.request); })
  );
});
