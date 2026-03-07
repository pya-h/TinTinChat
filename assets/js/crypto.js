const ENCRYPTION_CHARACTER_LIMIT = 190,
    DECRYPTION_CHARACTER_LIMIT = 344,
    GROUP_MESSAGE_PREFIX = "gcm1";
const textEncoder = new TextEncoder();

function uint8ArrayToBase64(bytes) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
}

function base64ToUint8Array(base64Value) {
    const binary = atob(base64Value);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}
// PEM helper to import public key
async function importRsaPublicKey(pem) {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    let pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s+/g, "");
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    return window.crypto.subtle.importKey("spki", binaryDer.buffer, { name: "RSA-OAEP", hash: "SHA-256" }, true, [
        "encrypt",
    ]);
}

// PEM helper to import private key
async function importRsaPrivateKey(pem) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    let pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s+/g, "");
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    return window.crypto.subtle.importKey("pkcs8", binaryDer.buffer, { name: "RSA-OAEP", hash: "SHA-256" }, true, [
        "decrypt",
    ]);
}

async function importRsaPrivateKeySha1(pem) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    let pemContents = pem.replace(pemHeader, "").replace(pemFooter, "").replace(/\s+/g, "");
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    return window.crypto.subtle.importKey("pkcs8", binaryDer.buffer, { name: "RSA-OAEP", hash: "SHA-1" }, true, [
        "decrypt",
    ]);
}

const publicKeyCache = new Map();
let privateKey = null;
let privateKeySha1 = null;

async function fetchApiJson(url, options = {}) {
    if (window.ApiService?.json) {
        return window.ApiService.json(url, options);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
    }
    return response.json();
}

async function fetchAndImportPrivateKey() {
    const data = await fetchApiJson("api/get_private_key.php");
    if (!data.privateKeyPem) throw new Error("No private key PEM found");
    privateKey = await importRsaPrivateKey(data.privateKeyPem);
    privateKeySha1 = await importRsaPrivateKeySha1(data.privateKeyPem);
    return privateKey;
}

async function ensurePrivateKeyLoaded() {
    if (privateKey) {
        return privateKey;
    }
    return fetchAndImportPrivateKey();
}

async function getPublicKey(username) {
    if (publicKeyCache.has(username)) return publicKeyCache.get(username);

    const data = await fetchApiJson(
        `api/get_public_key.php?username=${encodeURIComponent(username)}`
    );
    if (!data.publicKey) throw new Error("Public key missing");

    const cryptoKey = await importRsaPublicKey(data.publicKey);
    publicKeyCache.set(username, cryptoKey);
    return cryptoKey;
}

async function encryptMessage(message, recipientPublicKey) {
    const encoded = textEncoder.encode(message);
    const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, recipientPublicKey, encoded);
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

function splitTextByUtf8ByteLimit(message, maxBytesPerChunk) {
    const chunks = [];
    let currentChunk = "";
    let currentBytes = 0;

    for (const char of message) {
        const charBytes = textEncoder.encode(char).length;
        if (charBytes > maxBytesPerChunk) {
            throw new Error("Unsupported character size for encryption");
        }

        if (currentBytes + charBytes > maxBytesPerChunk) {
            if (currentChunk.length) {
                chunks.push(currentChunk);
            }
            currentChunk = char;
            currentBytes = charBytes;
            continue;
        }

        currentChunk += char;
        currentBytes += charBytes;
    }

    if (currentChunk.length) {
        chunks.push(currentChunk);
    }

    return chunks;
}

async function encryptLongMessage(message, recipientPublicKey, _isPersian = true) {
    const chunks = splitTextByUtf8ByteLimit(message, ENCRYPTION_CHARACTER_LIMIT);
    const segments = await Promise.all(
        chunks.map((chunk) => encryptMessage(chunk, recipientPublicKey))
    );
    return segments.join("");
}

async function decryptMessage(base64Encrypted) {
    if (!privateKey) throw new Error("Private key not loaded");
    const binary = atob(base64Encrypted);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    const decrypted = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, buffer.buffer);
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

async function decryptServerWrappedMessage(base64Encrypted) {
    if (!privateKeySha1) throw new Error("Private key not loaded");
    const binary = atob(base64Encrypted);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    const decrypted = await window.crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKeySha1, buffer.buffer);
    return new TextDecoder().decode(decrypted);
}

async function decryptLongMessage(message) {
    const segments = await Promise.all(
        Array(Math.ceil(message.length / DECRYPTION_CHARACTER_LIMIT))
            .fill(null)
            .map((_, idx) =>
                decryptMessage(message.slice(idx * DECRYPTION_CHARACTER_LIMIT, (idx + 1) * DECRYPTION_CHARACTER_LIMIT))
            )
    );
    return segments.join("");
}

async function importGroupSymmetricKey(groupKeyBase64) {
    const keyBytes = base64ToUint8Array(groupKeyBase64);
    return window.crypto.subtle.importKey(
        "raw",
        keyBytes,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptGroupMessage(plainText, groupKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plainText);
    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        groupKey,
        encoded
    );
    const cipherBytes = new Uint8Array(encrypted);
    return `${GROUP_MESSAGE_PREFIX}:${uint8ArrayToBase64(iv)}:${uint8ArrayToBase64(cipherBytes)}`;
}

async function decryptGroupMessage(payload, groupKey) {
    if (typeof payload !== "string" || !payload.length) {
        return "";
    }

    if (!payload.startsWith(`${GROUP_MESSAGE_PREFIX}:`)) {
        return payload;
    }

    const parts = payload.split(":");
    if (parts.length !== 3 || parts[0] !== GROUP_MESSAGE_PREFIX) {
        throw new Error("Invalid group message format");
    }

    const iv = base64ToUint8Array(parts[1]);
    const cipherBytes = base64ToUint8Array(parts[2]);
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        groupKey,
        cipherBytes
    );

    return new TextDecoder().decode(decrypted);
}
