/**
 * Image Modal / Zoom System
 * Extracted from chat.js for readability.
 *
 * Dependencies (from chat.js global scope):
 *   pushUiBackLayer, removeUiBackLayer, requestUiLayerClose, UI_BACK_LAYER_KEYS
 */

const IMAGE_MODAL_MIN_SCALE = 1;
const IMAGE_MODAL_MAX_SCALE = 4;
const IMAGE_MODAL_SCALE_STEP = 0.25;
let imageModalScale = 1;
let imageModalPinchStartDistance = 0;
let imageModalPinchStartScale = 1;

function getImageModalElements() {
    const imageModalOverlay = document.getElementById("imageModalOverlay");
    const imageModalImage = document.getElementById("imageModalImage");
    const imageModalDownload = document.getElementById("imageModalDownload");
    const imageModalZoomIn = document.getElementById("imageModalZoomIn");
    const imageModalZoomOut = document.getElementById("imageModalZoomOut");
    const imageModalContent =
        imageModalOverlay?.querySelector(".image-modal-content") || null;
    return {
        imageModalOverlay,
        imageModalImage,
        imageModalDownload,
        imageModalZoomIn,
        imageModalZoomOut,
        imageModalContent,
    };
}

function clampImageModalScale(scale) {
    return Math.min(
        IMAGE_MODAL_MAX_SCALE,
        Math.max(IMAGE_MODAL_MIN_SCALE, Number(scale) || IMAGE_MODAL_MIN_SCALE),
    );
}

function applyImageModalScale(
    scale,
    { focalClientX = null, focalClientY = null } = {},
) {
    const { imageModalImage } = getImageModalElements();
    if (!imageModalImage) {
        return;
    }

    if (Number.isFinite(focalClientX) && Number.isFinite(focalClientY)) {
        const rect = imageModalImage.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            const originX = ((focalClientX - rect.left) / rect.width) * 100;
            const originY = ((focalClientY - rect.top) / rect.height) * 100;
            const clampedOriginX = Math.max(0, Math.min(100, originX));
            const clampedOriginY = Math.max(0, Math.min(100, originY));
            imageModalImage.style.transformOrigin = `${clampedOriginX}% ${clampedOriginY}%`;
        }
    } else {
        imageModalImage.style.transformOrigin = "center center";
    }

    imageModalScale = clampImageModalScale(scale);
    imageModalImage.style.transform = `scale(${imageModalScale})`;
}

function resetImageModalScale() {
    applyImageModalScale(1);
}

function getTouchDistance(touchA, touchB) {
    const dx = Number(touchA?.clientX || 0) - Number(touchB?.clientX || 0);
    const dy = Number(touchA?.clientY || 0) - Number(touchB?.clientY || 0);
    return Math.sqrt(dx * dx + dy * dy);
}

function getTouchMidpoint(touchA, touchB) {
    return {
        x: (Number(touchA?.clientX || 0) + Number(touchB?.clientX || 0)) / 2,
        y: (Number(touchA?.clientY || 0) + Number(touchB?.clientY || 0)) / 2,
    };
}

function openImageModal(imageUrl) {
    const { imageModalOverlay, imageModalImage, imageModalDownload } =
        getImageModalElements();

    if (!imageModalOverlay || !imageModalImage || !imageModalDownload) return;

    resetImageModalScale();
    imageModalImage.src = imageUrl;
    imageModalImage.onload = () => {
        resetImageModalScale();
    };
    imageModalDownload.href = imageUrl;
    imageModalDownload.download = `image_${Date.now()}.jpg`;

    imageModalOverlay.style.display = "flex";
    pushUiBackLayer(
        UI_BACK_LAYER_KEYS.imageModal,
        ({ fromHistory = false } = {}) => {
            closeImageModal({ fromHistory });
        },
    );
    setTimeout(() => {
        imageModalOverlay.classList.add("visible");
    }, 10);

    document.body.style.overflow = "hidden";
}

function closeImageModal({ fromHistory = false } = {}) {
    const { imageModalOverlay, imageModalImage } = getImageModalElements();
    if (!imageModalOverlay) return;
    if (
        !fromHistory &&
        requestUiLayerClose(UI_BACK_LAYER_KEYS.imageModal, () => {
            closeImageModal({ fromHistory: true });
        })
    ) {
        return;
    }
    removeUiBackLayer(UI_BACK_LAYER_KEYS.imageModal);

    imageModalOverlay.classList.remove("visible");

    setTimeout(() => {
        if (!imageModalOverlay.classList.contains("visible")) {
            imageModalOverlay.style.display = "none";
            document.body.style.overflow = "";
            imageModalPinchStartDistance = 0;
            imageModalPinchStartScale = 1;
            if (imageModalImage) {
                imageModalImage.onload = null;
            }
            resetImageModalScale();
        }
    }, 300);
}

function downloadImage(event) {
    event.stopPropagation();
}

window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;

/* ── Image modal event bindings (zoom, pinch, wheel, keyboard) ── */
document.addEventListener("DOMContentLoaded", () => {
    const {
        imageModalOverlay,
        imageModalContent,
        imageModalZoomIn,
        imageModalZoomOut,
    } = getImageModalElements();

    if (imageModalZoomIn) {
        imageModalZoomIn.addEventListener("click", function (e) {
            e.stopPropagation();
            applyImageModalScale(imageModalScale + IMAGE_MODAL_SCALE_STEP);
        });
    }

    if (imageModalZoomOut) {
        imageModalZoomOut.addEventListener("click", function (e) {
            e.stopPropagation();
            applyImageModalScale(imageModalScale - IMAGE_MODAL_SCALE_STEP);
        });
    }

    if (imageModalContent) {
        imageModalContent.addEventListener(
            "wheel",
            function (e) {
                e.preventDefault();
                e.stopPropagation();
                const direction = e.deltaY < 0 ? 1 : -1;
                const step = IMAGE_MODAL_SCALE_STEP * (e.ctrlKey ? 0.7 : 1);
                applyImageModalScale(imageModalScale + direction * step, {
                    focalClientX: e.clientX,
                    focalClientY: e.clientY,
                });
            },
            { passive: false },
        );

        imageModalContent.addEventListener(
            "touchstart",
            function (e) {
                if (e.touches.length === 2) {
                    e.preventDefault();
                    e.stopPropagation();
                    imageModalPinchStartDistance = getTouchDistance(
                        e.touches[0],
                        e.touches[1],
                    );
                    imageModalPinchStartScale = imageModalScale;
                }
            },
            { passive: false },
        );

        imageModalContent.addEventListener(
            "touchmove",
            function (e) {
                if (
                    e.touches.length !== 2 ||
                    imageModalPinchStartDistance <= 0
                ) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                const currentDistance = getTouchDistance(
                    e.touches[0],
                    e.touches[1],
                );
                if (currentDistance <= 0) {
                    return;
                }
                const ratio = currentDistance / imageModalPinchStartDistance;
                const midpoint = getTouchMidpoint(e.touches[0], e.touches[1]);
                applyImageModalScale(imageModalPinchStartScale * ratio, {
                    focalClientX: midpoint.x,
                    focalClientY: midpoint.y,
                });
            },
            { passive: false },
        );

        imageModalContent.addEventListener("touchend", function () {
            if (imageModalPinchStartDistance > 0) {
                imageModalPinchStartDistance = 0;
                imageModalPinchStartScale = imageModalScale;
            }
        });

        imageModalContent.addEventListener("touchcancel", function () {
            imageModalPinchStartDistance = 0;
            imageModalPinchStartScale = imageModalScale;
        });
    }

    if (imageModalOverlay) {
        imageModalOverlay.addEventListener("click", function (e) {
            if (e.target === this) {
                closeImageModal();
            }
        });

        const imageModalContent = imageModalOverlay.querySelector(
            ".image-modal-content",
        );
        if (imageModalContent) {
            imageModalContent.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                if (
                    imageModalOverlay.style.display !== "none" &&
                    imageModalOverlay.classList.contains("visible")
                ) {
                    closeImageModal();
                }
            }
        });
    }
});
