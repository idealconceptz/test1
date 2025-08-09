import { useState } from 'react';
import Image from 'next/image';

interface HotelImage {
  url: string;
  urlHd: string;
  caption: string;
  order: number;
  defaultImage: boolean;
}

interface ImageCarouselProps {
  readonly hotelImages: HotelImage[];
  readonly hotelName: string;
  readonly title?: string;
}

export default function ImageCarousel({
  hotelImages,
  hotelName,
  title,
}: Readonly<ImageCarouselProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (hotelImages.length === 0) return null;

  const totalPhotos = hotelImages.length;
  const currentImage = hotelImages[currentImageIndex];

  return (
    <div>
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      <div className="relative">
        {/* Main Image */}
        <div className="relative h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={currentImage.urlHd || currentImage.url}
            alt={currentImage.caption || `${hotelName} image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
          />

          {/* Navigation Arrows */}
          {totalPhotos > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === 0 ? totalPhotos - 1 : currentImageIndex - 1
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    currentImageIndex === totalPhotos - 1 ? 0 : currentImageIndex + 1
                  )
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}

          {/* Image Counter */}
          {totalPhotos > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {currentImageIndex + 1} / {totalPhotos}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {totalPhotos > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
            {hotelImages.slice(0, 8).map((image, index) => (
              <button
                key={`thumbnail-${index}-${image.url}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                  currentImageIndex === index ? 'border-indigo-500' : 'border-gray-300'
                }`}
              >
                <Image
                  src={image.urlHd || image.url}
                  alt={image.caption || `${hotelName} image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {totalPhotos > 8 && (
              <div className="flex-shrink-0 w-16 h-16 rounded border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                +{totalPhotos - 8}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
