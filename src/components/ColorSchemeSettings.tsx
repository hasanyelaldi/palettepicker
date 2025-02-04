import React, { useState } from 'react';

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

interface Props {
  settings: ColorSchemeSettings;
  onSettingsChange: (settings: ColorSchemeSettings) => void;
}

const tooltips = {
  colorSpace: "Choose between different color spaces:\n• LCH: Perceptually uniform, great for design\n• LAB: Mathematically uniform\n• RGB: Traditional digital color space",
  distribution: "How colors are spread across the palette:\n• Even: Equal spacing between colors\n• Random: Completely random within constraints\n• Clustered: Groups of similar colors",
  baseHue: "The main color angle on the color wheel (0-360°)\n0° is red, 120° is green, 240° is blue",
  hueRange: "How far colors can deviate from the base hue.\nLarger values create more diverse palettes",
  lightness: "Controls how light or dark the colors are.\n0% is black, 100% is white",
  chroma: "Controls color intensity/saturation.\nLower values are more muted, higher values are more vibrant"
};

export function ColorSchemeSettings({ settings, onSettingsChange }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleChange = (key: keyof ColorSchemeSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleTooltipEnter = (event: React.MouseEvent, tooltipKey: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right + 10,
      y: rect.top
    });
    setActiveTooltip(tooltipKey);
  };

  return (
    <div className="scheme-settings">
      <div className="settings-grid">
        <div className="settings-group">
          <div className="setting-header">
            <span className="setting-icon">🎨</span>
            <label>
              Color Space
              <span 
                className="info-icon"
                onMouseEnter={(e) => handleTooltipEnter(e, 'colorSpace')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                ℹ️
              </span>
            </label>
          </div>
          <select
            value={settings.colorSpace}
            onChange={(e) => handleChange('colorSpace', e.target.value)}
          >
            <option value="lch">LCH (Perceptual)</option>
            <option value="lab">LAB (Uniform)</option>
            <option value="rgb">RGB (Traditional)</option>
          </select>
        </div>

        <div className="settings-group">
          <div className="setting-header">
            <span className="setting-icon">🎯</span>
            <label>
              Distribution
              <span 
                className="info-icon"
                onMouseEnter={(e) => handleTooltipEnter(e, 'distribution')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                ℹ️
              </span>
            </label>
          </div>
          <select
            value={settings.distribution}
            onChange={(e) => handleChange('distribution', e.target.value)}
          >
            <option value="even">Even</option>
            <option value="random">Random</option>
            <option value="clustered">Clustered</option>
          </select>
        </div>

        <div className="settings-group">
          <div className="setting-header">
            <span className="setting-icon">🌈</span>
            <label>Base Hue <span className="value">{settings.baseHue}°</span></label>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={settings.baseHue}
            onChange={(e) => handleChange('baseHue', Number(e.target.value))}
            className="hue-slider"
          />
        </div>

        <div className="settings-group">
          <div className="setting-header">
            <span className="setting-icon">↔️</span>
            <label>Hue Range <span className="value">±{settings.hueRange}°</span></label>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={settings.hueRange}
            onChange={(e) => handleChange('hueRange', Number(e.target.value))}
          />
        </div>

        <div className="settings-group">
          <div className="setting-header">
            <span className="setting-icon">☀️</span>
            <label>Lightness <span className="value">{settings.minLightness}% - {settings.maxLightness}%</span></label>
          </div>
          <div className="range-wrapper">
            <input
              type="range"
              min="0"
              max="100"
              value={settings.minLightness}
              onChange={(e) => handleChange('minLightness', Number(e.target.value))}
              className="range-start"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={settings.maxLightness}
              onChange={(e) => handleChange('maxLightness', Number(e.target.value))}
              className="range-end"
            />
          </div>
        </div>

        <div className="settings-group">
          <div className="setting-header">
            <span className="setting-icon">💪</span>
            <label>Chroma <span className="value">{settings.minChroma} - {settings.maxChroma}</span></label>
          </div>
          <div className="range-wrapper">
            <input
              type="range"
              min="0"
              max="132"
              value={settings.minChroma}
              onChange={(e) => handleChange('minChroma', Number(e.target.value))}
              className="range-start"
            />
            <input
              type="range"
              min="0"
              max="132"
              value={settings.maxChroma}
              onChange={(e) => handleChange('maxChroma', Number(e.target.value))}
              className="range-end"
            />
          </div>
        </div>
      </div>

      {activeTooltip && (
        <div 
          className="tooltip"
          style={{
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`
          }}
        >
          {tooltips[activeTooltip as keyof typeof tooltips].split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
} 