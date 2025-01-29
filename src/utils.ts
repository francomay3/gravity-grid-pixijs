import { Vector2 } from "./vector2";
import { Planet } from "./Planet";

export const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getRandomSpeedDirectionFromKineticEnergyAndMass = (
  kineticEnergy: number,
  mass: number
): Vector2 => {
  const speed = Math.sqrt((2 * kineticEnergy) / mass);
  const angle = randomBetween(0, 2 * Math.PI);
  return new Vector2(speed * Math.cos(angle), speed * Math.sin(angle));
};

export const getRadius = (mass: number, density: number): number =>
  Math.cbrt((3 * mass) / (4 * Math.PI * density));

export const getKineticEnergy = (speed: number, mass: number): number =>
  0.5 * mass * speed ** 2;

export const getSpeedFromKineticEnergy = (
  kineticEnergy: number,
  mass: number
): number => Math.sqrt((2 * kineticEnergy) / mass);

export const getSpeedAfterCollission = (a: Planet, b: Planet): Vector2 => {
  return new Vector2(
    (a.speed.x * a.mass + b.speed.x * b.mass) / (a.mass + b.mass),
    (a.speed.y * a.mass + b.speed.y * b.mass) / (a.mass + b.mass)
  );
};

export const getPositionAfterCollission = (a: Planet, b: Planet): Vector2 => {
  return new Vector2(
    (a.position.x * a.mass + b.position.x * b.mass) / (a.mass + b.mass),
    (a.position.y * a.mass + b.position.y * b.mass) / (a.mass + b.mass)
  );
};

export const getOrbitalSpeed = (
  position: Vector2,
  G: number,
  galaxyCenter: Vector2,
  galaxyMass: number,
  galaxyRadius: number
): Vector2 => {
  const dx = position.x - galaxyCenter.x;
  const dy = position.y - galaxyCenter.y;
  const r = Math.sqrt(dx * dx + dy * dy);

  const effectiveMass = galaxyMass * Math.pow(r / galaxyRadius, 3);

  const speed = Math.sqrt((G * effectiveMass) / r);

  const vx = speed * (-dy / r);
  const vy = speed * (dx / r);

  return new Vector2(vx, vy);
};

export const getRandomVector = (maxLength: number): Vector2 => {
  return new Vector2(
    randomBetween(-maxLength, maxLength),
    randomBetween(-maxLength, maxLength)
  ).rotate(randomBetween(0, 2 * Math.PI));
};
