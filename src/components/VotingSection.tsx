import { SkiDestination, Hotel, Participant } from '@/types';

interface VotingSectionProps {
  readonly selectedDestination: SkiDestination;
  readonly selectedHotel: Hotel;
  readonly participants: Participant[];
  readonly onVote: (
    destinationId: string,
    destinationName: string,
    hotelId: string,
    hotelName: string,
    participantId: string
  ) => void;
}

export default function VotingSection({
  selectedDestination,
  selectedHotel,
  participants,
  onVote,
}: Readonly<VotingSectionProps>) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Cast Your Vote</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedDestination?.name} - {selectedHotel?.name}
            </h3>
            <p className="text-gray-600">${selectedHotel?.pricePerNight}/night per room</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {participants.map(participant => (
            <button
              key={participant.id}
              onClick={() =>
                onVote(
                  selectedDestination.id,
                  selectedDestination.name,
                  selectedHotel.id,
                  selectedHotel.name,
                  participant.id
                )
              }
              className={`p-3 rounded-lg border text-left transition-colors ${
                participant.hasVoted
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    participant.hasVoted ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                >
                  {participant.name.charAt(0)}
                </div>
                <span className="font-medium">{participant.name}</span>
                {participant.hasVoted && <span className="text-green-600">✓</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
