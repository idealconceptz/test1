import { useState } from 'react';
import { Participant } from '@/types';

interface UserSelectionProps {
  readonly participants: Participant[];
  readonly onUserSelect: (user: Participant) => void;
  readonly selectedUser: Participant | null;
}

export default function UserSelection({
  participants,
  onUserSelect,
  selectedUser,
}: Readonly<UserSelectionProps>) {
  const [isChangingUser, setIsChangingUser] = useState(false);

  // If no user is selected, show the selection interface
  if (!selectedUser || isChangingUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {isChangingUser ? 'Change User' : 'Who are you?'}
          </h2>
          <p className="text-gray-600 mb-6 text-center">Select your name to continue</p>

          <div className="space-y-3">
            {participants.map(participant => (
              <button
                key={participant.id}
                onClick={() => {
                  onUserSelect(participant);
                  setIsChangingUser(false);
                }}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{participant.name}</span>
                  {participant.hasVoted && (
                    <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">
                      Already voted
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {isChangingUser && (
            <button
              onClick={() => setIsChangingUser(false)}
              className="w-full mt-4 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // If user is selected, show a small indicator with option to change
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-700">Logged in as:</span>
          <span className="font-medium text-blue-900">{selectedUser.name}</span>
          {selectedUser.hasVoted && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Voted</span>
          )}
        </div>
        <button
          onClick={() => setIsChangingUser(true)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Change User
        </button>
      </div>
    </div>
  );
}
