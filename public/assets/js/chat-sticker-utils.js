/**
 * Sticker Image Processing Utilities
 *
 * Pure utility functions for sticker upload processing:
 * image loading, canvas manipulation, background removal, optimization.
 *
 * Dependencies (expected globals):
 *   - STICKER_UPLOAD_MAX_BYTES  (chat.js constant)
 *
 * Exposes on window:
 *   - window.StickerUtils.loadImageElementFromFile(file)
 *   - window.StickerUtils.canvasToBlob(canvas, type, quality)
 *   - window.StickerUtils.drawStickerImageOnCanvas(ctx, image, canvasSize)
 *   - window.StickerUtils.removeEdgeBlackWhiteBackground(ctx, canvasSize, drawRegion)
 *   - window.StickerUtils.normalizeStickerUploadFile(file, onProgress, options)
 *   - window.StickerUtils.buildStickerChoicePreviewDataUrl(file, removeBackground)
 */
(function (global) {
    "use strict";

    function loadImageElementFromFile(file) {
        return new Promise((resolve, reject) => {
            const imageUrl = URL.createObjectURL(file);
            const image = new Image();
            image.onload = () => {
                URL.revokeObjectURL(imageUrl);
                resolve(image);
            };
            image.onerror = () => {
                URL.revokeObjectURL(imageUrl);
                reject(new Error("Unable to read image file."));
            };
            image.src = imageUrl;
        });
    }

    function canvasToBlob(canvas, type, quality) {
        return new Promise((resolve, reject) => {
            if (!canvas || typeof canvas.toBlob !== "function") {
                reject(new Error("Canvas export is not supported in this browser."));
                return;
            }

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Unable to build sticker image."));
                        return;
                    }
                    resolve(blob);
                },
                type,
                quality
            );
        });
    }

    function drawStickerImageOnCanvas(ctx, image, canvasSize) {
        const sourceWidth = Number(image.naturalWidth || image.width || 0);
        const sourceHeight = Number(image.naturalHeight || image.height || 0);
        if (sourceWidth <= 0 || sourceHeight <= 0) {
            throw new Error("Invalid image dimensions.");
        }

        const scale = Math.min(canvasSize / sourceWidth, canvasSize / sourceHeight);
        const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
        const targetHeight = Math.max(1, Math.round(sourceHeight * scale));
        const offsetX = Math.floor((canvasSize - targetWidth) / 2);
        const offsetY = Math.floor((canvasSize - targetHeight) / 2);

        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.drawImage(image, 0, 0, sourceWidth, sourceHeight, offsetX, offsetY, targetWidth, targetHeight);

        return {
            offsetX,
            offsetY,
            targetWidth,
            targetHeight,
        };
    }

    function removeEdgeBlackWhiteBackground(ctx, canvasSize, drawRegion) {
        if (!ctx || !drawRegion) {
            return;
        }

        const width = Number(canvasSize) || 0;
        const height = Number(canvasSize) || 0;
        if (width <= 0 || height <= 0) {
            return;
        }

        const startX = Math.max(0, Math.floor(Number(drawRegion.x) || 0));
        const startY = Math.max(0, Math.floor(Number(drawRegion.y) || 0));
        const endX = Math.min(width - 1, startX + Math.max(0, Math.floor(Number(drawRegion.width) || 0)) - 1);
        const endY = Math.min(height - 1, startY + Math.max(0, Math.floor(Number(drawRegion.height) || 0)) - 1);

        if (endX < startX || endY < startY) {
            return;
        }

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        const visited = new Uint8Array(width * height);
        const removed = new Uint8Array(width * height);
        const queue = [];

        const isCandidate = (pixelIndex) => {
            const alpha = pixels[pixelIndex + 3];
            if (alpha < 16) {
                return false;
            }

            const red = pixels[pixelIndex];
            const green = pixels[pixelIndex + 1];
            const blue = pixels[pixelIndex + 2];
            const maxValue = Math.max(red, green, blue);
            const minValue = Math.min(red, green, blue);
            const average = (red + green + blue) / 3;
            const spread = maxValue - minValue;

            const nearWhite = minValue >= 240 || (average >= 232 && spread <= 28);
            const nearBlack = maxValue <= 22 || (average <= 24 && spread <= 28);
            return nearWhite || nearBlack;
        };

        const enqueue = (x, y) => {
            if (x < startX || x > endX || y < startY || y > endY) {
                return;
            }
            const flatIndex = y * width + x;
            if (visited[flatIndex]) {
                return;
            }
            visited[flatIndex] = 1;

            const pixelIndex = flatIndex * 4;
            if (!isCandidate(pixelIndex)) {
                return;
            }

            queue.push(flatIndex);
        };

        for (let x = startX; x <= endX; x++) {
            enqueue(x, startY);
            enqueue(x, endY);
        }
        for (let y = startY; y <= endY; y++) {
            enqueue(startX, y);
            enqueue(endX, y);
        }

        let head = 0;
        while (head < queue.length) {
            const current = queue[head++];
            const pixelIndex = current * 4;
            pixels[pixelIndex + 3] = 0;
            removed[current] = 1;

            const x = current % width;
            const y = Math.floor(current / width);
            enqueue(x - 1, y);
            enqueue(x + 1, y);
            enqueue(x, y - 1);
            enqueue(x, y + 1);
        }

        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const flatIndex = y * width + x;
                if (removed[flatIndex]) {
                    continue;
                }

                const pixelIndex = flatIndex * 4;
                const alpha = pixels[pixelIndex + 3];
                if (alpha < 20) {
                    continue;
                }

                const red = pixels[pixelIndex];
                const green = pixels[pixelIndex + 1];
                const blue = pixels[pixelIndex + 2];
                const maxValue = Math.max(red, green, blue);
                const minValue = Math.min(red, green, blue);
                const average = (red + green + blue) / 3;
                const spread = maxValue - minValue;
                const edgeCandidate =
                    minValue >= 228 ||
                    maxValue <= 34 ||
                    ((average >= 220 || average <= 36) && spread <= 36);

                if (!edgeCandidate) {
                    continue;
                }

                const left = x > startX ? flatIndex - 1 : -1;
                const right = x < endX ? flatIndex + 1 : -1;
                const up = y > startY ? flatIndex - width : -1;
                const down = y < endY ? flatIndex + width : -1;
                const touchesRemoved =
                    (left >= 0 && removed[left]) ||
                    (right >= 0 && removed[right]) ||
                    (up >= 0 && removed[up]) ||
                    (down >= 0 && removed[down]);

                if (touchesRemoved) {
                    pixels[pixelIndex + 3] = Math.round(alpha * 0.35);
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    async function buildStickerChoicePreviewDataUrl(file, removeBackground) {
        const previewSize = 256;
        const image = await loadImageElementFromFile(file);
        const canvas = document.createElement("canvas");
        canvas.width = previewSize;
        canvas.height = previewSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Canvas is not available in this browser.");
        }

        const drawn = drawStickerImageOnCanvas(ctx, image, previewSize);
        if (removeBackground) {
            removeEdgeBlackWhiteBackground(ctx, previewSize, {
                x: drawn.offsetX,
                y: drawn.offsetY,
                width: drawn.targetWidth,
                height: drawn.targetHeight,
            });
        }

        return canvas.toDataURL("image/webp", 0.84);
    }

    async function normalizeStickerUploadFile(file, onProgress, options) {
        if (onProgress === undefined) onProgress = null;
        if (options === undefined) options = {};
        const stickerCanvasSize = Number(global.STICKER_CANVAS_SIZE || global.APP_CONSTANTS?.stickerCanvasSize || 512);
        const stickerMaxBytes = Number(global.STICKER_UPLOAD_MAX_BYTES || global.APP_CONSTANTS?.uploadStickerMaxBytes || 512 * 1024);

        const reportProgress = (percent, step) => {
            if (typeof onProgress === "function") {
                onProgress(percent, step);
            }
        };
        const shouldRemoveBackground = options?.removeBackground !== false;

        if (typeof document === "undefined") {
            reportProgress(100, "Prepared");
            return file;
        }

        reportProgress(10, "Loading image");
        const image = await loadImageElementFromFile(file);

        const canvas = document.createElement("canvas");
        canvas.width = stickerCanvasSize;
        canvas.height = stickerCanvasSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Canvas is not available in this browser.");
        }

        reportProgress(28, "Drawing canvas");
        const drawn = drawStickerImageOnCanvas(ctx, image, stickerCanvasSize);

        if (shouldRemoveBackground) {
            reportProgress(38, "Cleaning background");
            removeEdgeBlackWhiteBackground(ctx, stickerCanvasSize, {
                x: drawn.offsetX,
                y: drawn.offsetY,
                width: drawn.targetWidth,
                height: drawn.targetHeight,
            });
        } else {
            reportProgress(38, "Skipping background clean");
        }

        let bestBlob = null;
        const qualityLevels = [0.86, 0.78, 0.7, 0.62, 0.55];
        const exportFormats = [
            { mime: "image/webp", extension: "webp" },
            { mime: "image/png", extension: "png" },
            { mime: "image/jpeg", extension: "jpg" },
        ];
        let selectedMime = "image/webp";
        let selectedExt = "webp";

        for (let formatIndex = 0; formatIndex < exportFormats.length; formatIndex++) {
            const format = exportFormats[formatIndex];
            for (let index = 0; index < qualityLevels.length; index++) {
                const quality = qualityLevels[index];
                const scanPercent = 45 + ((index + 1) / qualityLevels.length) * 45;
                reportProgress(scanPercent, "Optimizing size");

                let candidate = null;
                try {
                    candidate = await canvasToBlob(canvas, format.mime, quality);
                } catch (error) {
                    continue;
                }

                if (!candidate) {
                    continue;
                }

                if (candidate.size <= stickerMaxBytes) {
                    bestBlob = candidate;
                    selectedMime = format.mime;
                    selectedExt = format.extension;
                    break;
                }

                if (!bestBlob || candidate.size < bestBlob.size) {
                    bestBlob = candidate;
                    selectedMime = format.mime;
                    selectedExt = format.extension;
                }
            }

            if (bestBlob && bestBlob.size <= stickerMaxBytes) {
                break;
            }
        }

        if (!bestBlob) {
            throw new Error("Unable to prepare sticker image.");
        }

        if (bestBlob.size > stickerMaxBytes) {
            throw new Error("Prepared sticker is larger than 512KB. Try a simpler image.");
        }

        reportProgress(100, "Prepared");
        return new File([bestBlob], `sticker_${Date.now()}.${selectedExt}`, {
            type: selectedMime,
        });
    }

    global.StickerUtils = {
        loadImageElementFromFile,
        canvasToBlob,
        drawStickerImageOnCanvas,
        removeEdgeBlackWhiteBackground,
        normalizeStickerUploadFile,
        buildStickerChoicePreviewDataUrl,
    };
})(window);
