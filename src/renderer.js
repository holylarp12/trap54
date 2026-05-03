import { CONFIG } from './config.js';

export class Renderer {
  constructor() {
    this.renderedChunks = new Map();
    this.renderInterval = null;
  }

  start() {
    if (CONFIG.rendering.enabled) {
      this.renderInterval = setInterval(() => this.render(), 50); // 20 FPS render updates
      if (CONFIG.debug) console.log('[trap54] Renderer started');
    }
  }

  stop() {
    if (this.renderInterval) {
      clearInterval(this.renderInterval);
      this.renderInterval = null;
      this.clearAllChunks();
      if (CONFIG.debug) console.log('[trap54] Renderer stopped');
    }
  }

  render(detectedTargets) {
    // Clear previous chunks
    this.clearAllChunks();

    if (!detectedTargets || detectedTargets.size === 0) {
      return;
    }

    // Render purple chunks for each detected target
    for (const target of detectedTargets) {
      this.renderPurpleChunk(target);
    }
  }

  renderPurpleChunk(target) {
    // TODO: Implement purple chunk rendering
    // This will depend on your Meteor/rendering engine
    // Should create a purple-colored chunk at the target location

    const chunkId = `${target.x}_${target.y}_${target.z}`;
    
    // Store reference to rendered chunk
    if (!this.renderedChunks.has(chunkId)) {
      this.renderedChunks.set(chunkId, {
        id: chunkId,
        position: { x: target.x, y: target.y, z: target.z },
        color: CONFIG.rendering.chunkColor,
        opacity: CONFIG.rendering.chunkOpacity,
      });

      if (CONFIG.debug) {
        console.log(`[trap54] Rendered purple chunk at ${target.x}, ${target.y}, ${target.z}`);
      }
    }
  }

  clearAllChunks() {
    this.renderedChunks.clear();
  }

  getRenderedChunks() {
    return this.renderedChunks;
  }
}
