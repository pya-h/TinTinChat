const SW_VERSION = "ttc-pwa-v1";
const CACHE_APP_SHELL = `${SW_VERSION}-shell`;
const CACHE_STATIC = `${SW_VERSION}-static`;
const CACHE_API = `${SW_VERSION}-api`;

const APP_SHELL_URLS = [
  "./",
  "./index.php",
  "./offline.html",
  "./manifest.webmanifest",
  "./assets/css/style.css",
  "./assets/css/auth.css",
  "./assets/css/dashboard.css",
  "./assets/css/modal.css",
  "./assets/js/ui-enhancements.js",
  "./assets/js/api-service.js",
  "./assets/js/chat-utils.js",
  "./assets/js/chat-notifications.js",
  "./assets/js/crypto.js",
  "./assets/js/chat.js",
  "./assets/js/modal.js",
  "./assets/js/pwa.js",
  "./assets/js/ext/bootstrap.bundle.min.js",
  "./assets/css/ext/bootstrap.min.css",
  "./assets/css/ext/fontawesome.min.css",
  "./assets/pwa/icon-192.svg",
  "./assets/pwa/icon-512.svg"
];

const API_NETWORK_FIRST_ALLOWLIST = [
  "/api/chats/fetch.php",
  "/api/messages/fetch.php",
  "/api/messages/fetch_recent.php",
  "/api/messages/fetch_seen.php",
  "/api/groups/fetch.php",
  "/api/groups/fetch_details.php",
  "/api/typing/fetch.php",
  "/api/messages/stickers/fetch.php"
];

const API_CACHE_DENYLIST_PREFIXES = [
  "/api/messages/media/",
  "/uploads/"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_APP_SHELL).then((cache) => cache.addAll(APP_SHELL_URLS)).catch(() => Promise.resolve())
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("ttc-pwa-") && !key.startsWith(SW_VERSION))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isDeniedApiCache(url) {
  return API_CACHE_DENYLIST_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
}

function isAllowlistedApi(url) {
  return API_NETWORK_FIRST_ALLOWLIST.includes(url.pathname);
}

function withTimeout(fetchPromise, timeoutMs = 4500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return fetchPromise(controller.signal)
    .finally(() => clearTimeout(timeoutId));
}

async function networkFirstApi(request) {
  const cache = await caches.open(CACHE_API);
  try {
    const response = await withTimeout((signal) => fetch(request, { signal }));
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response(
      JSON.stringify({ status: "error", error: "Offline. Please retry when connection returns." }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}

async function cacheFirstStatic(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(CACHE_STATIC);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (!isSameOrigin(url)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(async () => {
          const shell = await caches.match("./index.php");
          return shell || caches.match("./offline.html");
        })
    );
    return;
  }

  if (isApiRequest(url)) {
    if (isDeniedApiCache(url) || !isAllowlistedApi(url)) {
      event.respondWith(fetch(request).catch(() => caches.match(request)));
      return;
    }
    event.respondWith(networkFirstApi(request));
    return;
  }

  event.respondWith(cacheFirstStatic(request));
});
