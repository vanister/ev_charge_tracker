import { describe, it, expect, vi } from 'vitest';
import { generatePkcePair } from '../../src/utilities/pkceUtils';

const BASE64URL_PATTERN = /^[A-Za-z0-9\-_]+$/;

describe('generatePkcePair', () => {
  it('returns a successful result', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
  });

  it('codeVerifier is 43 characters long', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.codeVerifier).toHaveLength(43);
  });

  it('codeVerifier contains only URL-safe base64url characters', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.codeVerifier).toMatch(BASE64URL_PATTERN);
  });

  it('codeChallenge is non-empty and contains only URL-safe base64url characters', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.codeChallenge.length).toBeGreaterThan(0);
    expect(result.data.codeChallenge).toMatch(BASE64URL_PATTERN);
  });

  it('codeChallenge is the SHA-256 base64url hash of codeVerifier', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) return;

    const { codeVerifier, codeChallenge } = result.data;
    const encoded = new TextEncoder().encode(codeVerifier);
    const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    const expected = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    expect(codeChallenge).toBe(expected);
  });

  it('codeChallenge differs from codeVerifier', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.codeChallenge).not.toBe(result.data.codeVerifier);
  });

  it('produces a unique pair on each call', async () => {
    const [first, second] = await Promise.all([generatePkcePair(), generatePkcePair()]);
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (!first.success || !second.success) return;
    expect(first.data.codeVerifier).not.toBe(second.data.codeVerifier);
    expect(first.data.codeChallenge).not.toBe(second.data.codeChallenge);
  });

  it('returns a failure when SubtleCrypto is unavailable', async () => {
    // Simulate a non-secure context where subtle is absent
    const insecureCrypto = {
      getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto),
      subtle: undefined as unknown as SubtleCrypto,
    } as Crypto;

    const result = await generatePkcePair(insecureCrypto);
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error).toMatch(/SubtleCrypto unavailable/);
  });

  it('accepts an injected Crypto implementation', async () => {
    // Verify the DI seam works — a spy-wrapped crypto still produces a valid pair.
    // subtle must be set explicitly; it is non-enumerable on the native Crypto object
    // so spreading does not copy it.
    const spyCrypto: Crypto = {
      getRandomValues: vi.fn(globalThis.crypto.getRandomValues.bind(globalThis.crypto)),
      subtle: globalThis.crypto.subtle,
      randomUUID: globalThis.crypto.randomUUID.bind(globalThis.crypto),
    };

    const result = await generatePkcePair(spyCrypto);
    expect(result.success).toBe(true);
    expect(spyCrypto.getRandomValues).toHaveBeenCalledOnce();
  });
});
