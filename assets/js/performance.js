/**
 * Performance Optimization Script
 * Handles lazy loading, image optimization, and performance monitoring
 */

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupVirtualScrolling();
        this.setupDebouncing();
        this.setupPreloading();
        this.monitorPerformance();
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add("loaded");
                            imageObserver.unobserve(img);
                        }
                    }
                });
            },
            {
                rootMargin: "50px",
            }
        );

        document.querySelectorAll("img[data-src]").forEach((img) => {
            imageObserver.observe(img);
        });
    }

    setupImageOptimization() {
        const images = document.querySelectorAll(".message-image");

        images.forEach((img) => {
            const placeholder = document.createElement("div");
            placeholder.className = "image-placeholder loading-skeleton";
            placeholder.style.width = "200px";
            placeholder.style.height = "150px";
            placeholder.style.borderRadius = "12px";

            img.parentNode.insertBefore(placeholder, img);
            img.style.display = "none";

            img.addEventListener("load", () => {
                placeholder.remove();
                img.style.display = "block";
                img.classList.add("image-loaded");
            });

            img.addEventListener("error", () => {
                placeholder.innerHTML =
                    '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;"><i class="fas fa-image"></i> Image unavailable</div>';
                placeholder.classList.remove("loading-skeleton");
                placeholder.style.background = "#f0f0f0";
            });
        });
    }

    setupVirtualScrolling() {
        const chatMessages = document.getElementById("chatMessages");
        if (!chatMessages) return;

        let isVirtualScrollEnabled = false;
        const VIRTUAL_SCROLL_THRESHOLD = 100;

        const checkMessageCount = () => {
            const messageCount = chatMessages.children.length;

            if (
                messageCount > VIRTUAL_SCROLL_THRESHOLD &&
                !isVirtualScrollEnabled
            ) {
                this.enableVirtualScroll(chatMessages);
                isVirtualScrollEnabled = true;
            }
        };

        const observer = new MutationObserver(checkMessageCount);
        observer.observe(chatMessages, { childList: true });
    }

    enableVirtualScroll(container) {
        const messages = Array.from(container.children);
        const VISIBLE_RANGE = 20;
        let startIndex = 0;
        let endIndex = VISIBLE_RANGE;

        const updateVisibleMessages = () => {
            messages.forEach((message, index) => {
                if (index >= startIndex && index <= endIndex) {
                    message.style.display = "block";
                } else {
                    message.style.display = "none";
                }
            });
        };

        container.addEventListener(
            "scroll",
            this.throttle(() => {
                const newScrollTop = container.scrollTop;
                const messageHeight = 80;

                startIndex = Math.floor(newScrollTop / messageHeight);
                endIndex = startIndex + VISIBLE_RANGE;

                updateVisibleMessages();
            }, 16)
        ); // 60fps

        updateVisibleMessages();
    }

    setupDebouncing() {
        const searchInput = document.getElementById("searchUser");
        if (searchInput) {
            const originalHandler = searchInput.onchange;
            searchInput.onchange = null;

            searchInput.addEventListener(
                "input",
                this.debounce((e) => {
                    if (originalHandler) {
                        originalHandler.call(searchInput, e);
                    }
                }, 300)
            );
        }

        const chatInput = document.getElementById("chatInput");
        if (chatInput) {
            let typingTimeout;

            chatInput.addEventListener(
                "input",
                this.debounce(() => {}, 500)
            );
        }
    }

    setupPreloading() {
        const preloadImages = (urls) => {
            urls.forEach((url) => {
                const link = document.createElement("link");
                link.rel = "prefetch";
                link.href = url;
                document.head.appendChild(link);
            });
        };

        const commonAssets = [
            "assets/css/ext/fontawesome.min.css",
            "assets/js/crypto.js",
        ];

        commonAssets.forEach((asset) => {
            const link = document.createElement("link");
            link.rel = "prefetch";
            link.href = asset;
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 0;

        const measureFPS = (currentTime) => {
            frameCount++;

            if (currentTime - lastTime >= 1000) {
                fps = Math.round(
                    (frameCount * 1000) / (currentTime - lastTime)
                );
                frameCount = 0;
                lastTime = currentTime;

                if (fps < 30) {
                    console.warn(`Low FPS detected: ${fps}`);
                }
            }

            requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);

        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576);
                const totalMB = Math.round(
                    memoryInfo.totalJSHeapSize / 1048576
                );

                if (usedMB > 0.5 * tot) {
                    console.warn(
                        `High memory usage: ${usedMB}MB / ${totalMB}MB! cleaning up...`
                    );
                    this.cleanup();
                }
            }, 600000); //10min
        }

        if ("PerformanceObserver" in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`);
                    }
                });
            });

            observer.observe({ entryTypes: ["longtask"] });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    cleanup() {
        if (window.gc) {
            window.gc();
        }
    }
}

const performanceStyles = `
.image-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    color: #666;
    font-size: 0.9rem;
}

.image-loaded {
    animation: imageReveal 0.3s ease;
}

@keyframes imageReveal {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* GPU acceleration for smooth animations */
.message,
.chat-list li,
.form-control,
.btn {
    will-change: transform;
    transform: translateZ(0);
}

/* Optimize repaints */
.chat-messages {
    contain: layout style paint;
}

.sidebar {
    contain: layout style;
}

/* Reduce layout thrashing */
.chat-input {
    contain: layout;
}

@media (prefers-reduced-motion: reduce) {
    .image-loaded {
        animation: none;
    }
}
`;

const performanceStyleSheet = document.createElement("style");
performanceStyleSheet.textContent = performanceStyles;
document.head.appendChild(performanceStyleSheet);

document.addEventListener("DOMContentLoaded", () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

window.addEventListener("beforeunload", () => {
    if (window.performanceOptimizer) {
        window.performanceOptimizer.cleanup();
    }
});
