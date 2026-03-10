import { OAUTH_PROVIDERS, type OAuthProvider } from '../constants';
import type { OAuthTokens } from '../data/data-types';
import type { TokenExchangeConfig } from '../types/auth-types';
import { type Result, success, failure } from './resultUtils';

const OAUTH_STATE_KEY = 'oauth_state';
const OAUTH_CODE_VERIFIER_KEY = 'oauth_code_verifier';

type AuthRequestParams = {
  provider: OAuthProvider;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  // Caller-generated CSRF token — must be stored externally for verification at the callback step
  state: string;
};

type AuthCallbackParams = {
  code: string;
  state: string;
};

export function buildAuthorizationUrl({
  provider,
  clientId,
  redirectUri,
  codeChallenge,
  state
}: AuthRequestParams): string {
  const { authorizationEndpoint, scope } = OAUTH_PROVIDERS[provider];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state
  });

  return `${authorizationEndpoint}?${params.toString()}`;
}

export function storeOAuthState(state: string, storage: Storage = sessionStorage): void {
  storage.setItem(OAUTH_STATE_KEY, state);
}

export function getStoredOAuthState(storage: Storage = sessionStorage): string | null {
  return storage.getItem(OAUTH_STATE_KEY);
}

export function clearOAuthState(storage: Storage = sessionStorage): void {
  storage.removeItem(OAUTH_STATE_KEY);
}

export function storeCodeVerifier(verifier: string, storage: Storage = sessionStorage): void {
  storage.setItem(OAUTH_CODE_VERIFIER_KEY, verifier);
}

export function getStoredCodeVerifier(storage: Storage = sessionStorage): string | null {
  return storage.getItem(OAUTH_CODE_VERIFIER_KEY);
}

export function clearCodeVerifier(storage: Storage = sessionStorage): void {
  storage.removeItem(OAUTH_CODE_VERIFIER_KEY);
}

export function parseAuthCallback(params: URLSearchParams): Result<AuthCallbackParams> {
  const error = params.get('error');

  if (error) {
    return failure(error);
  }

  const code = params.get('code');
  const state = params.get('state');

  if (!code || !state) {
    return failure('Invalid callback: missing code or state');
  }

  return success({ code, state });
}

export async function exchangeCodeForTokens({
  provider,
  code,
  codeVerifier,
  clientId,
  redirectUri
}: TokenExchangeConfig): Promise<Result<OAuthTokens>> {
  const { tokenEndpoint } = OAUTH_PROVIDERS[provider];

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    code_verifier: codeVerifier,
    client_id: clientId,
    redirect_uri: redirectUri
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error_description ?? errorData?.error ?? `Token exchange failed (${response.status})`;
      return failure(message);
    }

    const data = await response.json();
    const { access_token, refresh_token, expires_in } = data;

    if (!access_token || !refresh_token || !expires_in) {
      return failure('Invalid token response: missing required fields');
    }

    return success({
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: Date.now() + expires_in * 1000
    });
  } catch (err) {
    console.error('Network error during token exchange:', err);
    return failure(`Network error during token exchange: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
