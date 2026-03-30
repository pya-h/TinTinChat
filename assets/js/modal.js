function showModal(title, message, type = "info") {
    const modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;
    const modalContainer = document.getElementById("modalContainer");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    const iconContainer = modalIcon.parentElement;
    iconContainer.className = "modal-icon " + type;
    modalIcon.className = `fas ${getIconClass(type)}`;

    modalOverlay.style.display = "flex";
    setTimeout(() => {
        modalOverlay.classList.add("visible");
        modalContainer.classList.add("visible");
    }, 10);

    modalOverlay.focus();
}

function closeModal() {
    const modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;
    const modalContainer = document.getElementById("modalContainer");

    modalOverlay.classList.remove("visible");
    modalContainer.classList.remove("visible");

    setTimeout(() => {
        if (!modalOverlay.classList.contains("visible")) {
            modalOverlay.style.display = "none";
        }
    }, 500);
}

function getIconClass(type) {
    switch (type) {
        case "error":
            return "fa-exclamation-triangle";
        case "warning":
            return "fa-exclamation-circle";
        case "success":
            return "fa-check-circle";
        case "info":
        default:
            return "fa-info-circle";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const modalOverlay = document.getElementById("modalOverlay");
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e) {
            if (
                e.target === this ||
                e.target.classList.contains("modal-close") ||
                e.target.parentElement.classList.contains("modal-close") ||
                e.target.classList.contains("btn")
            ) {
                closeModal();
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            const modalOverlay = document.getElementById("modalOverlay");
            if (
                modalOverlay &&
                modalOverlay.style.display !== "none" &&
                modalOverlay.classList.contains("visible")
            ) {
                closeModal();
            }
        }
    });
});

function showModalHtml(title, html, type = "info") {
    const modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;
    const modalContainer = document.getElementById("modalContainer");
    const modalTitle = document.getElementById("modalTitle");
    const modalMessage = document.getElementById("modalMessage");
    const modalIcon = document.getElementById("modalIcon");

    modalTitle.textContent = title;
    modalMessage.innerHTML = html;

    const iconContainer = modalIcon.parentElement;
    iconContainer.className = "modal-icon " + type;
    modalIcon.className = `fas ${getIconClass(type)}`;

    modalOverlay.style.display = "flex";
    setTimeout(() => {
        modalOverlay.classList.add("visible");
        modalContainer.classList.add("visible");
    }, 10);

    modalOverlay.focus();
}

window.alert = function (message) {
    showModal("Information", message, "info");
};

/* ── Confirm / Prompt modal ── */

let _confirmResolve = null;

function _openConfirmOverlay() {
    const ov = document.getElementById("confirmModalOverlay");
    if (!ov) return;
    ov.style.display = "flex";
    setTimeout(() => { ov.classList.add("visible"); ov.querySelector(".confirm-modal-container")?.classList.add("visible"); }, 10);
}

function _closeConfirmOverlay(result) {
    const ov = document.getElementById("confirmModalOverlay");
    if (!ov) return;
    ov.classList.remove("visible");
    ov.querySelector(".confirm-modal-container")?.classList.remove("visible");
    setTimeout(() => { if (!ov.classList.contains("visible")) ov.style.display = "none"; }, 350);
    if (_confirmResolve) { const r = _confirmResolve; _confirmResolve = null; r(result); }
}

function showConfirmModal(title, message, { type = "warning", confirmLabel = "Yes", cancelLabel = "Cancel" } = {}) {
    return new Promise((resolve) => {
        if (_confirmResolve) _closeConfirmOverlay(false);
        _confirmResolve = resolve;
        const titleEl = document.getElementById("confirmModalTitle");
        const msgEl = document.getElementById("confirmModalMessage");
        const iconEl = document.getElementById("confirmModalIcon");
        const confirmBtn = document.getElementById("confirmModalConfirmBtn");
        const cancelBtn = document.getElementById("confirmModalCancelBtn");
        const promptWrap = document.getElementById("confirmModalPromptWrap");
        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;
        if (iconEl) { iconEl.parentElement.className = "modal-icon " + type; iconEl.className = "fas " + getIconClass(type); }
        if (confirmBtn) confirmBtn.textContent = confirmLabel;
        if (cancelBtn) cancelBtn.textContent = cancelLabel;
        if (promptWrap) promptWrap.style.display = "none";
        _openConfirmOverlay();
    });
}

function showPromptModal(title, message, { defaultValue = "", maxLength = 500, placeholder = "" } = {}) {
    return new Promise((resolve) => {
        if (_confirmResolve) _closeConfirmOverlay(null);
        _confirmResolve = resolve;
        const titleEl = document.getElementById("confirmModalTitle");
        const msgEl = document.getElementById("confirmModalMessage");
        const iconEl = document.getElementById("confirmModalIcon");
        const promptWrap = document.getElementById("confirmModalPromptWrap");
        const promptInput = document.getElementById("confirmModalPromptInput");
        const charCount = document.getElementById("confirmModalCharCount");
        const charMax = document.getElementById("confirmModalCharMax");
        const confirmBtn = document.getElementById("confirmModalConfirmBtn");
        const cancelBtn = document.getElementById("confirmModalCancelBtn");
        if (titleEl) titleEl.textContent = title;
        if (msgEl) msgEl.textContent = message;
        if (iconEl) { iconEl.parentElement.className = "modal-icon info"; iconEl.className = "fas fa-pen"; }
        if (confirmBtn) confirmBtn.textContent = "Save";
        if (cancelBtn) cancelBtn.textContent = "Cancel";
        if (promptWrap) promptWrap.style.display = "";
        if (promptInput) {
            promptInput.value = defaultValue;
            promptInput.maxLength = maxLength;
            promptInput.placeholder = placeholder;
            setTimeout(() => promptInput.focus(), 60);
        }
        if (charCount) charCount.textContent = String(defaultValue.length);
        if (charMax) charMax.textContent = String(maxLength);
        _openConfirmOverlay();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.getElementById("confirmModalConfirmBtn");
    const cancelBtn = document.getElementById("confirmModalCancelBtn");
    const closeBtn = document.getElementById("confirmModalCloseBtn");
    const overlay = document.getElementById("confirmModalOverlay");
    const promptInput = document.getElementById("confirmModalPromptInput");
    const charCount = document.getElementById("confirmModalCharCount");

    const doConfirm = () => {
        const promptWrap = document.getElementById("confirmModalPromptWrap");
        if (promptWrap && promptWrap.style.display !== "none" && promptInput) {
            const val = promptInput.value.trim();
            _closeConfirmOverlay(val || null);
        } else {
            _closeConfirmOverlay(true);
        }
    };
    const doCancel = () => {
        const promptWrap = document.getElementById("confirmModalPromptWrap");
        _closeConfirmOverlay(promptWrap && promptWrap.style.display !== "none" ? null : false);
    };

    confirmBtn?.addEventListener("click", doConfirm);
    cancelBtn?.addEventListener("click", doCancel);
    closeBtn?.addEventListener("click", doCancel);
    overlay?.addEventListener("click", (e) => { if (e.target === overlay) doCancel(); });
    promptInput?.addEventListener("input", () => {
        if (charCount) charCount.textContent = String(promptInput.value.length);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && overlay && overlay.style.display !== "none" && overlay.classList.contains("visible")) {
            doCancel();
        }
    });
});
