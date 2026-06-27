import { createRoot } from 'react-dom/client';

// Import polyfills first
import './lib/polyfills.ts';

import { bootstrapNative } from '@/lib/nativeBootstrap';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from './App.tsx';
import './index.css';

// Bootstrap Capacitor native features before React mounts.
// On web this is a no-op.
bootstrapNative();

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
