import { Vector2 } from "./vector2";

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

const colors = [0x36ff33, 0xff33f9, 0xff3737, 0xe3ff45, 0xffb955, 0x55f7ff];

export const getColor = (
  center: Vector2,
  radius: number,
  position: Vector2
): number => {
  const distanceToEdge = position.distanceTo(center);

  return colors[
    Math.min(
      Math.floor((distanceToEdge / radius) * colors.length),
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
  const r1 = (color1 >> 16) & 255;
  const g1 = (color1 >> 8) & 255;
  const b1 = color1 & 255;
  const [h1, s1, l1] = rgbToHsl(r1, g1, b1);

  const r2 = (color2 >> 16) & 255;
  const g2 = (color2 >> 8) & 255;
  const b2 = color2 & 255;
  const [h2, s2, l2] = rgbToHsl(r2, g2, b2);

  const totalWeight = weight1 + weight2;

  const h = (h1 * weight1 + h2 * weight2) / totalWeight;
  const s = (s1 * weight1 + s2 * weight2) / totalWeight;
  const l = (l1 + l2) / 2;

  const [r, g, b] = hslToRgb(h, s, l);
  return (r << 16) | (g << 8) | b;
};
