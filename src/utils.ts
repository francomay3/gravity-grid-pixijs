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

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const biasSpeed = (
  speed: Speed,
  position: Position,
  center: Position,
  biasStrength: number = 0
): Speed => {
  const angle = Math.atan2(position.y - center.y, position.x - center.x);
  const distanceToCenter = position.distance(center);

  const factor = 0.001;

  const bias = {
    x:
      Math.cos(angle + Math.PI / 2) *
      randomBetween(0, distanceToCenter * biasStrength * factor),
    y:
      Math.sin(angle + Math.PI / 2) *
      randomBetween(0, distanceToCenter * biasStrength * factor),
  };

  return {
    x: speed.x + bias.x,
    y: speed.y + bias.y,
  };
};

const colors = [0x36ff33, 0xff33f9, 0xff3737, 0xe3ff45, 0xffb955, 0x55f7ff];

export const getColor = (
  area: { minX: number; minY: number; maxX: number; maxY: number },
  position: { x: number; y: number }
): number => {
  const maxDistance = new Position({
    x: area.minX,
    y: area.minY,
  }).distance({ x: area.maxX, y: area.maxY });

  const distanceToEdge = new Position(position).distance({
    x: area.maxX,
    y: area.maxY,
  });

  return colors[
    Math.min(
      Math.floor((distanceToEdge / maxDistance) * colors.length),
      colors.length - 1
    )
  ];
};

export const getColorAfterColission = (
  color1: number,
  weight1: number,
  color2: number,
  weight2: number
): number => {
  // Extract RGB components
  const r1 = (color1 >> 16) & 255;
  const g1 = (color1 >> 8) & 255;
  const b1 = color1 & 255;
  const [h1, s1, l1] = rgbToHsl(r1, g1, b1);

  const r2 = (color2 >> 16) & 255;
  const g2 = (color2 >> 8) & 255;
  const b2 = color2 & 255;
  const [h2, s2, l2] = rgbToHsl(r2, g2, b2);

  // Calculate total weight
  const totalWeight = weight1 + weight2;

  // Mix hue and saturation according to weights
  const h = (h1 * weight1 + h2 * weight2) / totalWeight;
  const s = (s1 * weight1 + s2 * weight2) / totalWeight;
  // Take average of lightness to preserve luminosity
  const l = (l1 + l2) / 2;

  // Convert back to RGB
  const [r, g, b] = hslToRgb(h, s, l);
  return (r << 16) | (g << 8) | b;
};
