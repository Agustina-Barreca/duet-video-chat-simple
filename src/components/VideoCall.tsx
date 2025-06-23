
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
import { useZoomVideoSDK } from "../hooks/useZoomVideoSDK";

const VideoCall = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const {
    isCallActive,
    setIsCallActive,
    userName,
    setUserName,
    showNameForm,
    setShowNameForm,
    resetCallState
  } = useVideoCallState();

  const {
    isValidatingAccess,
    accessValidationError,
    handleAccessValidation
  } = useAccessValidation();

  const {
    isConnected,
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    isRemoteVideoEnabled,
    isRemoteAudioEnabled,
    isBackgroundBlurred,
    connectionError,
    localVideoRef,
    remoteVideoRef,
    toggleVideo,
    toggleAudio,
    toggleBlurBackground,
    leaveSession
  } = useZoomVideoSDK();

  const handleNameSubmit = async (
    name: string, 
    startWithVideo: boolean, 
    startWithAudio: boolean,
    initialBlurEnabled: boolean,
    initialBackground: string | null
  ) => {
    console.log('Iniciando proceso de validación de acceso...');
    const userData = {
      name,
      startWithVideo,
      startWithAudio,
      initialBlurEnabled,
      initialBackground
    };

    const accessGranted = await handleAccessValidation(userData);
    
    if (accessGranted) {
      console.log('✅ Acceso aprobado. Iniciando videollamada...');
      setUserName(name);
      setShowNameForm(false);
      setIsCallActive(true); // Esta es la línea clave que faltaba
      console.log(`Llamada iniciada con configuración: Video: ${startWithVideo ? 'activado' : 'desactivado'}, Audio: ${startWithAudio ? 'activado' : 'silenciado'}, Blur: ${initialBlurEnabled ? 'activado' : 'desactivado'}, Background: ${initialBackground || 'ninguno'}`);
    }
    // Si falla, el error se mostrará automáticamente en el NameForm
  };

  const handleEndCall = async () => {
    await leaveSession();
    setIsCallActive(false);
    console.log("Llamada terminada");
  };

  const toggleMute = async () => {
    await toggleAudio();
    console.log("Audio", isLocalAudioEnabled ? "silenciado" : "activado");
  };

  const toggleVideoLocal = async () => {
    await toggleVideo();
    console.log("Video", isLocalVideoEnabled ? "desactivado" : "activado");
  };

  const toggleBlur = async () => {
    await toggleBlurBackground();
    console.log("Blur background:", !isBackgroundBlurred ? "activado" : "desactivado");
  };

  const handleBackgroundChange = (background: string | null) => {
    // Por ahora solo manejamos blur, el fondo personalizado lo implementaremos después
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
        validationError={accessValidationError || connectionError}
      />
    );
  }

  // Mostrar pantalla de llamada finalizada si no está activa O no está conectado
  if (!isCallActive || !isConnected) {
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
        isRemoteAudioActive={isRemoteAudioEnabled}
        isRemoteVideoActive={isRemoteVideoEnabled}
      />
      
      {/* Video principal (remoto) - con z-index bajo para evitar superposiciones */}
      <div className="relative z-0">
        <div className="absolute inset-0 p-8 pt-32 pb-24 flex items-center justify-center">
          <div 
            ref={remoteVideoRef}
            className={`w-full max-w-4xl h-96 rounded-2xl overflow-hidden shadow-2xl ${themeClasses.cardBackground} ${themeClasses.border} border flex items-center justify-center`}
          >
            {!isRemoteVideoEnabled && (
              <div className="text-center">
                <div className={`w-32 h-32 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-4xl text-white">👤</span>
                </div>
                <h3 className={`text-2xl font-semibold ${themeClasses.textPrimary}`}>Usuario Remoto</h3>
                <p className={`${themeClasses.textSecondary}`}>Video desactivado</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Video local flotante - con z-index medio */}
      <div className="relative z-10">
        <div className="fixed bottom-32 right-8 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl">
          <div 
            ref={localVideoRef}
            className={`w-full h-full ${themeClasses.cardBackground} flex items-center justify-center`}
          >
            {!isLocalVideoEnabled && (
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto`}>
                  <span className="text-lg text-white">👤</span>
                </div>
                {userName && (
                  <p className={`text-xs font-medium mt-1 ${themeClasses.textPrimary}`}>{userName}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Controles de llamada - con z-index alto para estar siempre visibles */}
      <div className="relative z-20">
        <CallControls 
          isMuted={!isLocalAudioEnabled}
          isVideoOff={!isLocalVideoEnabled}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideoLocal}
          onEndCall={handleEndCall}
          isBlurEnabled={isBackgroundBlurred}
          currentBackground={null}
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
