// Configuration settings for trap54 addon

export const CONFIG = {
  // Detection settings
  detection: {
    enabled: true,
    checkInterval: 100, // milliseconds between detection checks
    playerDetectionRadius: 64, // blocks
    spawnerDetectionRadius: 64, // blocks
  },

  // Rendering settings
  rendering: {
    enabled: true,
    chunkColor: 0x9900FF, // Purple color (RGB hex)
    chunkOpacity: 0.5,
    chunkScale: 1.0,
    renderDistance: 128, // blocks
  },

  // Target types
  targets: {
    players: true,
    skeletonSpawners: true,
  },

  // Logging
  debug: false,
};
