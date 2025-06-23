
import RemoteVideo from "./RemoteVideo";
import LocalVideo from "./LocalVideo";
import { useTheme } from "../contexts/ThemeContext";

interface VideoDisplayProps {
  localVideoRef: React.RefObject<HTMLDivElement>;
  remoteVideoRef: React.RefObject<HTMLDivElement>;
  isLocalVideoEnabled: boolean;
  isRemoteVideoEnabled: boolean;
  userName: string | null;
}

const VideoDisplay = ({
  localVideoRef,
  remoteVideoRef,
  isLocalVideoEnabled,
  isRemoteVideoEnabled,
  userName
}: VideoDisplayProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <>
      {/* Video principal (remoto) - con z-index bajo para evitar superposiciones */}
      <div className="relative z-0">
        <div className="absolute inset-0 p-8 pt-32 pb-24 flex items-center justify-center">
          <div 
            ref={remoteVideoRef}
            className={`w-full max-w-4xl h-96 rounded-2xl overflow-hidden shadow-2xl ${themeClasses.cardBackground} ${themeClasses.border} border flex items-center justify-center`}
          >
            {!isRemoteVideoEnabled && (
              <div className="text-center">
                <div className={`w-32 h-32 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-4xl text-white">👤</span>
                </div>
                <h3 className={`text-2xl font-semibold ${themeClasses.textPrimary}`}>Usuario Remoto</h3>
                <p className={`${themeClasses.textSecondary}`}>Video desactivado</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Video local flotante - con z-index medio */}
      <div className="relative z-10">
        <div className="fixed bottom-32 right-8 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl">
          <div 
            ref={localVideoRef}
            className={`w-full h-full ${themeClasses.cardBackground} flex items-center justify-center`}
          >
            {!isLocalVideoEnabled && (
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto`}>
                  <span className="text-lg text-white">👤</span>
                </div>
                {userName && (
                  <p className={`text-xs font-medium mt-1 ${themeClasses.textPrimary}`}>{userName}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDisplay;
