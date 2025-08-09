import { Hotel, Participant } from '@/types';
import { useState } from 'react';
import Image from 'next/image';
import HotelDetailsModal from './HotelDetailsModal';

interface HotelListProps {
  readonly hotels: Hotel[];
  readonly selectedHotel: Hotel | null;
  readonly onSelectHotel: (hotel: Hotel) => void;
  readonly loading: boolean;
  readonly destinationName: string;
  readonly participants: Participant[];
  readonly groupId: string;
  readonly destinationId: string;
  readonly selectedUser: Participant | null;
}
export default function HotelList({
  hotels,
  selectedHotel,

  loading,
  destinationName,
  participants,
  groupId,
  destinationId,
  selectedUser,
}: Readonly<HotelListProps>) {
  const [modalHotel, setModalHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHotelClick = (hotel: Hotel) => {
    setModalHotel(hotel);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalHotel(null);
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Hotels in {destinationName}</h2>
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotels.map(hotel => (
            <button
              key={hotel.id}
              type="button"
              className={`border rounded-lg p-6 text-left transition-all ${
                selectedHotel?.id === hotel.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleHotelClick(hotel)}
            >
              {hotel.thumbnail && (
                <div className="mb-4">
                  <Image
                    src={hotel.thumbnail}
                    alt={hotel.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <h3 className="font-semibold text-gray-900 mb-2">{hotel.name}</h3>
              {/* <p className="text-2xl font-bold text-indigo-600 mb-2">
                ${hotel.pricePerNight}/night
              </p> */}
              <div className="mb-3">
                <span className="text-sm text-gray-600 float-right">Rating: {hotel.rating}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={`star-${hotel.id}-${i}`}
                      className={i < hotel.rating ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {hotel.amenities?.map(amenity => (
                  <span
                    key={`${hotel.id}-${amenity}`}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
              {hotel.hotelDescription && (
                <div
                  className="mt-3 text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: hotel.hotelDescription }}
                />
              )}
            </button>
          ))}
        </div>
      )}
      <HotelDetailsModal
        hotel={modalHotel}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        participants={participants}
        groupId={groupId}
        destinationId={destinationId}
        selectedUser={selectedUser}
      />
    </section>
  );
}
