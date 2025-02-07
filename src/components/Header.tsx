import { ThemeToggle } from './ThemeToggle';
import '../styles/Header.css';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">
            <svg className="logo-icon" width="36" height="36" viewBox="0 0 36 36">
              {/* Main circle */}
              <circle className="logo-ring" cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" fill="none"/>
              
              {/* Color palette icon */}
              <g className="logo-palette" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8C12.477 8 8 12.477 8 18C8 23.523 12.477 28 18 28C19.5 28 20 27.5 20 26C20 25.5 19.9 25.1 19.7 24.8C19.5 24.5 19.4 24.1 19.4 23.7C19.4 22.9 20 22.3 20.8 22.3H22C25.3 22.3 28 19.6 28 16.3C28 11.7 23.5 8 18 8Z"/>
                <circle cx="15" cy="16" r="2" fill="var(--logo-accent-1)"/>
                <circle cx="21" cy="16" r="2" fill="var(--logo-accent-2)"/>
                <circle cx="18" cy="20" r="2" fill="var(--logo-accent-3)"/>
              </g>
            </svg>
          </div>
          <div className="title-group">
            <h1>Palette Picker</h1>
            <p className="subtitle">Create beautiful color schemes</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
} 