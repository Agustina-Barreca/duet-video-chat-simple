
import { useRef } from 'react';
import { VideoQuality } from '@zoom/videosdk';
import type { VideoRenderEvent } from '../../types/zoom';

export const useZoomVideo = (client: any) => {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const handleRenderVideo = async ({
    event,
    videoRef,
    setVideoEnabled,
    onStartExtra = () => {}
  }: {
    event: VideoRenderEvent;
    videoRef: React.RefObject<HTMLDivElement>;
    setVideoEnabled: (enabled: boolean) => void;
    onStartExtra?: () => void;
  }) => {
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

  return {
    localVideoRef,
    remoteVideoRef,
    handleRenderVideo
  };
};
