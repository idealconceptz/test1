import { useState, useEffect, useCallback } from 'react';
import { Hotel, Participant, HotelDetails } from '@/types';
import { submitVote } from '@/app/actions/vote';
import ImageCarousel from './ImageCarousel';
import RoomOptions from './RoomOptions';

interface HotelDetailsModalProps {
  readonly hotel: Hotel | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly participants?: Participant[];
  readonly destinationId: string;
  readonly groupId: string;
  readonly selectedUser: Participant | null;
}

export default function HotelDetailsModal({
  hotel,
  isOpen,
  onClose,
  participants,
  destinationId,
  groupId,
  selectedUser,
}: Readonly<HotelDetailsModalProps>) {
  const [hotelDetails, setHotelDetails] = useState<HotelDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [voteStatus, setVoteStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [destinationName, setDestinationName] = useState<string>('');

  const fetchDestinationName = useCallback(async () => {
    try {
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        const destination = data.data.find(
          (dest: { id: string; name: string }) => dest.id === destinationId
        );
        if (destination) {
          setDestinationName(destination.name);
        }
      }
    } catch (error) {
      console.error('Error fetching destination name:', error);
    }
  }, [destinationId]);

  const fetchHotelDetails = useCallback(async (hotelId: string) => {
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
  }, []);

  useEffect(() => {
    if (isOpen && hotel) {
      fetchHotelDetails(hotel.id);
      fetchDestinationName();
    }
  }, [isOpen, hotel, fetchHotelDetails, fetchDestinationName]);

  const handleVote = async () => {
    if (selectedUser && hotel && destinationId && groupId) {
      setVoteStatus({ type: null, message: '' });

      try {
        console.log(selectedUser.id, groupId, destinationId, destinationName, hotel.id, hotel.name);
        const result = await submitVote(
          selectedUser.id,
          groupId,
          destinationId,
          destinationName,
          hotel.id,
          hotel.name
        );

        if (result.success) {
          setVoteStatus({
            type: 'success',
            message: result.message || 'Vote submitted successfully!',
          });
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
      onKeyDown={e => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      role="button"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex-1">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              {hotel?.name || 'Hotel Details'}
            </h2>

            {participants && participants.length > 0 && groupId && destinationId && (
              <div className="flex flex-col items-center gap-3 mt-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleVote}
                    disabled={!selectedUser}
                    className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
                      selectedUser
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    I Vote For This Hotel!
                  </button>
                </div>

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

        <div className="p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading hotel details...</p>
            </div>
          )}

          {!loading && hotelDetails && (
            <div className="space-y-6">
              {hotelDetails.hotelImages && hotelDetails.hotelImages.length > 0 && (
                <ImageCarousel
                  hotelImages={hotelDetails.hotelImages}
                  hotelName={hotelDetails.name}
                  title="Photos"
                />
              )}

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

              {hotelDetails.rooms && hotelDetails.rooms.length > 0 && hotel && selectedUser && (
                <RoomOptions
                  rooms={hotelDetails.rooms}
                  selectedUser={selectedUser}
                  groupId={groupId}
                  destinationId={destinationId}
                  destinationName={destinationName}
                  hotelId={hotel.id}
                  hotelName={hotel.name}
                  isOpen={isOpen}
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

        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
