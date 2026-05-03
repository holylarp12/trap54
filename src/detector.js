import { CONFIG } from './config.js';

export class Detector {
  constructor() {
    this.detectedTargets = new Set();
    this.checkInterval = null;
    this.meteor = null;
    this.world = null;
    this.playerList = null;
  }

  start() {
    if (CONFIG.detection.enabled) {
      // Initialize Meteor API references
      if (typeof window !== 'undefined' && window.meteor) {
        this.meteor = window.meteor;
        this.world = this.meteor.world;
        this.playerList = this.meteor.playerList;
      }

      this.checkInterval = setInterval(() => this.detectTargets(), CONFIG.detection.checkInterval);
      if (CONFIG.debug) console.log('[trap54] Detector started');
    }
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      if (CONFIG.debug) console.log('[trap54] Detector stopped');
    }
  }

  detectTargets() {
    const detectedThisFrame = new Set();

    // Detect players
    if (CONFIG.targets.players) {
      this.detectPlayers().forEach(player => detectedThisFrame.add(player));
    }

    // Detect skeleton spawners
    if (CONFIG.targets.skeletonSpawners) {
      this.detectSkeletonSpawners().forEach(spawner => detectedThisFrame.add(spawner));
    }

    // Update detected targets
    this.detectedTargets = detectedThisFrame;

    if (CONFIG.debug && detectedThisFrame.size > 0) {
      console.log(`[trap54] Detected ${detectedThisFrame.size} targets`);
    }

    return detectedThisFrame;
  }

  detectPlayers() {
    const players = [];
    
    try {
      // Get player list from Meteor API (1.21.11)
      if (this.playerList && this.playerList.players) {
        for (const player of this.playerList.players) {
          // Skip self
          if (player.isLocalPlayer) continue;

          const distance = this.getDistance(
            player.getX(),
            player.getY(),
            player.getZ()
          );

          if (distance <= CONFIG.detection.playerDetectionRadius) {
            players.push({
              x: Math.floor(player.getX()),
              y: Math.floor(player.getY()),
              z: Math.floor(player.getZ()),
              type: 'player',
              name: player.getName(),
            });
          }
        }
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error detecting players:', error);
    }

    return players;
  }

  detectSkeletonSpawners() {
    const spawners = [];

    try {
      // Scan loaded chunks for spawner blocks
      if (this.world) {
        const playerPos = this.getPlayerPosition();
        const searchRadius = CONFIG.detection.spawnerDetectionRadius;

        // Search in loaded chunk range
        for (let x = playerPos.x - searchRadius; x < playerPos.x + searchRadius; x += 16) {
          for (let z = playerPos.z - searchRadius; z < playerPos.z + searchRadius; z += 16) {
            for (let y = playerPos.y - 64; y < playerPos.y + 64; y += 16) {
              const spawner = this.checkForSpawner(x, y, z);
              if (spawner) {
                spawners.push(spawner);
              }
            }
          }
        }
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error detecting spawners:', error);
    }

    return spawners;
  }

  checkForSpawner(x, y, z) {
    try {
      if (!this.world) return null;

      // Check block at position for spawner
      const blockState = this.world.getBlockState(x, y, z);
      
      if (blockState && blockState.getBlock) {
        const blockName = blockState.getBlock().getName();
        
        // Check if it's a spawner block
        if (blockName && blockName.toLowerCase().includes('spawner')) {
          // Try to get entity type from spawner
          const blockEntity = this.world.getBlockEntity(x, y, z);
          let entityType = 'unknown';
          
          if (blockEntity && blockEntity.getSpawnData) {
            entityType = blockEntity.getSpawnData();
          }

          // Filter for skeleton spawners
          if (entityType.toLowerCase().includes('skeleton') || entityType === 'unknown') {
            return {
              x: x,
              y: y,
              z: z,
              type: 'spawner',
              entityType: entityType,
            };
          }
        }
      }
    } catch (error) {
      if (CONFIG.debug && CONFIG.debug.verbose) {
        console.debug('[trap54] Error checking block at', x, y, z, error);
      }
    }

    return null;
  }

  getPlayerPosition() {
    try {
      if (this.meteor && this.meteor.player) {
        return {
          x: Math.floor(this.meteor.player.getX()),
          y: Math.floor(this.meteor.player.getY()),
          z: Math.floor(this.meteor.player.getZ()),
        };
      }
    } catch (error) {
      if (CONFIG.debug) console.error('[trap54] Error getting player position:', error);
    }

    return { x: 0, y: 64, z: 0 };
  }

  getDistance(x, y, z) {
    const playerPos = this.getPlayerPosition();
    const dx = playerPos.x - x;
    const dy = playerPos.y - y;
    const dz = playerPos.z - z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  getDetectedTargets() {
    return this.detectedTargets;
  }
}
