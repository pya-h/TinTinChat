/**
 * Background Upload Tracker
 * Extracted from chat.js for readability.
 *
 * Manages concurrent file uploads with progress display, cancellation,
 * and a concurrency queue (max MAX_CONCURRENT_UPLOADS active at once).
 *
 * Dependencies (from global scope):
 *   window.ApiService, window.ChatUtils
 */

// ── Background upload tracker with progress + concurrency limit ──
const MAX_CONCURRENT_UPLOADS = 2;
const backgroundUploads = new Map();
let bgUploadIdCounter = 0;
const uploadQueue = []; // { resolve, bgId }
let activeUploadCount = 0;

function createBgUploadIndicator() {
    let container = document.getElementById("bgUploadIndicator");
    if (!container) {
        container = document.createElement("div");
        container.id = "bgUploadIndicator";
        container.className = "bg-upload-indicator";
        container.hidden = true;
        document.body.appendChild(container);
    }
    return container;
}

function formatUploadSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function updateBgUploadIndicator() {
    const container = createBgUploadIndicator();
    if (backgroundUploads.size === 0) {
        container.hidden = true;
        return;
    }
    const entries = [...backgroundUploads.entries()];
    const count = entries.length;
    const queuedCount = entries.filter(([, e]) => e.queued).length;

    // Aggregate progress: average across all uploads (queued ones count as 0%)
    let totalPct = 0;
    let totalLoaded = 0;
    let totalSize = 0;
    let hasByteInfo = false;
    for (const [, entry] of entries) {
        totalPct += entry.progress || 0;
        if (entry.total > 0) {
            totalLoaded += entry.loaded || 0;
            totalSize += entry.total;
            hasByteInfo = true;
        }
    }
    const avgPct = Math.round(totalPct / count);

    // Build label — for multi-item batches show "Photo 2/5"
    let label;
    if (count === 1) {
        const [, e] = entries[0];
        if (e.totalItems > 1) {
            const cur = Math.min(e.currentItem + 1, e.totalItems);
            label = `${e.label} ${cur}/${e.totalItems}`;
        } else {
            label = e.label;
        }
    } else {
        label = count + " files";
    }

    const escapeHtml = window.ChatUtils.escapeHtml;
    const pctText = avgPct > 0 && avgPct < 100 ? ` ${avgPct}%` : "";
    const queueText =
        queuedCount > 0
            ? ` <span class="bg-upload-queued">(${queuedCount} queued)</span>`
            : "";
    const detailText = hasByteInfo
        ? `<span class="bg-upload-detail">${formatUploadSize(totalLoaded)} / ${formatUploadSize(totalSize)}</span>`
        : "";

    // Build cancel buttons — one per active (non-queued) upload
    let cancelHtml = "";
    const cancelableEntries = entries.filter(
        ([, e]) => !e.queued && typeof e.abort === "function",
    );
    if (cancelableEntries.length > 0 || count > 0) {
        const cancelId = cancelableEntries.length
            ? cancelableEntries[0][0]
            : entries[0][0];
        cancelHtml =
            `<button class="bg-upload-cancel" data-cancel-bg-id="${cancelId}" title="Cancel upload">` +
            `<i class="fas fa-times"></i> Cancel</button>`;
    }

    container.innerHTML =
        `<div class="bg-upload-content">` +
        `<div class="bg-upload-header">` +
        `<span class="bg-upload-label">Sending ${escapeHtml(label)}\u2026${pctText}${queueText}</span>` +
        cancelHtml +
        `</div>` +
        detailText +
        `<div class="bg-upload-bar"><div class="bg-upload-bar-fill" style="width:${avgPct}%"></div></div>` +
        `</div>`;
    container.hidden = false;

    const cancelBtn = container.querySelector(".bg-upload-cancel");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const bgId = Number(cancelBtn.getAttribute("data-cancel-bg-id"));
            if (bgId > 0) cancelBackgroundUpload(bgId);
        });
    }
}

function registerBackgroundUpload(label, { totalItems = 1 } = {}) {
    const id = ++bgUploadIdCounter;
    backgroundUploads.set(id, {
        label,
        progress: 0,
        queued: true,
        abort: null,
        totalItems,
        currentItem: 0,
        cancelled: false,
    });
    updateBgUploadIndicator();
    return id;
}

/**
 * Store / replace the abort callback for a background upload so the cancel
 * button can invoke it. If the upload was already cancelled before the abort
 * was set, immediately call the abort to terminate the in-flight XHR.
 */
function setBackgroundUploadAbort(id, abortFn) {
    const entry = backgroundUploads.get(id);
    if (!entry) return;
    entry.abort = abortFn || null;
    if (entry.cancelled && typeof abortFn === "function") {
        abortFn();
    }
}

/**
 * Check if a background upload was cancelled by the user.
 * Single-file senders should call this before starting the XHR.
 */
function isUploadCancelled(id) {
    return backgroundUploads.get(id)?.cancelled === true;
}

/**
 * Returns true if an error was caused by a user-initiated cancel.
 * Used to suppress error modals for deliberate cancellations.
 */
function isUploadCancelError(err) {
    return (
        err &&
        (err.message === "Upload cancelled" ||
            err.message === "Upload was cancelled")
    );
}

/** Update which item is currently being uploaded (for multi-file batches). */
function setBackgroundUploadCurrentItem(id, itemIndex) {
    const entry = backgroundUploads.get(id);
    if (entry) {
        entry.currentItem = itemIndex;
        updateBgUploadIndicator();
    }
}

/**
 * Cancel a background upload. Calls the stored abort callback,
 * which will cause uploadWithProgress to reject with "Upload cancelled".
 */
function cancelBackgroundUpload(id) {
    const entry = backgroundUploads.get(id);
    if (!entry) return;
    if (typeof entry.abort === "function") entry.abort();
    entry.cancelled = true;
    updateBgUploadIndicator();
}

/** Wait until a concurrency slot is available. Call before starting the actual upload. */
function acquireUploadSlot(bgId) {
    const entry = backgroundUploads.get(bgId);
    if (activeUploadCount < MAX_CONCURRENT_UPLOADS) {
        activeUploadCount++;
        if (entry) entry.queued = false;
        updateBgUploadIndicator();
        return Promise.resolve();
    }
    return new Promise((resolve) => {
        uploadQueue.push({ resolve, bgId });
    });
}

function releaseUploadSlot() {
    activeUploadCount = Math.max(0, activeUploadCount - 1);
    while (
        uploadQueue.length > 0 &&
        activeUploadCount < MAX_CONCURRENT_UPLOADS
    ) {
        const next = uploadQueue.shift();
        const entry = backgroundUploads.get(next.bgId);
        // Skip cancelled queued uploads — let the sender detect via
        // isUploadCancelled and run its own cleanup lifecycle.
        if (entry?.cancelled) {
            // Increment so the sender's finally → releaseUploadSlot
            // can decrement it back without desynchronising the count.
            activeUploadCount++;
            if (entry) entry.queued = false;
            updateBgUploadIndicator();
            next.resolve();
            continue;
        }
        activeUploadCount++;
        if (entry) entry.queued = false;
        updateBgUploadIndicator();
        next.resolve();
        break;
    }
}

function updateBackgroundUploadProgress(id, percent, loaded, total) {
    const entry = backgroundUploads.get(id);
    if (entry) {
        entry.progress = Math.min(100, Math.max(0, percent));
        if (loaded !== undefined && total !== undefined) {
            entry.loaded = loaded;
            entry.total = total;
        }
        updateBgUploadIndicator();
    }
}

function completeBackgroundUpload(id) {
    backgroundUploads.delete(id);
    releaseUploadSlot();
    updateBgUploadIndicator();
}

/**
 * Upload FormData via XHR with progress tracking.
 * Returns { promise, abort } so callers can cancel the upload.
 */
function uploadWithProgress(url, formData, headers, onProgress) {
    let xhrRef = null;
    const promise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef = xhr;
        xhr.open("POST", url, true);
        if (headers) {
            for (const [key, value] of Object.entries(headers)) {
                xhr.setRequestHeader(key, value);
            }
        }
        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(
                    Math.round((e.loaded / e.total) * 100),
                    e.loaded,
                    e.total,
                );
            }
        });
        xhr.addEventListener("load", () => {
            let payload = null;
            try {
                payload = xhr.responseText
                    ? JSON.parse(xhr.responseText)
                    : null;
            } catch (_) {
                reject(new Error("Invalid server response"));
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                const msg = window.ApiService.extractErrorMessage(
                    payload,
                    `Request failed (${xhr.status})`,
                );
                reject(new Error(msg));
                return;
            }
            if (payload && payload.status === "error") {
                reject(
                    new Error(window.ApiService.extractErrorMessage(payload)),
                );
                return;
            }
            resolve(payload);
        });
        xhr.addEventListener("error", () => reject(new Error("Network error")));
        xhr.addEventListener("abort", () =>
            reject(new Error("Upload cancelled")),
        );
        xhr.send(formData);
    });
    return {
        promise,
        abort: () => { if (xhrRef) xhrRef.abort(); },
    };
}
