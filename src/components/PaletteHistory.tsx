interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  timestamp: number;
}

interface PaletteHistoryProps {
  savedPalettes: SavedPalette[];
  onPaletteSelect: (colors: string[]) => void;
  onPaletteDelete: (id: string) => void;
}

export function PaletteHistory({ savedPalettes, onPaletteSelect, onPaletteDelete }: PaletteHistoryProps) {
  return (
    <div className="palette-history">
      {savedPalettes.length === 0 ? (
        <p className="no-palettes">No saved palettes yet</p>
      ) : (
        savedPalettes
          .sort((a, b) => b.timestamp - a.timestamp)
          .map((palette) => (
            <div key={palette.id} className="saved-palette">
              <div className="palette-info">
                <h3>{palette.name}</h3>
                <small>
                  {new Date(palette.timestamp).toLocaleDateString()} at{' '}
                  {new Date(palette.timestamp).toLocaleTimeString()}
                </small>
              </div>
              <div className="mini-palette">
                {palette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="mini-color"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="palette-actions">
                <button
                  className="load-button"
                  onClick={() => onPaletteSelect(palette.colors)}
                >
                  Load
                </button>
                <button
                  className="delete-button"
                  onClick={() => onPaletteDelete(palette.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
} 