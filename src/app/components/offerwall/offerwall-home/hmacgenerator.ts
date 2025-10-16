export async function hmacSha256UrlSafe(key: string, message: string): Promise<string> {
    const enc = new TextEncoder();
    const keyData = enc.encode(key);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
    const base64 = arrayBufferToBase64(sig);
    return toUrlSafeBase64(base64);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function toUrlSafeBase64(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
