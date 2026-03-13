import type { OAuthProvider } from './shared-types';

export type TokenExchangeConfig = {
  provider: OAuthProvider;
  code: string;
  codeVerifier: string;
  clientId: string;
  redirectUri: string;
};
