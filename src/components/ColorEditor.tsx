import React, { useState, useEffect } from 'react';

interface Props {
  color: string;
  onColorChange: (newColor: string) => void;
  onClose: () => void;
}

export function ColorEditor({ color, onColorChange, onClose }: Props) {
  const [inputValue, setInputValue] = useState(color);
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    setInputValue(color);
    setRgbValues(hexToRgb(color));
  }, [color]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [channel]: value };
    setRgbValues(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setInputValue(newHex);
    onColorChange(newHex);
  };

  const handleHexInput = (value: string) => {
    setInputValue(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setRgbValues(hexToRgb(value));
      onColorChange(value);
    }
  };

  return (
    <div className="color-editor" onClick={(e) => e.stopPropagation()}>
      <div className="editor-header">
        <div className="editor-title">
          <h3>Edit Color</h3>
          <span className="color-value">{inputValue}</span>
        </div>
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      <div className="editor-content">
        <div className="color-preview-container">
          <div 
            className="color-preview-large"
            style={{ backgroundColor: color }}
          />
          <input
            type="color"
            value={color}
            onChange={(e) => {
              handleHexInput(e.target.value);
            }}
            className="color-picker"
          />
        </div>

        <div className="color-inputs">
          <div className="input-group hex">
            <label>Hex</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
              title="Hex color code (e.g., #FF0000)"
            />
          </div>

          <div className="rgb-inputs">
            <div className="input-group">
              <label>R</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbValues.r}
                onChange={(e) => handleRgbChange('r', Number(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>G</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbValues.g}
                onChange={(e) => handleRgbChange('g', Number(e.target.value))}
              />
            </div>
            <div className="input-group">
              <label>B</label>
              <input
                type="number"
                min="0"
                max="255"
                value={rgbValues.b}
                onChange={(e) => handleRgbChange('b', Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 