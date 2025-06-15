
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
      <div className="flex justify-center items-center space-x-4">
        {/* Control de micrófono */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={12}>
            <p>{isMuted ? "Activar micrófono" : "Silenciar micrófono"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Control de video */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
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
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={12}>
            <p>{isVideoOff ? "Activar cámara" : "Desactivar cámara"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Controles de efectos de video */}
        <VideoEffectsControls
          isBlurEnabled={isBlurEnabled}
          currentBackground={currentBackground}
          onToggleBlur={onToggleBlur}
          onBackgroundChange={onBackgroundChange}
        />

        {/* Botón para colgar */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={onEndCall}
              className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <PhoneOff className="w-7 h-7 text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" sideOffset={12}>
            <p>Finalizar llamada</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Indicadores de estado */}
      <div className="flex justify-center mt-4 space-x-6">
        {isMuted && (
          <div className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1">
            <MicOff className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">Silenciado</span>
          </div>
        )}
        {isVideoOff && (
          <div className="flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1">
            <VideoOff className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">Cámara off</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallControls;
