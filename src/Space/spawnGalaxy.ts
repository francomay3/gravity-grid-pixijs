import { getOrbitalSpeed, getRandomVector } from "../utils";

import { Space } from ".";
import { randomBetween } from "../utils";
import { Vector2 } from "../vector2";
import { getColor } from "../colorUtils";

export interface SpawnGalaxyOptions {
  count: number;
  minMass: number;
  maxMass: number;
  center: Vector2;
  radius: number;
  speed: number;
  temperature: number;
}

export const spawnGalaxy = (space: Space, options: SpawnGalaxyOptions) => {
  for (let i = 0; i < options.count; i++) {
    const planetMass = randomBetween(options.minMass, options.maxMass);
    const planetPosition = getRandomVector(options.radius).add(options.center);
    const galaxyMass = (options.minMass + options.maxMass / 2) * options.count;
    const speedDueToTemperature = getRandomVector(options.temperature);
    const planetSpeed = getOrbitalSpeed(
      planetPosition,
      space.G,
      options.center,
      galaxyMass,
      options.radius
    )
      .multiply(options.speed)
      .add(speedDueToTemperature);
    const color = getColor(options.center, options.radius, planetPosition);

    space.addPlanet({
      position: planetPosition,
      mass: planetMass,
      density: space.planetsDensity,
      color,
      speed: planetSpeed,
    });
  }
};
