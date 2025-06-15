
import { Palette, Minimize, Moon, Settings, Briefcase } from "lucide-react";
import { useTheme, ThemeMode } from "../contexts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      mode: 'professional' as ThemeMode, 
      name: 'Professional', 
      icon: Briefcase,
      description: 'Elegante y profesional'
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
      description: 'Moderno y elegante'
    }
  ];

  const currentTheme = themes.find(theme => theme.mode === themeMode);
  const CurrentIcon = currentTheme?.icon || Settings;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`${themeClasses.cardBackground} backdrop-blur-sm border ${themeClasses.border} rounded-full p-3 hover:scale-105 transition-all duration-200 shadow-lg`}
            title="Cambiar tema"
          >
            <CurrentIcon className={`w-5 h-5 ${themeClasses.textPrimary}`} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="top" 
          align="start"
          className={`${themeClasses.cardBackground} border ${themeClasses.border} backdrop-blur-sm`}
        >
          {themes.map(({ mode, name, icon: Icon, description }) => (
            <DropdownMenuItem
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors ${
                themeMode === mode
                  ? `bg-blue-500/20 ${themeClasses.textPrimary} border-l-2 border-blue-400`
                  : `${themeClasses.textSecondary} hover:${themeClasses.buttonSecondary} hover:${themeClasses.textPrimary}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{name}</span>
                <span className="text-xs opacity-70">{description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSelector;
