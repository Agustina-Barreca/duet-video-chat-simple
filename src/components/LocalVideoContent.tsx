
import { User } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface LocalVideoContentProps {
  isVideoOff: boolean;
  userName: string | null;
  isBlurEnabled: boolean;
  currentBackground: string | null;
  isMinimized: boolean;
}

const LocalVideoContent = ({
  isVideoOff,
  userName,
  isBlurEnabled,
  currentBackground,
  isMinimized
}: LocalVideoContentProps) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const getVideoStyle = () => {
    let style: React.CSSProperties = {};
    
    if (isBlurEnabled) {
      style.filter = 'blur(8px)';
      style.backdropFilter = 'blur(10px)';
    }
    
    if (currentBackground) {
      style.backgroundImage = `url(${currentBackground})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
    }
    
    return style;
  };

  if (isMinimized) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${themeClasses.accent} flex items-center justify-center`}>
        <User className="w-6 h-6 text-white" />
      </div>
    );
  }

  if (isVideoOff) {
    return (
      <div className={`w-full h-full ${themeClasses.cardBackground} flex items-center justify-center relative`}>
        <div className="text-center">
          <div className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto`}>
            <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
          </div>
          {userName && (
            <p className={`text-[10px] md:text-xs font-medium mt-1 md:mt-2 ${themeClasses.textPrimary}`}>{userName}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={getVideoStyle()}>
      {/* Overlay con efectos aplicados */}
      <div className={`absolute inset-0 ${currentBackground ? 'bg-black/20' : `bg-gradient-to-br ${themeClasses.accent}`} ${currentBackground ? '' : 'opacity-90'}`}></div>
      
      {/* Nombre del usuario en la esquina inferior izquierda cuando el video está activado */}
      {userName && (
        <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded text-white text-[10px] md:text-xs font-medium">
          {userName}
        </div>
      )}
    </div>
  );
};

export default LocalVideoContent;
