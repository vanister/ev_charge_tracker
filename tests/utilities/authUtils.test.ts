import { describe, it, expect } from 'vitest';
import { buildAuthorizationUrl } from '../../src/utilities/authUtils';
import { OAUTH_PROVIDERS } from '../../src/constants';

const BASE_PARAMS = {
  provider: 'google' as const,
  clientId: 'test-client-id',
  redirectUri: 'https://example.com/callback',
  codeChallenge: 'test-code-challenge',
  state: 'test-csrf-state',
};

function parseResult(url: string): { base: string; params: URLSearchParams } {
  const [base, query] = url.split('?');
  return { base, params: new URLSearchParams(query) };
}

describe('buildAuthorizationUrl', () => {
  it('returns a string', () => {
    const result = buildAuthorizationUrl(BASE_PARAMS);
    expect(typeof result).toBe('string');
  });

  it('uses the correct authorization endpoint for the provider', () => {
    const { base } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(base).toBe(OAUTH_PROVIDERS.google.authorizationEndpoint);
  });

  it('includes client_id', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('client_id')).toBe(BASE_PARAMS.clientId);
  });

  it('includes redirect_uri', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('redirect_uri')).toBe(BASE_PARAMS.redirectUri);
  });

  it('sets response_type to code', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('response_type')).toBe('code');
  });

  it('uses the drive.appdata scope for Google', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('scope')).toBe(OAUTH_PROVIDERS.google.scope);
  });

  it('includes code_challenge', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('code_challenge')).toBe(BASE_PARAMS.codeChallenge);
  });

  it('sets code_challenge_method to S256', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('code_challenge_method')).toBe('S256');
  });

  it('echoes back the caller-supplied state', () => {
    const { params } = parseResult(buildAuthorizationUrl(BASE_PARAMS));
    expect(params.get('state')).toBe(BASE_PARAMS.state);
  });

  it('reflects a different state when a different state is passed', () => {
    const url = buildAuthorizationUrl({ ...BASE_PARAMS, state: 'other-csrf-token' });
    const { params } = parseResult(url);
    expect(params.get('state')).toBe('other-csrf-token');
  });
});
