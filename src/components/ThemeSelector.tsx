
import { Palette, Minimize, Moon } from "lucide-react";
import { useTheme, ThemeMode } from "../contexts/ThemeContext";

interface ThemeSelectorProps {
  variant?: 'standalone' | 'inline';
}

const ThemeSelector = ({ variant = 'standalone' }: ThemeSelectorProps) => {
  const { themeMode, setThemeMode, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const themes = [
    { 
      mode: 'rainbow' as ThemeMode, 
      name: 'Rainbow', 
      icon: Palette,
      description: 'Colorido y vibrante'
    },
    { 
      mode: 'minimalist' as ThemeMode, 
      name: 'Minimalista', 
      icon: Minimize,
      description: 'Limpio y simple'
    },
    { 
      mode: 'dark' as ThemeMode, 
      name: 'Oscuro', 
      icon: Moon,
      description: 'Elegante y moderno'
    }
  ];

  const containerClasses = variant === 'standalone' 
    ? `${themeClasses.cardBackground} backdrop-blur-sm border ${themeClasses.border} rounded-lg p-2`
    : 'bg-black/30 backdrop-blur-sm rounded-lg p-2';

  const buttonClasses = variant === 'standalone'
    ? (isActive: boolean) => isActive
      ? `${themeClasses.buttonPrimary} ${themeClasses.textPrimary}`
      : `${themeClasses.buttonSecondary} ${themeClasses.textSecondary} hover:${themeClasses.buttonPrimary.replace('bg-', 'hover:bg-')}`
    : (isActive: boolean) => isActive
      ? 'bg-white/30 text-white'
      : 'text-white/70 hover:bg-white/20 hover:text-white';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col gap-2">
        {themes.map(({ mode, name, icon: Icon, description }) => (
          <button
            key={mode}
            onClick={() => setThemeMode(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${buttonClasses(themeMode === mode)}`}
            title={description}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden md:inline">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
