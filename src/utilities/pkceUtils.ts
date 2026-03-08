import { type Result, success, failure } from './resultUtils';

type PkcePair = {
  codeVerifier: string;
  codeChallenge: string;
};

// Converts a byte array to a base64url string (URL-safe, no padding)
function toBase64Url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// 32 random bytes → 43 base64url chars, satisfying the 43–128 char PKCE spec
function generateCodeVerifier(c: Crypto = globalThis.crypto): string {
  const bytes = new Uint8Array(32);
  c.getRandomValues(bytes);
  return toBase64Url(bytes);
}

async function generateCodeChallenge(
  verifier: string,
  c: Crypto = globalThis.crypto,
): Promise<Result<string>> {
  if (!c.subtle) {
    return failure('SubtleCrypto unavailable — must run in a secure context (HTTPS or localhost)');
  }

  const encoded = new TextEncoder().encode(verifier);
  const hashBuffer = await c.subtle.digest('SHA-256', encoded);
  return success(toBase64Url(new Uint8Array(hashBuffer)));
}

export async function generatePkcePair(c: Crypto = globalThis.crypto): Promise<Result<PkcePair>> {
  const codeVerifier = generateCodeVerifier(c);
  const challengeResult = await generateCodeChallenge(codeVerifier, c);

  if (!challengeResult.success) {
    return challengeResult;
  }

  return success({ codeVerifier, codeChallenge: challengeResult.data });
}
