'use client';

import { useState, useEffect } from 'react';
import { Room, Participant } from '../types';
import { saveRoomSelection, getUserRoomSelection } from '../app/actions/roomSelection';

interface RoomItemProps {
  readonly room: Room;
  readonly hotelId: string;
  readonly selectedRoom: Room | null;
  readonly onSelect: (room: Room) => void;
}

interface RoomOptionsProps {
  readonly rooms: Room[];
  readonly groupId: string;
  readonly destinationId: string;
  readonly destinationName: string;
  readonly hotelId: string;
  readonly hotelName: string;
  readonly selectedUser: Participant;
  readonly isOpen?: boolean;
}

export default function RoomOptions({
  rooms,
  groupId,
  destinationId,
  destinationName,
  hotelId,
  hotelName,
  selectedUser,
  isOpen,
}: RoomOptionsProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExistingSelection = async () => {
      setIsLoading(true);
      try {
        const result = await getUserRoomSelection(selectedUser.id, groupId, hotelId);
        if (result.success && result.data) {
          const savedRoom = rooms.find(room => room.id === result.data.room_id);
          if (savedRoom) {
            setSelectedRoom(savedRoom);
          }
        } else {
          setSelectedRoom(null);
        }
      } catch (error) {
        console.error('Error loading existing room selection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && rooms.length > 0 && selectedUser) {
      loadExistingSelection();
    }
  }, [selectedUser, groupId, hotelId, rooms, isOpen]);

  const handleSaveSelection = async () => {
    if (!selectedRoom) {
      setSaveStatus({ type: 'error', message: 'Please select a room option' });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const result = await saveRoomSelection({
        participantId: selectedUser.id,
        groupId,
        destinationId,
        destinationName,
        hotelId,
        hotelName,
        roomId: selectedRoom.id,
        roomName: selectedRoom.roomName,
        roomDetails: selectedRoom,
      });

      if (result.success) {
        setSaveStatus({ type: 'success', message: 'Room selection saved successfully!' });
      } else {
        setSaveStatus({ type: 'error', message: result.error || 'Failed to save selection' });
      }
    } catch (error) {
      setSaveStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to save selection',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold mb-4">Room Options</h3>
        <div className="text-gray-600">Loading your room selection...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">Room Options</h3>

      <div className="bg-blue-50 p-3 rounded-lg border">
        <p className="text-sm text-blue-800">
          <strong>Selecting for:</strong> {selectedUser.name} ({selectedUser.email})
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={handleSaveSelection}
          disabled={!selectedRoom || isSaving}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            !selectedRoom || isSaving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Room Selection'}
        </button>

        {saveStatus && (
          <div
            className={`p-3 rounded-lg text-sm ${
              saveStatus.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {saveStatus.message}
          </div>
        )}
      </div>

      {selectedRoom && (
        <p className="text-xs text-blue-600 mt-1">Currently selected: {selectedRoom.roomName}</p>
      )}

      <div className="space-y-4">
        {rooms.map(room => (
          <RoomItem
            key={room.id}
            room={room}
            hotelId={hotelId}
            selectedRoom={selectedRoom}
            onSelect={setSelectedRoom}
          />
        ))}
      </div>
    </div>
  );
}

function RoomItem({ room, hotelId, selectedRoom, onSelect }: RoomItemProps) {
  const isSelected = selectedRoom?.id === room.id;

  return (
    <label
      htmlFor={`room-${room.id}`}
      aria-label={`Select ${room.roomName} room`}
      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start space-x-3">
        <input
          id={`room-${room.id}`}
          type="radio"
          name={`room-${hotelId}`}
          value={room.id}
          checked={isSelected}
          onChange={() => onSelect(room)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">{room.roomName}</h4>
            <span className="text-lg font-semibold text-gray-900">
              {room.maxOccupancy ? `Max: ${room.maxOccupancy}` : 'N/A'}
            </span>
          </div>
          {room.description && <p className="text-sm text-gray-600 mt-1">{room.description}</p>}
          {room.roomAmenities && room.roomAmenities.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {room.roomAmenities.map(amenity => (
                  <span
                    key={amenity.amenitiesId}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                  >
                    {amenity.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {room.bedTypes && room.bedTypes.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {room.bedTypes
                  .map(bed => `${bed.quantity} ${bed.bedType} ${bed.bedSize}`)
                  .join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </label>
  );
}
