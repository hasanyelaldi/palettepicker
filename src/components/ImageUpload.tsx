import { useState, useRef } from 'react';

interface ImageUploadProps {
  onPaletteGenerated: (colors: string[]) => void;
}

export function ImageUpload({ onPaletteGenerated }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Create an image element to draw to canvas
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Resize image to manageable size
      const MAX_SIZE = 100;
      const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      
      // Simple color quantization
      const colors: { [key: string]: number } = {};
      for (let i = 0; i < imageData.length; i += 4) {
        const r = Math.round(imageData[i] / 16) * 16;
        const g = Math.round(imageData[i + 1] / 16) * 16;
        const b = Math.round(imageData[i + 2] / 16) * 16;
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }

      // Sort colors by frequency and get top 5
      const palette = Object.entries(colors)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([color]) => color);

      onPaletteGenerated(palette);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="image-upload-container">
      {previewUrl ? (
        <div className="image-preview">
          <img 
            src={previewUrl} 
            alt="Uploaded preview" 
            width={'150px'} 
            height={'150px'}
            style={{objectFit: 'cover'}}
          />
          <button 
            className="remove-image"
            onClick={() => setPreviewUrl(null)}
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">📁</div>
          <p>Drop an image here or click to upload</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden-input"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
} 