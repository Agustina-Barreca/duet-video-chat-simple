
import { useState } from "react";
import { Focus, Image, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";

interface LocalVideoControlsProps {
  onBlurToggle: (enabled: boolean) => void;
  onBackgroundChange: (background: string | null) => void;
  isBlurEnabled: boolean;
  currentBackground: string | null;
}

const backgrounds = [
  { id: 'none', name: 'Sin fondo', url: null },
  { id: 'office', name: 'Oficina', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop' },
  { id: 'nature', name: 'Naturaleza', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop' },
  { id: 'mountains', name: 'Montañas', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop' },
  { id: 'workspace', name: 'Espacio de trabajo', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop' },
];

const LocalVideoControls = ({ 
  onBlurToggle, 
  onBackgroundChange, 
  isBlurEnabled, 
  currentBackground 
}: LocalVideoControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleBlurToggle = (pressed: boolean) => {
    onBlurToggle(pressed);
  };

  const handleBackgroundChange = (backgroundId: string) => {
    const selectedBg = backgrounds.find(bg => bg.id === backgroundId);
    onBackgroundChange(selectedBg?.url || null);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="absolute top-1 left-1 md:top-2 md:left-2 w-6 h-6 md:w-8 md:h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm">
          <Image className="w-3 h-3 md:w-4 md:h-4 text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" side="left" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Efectos de video</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Focus className="w-4 h-4" />
                <span className="text-sm">Difuminar fondo</span>
              </div>
              <Toggle
                pressed={isBlurEnabled}
                onPressedChange={handleBlurToggle}
                size="sm"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span className="text-sm">Cambiar fondo</span>
              </div>
              <Select onValueChange={handleBackgroundChange} defaultValue="none">
                <SelectTrigger className="w-full h-8 text-xs">
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LocalVideoControls;
