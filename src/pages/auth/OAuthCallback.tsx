import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FullscreenLoader } from '../../components/FullscreenLoader';
import { parseAuthCallback, getStoredOAuthState, clearOAuthState } from '../../utilities/authUtils';

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
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

    // State is valid — clear it to prevent replay, then hand off code to task 4 (token exchange)
    clearOAuthState();
  }, [navigate, searchParams]);

  return <FullscreenLoader description="Connecting..." />;
}
