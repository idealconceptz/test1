'use client';

import { Participant } from '@/types';

interface ParticipantsListProps {
  readonly participants: Participant[];
}

export default function ParticipantsList({ participants }: Readonly<ParticipantsListProps>) {
  const votedCount = participants.filter(p => p.hasVoted).length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Group Members ({votedCount}/{participants.length} voted)
      </h3>

      <div className="space-y-3">
        {participants.map(participant => (
          <div
            key={participant.id}
            className={`flex items-center space-x-3 p-3 rounded-lg ${
              participant.hasVoted ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                participant.hasVoted ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              {participant.name.charAt(0)}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{participant.name}</p>
              <p className="text-sm text-gray-600">{participant.email}</p>
            </div>

            {participant.hasVoted && (
              <div className="text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {votedCount === participants.length && (
        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
          <p className="text-indigo-800 font-medium">🎉 Everyone has voted!</p>
          <p className="text-indigo-600 text-sm mt-1">
            Check the results to see the winning option.
          </p>
        </div>
      )}
    </div>
  );
}
