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
    if (!result.success) {
      return;
    }
    expect(result.data.codeVerifier).toHaveLength(43);
  });

  it('codeVerifier contains only URL-safe base64url characters', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.codeVerifier).toMatch(BASE64URL_PATTERN);
  });

  it('codeChallenge is non-empty and contains only URL-safe base64url characters', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }
    expect(result.data.codeChallenge.length).toBeGreaterThan(0);
    expect(result.data.codeChallenge).toMatch(BASE64URL_PATTERN);
  });

  it('codeChallenge is the SHA-256 base64url hash of codeVerifier', async () => {
    const result = await generatePkcePair();
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

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
    if (!result.success) {
      return;
    }
    expect(result.data.codeChallenge).not.toBe(result.data.codeVerifier);
  });

  it('produces a unique pair on each call', async () => {
    const [first, second] = await Promise.all([generatePkcePair(), generatePkcePair()]);
    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (!first.success || !second.success) {
      return;
    }
    expect(first.data.codeVerifier).not.toBe(second.data.codeVerifier);
    expect(first.data.codeChallenge).not.toBe(second.data.codeChallenge);
  });

  it('returns a failure when SubtleCrypto is unavailable', async () => {
    const insecureCrypto = {
      getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto),
      subtle: undefined as unknown as SubtleCrypto,
    } as Crypto;

    const result = await generatePkcePair(insecureCrypto);
    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }
    expect(result.error).toMatch(/SubtleCrypto unavailable/);
  });

  it('derives codeVerifier and codeChallenge from the injected Crypto bytes', async () => {
    // Fixed bytes let us assert that the utility's output is driven entirely by the
    // injected Crypto, not by an ambient global — that is what makes DI meaningful here.
    const FIXED_BYTES = new Uint8Array(32).fill(0x42);

    const expectedVerifier = btoa(String.fromCharCode(...FIXED_BYTES))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const hashBuffer = await globalThis.crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(expectedVerifier),
    );
    const expectedChallenge = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const mockCrypto = {
      getRandomValues: vi.fn((buffer: Uint8Array) => {
        buffer.set(FIXED_BYTES);
        return buffer;
      }),
      subtle: globalThis.crypto.subtle,
      randomUUID: globalThis.crypto.randomUUID.bind(globalThis.crypto),
    } as unknown as Crypto;

    const result = await generatePkcePair(mockCrypto);
    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(mockCrypto.getRandomValues).toHaveBeenCalledOnce();
    expect(result.data.codeVerifier).toBe(expectedVerifier);
    expect(result.data.codeChallenge).toBe(expectedChallenge);
  });
});
