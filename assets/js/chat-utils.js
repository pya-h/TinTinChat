(function (global) {
    function parseStoredBoolean(value, fallback = true) {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            if (value === "true") {
                return true;
            }
            if (value === "false") {
                return false;
            }
        }
        return fallback;
    }

    function isTextPersian(text) {
        return /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF]/.test(text);
    }

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    function formatMessageTimestamp(timestamp) {
        if (!timestamp) {
            return "-";
        }
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleString("default", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    }

    function formatI18nText(template, values = {}) {
        return String(template || "").replace(/\{(\w+)\}/g, (_, key) => {
            const value = values[key];
            return value == null ? "" : String(value);
        });
    }

    global.ChatUtils = {
        parseStoredBoolean,
        isTextPersian,
        escapeHtml,
        formatMessageTimestamp,
        formatI18nText,
    };
})(window);