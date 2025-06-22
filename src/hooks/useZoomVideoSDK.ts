
import { useState, useEffect, useRef } from 'react';
import ZoomVideoSDK, { VideoQuality } from '@zoom/videosdk';

interface ZoomConfig {
  sessionName: string;
  accessToken: string;
  userIdentity: string;
  sessionPassword?: string;
}

export const useZoomVideoSDK = () => {
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(false);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(false);
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(false);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  
  const [remoteVideoStatus, setRemoteVideoStatus] = useState<{
    userId: string | null;
    bVideoOn: boolean;
  }>({ userId: null, bVideoOn: false });

  // Inicializar cliente
  const initClient = async () => {
    if (client || isConnected) return true;

    setIsInitializing(true);
    setConnectionError(null);

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
      return true;
    } catch (error) {
      console.error('Error inicializando cliente Zoom:', error);
      setConnectionError('Error al inicializar el cliente de videollamada');
      return false;
    } finally {
      setIsInitializing(false);
    }
  };

  // Unirse a la sesión
  const joinSession = async (config: ZoomConfig) => {
    if (!client) {
      const initialized = await initClient();
      if (!initialized) return false;
    }

    try {
      console.log('Uniéndose a la sesión...', config);
      setConnectionError(null);
      
      await client.join(
        config.sessionName,
        config.accessToken,
        config.userIdentity,
        config.sessionPassword || ''
      );
      
      setIsConnected(true);
      console.log('✅ Conectado exitosamente a la sesión');

      const mediaStream = client.getMediaStream();
      const isSupportedHD = mediaStream.isSupportHDVideo();
      console.log(`HD ${isSupportedHD ? 'soportado' : 'no soportado'}`);

      // Iniciar video y audio
      await mediaStream.startVideo({ hd: isSupportedHD });
      await mediaStream.startAudio();
      setIsLocalAudioEnabled(true);

      await renderLocalVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
      
      return true;
    } catch (error) {
      console.error('Error uniéndose a la sesión:', error);
      setConnectionError('No se pudo conectar a la videollamada. Verifica tus permisos.');
      setIsConnected(false);
      return false;
    }
  };

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

  // Función auxiliar para renderizar video
  const handleRenderVideo = async ({
    event,
    videoRef,
    setVideoEnabled,
    onStartExtra = () => {}
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
        onStartExtra();
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

  return {
    // Estados
    client,
    isConnected,
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    isRemoteVideoEnabled,
    isRemoteAudioEnabled,
    isBackgroundBlurred,
    connectionError,
    isInitializing,
    
    // Refs para videos
    localVideoRef,
    remoteVideoRef,
    
    // Funciones
    initClient,
    joinSession,
    toggleVideo,
    toggleAudio,
    toggleBlurBackground,
    leaveSession
  };
};
