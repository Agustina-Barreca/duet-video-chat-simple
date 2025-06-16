
import RemoteVideo from "./RemoteVideo";
import LocalVideo from "./LocalVideo";
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import NameForm from "./NameForm";
import ThemeSelector from "./ThemeSelector";
import FloatingChat from "./FloatingChat";
import CallEndScreen from "./CallEndScreen";
import { useTheme } from "../contexts/ThemeContext";
import { useVideoCallState } from "../hooks/useVideoCallState";
import { useAccessValidation } from "../hooks/useAccessValidation";

const VideoCall = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const {
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
    isCallActive,
    setIsCallActive,
    userName,
    setUserName,
    showNameForm,
    setShowNameForm,
    isBlurEnabled,
    setIsBlurEnabled,
    currentBackground,
    setCurrentBackground,
    isRemoteAudioActive,
    isRemoteVideoActive,
    resetCallState
  } = useVideoCallState();

  const {
    isValidatingAccess,
    accessValidationError,
    handleAccessValidation
  } = useAccessValidation();

  const handleNameSubmit = (
    name: string, 
    startWithVideo: boolean, 
    startWithAudio: boolean,
    initialBlurEnabled: boolean,
    initialBackground: string | null
  ) => {
    console.log('✅ Acceso aprobado. Iniciando videollamada...');
    setUserName(name);
    setShowNameForm(false);
    // Configurar estados iniciales basados en las preferencias del usuario
    setIsVideoOff(!startWithVideo);
    setIsMuted(!startWithAudio);
    setIsBlurEnabled(initialBlurEnabled);
    setCurrentBackground(initialBackground);
    console.log(`Llamada iniciada - Video: ${startWithVideo ? 'activado' : 'desactivado'}, Audio: ${startWithAudio ? 'activado' : 'silenciado'}, Blur: ${initialBlurEnabled ? 'activado' : 'desactivado'}, Background: ${initialBackground || 'ninguno'}`);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    console.log("Llamada terminada");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log("Audio", isMuted ? "activado" : "silenciado");
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    console.log("Video", isVideoOff ? "activado" : "desactivado");
  };

  const toggleBlur = () => {
    setIsBlurEnabled(!isBlurEnabled);
    // Si se activa el blur, desactivar el fondo personalizado
    if (!isBlurEnabled) {
      setCurrentBackground(null);
    }
    console.log("Blur background:", !isBlurEnabled ? "activado" : "desactivado");
  };

  const handleBackgroundChange = (background: string | null) => {
    setCurrentBackground(background);
    // Si se selecciona un fondo personalizado, desactivar el blur
    if (background) {
      setIsBlurEnabled(false);
    }
    console.log('Background changed to:', background || 'none');
  };

  const startNewCall = () => {
    setIsCallActive(true);
    setShowNameForm(true);
    setUserName(null);
    resetCallState();
  };

  // Mostrar formulario de nombre si no se ha ingresado
  if (showNameForm) {
    return (
      <NameForm 
        onSubmit={handleNameSubmit}
        onValidationRequired={handleAccessValidation}
        isValidating={isValidatingAccess}
        validationError={accessValidationError}
      />
    );
  }

  if (!isCallActive) {
    return (
      <CallEndScreen 
        userName={userName}
        onStartNewCall={startNewCall}
      />
    );
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${themeClasses.background}`}>
      <ThemeSelector />
      
      <CallHeader 
        userName={userName} 
        isRemoteAudioActive={isRemoteAudioActive}
        isRemoteVideoActive={isRemoteVideoActive}
      />
      
      {/* Video principal (remoto) - con z-index bajo para evitar superposiciones */}
      <div className="relative z-0">
        <RemoteVideo isVideoOff={!isRemoteVideoActive} />
      </div>
      
      {/* Video local flotante - con z-index medio */}
      <div className="relative z-10">
        <LocalVideo 
          isVideoOff={isVideoOff} 
          userName={userName}
          isBlurEnabled={isBlurEnabled}
          currentBackground={currentBackground}
        />
      </div>
      
      {/* Controles de llamada - con z-index alto para estar siempre visibles */}
      <div className="relative z-20">
        <CallControls 
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onEndCall={handleEndCall}
          isBlurEnabled={isBlurEnabled}
          currentBackground={currentBackground}
          onToggleBlur={toggleBlur}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>
      
      {/* Chat flotante */}
      <FloatingChat />
    </div>
  );
};

export default VideoCall;
