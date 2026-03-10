import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FullscreenLoader } from '../../components/FullscreenLoader';
import { useOAuth } from '../../hooks/useOAuth';
import {
  parseAuthCallback,
  getStoredOAuthState,
  clearOAuthState,
  getStoredCodeVerifier,
  clearCodeVerifier
} from '../../utilities/authUtils';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { exchangeAndSave } = useOAuth();

  useEffect(() => {
    const run = async () => {
      const result = parseAuthCallback(searchParams);

      if (!result.success) {
        navigate('/error', { replace: true, state: { error: result.error } });
        return;
      }

      const storedState = getStoredOAuthState();

      if (result.data.state !== storedState) {
        navigate('/error', { replace: true, state: { error: 'OAuth state mismatch — possible CSRF attack' } });
        return;
      }

      clearOAuthState();

      const codeVerifier = getStoredCodeVerifier();

      if (!codeVerifier) {
        navigate('/error', { replace: true, state: { error: 'Missing code verifier' } });
        return;
      }

      // Clear immediately after retrieval to prevent replay
      clearCodeVerifier();

      // todo - move clientid to the settings page under sync settings later
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
      const redirectUri = `${location.origin}/auth/callback`;

      const exchangeResult = await exchangeAndSave({
        provider: 'google',
        code: result.data.code,
        codeVerifier,
        clientId,
        redirectUri
      });

      if (!exchangeResult.success) {
        navigate('/error', { replace: true, state: { error: exchangeResult.error } });
        return;
      }

      navigate('/', { replace: true });
    };

    run();
  }, [navigate, searchParams, exchangeAndSave]);

  return <FullscreenLoader description="Connecting..." />;
}
