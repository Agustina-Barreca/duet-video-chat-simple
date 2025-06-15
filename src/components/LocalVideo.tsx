
import { useState, useEffect } from "react";
import LocalVideoContainer from "./LocalVideoContainer";

interface LocalVideoProps {
  isVideoOff: boolean;
  userName: string | null;
  isBlurEnabled?: boolean;
  currentBackground?: string | null;
}

const LocalVideo = ({ 
  isVideoOff, 
  userName, 
  isBlurEnabled = false, 
  currentBackground = null 
}: LocalVideoProps) => {
  // Estados locales que se sincronizan con los props
  const [isBlurEnabledState, setIsBlurEnabled] = useState(isBlurEnabled);
  const [currentBackgroundState, setCurrentBackground] = useState(currentBackground);

  // Sincronizar estados locales con props cuando cambien
  useEffect(() => {
    setIsBlurEnabled(isBlurEnabled);
    console.log('LocalVideo: Blur updated to:', isBlurEnabled);
  }, [isBlurEnabled]);

  useEffect(() => {
    setCurrentBackground(currentBackground);
    console.log('LocalVideo: Background updated to:', currentBackground);
  }, [currentBackground]);

  return (
    <LocalVideoContainer
      isVideoOff={isVideoOff}
      userName={userName}
      isBlurEnabled={isBlurEnabledState}
      currentBackground={currentBackgroundState}
    />
  );
};

export default LocalVideo;
