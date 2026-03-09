import { OAUTH_PROVIDERS, type OAuthProvider } from '../constants';
import { type Result, success, failure } from './resultUtils';

const OAUTH_STATE_KEY = 'oauth_state';

type AuthRequestParams = {
  provider: OAuthProvider;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  // Caller-generated CSRF token — must be stored externally for verification at the callback step
  state: string;
};

export function buildAuthorizationUrl({
  provider,
  clientId,
  redirectUri,
  codeChallenge,
  state,
}: AuthRequestParams): string {
  const { authorizationEndpoint, scope } = OAUTH_PROVIDERS[provider];

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
  });

  return `${authorizationEndpoint}?${params.toString()}`;
}

export function storeOAuthState(state: string): void {
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
}

export function getStoredOAuthState(): string | null {
  return sessionStorage.getItem(OAUTH_STATE_KEY);
}

export function clearOAuthState(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY);
}

type AuthCallbackParams = {
  code: string;
  state: string;
};

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
