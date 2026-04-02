/**
 * CE.SDK Batch Image Generation - Initialization Module
 *
 * This module provides the main entry points for initializing CE.SDK editors
 * for template editing (Creator role) and instance editing (Adopter role).
 *
 * @see https://img.ly/docs/cesdk/js/getting-started/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

// Configuration plugins
import { AdvancedEditorConfig } from './config/advanced-editor/plugin';
import { DesignEditorConfig } from './config/design-editor/plugin';

// Batch Rendering
export { batchRender } from './batch-renderer';
export type {
  BatchItem,
  BatchRenderOptions,
  BatchResult,
  MimeType
} from './batch-renderer';

// Plugins
export { AdvancedEditorConfig } from './config/advanced-editor/plugin';
export { DesignEditorConfig } from './config/design-editor/plugin';

// ============================================================================
// Editor Options
// ============================================================================

/**
 * Common options for editor initialization.
 *
 * Note: Scene loading and variable setting should be handled by the application
 * layer after calling the init function. This keeps the imgly module generic
 * and reusable across different use cases.
 */
export interface EditorOptions {
  /** Title displayed in the navigation bar */
  title: string;
  /** Callback when the user saves the scene */
  onSave: (sceneString: string) => void;
  /** Callback when the user closes the editor */
  onClose: () => void;
}

// ============================================================================
// Template Editor Initialization (Creator Role)
// ============================================================================

/**
 * Initialize a CE.SDK instance as a Template Editor (Creator role).
 *
 * This function configures the editor for template creation with full
 * editing capabilities using AdvancedEditorConfig. After calling this function,
 * the application should set any variables and load the scene.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Editor options (title, onSave, onClose)
 *
 * @example
 * ```typescript
 * const cesdk = await CreativeEditorSDK.create('#editor', {});
 * await initTemplateEditor(cesdk, {
 *   title: 'My Template',
 *   onSave: (scene) => saveTemplate(scene),
 *   onClose: () => closeEditor()
 * });
 * // Set placeholder variables
 * cesdk.engine.variable.setString('FirstName', 'Firstname');
 * // Load scene
 * await cesdk.engine.scene.loadFromString(sceneString);
 * ```
 */
export async function initTemplateEditor(
  cesdk: CreativeEditorSDK,
  options: EditorOptions
): Promise<void> {
  // ============================================================================
  // Role and Theme
  // ============================================================================

  cesdk.engine.editor.setRole('Creator');
  cesdk.ui.setTheme('dark');

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new AdvancedEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(new TextComponentAssetSource());
  await cesdk.addPlugin(new VectorShapeAssetSource());
  await cesdk.addPlugin(new StickerAssetSource());
  await cesdk.addPlugin(new EffectsAssetSource());
  await cesdk.addPlugin(new FiltersAssetSource());
  await cesdk.addPlugin(new BlurAssetSource());
  await cesdk.addPlugin(new PagePresetsAssetSource());
  await cesdk.addPlugin(new CropPresetsAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // ============================================================================
  // Navigation Bar
  // ============================================================================

  // Set navigation bar order: close, undo, resize, title, zoom, save
  cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
    {
      id: 'ly.img.close.navigationBar',
      onClick: options.onClose
    },
    'ly.img.undoRedo.navigationBar',
    'ly.img.pageResize.navigationBar',
    'ly.img.spacer',
    'ly.img.title.navigationBar',
    'ly.img.spacer',
    'ly.img.zoom.navigationBar',
    {
      id: 'ly.img.saveScene.navigationBar',
      variant: 'regular',
      color: 'accent'
    }
  ]);

  // Set title
  cesdk.ui.updateOrderComponent(
    {
      in: 'ly.img.navigation.bar',
      match: { id: 'ly.img.title.navigationBar' }
    },
    { payload: { title: options.title } }
  );

  // Register save action
  cesdk.actions.register('saveScene', async () => {
    const scene = await cesdk.engine.scene.saveToString();
    options.onSave(scene);
    options.onClose();
  });
}

// ============================================================================
// Instance Editor Initialization (Adopter Role)
// ============================================================================

/**
 * Initialize a CE.SDK instance as an Instance Editor (Adopter role).
 *
 * This function configures the editor for editing individual instances
 * with limited editing capabilities using DesignEditorConfig. After calling
 * this function, the application should set any variables and load the scene.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 * @param options - Editor options (title, onSave, onClose)
 *
 * @example
 * ```typescript
 * const cesdk = await CreativeEditorSDK.create('#editor', {});
 * await initInstanceEditor(cesdk, {
 *   title: 'John Doe - Business Card',
 *   onSave: (scene) => saveInstance(scene),
 *   onClose: () => closeEditor()
 * });
 * // Set variables from employee data
 * cesdk.engine.variable.setString('FirstName', employee.firstName);
 * // Load scene
 * await cesdk.engine.scene.loadFromString(sceneString);
 * ```
 */
export async function initInstanceEditor(
  cesdk: CreativeEditorSDK,
  options: EditorOptions
): Promise<void> {
  // ============================================================================
  // Role
  // ============================================================================

  cesdk.engine.editor.setRole('Adopter');

  // ============================================================================
  // Configuration Plugin
  // ============================================================================

  await cesdk.addPlugin(new DesignEditorConfig());

  // ============================================================================
  // Asset Source Plugins
  // ============================================================================

  await cesdk.addPlugin(new ColorPaletteAssetSource());
  await cesdk.addPlugin(new TypefaceAssetSource());
  await cesdk.addPlugin(new TextAssetSource());
  await cesdk.addPlugin(
    new UploadAssetSources({
      include: ['ly.img.image.upload']
    })
  );
  await cesdk.addPlugin(
    new DemoAssetSources({
      include: ['ly.img.image.*']
    })
  );

  // ============================================================================
  // Navigation Bar
  // ============================================================================

  // Set navigation bar order: close, undo, title, zoom, actions
  cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
    {
      id: 'ly.img.close.navigationBar',
      onClick: options.onClose
    },
    'ly.img.undoRedo.navigationBar',
    'ly.img.spacer',
    'ly.img.title.navigationBar',
    'ly.img.spacer',
    'ly.img.zoom.navigationBar',
    {
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.saveScene.navigationBar',
        'ly.img.exportImage.navigationBar'
      ]
    }
  ]);

  // Set title
  cesdk.ui.updateOrderComponent(
    {
      in: 'ly.img.navigation.bar',
      match: { id: 'ly.img.title.navigationBar' }
    },
    { payload: { title: options.title } }
  );

  // Register save action
  cesdk.actions.register('saveScene', async () => {
    const scene = await cesdk.engine.scene.saveToString();
    options.onSave(scene);
    options.onClose();
  });
}
