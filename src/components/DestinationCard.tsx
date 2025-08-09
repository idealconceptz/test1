'use client';

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
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={e => {
            // Fallback to placeholder on error
            console.error('Image failed to load:', destination.imageUrl);
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/400x300/e5e7eb/6b7280?text=${encodeURIComponent(destination.name)}`;
          }}
          onLoad={() => {}}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{destination.name}</h3>
        <p className="text-gray-600 mb-3">{destination.location}</p>
        <p className="text-gray-700 text-sm mb-4">{destination.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            ${destination.basePricePerPerson}
          </span>
          <span className="text-sm text-gray-500">per person</span>
        </div>
      </div>
    </button>
  );
}
