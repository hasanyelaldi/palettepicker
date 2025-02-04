import { ColorMath } from './colorMath';

interface ColorSchemeSettings {
  colorSpace: 'lch' | 'lab' | 'rgb';
  baseHue: number;
  hueRange: number;
  minLightness: number;
  maxLightness: number;
  minChroma: number;
  maxChroma: number;
  distribution: 'even' | 'random' | 'clustered';
}

export class ColorGenerator {
  static generateScheme(settings: ColorSchemeSettings, count: number): string[] {
    const colors: string[] = [];
    
    switch (settings.distribution) {
      case 'even':
        colors.push(...this.generateEvenDistribution(settings, count));
        break;
      case 'random':
        colors.push(...this.generateRandomDistribution(settings, count));
        break;
      case 'clustered':
        colors.push(...this.generateClusteredDistribution(settings, count));
        break;
    }

    return colors;
  }

  private static generateEvenDistribution(settings: ColorSchemeSettings, count: number): string[] {
    const colors: string[] = [];
    const hueStep = (settings.hueRange * 2) / (count - 1);
    const lightnessStep = (settings.maxLightness - settings.minLightness) / (count - 1);
    const chromaStep = (settings.maxChroma - settings.minChroma) / (count - 1);

    for (let i = 0; i < count; i++) {
      const h = (settings.baseHue - settings.hueRange + (hueStep * i) + 360) % 360;
      const l = settings.minLightness + (lightnessStep * i);
      const c = settings.minChroma + (chromaStep * i);

      colors.push(this.lchToHex(l, c, h));
    }

    return colors;
  }

  private static generateRandomDistribution(settings: ColorSchemeSettings, count: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
      const h = (settings.baseHue - settings.hueRange + (Math.random() * settings.hueRange * 2) + 360) % 360;
      const l = settings.minLightness + (Math.random() * (settings.maxLightness - settings.minLightness));
      const c = settings.minChroma + (Math.random() * (settings.maxChroma - settings.minChroma));

      colors.push(this.lchToHex(l, c, h));
    }

    return colors;
  }

  private static generateClusteredDistribution(settings: ColorSchemeSettings, count: number): string[] {
    const colors: string[] = [];
    const clusters = Math.ceil(count / 3);
    
    for (let i = 0; i < clusters; i++) {
      const baseH = (settings.baseHue - settings.hueRange + (Math.random() * settings.hueRange * 2) + 360) % 360;
      const baseL = settings.minLightness + (Math.random() * (settings.maxLightness - settings.minLightness));
      const baseC = settings.minChroma + (Math.random() * (settings.maxChroma - settings.minChroma));

      // Generate variations around the base color
      for (let j = 0; j < 3 && colors.length < count; j++) {
        const h = (baseH + (Math.random() * 30 - 15) + 360) % 360;
        const l = Math.max(settings.minLightness, Math.min(settings.maxLightness, baseL + (Math.random() * 20 - 10)));
        const c = Math.max(settings.minChroma, Math.min(settings.maxChroma, baseC + (Math.random() * 20 - 10)));

        colors.push(this.lchToHex(l, c, h));
      }
    }

    return colors;
  }

  private static lchToHex(l: number, c: number, h: number): string {
    const [L, a, b] = ColorMath.lchToLab(l, c, h);
    const [r, g, b_] = ColorMath.labToRgb(L, a, b);
    return ColorMath.rgbToHex(r, g, b_);
  }
} 