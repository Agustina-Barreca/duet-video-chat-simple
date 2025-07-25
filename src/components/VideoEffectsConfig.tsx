
import { Focus, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "../contexts/ThemeContext";

interface VideoEffectsConfigProps {
  initialBlurEnabled: boolean;
  initialBackground: string | null;
  onToggleBlur: () => void;
  onBackgroundChange: (backgroundId: string) => void;
  disabled?: boolean;
}

const backgrounds = [
  { id: 'none', name: 'No background', url: null },
  { id: 'office', name: 'Office', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop' },
  { id: 'nature', name: 'Nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop' },
  { id: 'mountains', name: 'Mountains', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop' },
  { id: 'workspace', name: 'Workspace', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop' },
];

const VideoEffectsConfig = ({
  initialBlurEnabled,
  initialBackground,
  onToggleBlur,
  onBackgroundChange,
  disabled = false
}: VideoEffectsConfigProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <>
      <div className={`flex items-center justify-between ${themeClasses.buttonSecondary} rounded-lg p-3`}>
        <div className="flex items-center space-x-3">
          <Focus className={`w-5 h-5 ${initialBlurEnabled ? 'text-blue-400' : 'text-gray-400'}`} />
          <span className={`${themeClasses.textPrimary} text-sm`}>Blur background</span>
        </div>
        <button
          type="button"
          onClick={onToggleBlur}
          disabled={disabled}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            initialBlurEnabled ? 'bg-blue-500' : 'bg-gray-600'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
            initialBlurEnabled ? 'translate-x-7' : 'translate-x-1'
          }`}></div>
        </button>
      </div>

      <div className={`${themeClasses.buttonSecondary} rounded-lg p-3`}>
        <div className="flex items-center space-x-3 mb-3">
          <Image className={`w-5 h-5 ${initialBackground ? 'text-purple-400' : 'text-gray-400'}`} />
          <span className={`${themeClasses.textPrimary} text-sm`}>Virtual background</span>
        </div>
        <Select onValueChange={onBackgroundChange} defaultValue="none" disabled={disabled}>
          <SelectTrigger className={`w-full h-9 text-xs ${themeClasses.cardBackground} border ${themeClasses.border} ${themeClasses.textPrimary} ${disabled ? 'opacity-50' : ''}`}>
            <SelectValue placeholder="Select background" />
          </SelectTrigger>
          <SelectContent>
            {backgrounds.map((bg) => (
              <SelectItem key={bg.id} value={bg.id} className="text-xs">
                {bg.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default VideoEffectsConfig;
