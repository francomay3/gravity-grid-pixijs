# GravityGrid

A TypeScript-based gravity simulation that visualizes planetary motion using PixiJS.

## Overview

GravityGrid is an interactive space simulation that demonstrates gravitational interactions between celestial bodies. The project uses modern web technologies to create an engaging visualization of planetary motion.

## Features

- Interactive planetary system simulation
- Real-time gravity calculations
- Smooth panning and zooming controls

## Technologies

- TypeScript
- PixiJS (v8.6.2) for rendering
- Vite for development and building

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/francomay3/gravity-grid-pixijs.git
   cd gravity-grid-pixijs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

This will start the Vite development server, at `http://localhost:8080`.

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

- `src/`
  - `main.ts` - Application entry point
  - `Space.ts` - Space class definition
  - `Planet.ts` - Planet class definition
  - `Force.ts` - Force class definition
  - `Position.ts` - Position class definition
  - `Speed.ts` - Speed class definition
  - `StateManager.ts` - (Future implementation) Application state management
  - `utils.ts` - Utility functions
  - `enablePanning.ts` - Pan control implementation
  - `enableZooming.ts` - Zoom control implementation
  - `enableScreenEvents.ts` - Event handling

## ToDo List

### User Interface

- Implement hand cursor for panning that closes/opens to indicate screen pinching
- Add planet creation mode with mouse interaction
  - Switch between navigation and planet creation states
  - Create planets with initial velocity based on mouse movement

### Planet Features

- Enhance planet customization
  - Add configurable mass ranges (min/max)
  - Add configurable speed ranges (min/max)
  - Make planet radius proportional to mass
  - Implement color schemes (random or mass-dependent)

### Space Features

- Add methods to dynamically create new planets
- Expand configuration options for planet generation

### Performance Optimization

- Profile and identify computationally intensive functions
- Implement performance-critical calculations in C/WebAssembly

### Physics

- Implement planet collision mechanics
  - Detect collisions between planets
  - Merge colliding planets
  - Calculate resulting mass and velocity

### Visual Effects

- Add movement trailing effect for planets
  - Implement motion blur or particle trail
  - Make trail length/opacity configurable

### Audio

- Add sound system
  - Implement ambient space background music
  - Add sound effects for planet collisions/merging
  - Add volume controls
