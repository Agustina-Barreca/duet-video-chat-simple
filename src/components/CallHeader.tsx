
import { Clock, Wifi, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useState, useEffect } from "react";

interface CallHeaderProps {
  userName: string | null;
  isRemoteAudioActive?: boolean;
  isRemoteVideoActive?: boolean;
}

const CallHeader = ({ userName, isRemoteAudioActive = true, isRemoteVideoActive = true }: CallHeaderProps) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-3 md:p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        {/* Top row on mobile: status indicators */}
        <div className="flex items-center justify-between md:justify-start md:space-x-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="flex items-center space-x-1 md:space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4 text-white" />
              <span className="text-white font-mono text-xs md:text-sm">{formatTime(callDuration)}</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1 md:px-3 md:py-2">
              <Wifi className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              <span className="text-white text-xs md:text-sm hidden sm:inline">Connected</span>
            </div>
          </div>
          
          {/* Audio/video status - mobile only */}
          <div className="flex items-center space-x-1 md:hidden">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isRemoteAudioActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isRemoteAudioActive ? (
                <Mic className="w-3 h-3" />
              ) : (
                <MicOff className="w-3 h-3" />
              )}
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isRemoteVideoActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isRemoteVideoActive ? (
                <Video className="w-3 h-3" />
              ) : (
                <VideoOff className="w-3 h-3" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom row on mobile: detailed status */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex flex-col items-start md:items-end space-y-2">
            {/* Audio/video status - desktop only */}
            <div className="hidden md:flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isRemoteAudioActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isRemoteAudioActive ? (
                  <Mic className="w-3 h-3" />
                ) : (
                  <MicOff className="w-3 h-3" />
                )}
                <span className="text-xs">{isRemoteAudioActive ? 'Audio' : 'No audio'}</span>
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isRemoteVideoActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isRemoteVideoActive ? (
                  <Video className="w-3 h-3" />
                ) : (
                  <VideoOff className="w-3 h-3" />
                )}
                <span className="text-xs">{isRemoteVideoActive ? 'Video' : 'No video'}</span>
              </div>
            </div>
            
            <div className="text-left md:text-right">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                <span className="text-white text-sm md:text-lg font-medium">Remote User</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallHeader;
