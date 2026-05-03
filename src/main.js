import { Detector } from './detector.js';
import { Renderer } from './renderer.js';
import { CONFIG } from './config.js';

/**
 * trap54 Meteor Addon for 1.21.11
 * Detects players and skeleton spawners, highlighting them with purple chunks
 */

class Trap54Addon {
  constructor() {
    this.detector = new Detector();
    this.renderer = new Renderer();
    this.isRunning = false;
    this.updateLoop = null;
    this.meteor = null;
  }

  /**
   * Initialize the addon with Meteor API
   */
  initialize() {
    if (typeof window !== 'undefined' && window.meteor) {
      this.meteor = window.meteor;
      if (CONFIG.debug) console.log('[trap54] Meteor API initialized');
    }
  }

  /**
   * Start the addon
   */
  start() {
    if (this.isRunning) {
      console.warn('[trap54] Addon is already running');
      return;
    }

    console.log('[trap54] Starting trap54 addon...');
    
    this.detector.start();
    this.renderer.start();
    
    // Main update loop - runs at configurable interval
    this.updateLoop = setInterval(() => {
      try {
        const detectedTargets = this.detector.getDetectedTargets();
        this.renderer.render(detectedTargets);
      } catch (error) {
        console.error('[trap54] Error in main update loop:', error);
      }
    }, 50); // 20 FPS update rate

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
      this.updateLoop = null;
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

  /**
   * Reload configuration
   */
  reloadConfig() {
    if (CONFIG.debug) console.log('[trap54] Reloading configuration');
    // Configuration is already imported, changes will take effect on next detection cycle
  }
}

// Create global addon instance
const trap54 = new Trap54Addon();

// Meteor lifecycle hooks
if (typeof window !== 'undefined') {
  // Initialize when Meteor API is ready
  window.addEventListener('meteorReady', () => {
    trap54.initialize();
    if (CONFIG.detection.enabled || CONFIG.rendering.enabled) {
      trap54.start();
    }
  });

  // Auto-start if document is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trap54.initialize();
      if (CONFIG.detection.enabled || CONFIG.rendering.enabled) {
        trap54.start();
      }
    });
  } else {
    trap54.initialize();
    if (CONFIG.detection.enabled || CONFIG.rendering.enabled) {
      trap54.start();
    }
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (trap54.isRunning) {
      trap54.stop();
    }
  });

  // Expose global API for console control
  window.trap54 = trap54;
  window.trap54API = {
    start: () => trap54.start(),
    stop: () => trap54.stop(),
    toggle: () => trap54.toggle(),
    status: () => trap54.getStatus(),
    reload: () => trap54.reloadConfig(),
  };

  console.log('[trap54] Addon loaded. Use window.trap54API for control or window.trap54 for direct access');
}

// Export for use in other modules
export const addon = trap54;
export default trap54;
