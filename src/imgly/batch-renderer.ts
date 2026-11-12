/**
 * Batch Renderer - Headless batch rendering using CE.SDK Engine
 *
 * @example
 * ```typescript
 * const results = await batchRender(sceneString, [
 *   { images: { Photo: '/img/1.jpg' }, variables: { Name: 'Alice' } },
 *   { images: { Photo: '/img/2.jpg' }, variables: { Name: 'Bob' } }
 *
 * results.forEach(r => console.log(URL.createObjectURL(r.blob)));
 * ```
 */

import CreativeEngine from '@cesdk/engine';

// ============================================================================
// Types
// ============================================================================

type CreativeEngineInstance = Awaited<ReturnType<typeof CreativeEngine.init>>;

export type MimeType = 'image/png' | 'image/jpeg' | 'image/webp';

/** Data for a single item in the batch */
export interface BatchItem {
  /** Image replacements: block name -> image URL */
  images?: Record<string, string>;
  /**
   * Variable substitutions: variable name -> value. Each item starts from the
   * values of the template, so a value that every item needs goes into each
   * item. A variable that the caller sets on the engine while no scene exists
   * waits for one scene only, so it reaches the first item alone.
   */
  variables?: Record<string, string>;
}

/** Result for a single rendered item */
export interface BatchResult {
  blob: Blob;
  sceneString: string;
}

/** Options for batch rendering */
export interface BatchRenderOptions {
  /** CE.SDK license key */
  license?: string;
  /** Base URL for CE.SDK assets */
  baseURL?: string;
  /** Output format (default: 'image/png') */
  mimeType?: MimeType;
  /**
   * An engine to render with. When given, `batchRender` reuses it and leaves it
   * open, so a caller rendering several batches pays for one engine instead of
   * one per call. Without it, `batchRender` creates and disposes its own.
   */
  engine?: CreativeEngineInstance;
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Render multiple items from a template scene.
 *
 * Renders the template's **first page** only; further pages are ignored.
 *
 * Creates a fresh engine instance, renders all items, then disposes — unless
 * `options.engine` is given, in which case that engine is reused and left open
 * with the scene of the last item loaded.
 *
 * @param sceneString - The template scene to render
 * @param items - Array of items with images and variables to apply
 * @param options - Configuration options (license, baseURL, mimeType, engine)
 * @returns Array of results with blob and sceneString for each item
 */
export async function batchRender(
  sceneString: string,
  items: BatchItem[],
  options: BatchRenderOptions = {}
): Promise<BatchResult[]> {
  const ownsEngine = options.engine == null;
  const engine =
    options.engine ??
    (await CreativeEngine.init({
      license: options.license,
      baseURL: options.baseURL
    }));
  engine.editor.setSetting('page/title/show', false);

  try {
    const results: BatchResult[] = [];
    const mimeType = options.mimeType ?? 'image/png';

    for (const item of items) {
      // The scene holds the variables, so each load starts the item from the
      // values of the template.
      await engine.scene.load(sceneString);

      // Apply images
      if (item.images) {
        for (const [blockName, imageUrl] of Object.entries(item.images)) {
          const blocks = engine.block.findByName(blockName);
          for (const block of blocks) {
            const fill = engine.block.getFill(block);
            engine.block.setString(fill, 'fill/image/imageFileURI', imageUrl);
          }
        }
      }

      // Apply variables
      if (item.variables) {
        for (const [name, value] of Object.entries(item.variables)) {
          engine.variable.setString(name, value);
        }
      }

      // Render
      const pages = engine.block.findByType('page');
      if (pages.length === 0) throw new Error('No pages found in scene');
      const blob = await engine.block.export(pages[0], { mimeType });
      const savedScene = await engine.scene.saveToString();

      results.push({ blob, sceneString: savedScene });
    }

    return results;
  } finally {
    if (ownsEngine) {
      engine.dispose();
    }
  }
}
