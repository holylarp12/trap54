import { CONFIG } from './config.js';

export class Renderer {
  constructor() {
    this.renderedChunks = new Map();
    this.renderInterval = null;
    this.meteor = null;
    this.worldRenderer = null;
  }

  start() {
    if (CONFIG.rendering.enabled) {
      // Initialize Meteor rendering API
      if (typeof window !== 'undefined' && window.meteor) {
        this.meteor = window.meteor;
        this.worldRenderer = this.meteor.worldRenderer;
      }

      this.renderInterval = setInterval(() => this.render(), 50);
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
    try {
      const chunkId = `${target.x}_${target.y}_${target.z}`;
      
      if (!this.renderedChunks.has(chunkId)) {
        const chunkData = {
          id: chunkId,
          position: { x: target.x, y: target.y, z: target.z },
          color: CONFIG.rendering.chunkColor,
          opacity: CONFIG.rendering.chunkOpacity,
          scale: CONFIG.rendering.chunkScale,
          type: target.type,
        };

        // Store chunk reference
        this.renderedChunks.set(chunkId, chunkData);

        // Render using Meteor's world renderer
        this.drawChunk(chunkData);

        if (CONFIG.debug) {
          console.log(`[trap54] Rendered ${target.type} at ${target.x}, ${target.y}, ${target.z}`);
        }
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error rendering chunk:', error);
    }
  }

  drawChunk(chunkData) {
    try {
      if (!this.worldRenderer) return;

      const { x, y, z } = chunkData.position;
      const color = chunkData.color;
      const opacity = chunkData.opacity;

      // Draw wireframe box around the chunk
      this.drawBox(x, y, z, x + 16, y + 16, z + 16, color, opacity);

      // Optional: Draw filled cube with transparency
      if (CONFIG.rendering.fillChunks) {
        this.drawFilledBox(x, y, z, x + 16, y + 16, z + 16, color, opacity * 0.3);
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error drawing chunk:', error);
    }
  }

  drawBox(x1, y1, z1, x2, y2, z2, color, opacity) {
    try {
      // Convert hex color to RGB
      const r = ((color >> 16) & 255) / 255;
      const g = ((color >> 8) & 255) / 255;
      const b = (color & 255) / 255;

      // Draw wireframe box (requires matrix stack in Meteor)
      if (this.meteor && this.meteor.renderSystem) {
        const renderSystem = this.meteor.renderSystem;

        // Draw 12 lines for box outline
        const lines = [
          // Bottom face
          [x1, y1, z1, x2, y1, z1],
          [x2, y1, z1, x2, y1, z2],
          [x2, y1, z2, x1, y1, z2],
          [x1, y1, z2, x1, y1, z1],
          // Top face
          [x1, y2, z1, x2, y2, z1],
          [x2, y2, z1, x2, y2, z2],
          [x2, y2, z2, x1, y2, z2],
          [x1, y2, z2, x1, y2, z1],
          // Vertical edges
          [x1, y1, z1, x1, y2, z1],
          [x2, y1, z1, x2, y2, z1],
          [x2, y1, z2, x2, y2, z2],
          [x1, y1, z2, x1, y2, z2],
        ];

        for (const line of lines) {
          this.drawLine(line[0], line[1], line[2], line[3], line[4], line[5], r, g, b, opacity);
        }
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error drawing box:', error);
    }
  }

  drawFilledBox(x1, y1, z1, x2, y2, z2, color, opacity) {
    try {
      const r = ((color >> 16) & 255) / 255;
      const g = ((color >> 8) & 255) / 255;
      const b = (color & 255) / 255;

      if (this.meteor && this.meteor.renderSystem) {
        // Draw filled cube using quads (6 faces)
        const faces = [
          // Bottom (y1)
          [x1, y1, z1, x2, y1, z1, x2, y1, z2, x1, y1, z2],
          // Top (y2)
          [x1, y2, z1, x2, y2, z1, x2, y2, z2, x1, y2, z2],
          // Front (z1)
          [x1, y1, z1, x2, y1, z1, x2, y2, z1, x1, y2, z1],
          // Back (z2)
          [x1, y1, z2, x2, y1, z2, x2, y2, z2, x1, y2, z2],
          // Left (x1)
          [x1, y1, z1, x1, y1, z2, x1, y2, z2, x1, y2, z1],
          // Right (x2)
          [x2, y1, z1, x2, y1, z2, x2, y2, z2, x2, y2, z1],
        ];

        for (const face of faces) {
          this.drawQuad(face, r, g, b, opacity);
        }
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error drawing filled box:', error);
    }
  }

  drawLine(x1, y1, z1, x2, y2, z2, r, g, b, a) {
    try {
      if (this.meteor && this.meteor.renderSystem && this.meteor.renderSystem.drawLine) {
        this.meteor.renderSystem.drawLine(x1, y1, z1, x2, y2, z2, r, g, b, a);
      }
    } catch (error) {
      if (CONFIG.debug && CONFIG.debug.verbose) {
        console.debug('[trap54] Error drawing line:', error);
      }
    }
  }

  drawQuad(vertices, r, g, b, a) {
    try {
      if (this.meteor && this.meteor.renderSystem && this.meteor.renderSystem.drawQuad) {
        this.meteor.renderSystem.drawQuad(vertices[0], vertices[1], vertices[2],
                                          vertices[3], vertices[4], vertices[5],
                                          vertices[6], vertices[7], vertices[8],
                                          vertices[9], vertices[10], vertices[11],
                                          r, g, b, a);
      }
    } catch (error) {
      if (CONFIG.debug && CONFIG.debug.verbose) {
        console.debug('[trap54] Error drawing quad:', error);
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
