'use client';

import Image from 'next/image';
import { SkiDestination } from '@/types';

interface DestinationCardProps {
  readonly destination: SkiDestination;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

export default function DestinationCard({
  destination,
  selected,
  onSelect,
}: Readonly<DestinationCardProps>) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left border rounded-lg overflow-hidden transition-all hover:shadow-lg ${
        selected
          ? 'border-indigo-500 ring-2 ring-indigo-200'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="relative h-48 bg-gray-200">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          onError={() => {
            console.error('Image failed to load:', destination.imageUrl);
          }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
        <p className="text-gray-600 mb-3">{destination.location}</p>
        <p className="text-gray-700 text-sm mb-4">{destination.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            £{destination.basePricePerPerson}
          </span>
          <span className="text-sm text-gray-500">per person</span>
        </div>
      </div>
    </button>
  );
}
