import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import '../styles/Header.css';

export function Header() {
  const { theme } = useTheme();

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1>Palette Picker</h1>
          <p className="subtitle">Create beautiful color schemes</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
} 