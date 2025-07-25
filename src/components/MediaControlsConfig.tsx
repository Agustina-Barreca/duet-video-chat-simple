
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface MediaControlsConfigProps {
  startWithVideo: boolean;
  startWithAudio: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
  disabled?: boolean;
}

const MediaControlsConfig = ({
  startWithVideo,
  startWithAudio,
  onToggleVideo,
  onToggleAudio,
  disabled = false
}: MediaControlsConfigProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <>
      <div className={`flex items-center justify-between ${themeClasses.buttonSecondary} rounded-lg p-3`}>
        <div className="flex items-center space-x-3">
          {startWithVideo ? (
            <Video className="w-5 h-5 text-green-400" />
          ) : (
            <VideoOff className="w-5 h-5 text-red-400" />
          )}
          <span className={`${themeClasses.textPrimary} text-sm`}>Camera</span>
        </div>
        <button
          type="button"
          onClick={onToggleVideo}
          disabled={disabled}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            startWithVideo ? 'bg-green-500' : 'bg-gray-600'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
            startWithVideo ? 'translate-x-7' : 'translate-x-1'
          }`}></div>
        </button>
      </div>

      <div className={`flex items-center justify-between ${themeClasses.buttonSecondary} rounded-lg p-3`}>
        <div className="flex items-center space-x-3">
          {startWithAudio ? (
            <Mic className="w-5 h-5 text-green-400" />
          ) : (
            <MicOff className="w-5 h-5 text-red-400" />
          )}
          <span className={`${themeClasses.textPrimary} text-sm`}>Microphone</span>
        </div>
        <button
          type="button"
          onClick={onToggleAudio}
          disabled={disabled}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            startWithAudio ? 'bg-green-500' : 'bg-gray-600'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
            startWithAudio ? 'translate-x-7' : 'translate-x-1'
          }`}></div>
        </button>
      </div>
    </>
  );
};

export default MediaControlsConfig;
