/**
 * Configuration for trap54 Meteor Addon
 * Customize detection and rendering behavior
 */

export const CONFIG = {
  // Detection settings
  detection: {
    enabled: true,
    checkInterval: 100, // milliseconds between detection checks
    playerDetectionRadius: 256, // blocks
    spawnerDetectionRadius: 512, // blocks
  },

  // Rendering settings
  rendering: {
    enabled: true,
    chunkColor: 0x9900FF, // Purple in hex (RGB)
    chunkOpacity: 0.8, // 0.0 to 1.0
    chunkScale: 1.0, // 1.0 = normal size
    fillChunks: true, // Draw filled cubes in addition to wireframe
  },

  // Target detection filters
  targets: {
    players: true, // Detect and highlight players
    skeletonSpawners: true, // Detect and highlight skeleton spawners
  },

  // Debug settings
  debug: true, // Enable debug logging
};
