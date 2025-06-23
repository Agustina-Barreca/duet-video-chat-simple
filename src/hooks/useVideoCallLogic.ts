
import { useVideoCallState } from "./useVideoCallState";
import { useAccessValidation } from "./useAccessValidation";
import { useZoomVideoSDK } from "./useZoomVideoSDK";

export const useVideoCallLogic = () => {
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
      setIsCallActive(true);
      console.log(`Llamada iniciada con configuración: Video: ${startWithVideo ? 'activado' : 'desactivado'}, Audio: ${startWithAudio ? 'activado' : 'silenciado'}, Blur: ${initialBlurEnabled ? 'activado' : 'desactivado'}, Background: ${initialBackground || 'ninguno'}`);
    }
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
    console.log('Background changed to:', background || 'none');
  };

  const startNewCall = () => {
    setIsCallActive(true);
    setShowNameForm(true);
    setUserName(null);
    resetCallState();
  };

  return {
    // States
    isCallActive,
    userName,
    showNameForm,
    isConnected,
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    isRemoteVideoEnabled,
    isRemoteAudioEnabled,
    isBackgroundBlurred,
    isValidatingAccess,
    accessValidationError,
    connectionError,
    localVideoRef,
    remoteVideoRef,
    
    // Actions
    handleNameSubmit,
    handleEndCall,
    toggleMute,
    toggleVideoLocal,
    toggleBlur,
    handleBackgroundChange,
    startNewCall
  };
};
