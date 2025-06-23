
import { useState } from 'react';
import type { VideoRenderEvent } from '../../types/zoom';

interface UseZoomControlsProps {
  client: any;
  handleRenderVideo: (params: {
    event: VideoRenderEvent;
    videoRef: React.RefObject<HTMLDivElement>;
    setVideoEnabled: (enabled: boolean) => void;
    onStartExtra?: () => void;
  }) => Promise<void>;
  localVideoRef: React.RefObject<HTMLDivElement>;
}

export const useZoomControls = ({ client, handleRenderVideo, localVideoRef }: UseZoomControlsProps) => {
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(false);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(false);
  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);

  const renderLocalVideo = (event: VideoRenderEvent) => {
    handleRenderVideo({
      event,
      videoRef: localVideoRef,
      setVideoEnabled: setIsLocalVideoEnabled
    });
  };

  const startInitialMedia = async () => {
    if (!client) return;

    const mediaStream = client.getMediaStream();
    const isSupportedHD = mediaStream.isSupportHDVideo();
    console.log(`HD ${isSupportedHD ? 'soportado' : 'no soportado'}`);

    // Iniciar video y audio
    await mediaStream.startVideo({ hd: isSupportedHD });
    await mediaStream.startAudio();
    setIsLocalAudioEnabled(true);

    await renderLocalVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
  };

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

  const resetControlStates = () => {
    setIsLocalVideoEnabled(false);
    setIsLocalAudioEnabled(false);
    setIsBackgroundBlurred(false);
  };

  return {
    isLocalVideoEnabled,
    isLocalAudioEnabled,
    isBackgroundBlurred,
    toggleVideo,
    toggleAudio,
    toggleBlurBackground,
    startInitialMedia,
    resetControlStates
  };
};
