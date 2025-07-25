
import { Focus, Image } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip } from "@/components/ui/tooltip";

interface VideoEffectsControlsProps {
  isBlurEnabled: boolean;
  currentBackground: string | null;
  onToggleBlur: () => void;
  onBackgroundChange: (background: string | null) => void;
}

const backgrounds = [
  { id: 'none', name: 'No background', url: null },
  { id: 'office', name: 'Office', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1920&h=1080&fit=crop' },
  { id: 'nature', name: 'Nature', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=1080&fit=crop' },
  { id: 'mountains', name: 'Mountains', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&h=1080&fit=crop' },
  { id: 'workspace', name: 'Workspace', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop' },
];

const VideoEffectsControls = ({ 
  isBlurEnabled, 
  currentBackground, 
  onToggleBlur, 
  onBackgroundChange 
}: VideoEffectsControlsProps) => {
  const handleBackgroundChange = (backgroundId: string) => {
    const selectedBg = backgrounds.find(bg => bg.id === backgroundId);
    onBackgroundChange(selectedBg?.url || null);
  };

  return (
    <div className="flex gap-2">
      {/* Blur control */}
      <Tooltip text={isBlurEnabled ? "Disable blur" : "Blur background"} position="top">
        <button
          onClick={onToggleBlur}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
            isBlurEnabled 
              ? 'bg-blue-500 hover:bg-blue-600' 
              : 'bg-gray-600/80 hover:bg-gray-500/80'
          }`}
        >
          <Focus className="w-5 h-5 text-white" />
        </button>
      </Tooltip>

      {/* Background control */}
      <Tooltip text="Change virtual background" position="top">
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  currentBackground 
                    ? 'bg-purple-500 hover:bg-purple-600' 
                    : 'bg-gray-600/80 hover:bg-gray-500/80'
                }`}
              >
                <Image className="w-5 h-5 text-white" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" side="top" align="center">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Change background</h4>
                <Select onValueChange={handleBackgroundChange} defaultValue="none">
                  <SelectTrigger className="w-full h-9 text-xs">
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
            </PopoverContent>
          </Popover>
        </div>
      </Tooltip>
    </div>
  );
};

export default VideoEffectsControls;
