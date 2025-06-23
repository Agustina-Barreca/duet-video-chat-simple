
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import ThemeSelector from "./ThemeSelector";
import FloatingChat from "./FloatingChat";
import VideoDisplay from "./VideoDisplay";
import { useTheme } from "../contexts/ThemeContext";

interface VideoCallContainerProps {
  userName: string | null;
  isLocalVideoEnabled: boolean;
  isLocalAudioEnabled: boolean;
  isRemoteVideoEnabled: boolean;
  isRemoteAudioEnabled: boolean;
  isBackgroundBlurred: boolean;
  localVideoRef: React.RefObject<HTMLDivElement>;
  remoteVideoRef: React.RefObject<HTMLDivElement>;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onToggleBlur: () => void;
  onBackgroundChange: (background: string | null) => void;
}

const VideoCallContainer = ({
  userName,
  isLocalVideoEnabled,
  isLocalAudioEnabled,
  isRemoteVideoEnabled,
  isRemoteAudioEnabled,
  isBackgroundBlurred,
  localVideoRef,
  remoteVideoRef,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleBlur,
  onBackgroundChange
}: VideoCallContainerProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className={`relative min-h-screen overflow-hidden ${themeClasses.background}`}>
      <ThemeSelector />
      
      <CallHeader 
        userName={userName} 
        isRemoteAudioActive={isRemoteAudioEnabled}
        isRemoteVideoActive={isRemoteVideoEnabled}
      />
      
      <VideoDisplay
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        isLocalVideoEnabled={isLocalVideoEnabled}
        isRemoteVideoEnabled={isRemoteVideoEnabled}
        userName={userName}
      />
      
      {/* Controles de llamada - con z-index alto para estar siempre visibles */}
      <div className="relative z-20">
        <CallControls 
          isMuted={!isLocalAudioEnabled}
          isVideoOff={!isLocalVideoEnabled}
          onToggleMute={onToggleMute}
          onToggleVideo={onToggleVideo}
          onEndCall={onEndCall}
          isBlurEnabled={isBackgroundBlurred}
          currentBackground={null}
          onToggleBlur={onToggleBlur}
          onBackgroundChange={onBackgroundChange}
        />
      </div>
      
      {/* Chat flotante */}
      <FloatingChat />
    </div>
  );
};

export default VideoCallContainer;
