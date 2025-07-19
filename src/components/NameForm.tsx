import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Loader2, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

import ThemeSelector from "./ThemeSelector";
import MediaControlsConfig from "./MediaControlsConfig";
import VideoEffectsConfig from "./VideoEffectsConfig";

interface NameFormProps {
  onSubmit: (
    name: string, 
    startWithVideo: boolean, 
    startWithAudio: boolean,
    initialBlurEnabled: boolean,
    initialBackground: string | null
  ) => void;
  onValidationRequired?: (userData: {
    name: string;
    startWithVideo: boolean;
    startWithAudio: boolean;
    initialBlurEnabled: boolean;
    initialBackground: string | null;
  }) => Promise<boolean>;
  isValidating?: boolean;
  validationError?: string | null;
}

const backgrounds = [
  { id: 'none', name: 'Sin fondo', url: null },
  { id: 'office', name: 'Oficina', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop' },
  { id: 'nature', name: 'Naturaleza', url: 'https://images.unsplash.com/photo-1506744140801-50d01698950b?w=1920&h=1080&fit=crop' },
  { id: 'mountains', name: 'Montañas', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop' },
  { id: 'workspace', name: 'Espacio de trabajo', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop' },
];

const NameForm = ({ onSubmit, onValidationRequired, isValidating = false, validationError = null }: NameFormProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [name, setName] = useState("");
  const [startWithVideo, setStartWithVideo] = useState(true);
  const [startWithAudio, setStartWithAudio] = useState(true);
  const [initialBlurEnabled, setInitialBlurEnabled] = useState(false);
  const [initialBackground, setInitialBackground] = useState<string | null>(null);
  
  

  const handleBackgroundChange = (backgroundId: string) => {
    const selectedBg = backgrounds.find(bg => bg.id === backgroundId);
    setInitialBackground(selectedBg?.url || null);
    // Si se selecciona un fondo, desactivar el blur
    if (selectedBg?.url) {
      setInitialBlurEnabled(false);
    }
  };

  const handleBlurToggle = () => {
    const newBlurState = !initialBlurEnabled;
    setInitialBlurEnabled(newBlurState);
    // Si se activa el blur, desactivar el fondo personalizado
    if (newBlurState) {
      setInitialBackground(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Usar nombre por defecto si no se ingresa
    const finalName = name.trim() || "Usuario";
    
    // Llamar directamente sin validaciones
    onSubmit(finalName, startWithVideo, startWithAudio, initialBlurEnabled, initialBackground);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${themeClasses.background} transition-all duration-300 relative`}>
      <ThemeSelector />

      <div className={`${themeClasses.cardBackground} backdrop-blur-sm border ${themeClasses.border} rounded-2xl p-8 w-full max-w-md mx-4`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-2xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Bienvenido a la videollamada</h2>
          <p className={themeClasses.textSecondary}>Configura tu entrada a la llamada</p>
        </div>

        {/* Error de validación de la API */}
        {validationError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 text-sm font-medium">Error de acceso</p>
            </div>
            <p className="text-red-300 text-sm mt-1">{validationError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className={`${themeClasses.textPrimary} text-sm font-medium`}>
              Tu nombre (opcional)
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Escribe tu nombre aquí..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 ${themeClasses.cardBackground} border ${themeClasses.border} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:border-green-500 focus:ring-green-500`}
              disabled={isValidating}
            />
          </div>

          <div className="space-y-4">
            <Label className={`${themeClasses.textPrimary} text-sm font-medium`}>
              Configuración inicial
            </Label>
            
            <MediaControlsConfig
              startWithVideo={startWithVideo}
              startWithAudio={startWithAudio}
              onToggleVideo={() => setStartWithVideo(!startWithVideo)}
              onToggleAudio={() => setStartWithAudio(!startWithAudio)}
              disabled={isValidating}
            />

            <VideoEffectsConfig
              initialBlurEnabled={initialBlurEnabled}
              initialBackground={initialBackground}
              onToggleBlur={handleBlurToggle}
              onBackgroundChange={handleBackgroundChange}
              disabled={isValidating}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3"
            disabled={isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Conectando a videollamada...
              </>
            ) : (
              'Iniciar llamada'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NameForm;
