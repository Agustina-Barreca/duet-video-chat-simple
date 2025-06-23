
import { useState, useEffect } from 'react';
import type { RemoteVideoStatus, VideoRenderEvent } from '../../types/zoom';

interface UseZoomEventsProps {
  client: any;
  handleRenderVideo: (params: {
    event: VideoRenderEvent;
    videoRef: React.RefObject<HTMLDivElement>;
    setVideoEnabled: (enabled: boolean) => void;
    onStartExtra?: () => void;
  }) => Promise<void>;
  remoteVideoRef: React.RefObject<HTMLDivElement>;
}

export const useZoomEvents = ({ client, handleRenderVideo, remoteVideoRef }: UseZoomEventsProps) => {
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(false);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(true);
  const [remoteVideoStatus, setRemoteVideoStatus] = useState<RemoteVideoStatus>({ 
    userId: null, 
    bVideoOn: false 
  });

  const renderRemoteVideo = (event: VideoRenderEvent) => {
    handleRenderVideo({
      event,
      videoRef: remoteVideoRef,
      setVideoEnabled: setIsRemoteVideoEnabled
    });
  };

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

  return {
    isRemoteVideoEnabled,
    isRemoteAudioEnabled,
    remoteVideoStatus
  };
};
