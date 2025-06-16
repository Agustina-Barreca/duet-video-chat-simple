
import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface FullScreenViewerProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: 'image' | 'carousel';
    data: string | string[];
  };
}

const FullScreenViewer: React.FC<FullScreenViewerProps> = ({ isOpen, onClose, content }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-[95vw] h-[95vh] flex items-center justify-center">
        {content.type === 'image' ? (
          <img
            src={content.data as string}
            alt="Vista completa"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        ) : (
          <div className="w-full max-w-4xl">
            <Carousel className="w-full">
              <CarouselContent>
                {(content.data as string[]).map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center h-[90vh]">
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/50 border-white/20 text-white hover:bg-black/70" />
              <CarouselNext className="right-4 bg-black/50 border-white/20 text-white hover:bg-black/70" />
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenViewer;
