/**
 * CE.SDK Batch Image Generation Starterkit - React Entry Point
 *
 * Demonstrates batch rendering of personalized images from templates.
 * Uses @cesdk/engine for headless batch rendering and @cesdk/cesdk-js
 * for modal-based template and instance editing.
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type { Configuration } from '@cesdk/cesdk-js';
import { createRoot } from 'react-dom/client';

import App from './app/App';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Application configuration for CE.SDK.
 * Customize license and baseURL for production use.
 */
const config: Configuration = {
  // Unique user identifier for analytics (customize for your app)
  userId: 'starterkit-batch-image-generation-user',

  // Local assets (uncomment and set path for self-hosted assets)
  // baseURL: `/assets/`,

  // License key (required for production)
  // license: 'YOUR_LICENSE_KEY',
};

// ============================================================================
// Initialize React Application
// ============================================================================

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);
root.render(<App config={config} />);
