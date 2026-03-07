(function (global) {
    function csrfHeaders() {
        if (typeof global.CSRF_TOKEN === "string" && global.CSRF_TOKEN.length) {
            return { "X-CSRF-Token": global.CSRF_TOKEN };
        }
        return {};
    }

    function extractErrorMessage(payload, fallback = "Request failed") {
        if (!payload || typeof payload !== "object") {
            return fallback;
        }

        if (typeof payload.error === "string" && payload.error.trim().length) {
            return payload.error;
        }

        if (
            payload.error &&
            typeof payload.error === "object" &&
            typeof payload.error.message === "string" &&
            payload.error.message.trim().length
        ) {
            return payload.error.message;
        }

        if (typeof payload.message === "string" && payload.message.trim().length) {
            return payload.message;
        }

        return fallback;
    }

    async function parseJsonResponse(response) {
        const text = await response.text();
        if (!text) {
            return null;
        }
        try {
            return JSON.parse(text);
        } catch (error) {
            throw new Error("Invalid server response");
        }
    }

    async function json(url, options = {}) {
        const response = await fetch(url, options);
        const payload = await parseJsonResponse(response);

        if (!response.ok) {
            const fallback = `Request failed (${response.status})`;
            throw new Error(extractErrorMessage(payload, fallback));
        }

        if (payload && payload.status === "error") {
            throw new Error(extractErrorMessage(payload));
        }

        return payload;
    }

    async function jsonOk(url, options = {}) {
        const payload = await json(url, options);

        if (payload && Object.prototype.hasOwnProperty.call(payload, "status") && payload.status !== "ok") {
            throw new Error(extractErrorMessage(payload));
        }

        return payload;
    }

    global.ApiService = {
        csrfHeaders,
        extractErrorMessage,
        json,
        jsonOk,
    };
})(window);