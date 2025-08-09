import { useState, useEffect } from 'react';
import { Hotel } from '@/types';
import { submitVote } from '@/app/actions/vote';
import ImageCarousel from './ImageCarousel';
import RoomOptions from './RoomOptions';

interface HotelDetailsModalProps {
  readonly hotel: Hotel | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly participants?: Array<{ id: string; name: string; hasVoted?: boolean }>;
  readonly destinationId: string;
  readonly groupId: string;
}

interface HotelDetails {
  id: string;
  name: string;
  description?: string;
  hotelDescription?: string;
  images?: Array<{ url: string; description?: string }>;
  hotelImages?: Array<{
    url: string;
    urlHd: string;
    caption: string;
    order: number;
    defaultImage: boolean;
  }>;
  photos?: Array<{
    url: string;
    imageDescription: string;
    imageClass1: string;
    imageClass2: string;
    failoverPhoto: string;
    mainPhoto: boolean;
    score: number;
    classId: number;
    classOrder: number;
    hd_url: string;
  }>;
  roomAmenities?: Array<{ amenitiesId: number; name: string }>;
  facilities?: Array<{ facilityId: number; name: string; description?: string }>;
  rooms?: Array<{
    id: string;
    roomName: string;
    description?: string;
    maxAdults?: number;
    maxChildren?: number;
    maxOccupancy?: number;
    roomSizeSquare?: number;
    roomSizeUnit?: string;
    bedTypes?: Array<{
      quantity: number;
      bedType: string;
      bedSize: string;
      id: number;
    }>;
    roomAmenities?: Array<{
      amenitiesId: number;
      name: string;
      sort: number;
    }>;
  }>;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  star_rating?: number;
  latitude?: number;
  longitude?: number;
}

export default function HotelDetailsModal({
  hotel,
  isOpen,
  onClose,
  participants,
  destinationId,
  groupId,
}: Readonly<HotelDetailsModalProps>) {
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [voteStatus, setVoteStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    if (isOpen && hotel) {
      fetchHotelDetails(hotel.id);
    }
  }, [isOpen, hotel]);

  const fetchHotelDetails = async (hotelId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/hotel-details?hotelId=${hotelId}`);
      if (response.ok) {
        const data = await response.json();
        setHotelDetails(data.data);
      } else {
        console.error('Failed to fetch hotel details');
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    console.log('Selected room type:', roomId);
  };

  const handleVote = async () => {
    if (selectedParticipant && hotel && destinationId && groupId) {
      setVoteStatus({ type: null, message: '' });

      try {
        const result = await submitVote(selectedParticipant, groupId, destinationId, hotel.id);

        if (result.success) {
          setVoteStatus({
            type: 'success',
            message: result.message || 'Vote submitted successfully!',
          });
          setSelectedParticipant(''); // Reset selection after successful vote
        } else {
          setVoteStatus({ type: 'error', message: result.error || 'Failed to submit vote' });
        }
      } catch (error) {
        console.error('Vote submission error:', error);
        setVoteStatus({ type: 'error', message: 'An unexpected error occurred' });
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex-1">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              {hotel?.name || 'Hotel Details'}
            </h2>

            {/* Voting Section */}
            {groupId}
            {destinationId}
            {participants?.length}
            {participants && participants.length > 0 && groupId && destinationId && (
              <div className="flex flex-col items-center gap-3 mt-8">
                <div className="flex items-center gap-3">
                  <select
                    value={selectedParticipant}
                    onChange={e => setSelectedParticipant(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select your name</option>
                    {participants.map(participant => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name} {participant.hasVoted ? '(Already voted)' : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleVote}
                    disabled={!selectedParticipant}
                    className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                      selectedParticipant
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    🗳️ I Vote For This Hotel!
                  </button>
                </div>

                {/* Vote Status Message */}
                {voteStatus.type && (
                  <div
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      voteStatus.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {voteStatus.message}
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl ml-4">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading hotel details...</p>
            </div>
          )}

          {!loading && hotelDetails && (
            <div className="space-y-6">
              {/* Image Carousel */}
              {hotelDetails.hotelImages && hotelDetails.hotelImages.length > 0 && (
                <ImageCarousel
                  hotelImages={hotelDetails.hotelImages}
                  hotelName={hotelDetails.name}
                  title="Photos"
                />
              )}

              {/* Description */}
              {(hotelDetails.description || hotelDetails.hotelDescription) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: hotelDetails.description || hotelDetails.hotelDescription || '',
                    }}
                  />
                </div>
              )}

              {/* Amenities & Facilities */}
              {hotelDetails.facilities && hotelDetails.facilities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amenities & Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {hotelDetails.facilities.map(facility => (
                      <span
                        key={`facility-${facility.facilityId}`}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {facility.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Options */}
              {hotelDetails.rooms && hotelDetails.rooms.length > 0 && (
                <RoomOptions
                  rooms={hotelDetails.rooms}
                  selectedRoom={selectedRoom}
                  onRoomSelect={handleRoomSelect}
                />
              )}
            </div>
          )}

          {!loading && !hotelDetails && (
            <div className="text-center py-8">
              <p className="text-gray-600">Unable to load hotel details.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {selectedRoom && (
            <button
              onClick={() => {
                console.log('Room selected:', selectedRoom);
                onClose();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Select Room
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
