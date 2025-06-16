
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface ChatCarouselProps {
  onImageClick?: (images: string[]) => void;
}

const ChatCarousel: React.FC<ChatCarouselProps> = ({ onImageClick }) => {
  const sampleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop", 
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
  ];

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(sampleImages);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <Carousel className="w-full">
        <Carousel className="w-full">
        <CarouselContent>
          {sampleImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  onClick={handleImageClick}
                  className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  title="Click para ver en tamaño completo"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
      </Carousel>
    </div>
  );
};

export default ChatCarousel;
