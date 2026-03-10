(function () {
    const installButton = document.getElementById("installAppBtn");
    let deferredInstallPrompt = null;
    let hasRequestedReload = false;

    function showInstallFallbackGuidance() {
        if (typeof window.showModal === "function") {
            window.showModal(
                "Install TinTinChat",
                "Installation is not directly available in this browser view. Use browser menu → Install App / Add to Home Screen.",
                "info"
            );
            return;
        }
        window.alert("Install from your browser menu: Install App / Add to Home Screen.");
    }

    function revealInstallButton() {
        if (installButton) {
            installButton.hidden = false;
        }
    }

    function hideInstallButton() {
        if (installButton) {
            installButton.hidden = true;
        }
    }

    async function registerServiceWorker() {
        if (!("serviceWorker" in navigator)) {
            return;
        }

        const swVersion = String(window.PWA_SW_VERSION || "1");
        const swUrl = `service-worker.js?v=${encodeURIComponent(swVersion)}`;

        try {
            const registration = await navigator.serviceWorker.register(swUrl, { scope: "./" });

            registration.addEventListener("updatefound", () => {
                const newWorker = registration.installing;
                if (!newWorker) {
                    return;
                }
                newWorker.addEventListener("statechange", () => {
                    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                        if (typeof window.showModal === "function") {
                            window.showModal(
                                "Update Ready",
                                "A new TinTinChat version is available. Refresh to apply latest updates.",
                                "info"
                            );
                        }
                    }
                });
            });

            navigator.serviceWorker.addEventListener("controllerchange", () => {
                if (hasRequestedReload) {
                    return;
                }
                hasRequestedReload = true;
                window.location.reload();
            });
        } catch (error) {
        }
    }

    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        revealInstallButton();
    });

    window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;
        hideInstallButton();
    });

    installButton?.addEventListener("click", async () => {
        if (!deferredInstallPrompt) {
            showInstallFallbackGuidance();
            return;
        }

        deferredInstallPrompt.prompt();
        try {
            await deferredInstallPrompt.userChoice;
        } finally {
            deferredInstallPrompt = null;
            hideInstallButton();
        }
    });

    window.addEventListener("load", () => {
        registerServiceWorker();

        const isStandalone =
            window.matchMedia?.("(display-mode: standalone)")?.matches ||
            window.navigator.standalone === true;
        if (isStandalone) {
            hideInstallButton();
            return;
        }

        if (!deferredInstallPrompt && installButton) {
            installButton.hidden = false;
        }
    });
})();
