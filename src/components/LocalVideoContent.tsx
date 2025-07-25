
import React, { forwardRef } from "react";
import { User } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface LocalVideoContentProps {
  isVideoOff: boolean;
  userName: string | null;
  isBlurEnabled: boolean;
  currentBackground: string | null;
  isMinimized: boolean;
}

const LocalVideoContent = forwardRef<HTMLDivElement, LocalVideoContentProps>(({
  isVideoOff,
  userName,
  isBlurEnabled,
  currentBackground,
  isMinimized
}, ref) => {
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

  return (
    <div className="w-full h-full relative">
      <div
        ref={ref}
        className="w-full h-full absolute inset-0"
        style={{ ...getVideoStyle(), display: isVideoOff ? 'none' : 'block' }}
      />

      {(isMinimized || isVideoOff) && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          isMinimized ? `bg-gradient-to-br ${themeClasses.accent}` : `${themeClasses.cardBackground}`
        }`}>
          <div className="text-center">
            <div className={`w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br ${themeClasses.accent} rounded-full flex items-center justify-center mx-auto`}>
              <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            {userName && (
              <p className={`text-[10px] md:text-xs font-medium mt-1 md:mt-2 ${themeClasses.textPrimary}`}>{userName}</p>
            )}
          </div>
        </div>
      )}

      {!isVideoOff && !isMinimized && userName && (
        <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded text-white text-[10px] md:text-xs font-medium">
          {userName}
        </div>
      )}
    </div>
  );
});

export default LocalVideoContent;
