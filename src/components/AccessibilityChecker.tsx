import React, { useState } from 'react';
import { ColorAccessibility } from '../utils/colorAccessibility';
import '../styles/components.css';

interface Props {
  colors: string[];
}

const tooltips = {
  colorBlindness: "Color blindness simulation shows how your palette appears to people with different types of color vision deficiency:\n• Protanopia: Reduced sensitivity to red light\n• Deuteranopia: Reduced sensitivity to green light\n• Tritanopia: Reduced sensitivity to blue light",
  contrastRatio: "WCAG (Web Content Accessibility Guidelines) contrast ratios ensure text readability:\n• Minimum ratio 4.5:1 for AA standard\n• Enhanced ratio 7:1 for AAA standard\n• Green background: Meets AAA\n• Yellow background: Meets AA\n• Red background: Fails accessibility standards"
};

export function AccessibilityChecker({ colors }: Props) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(true);

  const checkContrast = (color1: string, color2: string) => {
    return ColorAccessibility.getContrastRatio(color1, color2);
  };

  const simulateColorBlindness = (color: string) => {
    return ColorAccessibility.simulateColorBlindness(color);
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
    <div className="accessibility-checker">
      <div 
        className="accessibility-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>Accessibility Analysis</h3>
        <button 
          className={`collapse-button ${isExpanded ? 'expanded' : ''}`}
          aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
        >
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 4L6 8L10 4" />
          </svg>
        </button>
      </div>
      
      <div className={`accessibility-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="accessibility-section">
          <div className="section-header">
            <h3>
              Color Blindness Simulation
              <span 
                className="info-icon"
                onMouseEnter={(e) => handleTooltipEnter(e, 'colorBlindness')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                ℹ️
              </span>
            </h3>
          </div>
          <div className="color-simulation-grid">
            {colors.map((color, index) => {
              const simulation = simulateColorBlindness(color);
              return (
                <div key={index} className="simulation-item">
                  <div className="original-color">
                    <div className="color-preview" style={{ backgroundColor: color }} />
                    <span>Original</span>
                  </div>
                  <div className="simulation-types">
                    <div className="simulation">
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: simulation.protanopia }}
                      />
                      <span>Protanopia</span>
                    </div>
                    <div className="simulation">
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: simulation.deuteranopia }}
                      />
                      <span>Deuteranopia</span>
                    </div>
                    <div className="simulation">
                      <div 
                        className="color-preview" 
                        style={{ backgroundColor: simulation.tritanopia }}
                      />
                      <span>Tritanopia</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="accessibility-section">
          <div className="section-header">
            <h3>
              Contrast Ratios (WCAG)
              <span 
                className="info-icon"
                onMouseEnter={(e) => handleTooltipEnter(e, 'contrastRatio')}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                ℹ️
              </span>
            </h3>
          </div>
          <div className="contrast-grid">
            {colors.map((color1, i) => (
              <div key={i} className="contrast-row">
                {colors.map((color2, j) => {
                  const contrast = checkContrast(color1, color2);
                  return (
                    <div 
                      key={j} 
                      className={`contrast-cell ${
                        contrast.AAA ? 'aaa' : contrast.AA ? 'aa' : 'fail'
                      }`}
                    >
                      <div 
                        className="contrast-preview"
                        style={{
                          backgroundColor: color1,
                          color: color2
                        }}
                      >
                        Aa
                      </div>
                      <span className="contrast-ratio">{contrast.ratio}:1</span>
                    </div>
                  );
                })}
              </div>
            ))}
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
    </div>
  );
} 