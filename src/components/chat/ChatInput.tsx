
import React from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import EmojiPicker from '../EmojiPicker';
import FileUpload, { FileAttachment } from '../FileUpload';

interface ChatInputProps {
  newMessage: string;
  showEmojiPicker: boolean;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onEmojiSelect: (emoji: string) => void;
  onEmojiToggle: () => void;
  onFilesSelected: (files: FileAttachment[]) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  showEmojiPicker,
  onMessageChange,
  onSubmit,
  onKeyDown,
  onEmojiSelect,
  onEmojiToggle,
  onFilesSelected,
}) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className={`relative border-t ${themeClasses.border} p-3`}>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message... 💬"
          className={`flex-1 px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        <div className="flex items-center gap-1 flex-shrink-0">
          <FileUpload onFilesSelected={onFilesSelected} />
          <EmojiPicker 
            onEmojiSelect={onEmojiSelect}
            isOpen={showEmojiPicker}
            onToggle={onEmojiToggle}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`${themeClasses.buttonPrimary} p-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
