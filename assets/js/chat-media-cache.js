/**
 * Media & File Cache Service (IndexedDB)
 *
 * Handles persistent file download cache and decrypted media cache
 * using IndexedDB. Self-contained with no chat state dependencies.
 *
 * Exposes on window:
 *   - window.MediaCacheService.initFileCache()
 *   - window.MediaCacheService.saveDownloadedFile(messageId, fileName, fileBlob)
 *   - window.MediaCacheService.getDownloadedFile(messageId)
 *   - window.MediaCacheService.isFileDownloaded(messageId)
 *   - window.MediaCacheService.saveMediaToCache(messageId, blob, metadata)
 *   - window.MediaCacheService.getMediaFromCache(messageId)
 *   - window.MediaCacheService.removeMediaFromCache(messageId)
 *   - window.MediaCacheService.removeMultipleMediaFromCache(messageIds)
 *   - window.MediaCacheService.getMediaCacheStats()
 *   - window.MediaCacheService.clearMediaCache()
 *   - window.MediaCacheService.evictStaleCachedMedia()
 *   - window.MediaCacheService.formatFileSize(bytes)
 */
(function (global) {
    "use strict";

    const FILE_CACHE_DB = "TinTinChatFileCache";
    const FILE_CACHE_STORE = "downloadedFiles";
    const MEDIA_CACHE_STORE = "mediaCache";
    const FILE_CACHE_DB_VERSION = 2;
    const MEDIA_CACHE_MAX_ENTRIES = 2000;
    const MEDIA_CACHE_EVICT_BATCH = 200;

    let _fileCacheDb = null;

    async function initFileCache() {
        if (_fileCacheDb) {
            return _fileCacheDb;
        }
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(FILE_CACHE_DB, FILE_CACHE_DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                _fileCacheDb = request.result;
                _fileCacheDb.onclose = () => { _fileCacheDb = null; };
                resolve(_fileCacheDb);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(FILE_CACHE_STORE)) {
                    const store = db.createObjectStore(FILE_CACHE_STORE, {
                        keyPath: "messageId",
                    });
                    store.createIndex("timestamp", "timestamp", { unique: false });
                }
                if (!db.objectStoreNames.contains(MEDIA_CACHE_STORE)) {
                    const mediaStore = db.createObjectStore(MEDIA_CACHE_STORE, {
                        keyPath: "messageId",
                    });
                    mediaStore.createIndex("cachedAt", "cachedAt", { unique: false });
                    mediaStore.createIndex("size", "size", { unique: false });
                }
            };
        });
    }

    async function saveDownloadedFile(messageId, fileName, fileBlob) {
        try {
            const db = await initFileCache();
            const transaction = db.transaction([FILE_CACHE_STORE], "readwrite");
            const objectStore = transaction.objectStore(FILE_CACHE_STORE);

            const fileData = {
                messageId: messageId,
                fileName: fileName,
                fileBlob: fileBlob,
                timestamp: Date.now(),
                size: fileBlob.size,
            };

            return new Promise((resolve, reject) => {
                const request = objectStore.put(fileData);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(fileData);
            });
        } catch (error) {}
        return null;
    }

    async function getDownloadedFile(messageId) {
        try {
            const db = await initFileCache();
            const transaction = db.transaction([FILE_CACHE_STORE], "readonly");
            const objectStore = transaction.objectStore(FILE_CACHE_STORE);

            return new Promise((resolve, reject) => {
                const request = objectStore.get(messageId);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
            });
        } catch (error) {}
        return null;
    }

    async function isFileDownloaded(messageId) {
        const cachedFile = await getDownloadedFile(messageId);
        return Boolean(cachedFile);
    }

    async function saveMediaToCache(messageId, blob, metadata) {
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readwrite");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            const entry = {
                messageId: Number(messageId),
                blob: blob,
                mimeType: String(metadata?.mime_type || "application/octet-stream"),
                fileName: String(metadata?.file_name || ""),
                size: Number(blob?.size || 0),
                cachedAt: Date.now(),
            };

            return new Promise((resolve, reject) => {
                const request = store.put(entry);
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(entry);
            });
        } catch (_) {}
        return null;
    }

    async function getMediaFromCache(messageId) {
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readonly");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            return new Promise((resolve, reject) => {
                const request = store.get(Number(messageId));
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    const result = request.result;
                    if (!result?.blob) {
                        resolve(null);
                        return;
                    }
                    resolve({
                        blob: result.blob,
                        mimeType: result.mimeType,
                        fileName: result.fileName,
                    });
                };
            });
        } catch (_) {}
        return null;
    }

    async function removeMediaFromCache(messageId) {
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readwrite");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            return new Promise((resolve, reject) => {
                const request = store.delete(Number(messageId));
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(true);
            });
        } catch (_) {}
        return false;
    }

    async function removeMultipleMediaFromCache(messageIds) {
        if (!Array.isArray(messageIds) || !messageIds.length) return;
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readwrite");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            for (const id of messageIds) {
                store.delete(Number(id));
            }
            return new Promise((resolve) => {
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            });
        } catch (_) {}
    }

    async function getMediaCacheStats() {
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readonly");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            return new Promise((resolve, reject) => {
                const countReq = store.count();
                let totalSize = 0;
                let count = 0;

                const cursorReq = store.openCursor();
                cursorReq.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        totalSize += Number(cursor.value?.size || 0);
                        count++;
                        cursor.continue();
                    }
                };

                countReq.onerror = () => reject(countReq.error);
                tx.oncomplete = () => resolve({ count, totalSize });
                tx.onerror = () => resolve({ count: 0, totalSize: 0 });
            });
        } catch (_) {}
        return { count: 0, totalSize: 0 };
    }

    async function clearMediaCache() {
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readwrite");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            return new Promise((resolve, reject) => {
                const request = store.clear();
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(true);
            });
        } catch (_) {}
        return false;
    }

    async function evictStaleCachedMedia() {
        try {
            const db = await initFileCache();
            const tx = db.transaction([MEDIA_CACHE_STORE], "readonly");
            const store = tx.objectStore(MEDIA_CACHE_STORE);

            const countReq = store.count();
            const totalCount = await new Promise((resolve, reject) => {
                countReq.onerror = () => reject(countReq.error);
                countReq.onsuccess = () => resolve(countReq.result);
            });

            if (totalCount <= MEDIA_CACHE_MAX_ENTRIES) {
                return 0;
            }

            const toEvict = totalCount - MEDIA_CACHE_MAX_ENTRIES + MEDIA_CACHE_EVICT_BATCH;
            const evictTx = db.transaction([MEDIA_CACHE_STORE], "readwrite");
            const evictStore = evictTx.objectStore(MEDIA_CACHE_STORE);
            const index = evictStore.index("cachedAt");

            let evicted = 0;
            return new Promise((resolve) => {
                const cursorReq = index.openCursor();
                cursorReq.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor && evicted < toEvict) {
                        cursor.delete();
                        evicted++;
                        cursor.continue();
                    }
                };
                evictTx.oncomplete = () => resolve(evicted);
                evictTx.onerror = () => resolve(evicted);
            });
        } catch (_) {}
        return 0;
    }

    function formatFileSize(bytes) {
        if (!bytes) return "";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
        return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    }

    global.MediaCacheService = {
        initFileCache,
        saveDownloadedFile,
        getDownloadedFile,
        isFileDownloaded,
        saveMediaToCache,
        getMediaFromCache,
        removeMediaFromCache,
        removeMultipleMediaFromCache,
        getMediaCacheStats,
        clearMediaCache,
        evictStaleCachedMedia,
        formatFileSize,
    };
})(window);
