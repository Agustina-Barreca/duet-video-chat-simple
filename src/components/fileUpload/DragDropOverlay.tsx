
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
      {/* Zona de drag & drop - portal a body para evitar problemas de z-index */}
      <div
        className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <div className={`${themeClasses.cardBackground} border-2 border-dashed ${themeClasses.border} rounded-lg p-8 text-center`}>
          <Upload className={`w-12 h-12 mx-auto mb-4 ${themeClasses.textSecondary}`} />
          <p className={`${themeClasses.textPrimary} text-lg font-medium`}>
            Suelta los archivos aquí
          </p>
        </div>
      </div>

      {/* Overlay global para drag & drop */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className="fixed inset-0 pointer-events-none z-40"
      />
    </>
  );
};

export default DragDropOverlay;
