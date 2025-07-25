import { useState, useEffect, useRef  } from "react";
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import NameForm from "./NameForm";
import ThemeSelector from "./ThemeSelector";
import FloatingChat from "./FloatingChat";
import LocalVideoContainer from "./LocalVideoContainer";
import RemoteVideo from "./RemoteVideo";

import { useTheme } from "../contexts/ThemeContext";
import ZoomVideoSDK, { VideoQuality } from '@zoom/videosdk';

// Extend window interface
declare global {
  interface Window {
    sessionName?: string;
    accesstoken?: string;
    sessionPassword?: string;
    userIdentity?: string;
    clientZoom?: any;
  }
}

const VideoCall = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [showNameForm, setShowNameForm] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isLocalAudioEnabled, setIsLocalAudioEnabled] = useState(true);
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(false);
  const [isRemoteAudioEnabled, setIsRemoteAudioEnabled] = useState(false);

  const [isBackgroundBlurred, setIsBackgroundBlurred] = useState(false);

  const [remoteVideoStatus, setRemoteVideoStatus] = useState<{ userId: string | null; bVideoOn: boolean }>({ userId: null, bVideoOn: false });

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // INIT CLIENT
  useEffect(() => {
    const initClient = async () => {
      if (!isCallActive || isConnected) return;
      try {
        const clientZoom = ZoomVideoSDK.createClient();
        await clientZoom.init('en-US', 'Global', {
          patchJsMedia: true,
          enforceMultipleVideos: true,
          enforceVirtualBackground: true,
          stayAwake: true,
          leaveOnPageUnload: true
        });
        setClient(clientZoom);
        window.clientZoom = clientZoom;
      } catch (error) {
        console.error('Error initializing client:', error);
      }
    };
    initClient();
  }, [isCallActive, isConnected]);

  // JOIN SESSION
  useEffect(() => {
    if (!client) return;

    const joinSession = async () => {
      try {
        const sessionName = window.sessionName;
        const accessToken = window.accesstoken;
        const userIdentity = window.userIdentity;
        const sessionPassword = window.sessionPassword;

        await client.join(sessionName, accessToken, userIdentity, sessionPassword);
        setIsConnected(true);

        const mediaStream = client.getMediaStream();
        const isSupportedHD = mediaStream.isSupportHDVideo();

        await mediaStream.startVideo({ hd: isSupportedHD });
        await mediaStream.startAudio();
        setIsLocalAudioEnabled(true);

        await renderLocalVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
      } catch (error) {
        console.error('Error joining session:', error);
      }
    };

    joinSession();
  }, [client]);

  // REMOTE VIDEO TRACKING
  useEffect(() => {
    if (remoteVideoStatus.bVideoOn) {
      if (!isRemoteVideoEnabled) {
        renderRemoteVideo({ action: 'Start', userId: remoteVideoStatus.userId });
      }
    } else if (remoteVideoStatus.bVideoOn === false) {
      renderRemoteVideo({ action: 'Stop', userId: remoteVideoStatus.userId });
    }
  }, [remoteVideoStatus]);

  // EVENT HANDLER
  useEffect(() => {
    if (!client) return;

    const handleUserUpdated = (state: any) => {
      if (!Array.isArray(state) || state.length === 0) return;
      if (!client.getCurrentUserInfo()?.userId) return;
      const remote = state.find(
        (s: any) => s.userId !== client.getCurrentUserInfo()?.userId && s.userId
      );

      if (!remote) return;

      if (remote.hasOwnProperty('bVideoOn')) {
        const { userId, bVideoOn } = remote;
        setRemoteVideoStatus({ userId, bVideoOn });
      }

      if (remote.hasOwnProperty('muted')) {
        setIsRemoteAudioEnabled(!remote.muted);
      }
    };

    client.on('user-updated', handleUserUpdated);

    return () => {
      client.off('user-updated', handleUserUpdated);
    };
  }, [client]);

  const handleRenderVideo = async ({ event, videoRef, setVideoEnabled }: any) => {
    if (!client) return;
    const mediaStream = client.getMediaStream();

    try {
      if (event.action === 'Start') {
        const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_720P);
        if (!videoRef.current) {
          console.warn('⚠️ Ref de video no disponible.');
          return;
        }

        videoRef.current.appendChild(userVideo);
        setVideoEnabled(true);
      } else if (event.action === 'Stop') {
        const elements = await mediaStream.detachVideo(event.userId);
        if (elements) {
          (Array.isArray(elements) ? elements : [elements]).forEach((el: any) => el.remove());
        }
        setVideoEnabled(false);
      }
    } catch (error) {
      console.error('Error in render video action:', error);
    }
  };

  const renderLocalVideo = (event: any) => {
    handleRenderVideo({ event, videoRef: localVideoRef, setVideoEnabled: setIsLocalVideoEnabled });
  };

  const renderRemoteVideo = (event: any) => {
    handleRenderVideo({ event, videoRef: remoteVideoRef, setVideoEnabled: setIsRemoteVideoEnabled });
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
      console.error('Error switching audio:', error);
    }
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
      console.error('Error toggling video:', error);
    }
  };

  if (showNameForm) {
    return <NameForm onSubmit={(name: string) => {
      setUserName(name);
      setShowNameForm(false);
      setIsCallActive(true);
    }} />;
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${themeClasses.background}`}>
      <ThemeSelector />
      <CallHeader userName={userName} isRemoteAudioActive={isRemoteAudioEnabled} isRemoteVideoActive={isRemoteVideoEnabled} />
      <RemoteVideo ref={remoteVideoRef} isVideoOff={!isRemoteVideoEnabled} />
      <LocalVideoContainer ref={localVideoRef} isVideoOff={!isLocalVideoEnabled} userName={userName} isBlurEnabled={isBackgroundBlurred} currentBackground={null} />
      <div className="relative z-20">
        <CallControls isMuted={!isLocalAudioEnabled} isVideoOff={!isLocalVideoEnabled} onToggleMute={toggleAudio} onToggleVideo={toggleVideo} onEndCall={() => {}} isBlurEnabled={isBackgroundBlurred} currentBackground={null} onToggleBlur={() => {}} onBackgroundChange={() => {}} />
      </div>
      <FloatingChat />
    </div>
  );
};

export default VideoCall;
