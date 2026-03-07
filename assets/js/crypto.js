const ENCRYPTION_CHARACTER_LIMIT = 190,
    DECRYPTION_CHARACTER_LIMIT = 344;
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

const publicKeyCache = new Map();
let privateKey = null;

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
    return privateKey;
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
    const encoder = new TextEncoder();
    const encoded = encoder.encode(message);
    const encrypted = await window.crypto.subtle.encrypt({ name: "RSA-OAEP" }, recipientPublicKey, encoded);
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function encryptLongMessage(message, recipientPublicKey, isPersian = true) {
    const actualLimit = isPersian ? (ENCRYPTION_CHARACTER_LIMIT / 2) | 0 : ENCRYPTION_CHARACTER_LIMIT; 
    const segments = await Promise.all(
        Array(Math.ceil(message.length / actualLimit))
            .fill(null)
            .map((_, idx) =>
                encryptMessage(
                    message.slice(idx * actualLimit, (idx + 1) * actualLimit),
                    recipientPublicKey
                )
            )
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
