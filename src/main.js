import { Detector } from './detector.js';
import { Renderer } from './renderer.js';
import { CONFIG } from './config.js';

/**
 * trap54 Meteor Addon
 * Detects players and skeleton spawners, highlighting them with purple chunks
 */

class Trap54Addon {
  constructor() {
    this.detector = new Detector();
    this.renderer = new Renderer();
    this.isRunning = false;
  }

  /**
   * Initialize and start the addon
   */
  start() {
    if (this.isRunning) {
      console.warn('[trap54] Addon is already running');
      return;
    }

    console.log('[trap54] Starting trap54 addon...');
    
    this.detector.start();
    this.renderer.start();
    
    // Main update loop
    this.updateLoop = setInterval(() => {
      const detectedTargets = this.detector.getDetectedTargets();
      this.renderer.render(detectedTargets);
    }, 50);

    this.isRunning = true;
    console.log('[trap54] Addon started successfully');
  }

  /**
   * Stop the addon
   */
  stop() {
    if (!this.isRunning) {
      console.warn('[trap54] Addon is not running');
      return;
    }

    console.log('[trap54] Stopping trap54 addon...');
    
    if (this.updateLoop) {
      clearInterval(this.updateLoop);
    }
    
    this.detector.stop();
    this.renderer.stop();
    
    this.isRunning = false;
    console.log('[trap54] Addon stopped');
  }

  /**
   * Toggle addon on/off
   */
  toggle() {
    if (this.isRunning) {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Get addon status
   */
  getStatus() {
    return {
      running: this.isRunning,
      detectedTargets: this.detector.getDetectedTargets().size,
      renderedChunks: this.renderer.getRenderedChunks().size,
    };
  }
}

// Create and export global instance
export const trap54 = new Trap54Addon();

// Auto-start if configured
if (CONFIG.detection.enabled || CONFIG.rendering.enabled) {
  trap54.start();
}

// Export for use in other modules
export default trap54;
