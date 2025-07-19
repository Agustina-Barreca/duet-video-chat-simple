
import { useState, useEffect, useRef } from "react";
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import NameForm from "./NameForm";
import ThemeSelector from "./ThemeSelector";
import FloatingChat from "./FloatingChat";
import LocalVideoContainer from "./LocalVideoContainer";
import RemoteVideo from "./RemoteVideo";

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
    console.log('🔄 useEffect [isCallActive, client]:', { isCallActive, clientExists: !!client });
    
    if (!isCallActive || client) {
      console.log('❌ No inicializando cliente:', { isCallActive, clientExists: !!client });
      return;
    }

    const initClient = async () => {
      try {
        console.log('🚀 Inicializando cliente Zoom...');
        const clientZoom = ZoomVideoSDK.createClient();
        await clientZoom.init('es-ES', 'Global', {
          patchJsMedia: true,
          enforceMultipleVideos: true,
          enforceVirtualBackground: true,
          stayAwake: true,
          leaveOnPageUnload: true
        });
        
        console.log('✅ Cliente Zoom inicializado correctamente');
        setClient(clientZoom);
        
        // Inmediatamente intentar unirse a la sesión
        await joinSession(clientZoom);
      } catch (error) {
        console.error('❌ Error inicializando cliente Zoom:', error);
        setConnectionError('Error al inicializar el cliente de videollamada');
      }
    };

    initClient();
  }, [isCallActive]);

  // Configurar eventos del cliente
  useEffect(() => {
    console.log('🔄 useEffect [client]:', { clientExists: !!client });
    
    if (!client) {
      console.log('❌ No configurando eventos: cliente no existe');
      return;
    }

    console.log('⚡ Configurando eventos del cliente...');
    const handleUserUpdated = (state: any) => {
      console.log('👥 Evento user-updated recibido:', state);
      updateRemoteParticipantState(state);
    };

    client.on('user-updated', handleUserUpdated);
    console.log('✅ Eventos del cliente configurados');

    return () => {
      console.log('🧹 Limpiando eventos del cliente');
      client.off('user-updated', handleUserUpdated);
    };
  }, [client]);

  // Efecto para manejar video remoto
  useEffect(() => {
    console.log('🔄 useEffect [remoteVideoStatus]:', remoteVideoStatus);
    
    if (remoteVideoStatus.bVideoOn) {
      console.log('📹 Video remoto activado, iniciando renderizado...');
      if (!isRemoteVideoEnabled) {
        renderRemoteVideo({ action: 'Start', userId: remoteVideoStatus.userId });
      }
    } else if (remoteVideoStatus.bVideoOn === false) {
      console.log('🚫 Video remoto desactivado, deteniendo renderizado...');
      renderRemoteVideo({ action: 'Stop', userId: remoteVideoStatus.userId });
    }
  }, [remoteVideoStatus]);

  // Unirse a la sesión
  const joinSession = async (currentClient: any) => {
    console.log('🔗 joinSession iniciado:', { clientExists: !!currentClient });
    
    if (!currentClient) {
      console.log('❌ joinSession abortado: cliente no existe');
      return false;
    }

    try {
      console.log('🚀 Uniéndose a la sesión...');
      console.log('📋 Configuración de sesión:', {
        sessionName: window.sessionName,
        hasToken: !!window.accesstoken,
        userIdentity: window.userIdentity,
        hasPassword: !!window.sessionPassword
      });
      
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
      console.log(`📺 HD ${isSupportedHD ? 'soportado' : 'no soportado'}`);

      // Iniciar video y audio
      console.log('🎥 Iniciando video local...');
      await mediaStream.startVideo({ hd: isSupportedHD });
      console.log('🎤 Iniciando audio local...');
      await mediaStream.startAudio();
      setIsLocalAudioEnabled(true);

      console.log('🖼️ Renderizando video local...');
      await renderLocalVideo({ action: 'Start', userId: currentClient.getCurrentUserInfo().userId });
      
      console.log('✅ joinSession completado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error uniéndose a la sesión:', error);
      setConnectionError('No se pudo conectar a la videollamada. Verifica tus permisos.');
      setIsConnected(false);
      return false;
    }
  };

  // Manejar estado del participante remoto
  const updateRemoteParticipantState = (state: any) => {
    console.log('👥 updateRemoteParticipantState:', { state, isArray: Array.isArray(state), length: state?.length });
    
    if (!Array.isArray(state) || state.length === 0) {
      console.log('❌ Estado inválido o vacío');
      return;
    }
    
    if (!client?.getCurrentUserInfo()?.userId) {
      console.log('❌ No hay usuario actual o cliente');
      return;
    }

    const currentUserId = client.getCurrentUserInfo().userId;
    console.log('🏷️ Usuario actual:', currentUserId);

    const remoteParticipant = state.find(
      (status: any) => status.userId !== currentUserId &&
        status.userId !== null &&
        status.userId !== undefined &&
        status.userId !== ''
    );

    console.log('🔍 Participante remoto encontrado:', remoteParticipant);

    if (!remoteParticipant) {
      console.log('❌ No se encontró participante remoto válido');
      return;
    }

    if (remoteParticipant.hasOwnProperty('bVideoOn')) {
      const { userId, bVideoOn } = remoteParticipant;
      console.log('📹 Actualizando estado de video remoto:', { userId, bVideoOn });
      setRemoteVideoStatus({ userId, bVideoOn });
    }

    if (remoteParticipant.hasOwnProperty('muted')) {
      console.log('🎤 Actualizando estado de audio remoto:', { muted: remoteParticipant.muted });
      setIsRemoteAudioEnabled(!remoteParticipant.muted);
    }
  };

  // Función auxiliar para renderizar video
  const handleRenderVideo = async ({
    event,
    videoRef,
    setVideoEnabled
  }: any) => {
    console.log('🎬 handleRenderVideo:', { event, hasRef: !!videoRef?.current, hasClient: !!client });
    
    if (!client) {
      console.error('❌ Cliente no definido aún');
      return;
    }

    const mediaStream = client.getMediaStream();

    try {
      if (event.action === 'Start') {
        console.log('▶️ Iniciando renderizado de video para usuario:', event.userId);
        const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_720P);

        if (!videoRef.current) {
          console.warn('⚠️ Ref de video no disponible.');
          return;
        }

        videoRef.current.appendChild(userVideo);
        setVideoEnabled(true);
        console.log('✅ Video renderizado exitosamente');
      } else if (event.action === 'Stop') {
        console.log('⏹️ Deteniendo renderizado de video para usuario:', event.userId);
        const elements = await mediaStream.detachVideo(event.userId);
        if (elements) {
          if (Array.isArray(elements)) {
            elements.forEach((el: any) => el.remove());
          } else {
            elements.remove();
          }
        }
        setVideoEnabled(false);
        console.log('✅ Video desrenderizado exitosamente');
      }
    } catch (error) {
      console.error('❌ Error en acción de renderizar video:', error);
    }
  };

  const renderLocalVideo = (event: any) => {
    console.log('📹 renderLocalVideo:', event);
    handleRenderVideo({
      event,
      videoRef: localVideoRef,
      setVideoEnabled: setIsLocalVideoEnabled
    });
  };

  const renderRemoteVideo = (event: any) => {
    console.log('📺 renderRemoteVideo:', event);
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
      <RemoteVideo 
        ref={remoteVideoRef}
        isVideoOff={!isRemoteVideoEnabled}
      />
      
      {/* Video local flotante - con z-index medio */}
      <LocalVideoContainer 
        ref={localVideoRef}
        isVideoOff={!isLocalVideoEnabled}
        userName={userName}
        isBlurEnabled={isBackgroundBlurred}
        currentBackground={null}
      />
      
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
