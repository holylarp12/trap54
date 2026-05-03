# Development Guide - trap54 Meteor Addon

## Project Structure

```
trap54/
├── src/
│   ├── main.js          # Entry point & lifecycle management
│   ├── detector.js      # Player & spawner detection logic
│   ├── renderer.js      # Chunk rendering with Meteor API
│   └── config.js        # Configuration settings
├── addon.json           # Meteor addon manifest
├── package.json         # NPM package metadata
├── README.md            # Project overview
├── INSTALL.md           # Installation instructions
└── DEVELOPMENT.md       # This file
```

## Architecture

### Main Components

#### 1. **Detector (detector.js)**
- Scans loaded chunks for players and skeleton spawners
- Uses Meteor 1.21.11 World & Player APIs
- Runs at configurable intervals
- Returns Set of detected targets with coordinates

#### 2. **Renderer (renderer.js)**
- Draws purple wireframe/filled chunks around targets
- Integrates with Meteor's RenderSystem
- Uses line and quad rendering for visual feedback
- Supports opacity and scaling

#### 3. **Main (main.js)**
- Orchestrates detector and renderer lifecycle
- Manages update loop (20 FPS default)
- Exposes global API for console control
- Handles Meteor event hooks

#### 4. **Config (config.js)**
- Centralized configuration management
- Detection radius, colors, rendering options
- Debug logging toggle

## Key Meteor 1.21.11 APIs Used

```javascript
// Player API
window.meteor.player.getX()
window.meteor.player.getY()
window.meteor.player.getZ()

// Player List API
window.meteor.playerList.players

// World API
window.meteor.world.getBlockState(x, y, z)
window.meteor.world.getBlockEntity(x, y, z)

// Render System API
window.meteor.renderSystem.drawLine(x1, y1, z1, x2, y2, z2, r, g, b, a)
window.meteor.renderSystem.drawQuad(x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4, r, g, b, a)
```

## Modifying the Addon

### Change Detection Radius
```javascript
// src/config.js
detection: {
  playerDetectionRadius: 256,    // Change this value (blocks)
  spawnerDetectionRadius: 512,   // Change this value (blocks)
}
```

### Change Chunk Color
```javascript
// src/config.js
rendering: {
  chunkColor: 0xFF0000,  // Red = 0xFF0000, Green = 0x00FF00, Blue = 0x0000FF
}
```

### Add Custom Target Detection

Edit `src/detector.js` and add a new detection method:

```javascript
detectDiamondOres() {
  const ores = [];
  // Your detection logic here
  return ores;
}
```

Then call it in `detectTargets()`:
```javascript
if (CONFIG.targets.diamondOres) {
  this.detectDiamondOres().forEach(ore => detectedThisFrame.add(ore));
}
```

## Debugging

### Enable Debug Mode
```javascript
// src/config.js
debug: true
```

Then check browser console (`F12`) for logs.

### Console Commands

```javascript
// Check addon status
trap54API.status()

// Output: { running: true, detectedTargets: 5, renderedChunks: 5 }

// View detected targets
window.trap54.detector.getDetectedTargets()

// View rendered chunks
window.trap54.renderer.getRenderedChunks()
```

## Adding New Features

### Example: Alert on Player Detection

1. Edit `src/main.js`:
```javascript
const detectedTargets = this.detector.getDetectedTargets();
this.renderer.render(detectedTargets);

// Add alert on player detection
detectedTargets.forEach(target => {
  if (target.type === 'player') {
    console.warn(`[trap54] Player detected: ${target.name}`);
  }
});
```

### Example: Custom Render Colors by Type

1. Edit `src/renderer.js`:
```javascript
drawChunk(chunkData) {
  const color = chunkData.type === 'player' ? 0xFF0000 : 0x0000FF;
  this.drawBox(..., color, ...);
}
```

## Testing

1. Place addon in `~/.meteor/addons/trap54/`
2. Launch Minecraft with Meteor
3. Open console with `F12`
4. Run: `trap54API.status()`
5. Verify output shows detection working

## Performance Optimization Tips

- Reduce `checkInterval` for more frequent updates
- Decrease detection radius to scan fewer chunks
- Disable `fillChunks` for wireframe-only rendering
- Use lower `chunkOpacity` for less GPU load
- Cache detected targets to avoid recalculating

## Troubleshooting Development

### Changes not taking effect?
1. Clear Meteor addon cache
2. Restart Minecraft
3. Verify file paths match exactly

### Meteor API not available?
1. Check `console.log(window.meteor)` returns object
2. Verify Meteor version is 1.21.11
3. Wait for `meteorReady` event

### Rendering not showing?
1. Verify `rendering.enabled = true`
2. Check detection finds targets: `trap54API.status()`
3. Ensure you're within chunk range of targets

## Contributing

Feel free to fork and submit PRs for improvements!
