import { useState, useEffect } from 'react'
import { generateHarmoniousPalette } from './utils/colorUtils'
import { ImageUpload } from './components/ImageUpload'
import { ColorEditor } from './components/ColorEditor'
import { PaletteHistory } from './components/PaletteHistory'
import { ColorSchemeSettings } from './components/ColorSchemeSettings'
import { ColorGenerator } from './utils/colorGenerator'
import { AccessibilityChecker } from './components/AccessibilityChecker'
import './App.css'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import './styles/theme.css'
import './styles/components.css'
import { Header } from './components/Header'

interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  timestamp: number;
}

type HarmonyType = 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'square' | 'monochromatic';

interface HarmonyOption {
  value: HarmonyType;
  label: string;
  icon: string;
  description: string;
}

const harmonyOptions: HarmonyOption[] = [
  {
    value: 'complementary',
    label: 'Complementary',
    icon: '↔️',
    description: 'Colors opposite each other on the color wheel'
  },
  {
    value: 'analogous',
    label: 'Analogous',
    icon: '⟶',
    description: 'Colors next to each other on the color wheel'
  },
  {
    value: 'triadic',
    label: 'Triadic',
    icon: '△',
    description: 'Three colors equally spaced around the wheel'
  },
  {
    value: 'split-complementary',
    label: 'Split Complementary',
    icon: '⋎',
    description: 'Base color and two colors adjacent to its complement'
  },
  {
    value: 'square',
    label: 'Square',
    icon: '□',
    description: 'Four colors evenly spaced around the wheel'
  },
  {
    value: 'monochromatic',
    label: 'Monochromatic',
    icon: '◯',
    description: 'Different shades and tints of one color'
  }
];

function AppContent() {
  const { theme } = useTheme();
  // State for storing the current color palette
  const [colors, setColors] = useState<string[]>([]);
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('complementary');
  const [activeTab, setActiveTab] = useState('harmony');
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [copying, setCopying] = useState<number | null>(null);
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
    const saved = localStorage.getItem('savedPalettes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [paletteName, setPaletteName] = useState('');
  const [schemeSettings, setSchemeSettings] = useState<any>({
    colorSpace: 'lch',
    baseHue: Math.floor(Math.random() * 360),
    hueRange: 30,
    minLightness: 20,
    maxLightness: 80,
    minChroma: 20,
    maxChroma: 100,
    distribution: 'even'
  });
  
  // Update localStorage when savedPalettes changes
  useEffect(() => {
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
  }, [savedPalettes]);

  const handleColorChange = (newColor: string) => {
    if (selectedColor !== null) {
      const newColors = [...colors];
      newColors[selectedColor] = newColor;
      setColors(newColors);
    }
  };

  const handleColorClick = (index: number) => {
    if (activeTab === 'edit') {
      setSelectedColor(index);
    } else {
      copyToClipboard(colors[index], index);
    }
  };

  const copyToClipboard = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopying(index);
    setTimeout(() => setCopying(null), 1000);
  };

  const handleSavePalette = () => {
    if (!paletteName.trim()) return;

    const newPalette: SavedPalette = {
      id: Date.now().toString(),
      name: paletteName.trim(),
      colors: [...colors],
      timestamp: Date.now(),
    };

    setSavedPalettes([...savedPalettes, newPalette]);
    setShowSaveDialog(false);
    setPaletteName('');
  };

  const handleDeletePalette = (id: string) => {
    setSavedPalettes(savedPalettes.filter(palette => palette.id !== id));
  };

  const generateNewPalette = () => {
    if (activeTab === 'harmony') {
      const newColors = generateHarmoniousPalette(harmonyType);
      setColors(newColors);
    }
  };

  // Watch for schemeSettings changes and generate new palette
  useEffect(() => {
    if (activeTab === 'harmony') {
      const newColors = ColorGenerator.generateScheme(schemeSettings, 5);
      setColors(newColors);
    }
  }, [schemeSettings]);

  return (
    <div className="App" data-theme={theme}>
      <Header />
      <main className="main-content">
        <div className="tab-controls">
          <button 
            className={activeTab === 'harmony' ? 'active' : ''}
            onClick={() => setActiveTab('harmony')}
          >
            Color Harmony
          </button>
          <button 
            className={activeTab === 'image' ? 'active' : ''}
            onClick={() => setActiveTab('image')}
          >
            Extract from Image
          </button>
          <button 
            className={activeTab === 'edit' ? 'active' : ''}
            onClick={() => setActiveTab('edit')}
          >
            Edit Colors
          </button>
          {savedPalettes.length > 0 && (
            <button 
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          )}
        </div>

        {activeTab === 'harmony' && (
          <>
            <div className="harmony-controls">
              <div className="harmony-options">
                {harmonyOptions.map((option) => (
                  <label 
                    key={option.value}
                    className={`harmony-option ${harmonyType === option.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="harmonyType"
                      value={option.value}
                      checked={harmonyType === option.value}
                      onChange={(e) => setHarmonyType(e.target.value as HarmonyType)}
                    />
                    <div className="option-content">
                      <span className="option-icon">{option.icon}</span>
                      <div className="option-text">
                        <span className="option-label">{option.label}</span>
                        <span className="option-description">{option.description}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <ColorSchemeSettings
              settings={schemeSettings}
              onSettingsChange={setSchemeSettings}
            />
          </>
        )}

        {activeTab === 'image' && (
          <ImageUpload onPaletteGenerated={setColors} />
        )}

        <div className="palette-container">
          {colors.map((color, index) => (
            <div
              key={index}
              className={`color-block ${copying === index ? 'copied' : ''} ${selectedColor === index ? 'selected' : ''}`}
              style={{ 
                backgroundColor: color,
                '--index': index
              } as React.CSSProperties}
              onClick={() => handleColorClick(index)}
            >
              <div className="color-info">
                <span>{color}</span>
                <div className="color-actions">
                  <small>{activeTab === 'edit' ? 'Click to edit' : 'Click to copy'}</small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeTab === 'edit' && selectedColor !== null && (
          <div className="editor-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedColor(null);
            }
          }}>
            <ColorEditor
              color={colors[selectedColor]}
              onColorChange={handleColorChange}
              onClose={() => setSelectedColor(null)}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <PaletteHistory
            savedPalettes={savedPalettes}
            onPaletteSelect={setColors}
            onPaletteDelete={handleDeletePalette}
          />
        )}

        <div className="controls">
          {activeTab === 'harmony' && (
            <button 
              className="generate-button"
              onClick={generateNewPalette}
            >
              Generate New Palette
            </button>
          )}
          <button 
            className="save-button"
            onClick={() => setShowSaveDialog(true)}
          >
            Save Palette
          </button>
        </div>

        {/* Add back the AccessibilityChecker */}
        {colors.length > 0 && (
          <AccessibilityChecker colors={colors} />
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="save-dialog-overlay">
            <div className="save-dialog">
              <h3>Save Palette</h3>
              <input
                type="text"
                placeholder="Enter palette name"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                autoFocus
              />
              <div className="dialog-buttons">
                <button onClick={handleSavePalette}>Save</button>
                <button 
                  className="cancel-button"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setPaletteName('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App
