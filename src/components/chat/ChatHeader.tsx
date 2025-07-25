
import React from 'react';
import { MessageCircle, Minus, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ChatHeaderProps {
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isMinimized,
  onMinimize,
  onClose,
  onMouseDown,
}) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div
      className={`${themeClasses.buttonSecondary} px-4 py-3 border-b ${themeClasses.border} cursor-grab active:cursor-grabbing flex items-center justify-between`}
      onMouseDown={onMouseDown}
    >
      <div className="flex items-center gap-2">
        <MessageCircle className={`w-4 h-4 ${themeClasses.textPrimary}`} />
        <span className={`text-sm font-medium ${themeClasses.textPrimary}`}>
          Chat
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onMinimize}
          className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
          title={isMinimized ? 'Maximize' : 'Minimize'}
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
          title="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
