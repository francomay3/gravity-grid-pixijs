import { Planet } from "./Planet";
import { Position } from "./Position";
import { Speed } from "./Speed";

export const randomBetween = (min: number, max: number) => {
  return min + Math.random() * (max - min);
};

export const getRandomSpeedFromKineticEnergyAndMass = (
  kineticEnergy: number,
  mass: number
): Speed => {
  const speed = Math.sqrt((2 * kineticEnergy) / mass);
  const angle = Math.random() * 2 * Math.PI; // Random angle between 0 and 2π
  return {
    x: speed * Math.cos(angle),
    y: speed * Math.sin(angle),
  };
};

export const getRadius = (mass: number, density: number): number => {
  return Math.cbrt((3 * mass) / (4 * Math.PI * density));
};

export const getKineticEnergy = (speed: number, mass: number): number =>
  0.5 * mass * speed ** 2;

export const getSpeedFromKineticEnergy = (
  kineticEnergy: number,
  mass: number
): number => Math.sqrt((2 * kineticEnergy) / mass);

export const getSpeedAfterCollission = (a: Planet, b: Planet): Speed => {
  return {
    x: (a.speed.x * a.mass + b.speed.x * b.mass) / (a.mass + b.mass),
    y: (a.speed.y * a.mass + b.speed.y * b.mass) / (a.mass + b.mass),
  };
};

export const getPositionAfterCollission = (a: Planet, b: Planet): Position => {
  return new Position({
    x: (a.position.x * a.mass + b.position.x * b.mass) / (a.mass + b.mass),
    y: (a.position.y * a.mass + b.position.y * b.mass) / (a.mass + b.mass),
  });
};

export const biasSpeed = (
  speed: Speed,
  position: Position,
  center: Position,
  biasStrength: number = 0
): Speed => {
  const angle = Math.atan2(position.y - center.y, position.x - center.x);
  const distanceToCenter = position.distance(center);

  const bias = {
    x:
      Math.cos(angle + Math.PI / 2) *
      randomBetween(0, biasStrength / distanceToCenter),
    y:
      Math.sin(angle + Math.PI / 2) *
      randomBetween(0, biasStrength / distanceToCenter),
  };

  return {
    x: speed.x + bias.x,
    y: speed.y + bias.y,
  };
};
