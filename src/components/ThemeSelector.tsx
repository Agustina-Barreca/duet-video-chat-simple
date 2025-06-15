
import { Palette, Minimize, Moon } from "lucide-react";
import { useTheme, ThemeMode } from "../contexts/ThemeContext";

const ThemeSelector = () => {
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

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`${themeClasses.cardBackground} backdrop-blur-sm border ${themeClasses.border} rounded-lg p-2`}>
        <div className="flex flex-col gap-2">
          {themes.map(({ mode, name, icon: Icon, description }) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                themeMode === mode
                  ? `${themeClasses.buttonPrimary} ${themeClasses.textPrimary}`
                  : `${themeClasses.buttonSecondary} ${themeClasses.textSecondary} hover:${themeClasses.buttonPrimary.replace('bg-', 'hover:bg-')}`
              }`}
              title={description}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
