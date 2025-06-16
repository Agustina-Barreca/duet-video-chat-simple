
import React from 'react';
import { Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DragDropOverlayProps {
  isVisible: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({
  isVisible,
  onDrop,
  onDragOver,
  onDragLeave,
}) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay dentro del contexto del chat */}
      <div
        className="absolute inset-0 bg-black/50 z-[60] flex items-center justify-center"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          borderRadius: '0.5rem', // Coincide con el rounded-lg del chat
        }}
      >
        <div className={`${themeClasses.cardBackground} border-2 border-dashed ${themeClasses.border} rounded-lg p-6 text-center mx-4`}>
          <Upload className={`w-10 h-10 mx-auto mb-3 ${themeClasses.textSecondary}`} />
          <p className={`${themeClasses.textPrimary} text-sm font-medium`}>
            Suelta los archivos aquí
          </p>
        </div>
      </div>
    </>
  );
};

export default DragDropOverlay;
