
import React, { useState } from 'react';
import { Smile } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, isOpen, onToggle }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😋',
    '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖',
    '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯',
    '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔',
    '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦',
    '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴',
    '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿',
    '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖',
    '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞',
    '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
    '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝',
    '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
    '🦻', '👃', '🫀', '🫁', '🧠', '🦷', '🦴', '👀', '👁️', '👅',
    '👄', '💋', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎',
    '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
    '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className={`p-2 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
        title="Emojis"
      >
        <Smile className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`p-2 rounded hover:bg-white/10 ${themeClasses.textPrimary} transition-colors`}
        title="Emojis"
      >
        <Smile className="w-4 h-4" />
      </button>
      
      <div className={`absolute bottom-full right-0 mb-2 ${themeClasses.cardBackground} border ${themeClasses.border} rounded-lg p-3 w-72 h-48 overflow-y-auto shadow-xl`}>
        <div className="grid grid-cols-8 gap-1">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => {
                onEmojiSelect(emoji);
                onToggle();
              }}
              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-white/10 rounded transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiPicker;
