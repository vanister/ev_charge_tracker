import { useCallback } from 'react';
import { failure, success, type Result } from '../utilities/resultUtils';
import { useDatabase } from './useDatabase';
import type { OAuthTokensRecord, ProviderConfigRecord } from '../data/data-types';
import type { OAuthProvider } from '../types/shared-types';
import { SYSTEM_CONFIG_KEY } from '../data/constants';
import type { TokenExchangeConfig } from '../types/auth-types';
import { exchangeCodeForTokens } from '../utilities/authUtils';

export function useOAuth() {
  const { db } = useDatabase();

  const saveTokens = useCallback(
    async (provider: OAuthProvider, tokens: OAuthTokensRecord): Promise<Result<boolean>> => {
      try {
        await db.systemConfig
          .where('key')
          .equals(SYSTEM_CONFIG_KEY)
          .modify((config) => {
            config.oauthTokens = {
              ...(config.oauthTokens ?? {}),
              [provider]: tokens
            };
          });

        return success(true);
      } catch (error) {
        console.error('Failed to save tokens:', error);
        return failure(error instanceof Error ? error.message : 'Failed to save tokens');
      }
    },
    [db]
  );

  const getTokens = useCallback(
    async (provider: OAuthProvider): Promise<Result<OAuthTokensRecord>> => {
      try {
        const systemConfig = await db.systemConfig.get(SYSTEM_CONFIG_KEY);
        const tokens = systemConfig?.oauthTokens?.[provider];

        if (!tokens) {
          return failure(`No tokens found for provider: ${provider}`);
        }

        return success(tokens);
      } catch (error) {
        console.error('Failed to get tokens:', error);
        return failure(error instanceof Error ? error.message : 'Failed to get tokens');
      }
    },
    [db]
  );

  const getProviderConfig = useCallback(
    async (provider: OAuthProvider): Promise<Result<ProviderConfigRecord>> => {
      try {
        const systemConfig = await db.systemConfig.get(SYSTEM_CONFIG_KEY);
        const config = systemConfig?.oAuthSettings[provider];

        if (!config) {
          return failure(`No configuration found for provider: ${provider}`);
        }

        return success(config);
      } catch (error) {
        console.error('Failed to get provider config:', error);
        return failure(error instanceof Error ? error.message : 'Failed to get provider config');
      }
    },
    [db]
  );

  const exchangeAndSave = useCallback(
    async (tokenConfig: TokenExchangeConfig): Promise<Result<boolean>> => {
      try {
        const result = await exchangeCodeForTokens(tokenConfig);

        if (!result.success) {
          return failure(result.error);
        }

        return saveTokens(tokenConfig.provider, result.data);
      } catch (error) {
        console.error('Failed to exchange token:', error);
        return failure(error instanceof Error ? error.message : 'Failed to exchange token');
      }
    },
    [saveTokens]
  );

  return { getTokens, getProviderConfig, exchangeAndSave };
}
