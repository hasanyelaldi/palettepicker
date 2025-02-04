import { ColorGenerator } from './colorGenerator';

// Convert HSL to RGB
const hslToRgb = (h: number, s: number, l: number): string => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Generate different color harmonies
export function generateHarmoniousPalette(harmonyType: string): string[] {
  const baseHue = Math.random() * 360;
  
  switch (harmonyType) {
    case 'complementary':
      return [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 180) % 360, 70, 50),
        hslToHex(baseHue, 70, 70),
        hslToHex((baseHue + 180) % 360, 70, 70),
        hslToHex(baseHue, 70, 30),
      ];
      
    case 'analogous':
      return [
        hslToHex((baseHue - 30 + 360) % 360, 70, 50),
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 30) % 360, 70, 50),
        hslToHex((baseHue - 15 + 360) % 360, 70, 60),
        hslToHex((baseHue + 15) % 360, 70, 40),
      ];
      
    case 'triadic':
      return [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 120) % 360, 70, 50),
        hslToHex((baseHue + 240) % 360, 70, 50),
        hslToHex(baseHue, 70, 70),
        hslToHex((baseHue + 120) % 360, 70, 30),
      ];
      
    case 'split-complementary':
      return [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 150) % 360, 70, 50),
        hslToHex((baseHue + 210) % 360, 70, 50),
        hslToHex(baseHue, 70, 70),
        hslToHex((baseHue + 180) % 360, 70, 30),
      ];
      
    case 'square':
      return [
        hslToHex(baseHue, 70, 50),
        hslToHex((baseHue + 90) % 360, 70, 50),
        hslToHex((baseHue + 180) % 360, 70, 50),
        hslToHex((baseHue + 270) % 360, 70, 50),
        hslToHex(baseHue, 70, 60),
      ];
      
    case 'monochromatic':
      return [
        hslToHex(baseHue, 70, 30),
        hslToHex(baseHue, 60, 40),
        hslToHex(baseHue, 50, 50),
        hslToHex(baseHue, 40, 60),
        hslToHex(baseHue, 30, 70),
      ];
      
    default:
      return ColorGenerator.generateScheme({
        colorSpace: 'lch',
        baseHue: baseHue,
        hueRange: 30,
        minLightness: 30,
        maxLightness: 70,
        minChroma: 50,
        maxChroma: 100,
        distribution: 'even'
      }, 5);
  }
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
} 