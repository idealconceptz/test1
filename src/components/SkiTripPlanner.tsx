'use client';

import { useState, useEffect } from 'react';
import { Group, SkiDestination, Hotel } from '@/types';
import { mockDestinations } from '@/data/mockData';
import { getDestinations } from '@/services/destinations';
import { getHotels } from '@/services/hotels';
import { getFullGroupData } from '@/app/actions/group';
import { submitVote } from '@/app/actions/vote';
import { useUserSelection } from '@/hooks/useUserSelection';
import DestinationCard from './DestinationCard';
import HotelList from './HotelList';
import VotingSection from './VotingSection';
import VotingResults from './VotingResults';
import ParticipantsList from './ParticipantsList';
import UserSelection from './UserSelection';

interface SkiTripPlannerProps {
  readonly group: Group;
  readonly onResetGroup: () => void;
}

export default function SkiTripPlanner({ group }: Readonly<SkiTripPlannerProps>) {
  const [destinations, setDestinations] = useState<SkiDestination[]>([]);
  const [destinationsLoading, setDestinationsLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<SkiDestination | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [currentGroup, setCurrentGroup] = useState<Group>(group);
  const [loading, setLoading] = useState(false);
  const { selectedUser, selectUser } = useUserSelection(currentGroup.participants);
  const [checkinDate] = useState<string>('');
  const [checkoutDate] = useState<string>('');

  useEffect(() => {
    const loadDestinations = async () => {
      setDestinationsLoading(true);
      try {
        const dests = await getDestinations();
        setDestinations(dests);
      } catch (error) {
        console.error('Failed to load destinations:', error);
        setDestinations(mockDestinations);
      } finally {
        setDestinationsLoading(false);
      }
    };

    loadDestinations();
  }, []);

  const refreshGroup = async () => {
    try {
      const result = await getFullGroupData(group.id);
      if (result.success && result.data) {
        setCurrentGroup(result.data);
      }
    } catch (error) {
      console.error('Failed to refresh group data:', error);
    }
  };

  useEffect(() => {
    if (selectedDestination) {
      const loadHotels = async () => {
        setLoading(true);
        try {
          const hotelParams: { destinationId: string; checkin?: string; checkout?: string } = {
            destinationId: selectedDestination.id,
          };

          if (checkinDate && checkoutDate) {
            hotelParams.checkin = checkinDate;
            hotelParams.checkout = checkoutDate;
          }

          const hotelData = await getHotels(hotelParams);
          setHotels(hotelData);
        } catch (error) {
          console.error('Failed to load hotels:', error);
          setHotels([]);
        } finally {
          setLoading(false);
        }
      };

      loadHotels();
    }
  }, [selectedDestination, checkinDate, checkoutDate]);

  const handleVote = async (
    destinationId: string,
    destinationName: string,
    hotelId: string,
    hotelName: string,
    participantId: string
  ) => {
    try {
      const result = await submitVote(
        participantId,
        group.id,
        destinationId,
        destinationName,
        hotelId,
        hotelName
      );

      if (result.success) {
        await refreshGroup();
      } else {
        console.error('Vote submission failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <UserSelection
        participants={currentGroup.participants}
        onUserSelect={selectUser}
        selectedUser={selectedUser}
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{currentGroup.name}</h1>
          <p className="text-gray-600 mt-1">Plan your perfect ski adventure together</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Destination</h2>
            {destinationsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading destinations...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {destinations.map(destination => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    selected={selectedDestination?.id === destination.id}
                    onSelect={() => {
                      setSelectedDestination(destination);
                      setSelectedHotel(null);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          {selectedDestination && (
            <HotelList
              hotels={hotels}
              selectedHotel={selectedHotel}
              onSelectHotel={setSelectedHotel}
              loading={loading}
              destinationName={selectedDestination.name}
              participants={selectedUser ? [selectedUser] : []}
              groupId={currentGroup.id}
              destinationId={selectedDestination.id}
              selectedUser={selectedUser}
            />
          )}

          {selectedDestination && selectedHotel && (
            <VotingSection
              selectedDestination={selectedDestination}
              selectedHotel={selectedHotel}
              participants={currentGroup.participants}
              onVote={handleVote}
            />
          )}
        </div>

        <div className="space-y-8">
          <ParticipantsList participants={currentGroup.participants} />
          <VotingResults groupId={currentGroup.id} />
        </div>
      </div>
    </div>
  );
}
