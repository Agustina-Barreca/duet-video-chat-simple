
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import VideoEffectsControls from "./VideoEffectsControls";

interface CallControlsProps {
  isMuted: boolean;
  isVideoOff: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  isBlurEnabled: boolean;
  currentBackground: string | null;
  onToggleBlur: () => void;
  onBackgroundChange: (background: string | null) => void;
}

const CallControls = ({ 
  isMuted, 
  isVideoOff, 
  onToggleMute, 
  onToggleVideo, 
  onEndCall,
  isBlurEnabled,
  currentBackground,
  onToggleBlur,
  onBackgroundChange
}: CallControlsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
      <div className="flex justify-center items-center space-x-4 pointer-events-auto">
        {/* Control de micrófono */}
        <Tooltip text={isMuted ? "Activar micrófono" : "Silenciar micrófono"} position="top">
          <button
            onClick={onToggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>
        </Tooltip>

        {/* Control de video */}
        <Tooltip text={isVideoOff ? "Activar cámara" : "Desactivar cámara"} position="top">
          <button
            onClick={onToggleVideo}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isVideoOff 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
            }`}
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>
        </Tooltip>

        {/* Controles de efectos de video */}
        <VideoEffectsControls
          isBlurEnabled={isBlurEnabled}
          currentBackground={currentBackground}
          onToggleBlur={onToggleBlur}
          onBackgroundChange={onBackgroundChange}
        />

        {/* Botón para colgar */}
        <Tooltip text="Finalizar llamada" position="top">
          <button
            onClick={onEndCall}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default CallControls;
