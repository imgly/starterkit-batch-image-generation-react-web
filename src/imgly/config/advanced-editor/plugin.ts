/**
 * Advanced Editor Plugin - Professional Full-Featured Editing Configuration for CE.SDK
 *
 * This plugin provides a production-ready advanced editor configuration with
 * all professional editing capabilities, complete asset libraries, and comprehensive
 * customization options for power users.
 *
 * @example Basic usage
 * ```typescript
 * import CreativeEditorSDK from '@cesdk/cesdk-js';
 * import { AdvancedEditorConfig } from './plugin';
 *
 * const cesdk = await CreativeEditorSDK.create('#editor', config);
 * await cesdk.addPlugin(new AdvancedEditorConfig());
 * await cesdk.actions.run('scene.create');
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/disable-or-enable-f058e2/
 * @see https://img.ly/docs/cesdk/js/configuration-2c1c3d/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';

import { setupActions } from './actions';
import { setupFeatures } from './features';
import { setupTranslations } from './i18n';
import { setupSettings } from './settings';
import { setupUI } from './ui';

/**
 * Advanced Editor configuration plugin.
 *
 * Provides a complete professional editing experience optimized for power users,
 * with all features enabled, comprehensive asset libraries, and advanced customization.
 *
 * @public
 */
export class AdvancedEditorConfig implements EditorPlugin {
  /**
   * Unique identifier for this plugin.
   * Used to identify the plugin in the CE.SDK plugin registry.
   */
  name = 'cesdk-advanced-editor';

  /**
   * Plugin version - matches the CE.SDK version for compatibility.
   */
  version = CreativeEditorSDK.version;

  /**
   * Initialize the advanced editor configuration.
   *
   * This method is called when the plugin is added to CE.SDK via addPlugin().
   * It sets up all features, UI components, translations, and settings.
   *
   * @param ctx - The editor plugin context containing cesdk and engine instances
   */
  async initialize({ cesdk, engine }: EditorPluginContext) {
    if (cesdk) {
    
      // Reset editor to clear any previous configuration
      // This ensures a clean slate when applying the advanced editor config
      cesdk.resetEditor();
    

    
      // Set advanced view mode for professional editing capabilities
      // This enables all advanced features and UI elements
      cesdk.ui.setView('advanced');
    

    
      // Configure which features are available in the editor
      // See features.ts for all available feature options
      setupFeatures(cesdk);
    

    
      // Configure the UI layout (navigation bar, dock, inspector, canvas, panels)
      // See ui/ folder for all UI configuration options
      setupUI(cesdk);
    

    
      // Configure export, save, and share actions
      // See actions.ts for action configuration
      setupActions(cesdk);
    

    
      // Set custom translations and labels for the UI
      // See i18n.ts for translation configuration
      setupTranslations(cesdk);
    

    
      // Configure engine settings (interactions, colors, snapping, etc.)
      // See settings.ts for all available settings
      setupSettings(engine);
    }
  }
}
