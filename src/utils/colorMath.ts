// Color space conversion and manipulation utilities
export class ColorMath {
  // Convert RGB to LAB
  static rgbToLab(r: number, g: number, b: number): [number, number, number] {
    // Convert RGB to XYZ
    let rgb = [r / 255, g / 255, b / 255].map(c => {
      if (c > 0.04045) {
        return Math.pow((c + 0.055) / 1.055, 2.4);
      }
      return c / 12.92;
    });

    // Observer = 2°, Illuminant = D65
    const x = rgb[0] * 0.4124 + rgb[1] * 0.3576 + rgb[2] * 0.1805;
    const y = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
    const z = rgb[0] * 0.0193 + rgb[1] * 0.1192 + rgb[2] * 0.9505;

    // Convert XYZ to LAB
    const xn = 0.95047;
    const yn = 1.00000;
    const zn = 1.08883;

    const xyz = [x / xn, y / yn, z / zn].map(v => {
      if (v > 0.008856) {
        return Math.pow(v, 1/3);
      }
      return (7.787 * v) + (16 / 116);
    });

    const l = (116 * xyz[1]) - 16;
    const a = 500 * (xyz[0] - xyz[1]);
    const _b = 200 * (xyz[1] - xyz[2]);

    return [l, a, _b];
  }

  // Convert LAB to LCH
  static labToLch(l: number, a: number, b: number): [number, number, number] {
    const c = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) * (180 / Math.PI);
    if (h < 0) {
      h += 360;
    }
    return [l, c, h];
  }

  // Convert LCH to LAB
  static lchToLab(l: number, c: number, h: number): [number, number, number] {
    const hRad = h * (Math.PI / 180);
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);
    return [l, a, b];
  }

  // Convert LAB to RGB
  static labToRgb(l: number, a: number, b: number): [number, number, number] {
    // Convert LAB to XYZ
    const y = (l + 16) / 116;
    const x = a / 500 + y;
    const z = y - b / 200;

    const xn = 0.95047;
    const yn = 1.00000;
    const zn = 1.08883;

    const xyz = [x, y, z].map((v, i) => {
      const v3 = Math.pow(v, 3);
      if (v3 > 0.008856) {
        return v3 * [xn, yn, zn][i];
      }
      return ((v - 16/116) / 7.787) * [xn, yn, zn][i];
    });

    // Convert XYZ to RGB
    const r = xyz[0] *  3.2406 + xyz[1] * -1.5372 + xyz[2] * -0.4986;
    const g = xyz[0] * -0.9689 + xyz[1] *  1.8758 + xyz[2] *  0.0415;
    const _b = xyz[0] *  0.0557 + xyz[1] * -0.2040 + xyz[2] *  1.0570;

    // Convert linear RGB to sRGB
    const rgb = [r, g, _b].map(v => {
      if (v > 0.0031308) {
        return 1.055 * Math.pow(v, 1/2.4) - 0.055;
      }
      return 12.92 * v;
    });

    return rgb.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255)) as [number, number, number];
  }

  // Convert RGB to Hex
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // Convert Hex to RGB
  static hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ];
  }
} 