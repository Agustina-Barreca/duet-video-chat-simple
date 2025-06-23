
import NameForm from "./NameForm";
import CallEndScreen from "./CallEndScreen";
import VideoCallContainer from "./VideoCallContainer";
import { useVideoCallLogic } from "../hooks/useVideoCallLogic";

const VideoCall = () => {
  const {
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
    handleNameSubmit,
    handleEndCall,
    toggleMute,
    toggleVideoLocal,
    toggleBlur,
    handleBackgroundChange,
    startNewCall
  } = useVideoCallLogic();

  // Mostrar formulario de nombre si no se ha ingresado
  if (showNameForm) {
    return (
      <NameForm 
        onSubmit={handleNameSubmit}
        onValidationRequired={handleNameSubmit}
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
    <VideoCallContainer
      userName={userName}
      isLocalVideoEnabled={isLocalVideoEnabled}
      isLocalAudioEnabled={isLocalAudioEnabled}
      isRemoteVideoEnabled={isRemoteVideoEnabled}
      isRemoteAudioEnabled={isRemoteAudioEnabled}
      isBackgroundBlurred={isBackgroundBlurred}
      localVideoRef={localVideoRef}
      remoteVideoRef={remoteVideoRef}
      onToggleMute={toggleMute}
      onToggleVideo={toggleVideoLocal}
      onEndCall={handleEndCall}
      onToggleBlur={toggleBlur}
      onBackgroundChange={handleBackgroundChange}
    />
  );
};

export default VideoCall;
