import { OAUTH_PROVIDERS, type OAuthProvider } from '../constants';

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
