import { Coordinates } from "./Coordinates";
import { Planet } from "./Planet";

export const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getRandomSpeedDirectionFromKineticEnergyAndMass = (
  kineticEnergy: number,
  mass: number
): Coordinates => {
  const speed = Math.sqrt((2 * kineticEnergy) / mass);
  const angle = randomBetween(0, 2 * Math.PI);
  return new Coordinates(speed * Math.cos(angle), speed * Math.sin(angle));
};

export const getRadius = (mass: number, density: number): number =>
  Math.cbrt((3 * mass) / (4 * Math.PI * density));

export const getKineticEnergy = (speed: number, mass: number): number =>
  0.5 * mass * speed ** 2;

export const getSpeedFromKineticEnergy = (
  kineticEnergy: number,
  mass: number
): number => Math.sqrt((2 * kineticEnergy) / mass);

export const getSpeedAfterCollission = (a: Planet, b: Planet): Coordinates => {
  return new Coordinates(
    (a.speed.x * a.mass + b.speed.x * b.mass) / (a.mass + b.mass),
    (a.speed.y * a.mass + b.speed.y * b.mass) / (a.mass + b.mass)
  );
};

export const getPositionAfterCollission = (
  a: Planet,
  b: Planet
): Coordinates => {
  return new Coordinates(
    (a.position.x * a.mass + b.position.x * b.mass) / (a.mass + b.mass),
    (a.position.y * a.mass + b.position.y * b.mass) / (a.mass + b.mass)
  );
};

export const biasSpeed = (
  speed: Coordinates,
  position: Coordinates,
  center: Coordinates,
  biasStrength: number = 0
): Coordinates => {
  const angle = Math.atan2(position.y - center.y, position.x - center.x);
  const distanceToCenter = position.distanceTo(center);

  const factor = 0.001;

  const bias = new Coordinates(
    Math.cos(angle + Math.PI / 2) *
      randomBetween(0, distanceToCenter * biasStrength * factor),
    Math.sin(angle + Math.PI / 2) *
      randomBetween(0, distanceToCenter * biasStrength * factor)
  );

  return new Coordinates(speed.x + bias.x, speed.y + bias.y);
};
