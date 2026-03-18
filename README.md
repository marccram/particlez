# Particlez - 3D Background Creator

Interactive React + Three.js app for generating abstract 3D particle backgrounds and exporting high-resolution PNGs.

## Features

- Real-time 3D particle scene with camera orbit controls
- Layout generation modes:
  - `scatter`
  - `grid`
  - `spiral`
- Theme-based color palettes:
  - `neon`, `ocean`, `sunset`, `monochrome`, `pastel`, `custom`
- Background designer:
  - `solid` mode
  - `gradient` mode with `linear`, `radial`, and `organic` (blob-style) variants
- Connector lines between nearby particles with:
  - toggle on/off
  - distance threshold
  - independent connector opacity
- Optional post-processing toggle
- PNG export with aspect ratio presets (`16:9`, `1:1`, `5:4`, `9:16`, `4:5`)

## Tech Stack

- React 18
- Vite
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- Leva (control panel)

## Getting Started

### Prerequisites

- Node.js 18+ (Node 22 tested)
- npm

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

Default local URL:

```text
http://127.0.0.1:5173/
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Usage Notes

- Use the Leva panel to adjust scene generation, theme, background style, and connector behavior.
- Export controls are fixed as a DOM overlay, so they stay in place regardless of camera zoom/pan.
- Export resolution is currently fixed to a high-quality target based on selected aspect ratio.

## Project Structure

```text
src/
  components/
    Effects.jsx
    ExportUI.jsx
    PlaneGroup.jsx
  utils/
    generation.js
    themes.js
  Scene.jsx
  App.jsx
```
