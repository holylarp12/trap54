# trap54

A Meteor addon that detects player and skeleton spawners and highlights them with a purple chunk.

## Features

- Detects players in the game world
- Detects skeleton spawners
- Highlights detected spawners with a purple chunk visual indicator

## Installation

1. Clone this repository into your Meteor addons directory
2. Load the addon in your Meteor configuration
3. The addon will automatically initialize on game start

## Usage

The addon will automatically start detecting players and skeleton spawners upon initialization. When detected, a purple chunk will be rendered at the spawner location.

## Configuration

Customize the addon behavior by modifying the settings in `src/config.js`.

## Files

- `src/main.js` - Main addon entry point
- `src/detector.js` - Player and spawner detection logic
- `src/renderer.js` - Purple chunk rendering
- `src/config.js` - Configuration settings
