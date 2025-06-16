
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const ChatCarousel = () => {
  const sampleImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=200&fit=crop", 
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop"
  ];

  return (
    <div className="w-full max-w-xs mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {sampleImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <img
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default ChatCarousel;
