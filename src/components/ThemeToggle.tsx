import { useTheme } from '../context/ThemeContext';
import '../styles/ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`theme-toggle ${theme}`}
      aria-label="Toggle theme"
    >
      <span className="icon">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
    </button>
  );
}