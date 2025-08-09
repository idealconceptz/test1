'use client';

import { useState, useEffect } from 'react';
import { getVoteResults } from '@/app/actions/vote';

interface VotingResultsProps {
  readonly groupId: string;
}

interface RawVote {
  id: string;
  participant_id: string;
  group_id: string;
  destination_id: string;
  destination_name: string;
  hotel_id: string | null;
  hotel_name: string | null;
  created_at: string;
  trip_participants: {
    name: string;
    avatar?: string;
  }[];
}

interface VoteResult {
  destinationId: string;
  destinationName: string;
  hotelId: string | null;
  hotelName: string | null;
  count: number;
  participants: Array<{
    id: string;
    name: string;
  }>;
}

export default function VotingResults({ groupId }: Readonly<VotingResultsProps>) {
  const [votingResults, setVotingResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotingResults = async () => {
      try {
        const result = await getVoteResults(groupId);

        if (result.success && Array.isArray(result.data)) {
          // Group votes by destination+hotel combination
          const groupedVotes: Record<string, VoteResult> = {};

          result.data.forEach((vote: RawVote) => {
            const key = `${vote.destination_id}:${vote.hotel_id || 'no-hotel'}`;
            if (!groupedVotes[key]) {
              groupedVotes[key] = {
                destinationId: vote.destination_id,
                destinationName: vote.destination_name || 'Unknown Destination',
                hotelId: vote.hotel_id,
                hotelName: vote.hotel_name || null,
                count: 0,
                participants: [],
              };
            }
            groupedVotes[key].count++;
            groupedVotes[key].participants.push({
              id: vote.participant_id,
              name: vote.trip_participants[0]?.name || 'Unknown',
            });
          });

          // Convert to array and sort by count (descending)
          const sortedResults = Object.values(groupedVotes);
          sortedResults.sort((a, b) => b.count - a.count);
          setVotingResults(sortedResults);
        } else {
          console.error('Invalid response format:', result);
          setVotingResults([]);
        }
      } catch (error) {
        console.error('Failed to fetch voting results:', error);
        setVotingResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVotingResults();

    // Refresh results every 5 seconds to show live updates
    const interval = setInterval(fetchVotingResults, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Results</h3>
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading results...</p>
        </div>
      </div>
    );
  }

  if (votingResults.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Results</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🗳️</div>
          <p className="text-gray-600">No votes yet</p>
          <p className="text-gray-500 text-sm mt-1">Results will appear here as people vote</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Results</h3>

      <div className="space-y-4">
        {votingResults.map((result, index) => {
          const isWinner = index === 0;

          return (
            <div
              key={`${result.destinationId}_${result.hotelId || 'no-hotel'}`}
              className={`p-4 rounded-lg border ${
                isWinner ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
              }`}
            >
              {isWinner && (
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500 text-lg mr-2">👑</span>
                  <span className="text-yellow-700 font-medium text-sm">Leading Choice</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{result.destinationName}</h4>
                  <p className="text-sm text-gray-600">{result.hotelName || 'Destination Only'}</p>

                  {/* Show participant names who voted for this option */}
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Voted by:</p>
                    <div className="flex flex-wrap gap-1">
                      {result.participants.map(participant => (
                        <span
                          key={participant.id}
                          className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                        >
                          {participant.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-indigo-600">{result.count}</div>
                  <div className="text-xs text-gray-500">
                    {result.count === 1 ? 'vote' : 'votes'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {votingResults.length > 0 && votingResults[0].count >= 1 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">
            🏆 <strong>{votingResults[0].count > 1 ? 'Winner' : 'Current Leader'}:</strong>{' '}
            {votingResults[0].destinationName}
            {votingResults[0].hotelName && ` - ${votingResults[0].hotelName}`}
          </p>
        </div>
      )}
    </div>
  );
}
