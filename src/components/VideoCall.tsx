
import { useState, useEffect, useRef } from "react";
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import NameForm from "./NameForm";
import ThemeSelector from "./ThemeSelector";
import FloatingChat from "./FloatingChat";

import { useTheme } from "../contexts/ThemeContext";
import ZoomVideoSDK, { VideoQuality } from '@zoom/videosdk';

// Extend window interface to include Zoom configuration
declare global {
  interface Window {
    sessionName?: string;
    accesstoken?: string;
    sessionPassword?: string;
    userIdentity?: string;
  }
}

const VideoCall = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  // Estados locales
  const [showNameForm, setShowNameForm] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isValidatingAccess, setIsValidatingAccess] = useState(false);
  const [accessValidationError, setAccessValidationError] = useState<string | null>(null);
  
  // Estados del cliente Zoom
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(false);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(false);
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(false);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Refs para videos
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  
  // Estado del video remoto
  const [remoteVideoStatus, setRemoteVideoStatus] = useState<{
    userId: string | null;
    bVideoOn: boolean;
  }>({ userId: null, bVideoOn: false });

  // Inicializar cliente Zoom cuando se monte el componente
  useEffect(() => {
    if (!isCallActive || client) return;

    const initClient = async () => {
      try {
        console.log('Inicializando cliente Zoom...');
        const clientZoom = ZoomVideoSDK.createClient();
        await clientZoom.init('es-ES', 'Global', {
          patchJsMedia: true,
          enforceMultipleVideos: true,
          enforceVirtualBackground: true,
          stayAwake: true,
          leaveOnPageUnload: true
        });
        
        setClient(clientZoom);
        console.log('Cliente Zoom inicializado correctamente');
        
        // Inmediatamente intentar unirse a la sesión
        await joinSession(clientZoom);
      } catch (error) {
        console.error('Error inicializando cliente Zoom:', error);
        setConnectionError('Error al inicializar el cliente de videollamada');
      }
    };

    initClient();
  }, [isCallActive]);

  // Configurar eventos del cliente
  useEffect(() => {
    if (!client) return;

    const handleUserUpdated = (state: any) => {
      updateRemoteParticipantState(state);
    };

    client.on('user-updated', handleUserUpdated);

    return () => {
      client.off('user-updated', handleUserUpdated);
    };
  }, [client]);

  // Efecto para manejar video remoto
  useEffect(() => {
    if (remoteVideoStatus.bVideoOn) {
      if (!isRemoteVideoEnabled) {
        renderRemoteVideo({ action: 'Start', userId: remoteVideoStatus.userId });
      }
    } else if (remoteVideoStatus.bVideoOn === false) {
      renderRemoteVideo({ action: 'Stop', userId: remoteVideoStatus.userId });
    }
  }, [remoteVideoStatus]);

  // Unirse a la sesión
  const joinSession = async (currentClient: any) => {
    if (!currentClient) return false;

    try {
      console.log('Uniéndose a la sesión...');
      setConnectionError(null);
      
      await currentClient.join(
        window.sessionName,
        window.accesstoken,
        window.userIdentity,
        window.sessionPassword
      );
      
      setIsConnected(true);
      console.log('✅ Conectado exitosamente a la sesión');

      const mediaStream = currentClient.getMediaStream();
      const isSupportedHD = mediaStream.isSupportHDVideo();
      console.log(`HD ${isSupportedHD ? 'soportado' : 'no soportado'}`);

      // Iniciar video y audio
      await mediaStream.startVideo({ hd: isSupportedHD });
      await mediaStream.startAudio();
      setIsLocalAudioEnabled(true);

      await renderLocalVideo({ action: 'Start', userId: currentClient.getCurrentUserInfo().userId });
      
      return true;
    } catch (error) {
      console.error('Error uniéndose a la sesión:', error);
      setConnectionError('No se pudo conectar a la videollamada. Verifica tus permisos.');
      setIsConnected(false);
      return false;
    }
  };

  // Manejar estado del participante remoto
  const updateRemoteParticipantState = (state: any) => {
    if (!Array.isArray(state) || state.length === 0) return;
    if (!client?.getCurrentUserInfo()?.userId) return;

    const remoteParticipant = state.find(
      (status: any) => status.userId !== client.getCurrentUserInfo()?.userId &&
        status.userId !== null &&
        status.userId !== undefined &&
        status.userId !== ''
    );

    if (!remoteParticipant) return;

    if (remoteParticipant.hasOwnProperty('bVideoOn')) {
      const { userId, bVideoOn } = remoteParticipant;
      setRemoteVideoStatus({ userId, bVideoOn });
    }

    if (remoteParticipant.hasOwnProperty('muted')) {
      setIsRemoteAudioEnabled(!remoteParticipant.muted);
    }
  };

  // Función auxiliar para renderizar video
  const handleRenderVideo = async ({
    event,
    videoRef,
    setVideoEnabled
  }: any) => {
    if (!client) {
      console.error('Cliente no definido aún');
      return;
    }

    const mediaStream = client.getMediaStream();

    try {
      if (event.action === 'Start') {
        const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_720P);

        if (!videoRef.current) {
          console.warn('Video no disponible.');
          return;
        }

        videoRef.current.appendChild(userVideo);
        setVideoEnabled(true);
      } else if (event.action === 'Stop') {
        const elements = await mediaStream.detachVideo(event.userId);
        if (elements) {
          if (Array.isArray(elements)) {
            elements.forEach((el: any) => el.remove());
          } else {
            elements.remove();
          }
        }
        setVideoEnabled(false);
      }
    } catch (error) {
      console.error('Error en acción de renderizar video:', error);
    }
  };

  const renderLocalVideo = (event: any) => {
    handleRenderVideo({
      event,
      videoRef: localVideoRef,
      setVideoEnabled: setIsLocalVideoEnabled
    });
  };

  const renderRemoteVideo = (event: any) => {
    handleRenderVideo({
      event,
      videoRef: remoteVideoRef,
      setVideoEnabled: setIsRemoteVideoEnabled
    });
  };

  // Toggle video local
  const toggleVideo = async () => {
    if (!client) return;

    const mediaStream = client.getMediaStream();

    try {
      if (isLocalVideoEnabled) {
        await mediaStream.stopVideo();
        await renderLocalVideo({ action: 'Stop', userId: client.getCurrentUserInfo().userId });
        setIsLocalVideoEnabled(false);
      } else {
        const isSupportedHD = mediaStream.isSupportHDVideo();
        await mediaStream.startVideo({ hd: isSupportedHD });

        if (isBackgroundBlurred) {
          await mediaStream.updateVirtualBackgroundImage('blur');
        }

        await renderLocalVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
        setIsLocalVideoEnabled(true);
      }
    } catch (error) {
      console.error('Error alternando video:', error);
    }
  };

  // Toggle audio local
  const toggleAudio = async () => {
    if (!client) return;

    const mediaStream = client.getMediaStream();

    try {
      if (isLocalAudioEnabled) {
        await mediaStream.muteAudio();
        setIsLocalAudioEnabled(false);
      } else {
        await mediaStream.unmuteAudio();
        setIsLocalAudioEnabled(true);
      }
    } catch (error) {
      console.error('Error alternando audio:', error);
    }
  };

  // Toggle blur background
  const toggleBlurBackground = async () => {
    if (!client) return;

    console.log('Alternando blur de fondo...');
    const mediaStream = client.getMediaStream();

    try {
      if (!isBackgroundBlurred) {
        await mediaStream.updateVirtualBackgroundImage('blur');
        setIsBackgroundBlurred(true);
        console.log('Blur activado');
      } else {
        await mediaStream.updateVirtualBackgroundImage('');
        setIsBackgroundBlurred(false);
        console.log('Blur desactivado');
      }
    } catch (error) {
      console.error('Error alternando blur de fondo:', error);
    }
  };

  // Salir de la sesión
  const leaveSession = async () => {
    if (!client || !isConnected) return;

    try {
      await client.leave();
      setIsConnected(false);
      setIsLocalVideoEnabled(false);
      setIsLocalAudioEnabled(false);
      setIsRemoteVideoEnabled(false);
      setIsBackgroundBlurred(false);
      console.log('Sesión abandonada');
    } catch (error) {
      console.error('Error al abandonar sesión:', error);
    }
  };

  const handleNameSubmit = async (
    name: string, 
    startWithVideo: boolean, 
    startWithAudio: boolean,
    initialBlurEnabled: boolean,
    initialBackground: string | null
  ) => {
    console.log('Iniciando videollamada para:', name);
    
    // Ocultar formulario inmediatamente
    setUserName(name);
    setShowNameForm(false);
    setIsCallActive(true);
    
    console.log(`Llamada iniciada con configuración: Video: ${startWithVideo ? 'activado' : 'desactivado'}, Audio: ${startWithAudio ? 'activado' : 'silenciado'}, Blur: ${initialBlurEnabled ? 'activado' : 'desactivado'}, Background: ${initialBackground || 'ninguno'}`);
  };

  const handleEndCall = async () => {
    await leaveSession();
    setIsCallActive(false);
    setShowNameForm(true);
    setUserName(null);
    // Reset estados
    setIsConnected(false);
    setIsLocalVideoEnabled(false);
    setIsLocalAudioEnabled(false);
    setIsRemoteVideoEnabled(false);
    setIsBackgroundBlurred(false);
    setClient(null);
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

  // Mostrar formulario de nombre si no se ha ingresado
  if (showNameForm) {
    return (
      <NameForm 
        onSubmit={handleNameSubmit}
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
