interface Room {
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
}

interface RoomOptionsProps {
  readonly rooms: Room[];
  readonly selectedRoom: string;
  readonly onRoomSelect: (roomId: string) => void;
  readonly title?: string;
}

export default function RoomOptions({
  rooms,
  selectedRoom,
  onRoomSelect,
  title = 'Room Options',
}: Readonly<RoomOptionsProps>) {
  if (!rooms || rooms.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        {rooms.map(room => (
          <label
            key={room.id}
            className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedRoom === room.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            htmlFor={`room-${room.id}`}
            aria-label={`Select ${room.roomName} room`}
          >
            <input
              type="radio"
              id={`room-${room.id}`}
              name="room"
              value={room.id}
              checked={selectedRoom === room.id}
              onChange={() => onRoomSelect(room.id)}
              className="sr-only"
            />
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{room.roomName}</h4>
                {room.description && (
                  <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  {room.maxOccupancy && <span>Max Occupancy: {room.maxOccupancy}</span>}
                  {room.roomSizeSquare && room.roomSizeUnit && (
                    <span>
                      Size: {room.roomSizeSquare} {room.roomSizeUnit}
                    </span>
                  )}
                  {room.bedTypes && room.bedTypes.length > 0 && (
                    <span>
                      Beds: {room.bedTypes.map(bed => `${bed.quantity}x ${bed.bedType}`).join(', ')}
                    </span>
                  )}
                </div>
                {room.roomAmenities && room.roomAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.roomAmenities.map(amenity => (
                      <span
                        key={`room-amenity-${room.id}-${amenity.amenitiesId}`}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {amenity.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="ml-4">
                <div
                  className={`w-4 h-4 border-2 rounded-full ${
                    selectedRoom === room.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                  }`}
                >
                  {selectedRoom === room.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
