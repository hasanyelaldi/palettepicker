interface ContrastResult {
  ratio: number;
  AA: boolean;
  AAA: boolean;
}

interface ColorBlindSimulation {
  protanopia: string;
  deuteranopia: string;
  tritanopia: string;
}

export class ColorAccessibility {
  // Calculate relative luminance
  static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  // Calculate contrast ratio between two colors
  static getContrastRatio(color1: string, color2: string): ContrastResult {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    const l1 = this.getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const l2 = this.getLuminance(rgb2[0], rgb2[1], rgb2[2]);
    
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return {
      ratio: Math.round(ratio * 100) / 100,
      AA: ratio >= 4.5,
      AAA: ratio >= 7
    };
  }

  // Simulate color blindness
  static simulateColorBlindness(color: string): ColorBlindSimulation {
    const rgb = this.hexToRgb(color);
    
    // Conversion matrices for different types of color blindness
    const matrices = {
      protanopia: [
        [0.567, 0.433, 0, 0],
        [0.558, 0.442, 0, 0],
        [0, 0.242, 0.758, 0]
      ],
      deuteranopia: [
        [0.625, 0.375, 0, 0],
        [0.7, 0.3, 0, 0],
        [0, 0.3, 0.7, 0]
      ],
      tritanopia: [
        [0.95, 0.05, 0, 0],
        [0, 0.433, 0.567, 0],
        [0, 0.475, 0.525, 0]
      ]
    };

    const simulate = (matrix: number[][]) => {
      const r = rgb[0] / 255;
      const g = rgb[1] / 255;
      const b = rgb[2] / 255;

      const simR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
      const simG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
      const simB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];

      return this.rgbToHex(
        Math.round(simR * 255),
        Math.round(simG * 255),
        Math.round(simB * 255)
      );
    };

    return {
      protanopia: simulate(matrices.protanopia),
      deuteranopia: simulate(matrices.deuteranopia),
      tritanopia: simulate(matrices.tritanopia)
    };
  }

  private static hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ];
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
      .map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
      .join('');
  }
} 