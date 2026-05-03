# Installation Guide - trap54 Meteor Addon

## Prerequisites
- Minecraft 1.21.11
- Meteor Client installed
- Basic knowledge of Meteor addon installation

## Installation Steps

### Option 1: Clone from GitHub (Recommended)
```bash
cd ~/.meteor/addons
git clone https://github.com/holylarp12/trap54.git
```

### Option 2: Manual Installation
1. Download the repository as ZIP from GitHub
2. Extract to `~/.meteor/addons/trap54/`
3. Ensure the folder structure matches:
```
~/.meteor/addons/trap54/
├── src/
│   ├── main.js
│   ├── detector.js
│   ├── renderer.js
│   └── config.js
├── addon.json
├── package.json
└── README.md
```

## Folder Locations

**Windows:**
```
C:\Users\<YourUsername>\AppData\Roaming\.meteor\addons
```

**Mac:**
```
~/.meteor/addons
```

**Linux:**
```
~/.meteor/addons
```

## Usage

### Auto-Start (Recommended)
The addon will automatically start when you launch Minecraft with Meteor if `enabled` is `true` in `src/config.js`.

### Manual Control (In-Game Console)
Once loaded, you can control the addon using the browser console:

```javascript
// Start the addon
trap54API.start()

// Stop the addon
trap54API.stop()

// Toggle on/off
trap54API.toggle()

// Check status
trap54API.status()

// Reload configuration
trap54API.reload()
```

Or use the direct object:
```javascript
window.trap54.start()
window.trap54.stop()
window.trap54.toggle()
```

## Configuration

Edit `src/config.js` to customize behavior:

```javascript
export const CONFIG = {
  detection: {
    enabled: true,
    checkInterval: 100, // ms between checks
    playerDetectionRadius: 256, // blocks
    spawnerDetectionRadius: 512, // blocks
  },
  rendering: {
    enabled: true,
    chunkColor: 0x9900FF, // Purple hex color
    chunkOpacity: 0.8, // 0.0-1.0
    chunkScale: 1.0,
    fillChunks: true,
  },
  targets: {
    players: true,
    skeletonSpawners: true,
  },
  debug: true, // Enable logging
};
```

## Features

✅ **Player Detection** - Automatically detects nearby players  
✅ **Spawner Detection** - Finds skeleton spawners in loaded chunks  
✅ **Purple Chunks** - Highlights detected targets with purple wireframe chunks  
✅ **Customizable** - Full configuration options in `config.js`  
✅ **Debug Mode** - Console logging for troubleshooting  

## Troubleshooting

### Addon Not Loading
1. Check that folder is in `.meteor/addons/`
2. Verify folder structure matches exactly
3. Check browser console for errors (`F12`)
4. Ensure `addon.json` exists in root directory

### No Detections
1. Enable debug mode in `config.js`
2. Check console for error messages
3. Verify detection is enabled: `CONFIG.detection.enabled = true`
4. Increase detection radius if needed

### Performance Issues
1. Reduce `checkInterval` in config
2. Reduce detection radius values
3. Disable `fillChunks` rendering
4. Close other heavy addons

## Support

For issues, visit: https://github.com/holylarp12/trap54/issues
