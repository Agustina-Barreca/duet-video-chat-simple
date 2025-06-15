
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mic, MicOff, Video, VideoOff, Focus, Image } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NameFormProps {
  onSubmit: (
    name: string, 
    startWithVideo: boolean, 
    startWithAudio: boolean,
    initialBlurEnabled: boolean,
    initialBackground: string | null
  ) => void;
}

const backgrounds = [
  { id: 'none', name: 'Sin fondo', url: null },
  { id: 'office', name: 'Oficina', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop' },
  { id: 'nature', name: 'Naturaleza', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop' },
  { id: 'mountains', name: 'Montañas', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop' },
  { id: 'workspace', name: 'Espacio de trabajo', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop' },
];

const NameForm = ({ onSubmit }: NameFormProps) => {
  const [name, setName] = useState("");
  const [startWithVideo, setStartWithVideo] = useState(true);
  const [startWithAudio, setStartWithAudio] = useState(true);
  const [initialBlurEnabled, setInitialBlurEnabled] = useState(false);
  const [initialBackground, setInitialBackground] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), startWithVideo, startWithAudio, initialBlurEnabled, initialBackground);
    }
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Bienvenido a la videollamada</h2>
          <p className="text-gray-300">Configura tu entrada a la llamada</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-white text-sm font-medium">
              Tu nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Escribe tu nombre aquí..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div className="space-y-4">
            <Label className="text-white text-sm font-medium">
              Configuración inicial
            </Label>
            
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                {startWithVideo ? (
                  <Video className="w-5 h-5 text-green-400" />
                ) : (
                  <VideoOff className="w-5 h-5 text-red-400" />
                )}
                <span className="text-white text-sm">Cámara</span>
              </div>
              <button
                type="button"
                onClick={() => setStartWithVideo(!startWithVideo)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  startWithVideo ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  startWithVideo ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                {startWithAudio ? (
                  <Mic className="w-5 h-5 text-green-400" />
                ) : (
                  <MicOff className="w-5 h-5 text-red-400" />
                )}
                <span className="text-white text-sm">Micrófono</span>
              </div>
              <button
                type="button"
                onClick={() => setStartWithAudio(!startWithAudio)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  startWithAudio ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  startWithAudio ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Control de blur */}
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <Focus className={`w-5 h-5 ${initialBlurEnabled ? 'text-blue-400' : 'text-gray-400'}`} />
                <span className="text-white text-sm">Difuminar fondo</span>
              </div>
              <button
                type="button"
                onClick={handleBlurToggle}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  initialBlurEnabled ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  initialBlurEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Control de fondo virtual */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3 mb-3">
                <Image className={`w-5 h-5 ${initialBackground ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className="text-white text-sm">Fondo virtual</span>
              </div>
              <Select onValueChange={handleBackgroundChange} defaultValue="none">
                <SelectTrigger className="w-full h-9 text-xs bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar fondo" />
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
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3"
            disabled={!name.trim()}
          >
            Iniciar llamada
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NameForm;
