import type { OAuthProvider } from '../constants';

export type TokenExchangeConfig = {
  provider: OAuthProvider;
  code: string;
  codeVerifier: string;
  clientId: string;
  redirectUri: string;
};
