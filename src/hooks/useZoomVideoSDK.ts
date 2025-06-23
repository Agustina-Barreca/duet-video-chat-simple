
import type { ZoomConfig } from '../types/zoom';
import { useZoomClient } from './zoom/useZoomClient';
import { useZoomVideo } from './zoom/useZoomVideo';
import { useZoomControls } from './zoom/useZoomControls';
import { useZoomEvents } from './zoom/useZoomEvents';

export const useZoomVideoSDK = () => {
  const {
    client,
    isConnected,
    connectionError,
    isInitializing,
    initClient,
    joinSession: joinSessionBase,
    leaveSession: leaveSessionBase,
    setIsConnected
  } = useZoomClient();

  const { localVideoRef, remoteVideoRef, handleRenderVideo } = useZoomVideo(client);

  const {
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    isBackgroundBlurred,
    toggleVideo,
    toggleAudio,
    toggleBlurBackground,
    startInitialMedia,
    resetControlStates
  } = useZoomControls({ client, handleRenderVideo, localVideoRef });

  const {
    isRemoteVideoEnabled,
    isRemoteAudioEnabled
  } = useZoomEvents({ client, handleRenderVideo, remoteVideoRef });

  // Enhanced joinSession that includes media initialization
  const joinSession = async (config: ZoomConfig) => {
    const success = await joinSessionBase(config);
    if (success) {
      await startInitialMedia();
    }
    return success;
  };

  // Enhanced leaveSession that resets all states
  const leaveSession = async () => {
    await leaveSessionBase();
    resetControlStates();
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
