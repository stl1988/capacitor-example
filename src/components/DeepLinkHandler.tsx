import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';

/**
 * Forwards OS-level deep-link opens into the React Router navigation stack.
 *
 * When the OS launches your app via a URL (a `https://your-domain.com/post/123`
 * universal link or a `myapp://post/123` custom-scheme link), Capacitor fires
 * an `appUrlOpen` event. This component listens for it and calls
 * `navigate(pathname + search + hash)` so the app lands on the intended
 * in-app route instead of staying on whatever page it was on.
 *
 * Must be rendered **inside** a `<BrowserRouter>` (so `useNavigate` works).
 * Safe to render unconditionally — on web it is a no-op.
 */
export function DeepLinkHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cleanup: (() => void) | undefined;

    async function setup() {
      const { App } = await import('@capacitor/app');

      // Handle URLs opened while the app is already running
      const listener = await App.addListener('appUrlOpen', (event) => {
        try {
          const url = new URL(event.url);
          const path = url.pathname + url.search + url.hash;
          if (path) {
            navigate(path);
          }
        } catch {
          // Invalid URL, ignore
        }
      });

      cleanup = () => listener.remove();
    }

    setup();

    return () => {
      cleanup?.();
    };
  }, [navigate]);

  return null;
}
