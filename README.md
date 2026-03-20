# Particlez - 3D Background Creator

Interactive React + Three.js app for generating abstract 3D particle backgrounds and exporting high-resolution PNGs.

## Features

- **Iridescent Glass Materials**: High-end `MeshPhysicalMaterial` with transmission, thickness, and iridescence.
- **Organic Floating Motion**: Smooth, noise-based drifting and rotation for a cinematic feel.
- **Bespoke Glassmorphism UI**: A custom-built, translucent control panel for real-time scene manipulation.
- **Curated Presets**: Quick-access styles including `Deep Ocean`, `Cyberpunk`, `Minimalist`, and `Golden Hour`.
- **Cinematic Post-Processing**: Integrated Bloom, Depth of Field, Noise (film grain), and Chromatic Aberration.
- **Real-time 3D Scene**: Interactive camera orbit controls and dynamic background gradients.
- **Layout Generation Modes**:
  - `scatter`, `grid`, `spiral`
- **Theme-based Color Palettes**:
  - `neon`, `ocean`, `sunset`, `monochrome`, `pastel`, `custom`
- **Connector Lines**: Vertex-to-vertex connections between nearby particles with adjustable distance and intensity.
- **PNG Export**: High-resolution export with aspect ratio presets (`16:9`, `1:1`, `5:4`, `9:16`, `4:5`).

## Tech Stack

- React 18
- Vite
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- Custom CSS (Glassmorphism design system)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

Default local URL: `http://localhost:5173/`

### Build

```bash
npm run build
```

## Usage Notes

- **Control Panel**: Use the bespoke glassmorphism panel on the right to adjust geometry, scene layout, and lighting.
- **Animated Transitions**: Selecting a preset triggers a smooth camera transition to a curated viewpoint.
- **Exporting**: Use the bottom-left panel to select your desired aspect ratio and download a high-bit-depth PNG.

## Project Structure

```text
src/
  components/
    Controls.jsx      # Main glassmorphism control panel
    Controls.css
    Effects.jsx       # Post-processing stack
    ExportUI.jsx      # Export configuration overlay
    ExportUI.css
    PlaneGroup.jsx    # Particle generation & animation logic
  utils/
    generation.js     # Geometry generation algorithms
    themes.js         # Color palette definitions
  Scene.jsx           # Main 3D scene & camera rig
  App.jsx
```
