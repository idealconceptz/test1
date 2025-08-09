'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-server';
import type { SupabaseClient } from '@supabase/supabase-js';

async function fetchDestinationName(destinationId: string): Promise<string> {
  try {
    const destinationsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/destinations`
    );
    const destinationsData = await destinationsResponse.json();

    if (destinationsData.success && destinationsData.data) {
      const destination = destinationsData.data.find(
        (d: { id: string; name: string }) => d.id === destinationId
      );
      return destination?.name || 'Unknown Destination';
    }
  } catch (error) {
    console.error('Failed to fetch destination name:', error);
  }
  return 'Unknown Destination';
}

async function fetchHotelName(destinationId: string, hotelId: string): Promise<string | null> {
  if (!hotelId) return null;

  try {
    const hotelsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/hotels?destinationId=${destinationId}`
    );
    const hotelsData = await hotelsResponse.json();

    if (hotelsData.success && hotelsData.data) {
      const hotel = hotelsData.data.find((h: { id: string; name: string }) => h.id === hotelId);
      return hotel?.name || null;
    }
  } catch (error) {
    console.error('Failed to fetch hotel name:', error);
  }
  return null;
}

async function checkExistingVote(
  supabase: SupabaseClient,
  participantId: string,
  groupId: string
): Promise<boolean> {
  const { data: existingVote, error: checkError } = await supabase
    .from('trip_votes')
    .select('id')
    .eq('participant_id', participantId)
    .eq('group_id', groupId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error('Error checking existing vote');
  }

  return !!existingVote;
}

async function upsertVote(
  supabase: SupabaseClient,
  participantId: string,
  groupId: string,
  destinationId: string,
  destinationName: string,
  hotelId: string,
  hotelName: string | null
): Promise<void> {
  const { error: voteError } = await supabase.from('trip_votes').upsert(
    {
      participant_id: participantId,
      group_id: groupId,
      destination_id: destinationId,
      destination_name: destinationName,
      hotel_id: hotelId,
      hotel_name: hotelName,
    },
    {
      onConflict: 'participant_id,group_id',
    }
  );

  if (voteError) {
    console.error('Vote error:', voteError);
    throw new Error('Failed to submit vote');
  }
}

async function updateParticipantVoteStatus(
  supabase: SupabaseClient,
  participantId: string
): Promise<void> {
  const { error: participantError } = await supabase
    .from('trip_participants')
    .update({ has_voted: true })
    .eq('id', participantId);

  if (participantError) {
    console.error('Participant update error:', participantError);
    throw new Error('Failed to update participant status');
  }
}

export async function submitVote(
  participantId: string,
  groupId: string,
  destinationId: string,
  hotelId: string
) {
  try {
    const supabase = await createClient();

    const [destinationName, hotelName, hasExistingVote] = await Promise.all([
      fetchDestinationName(destinationId),
      fetchHotelName(destinationId, hotelId),
      checkExistingVote(supabase, participantId, groupId),
    ]);

    await upsertVote(
      supabase,
      participantId,
      groupId,
      destinationId,
      destinationName,
      hotelId,
      hotelName
    );

    await updateParticipantVoteStatus(supabase, participantId);

    revalidatePath('/');

    return {
      success: true,
      message: hasExistingVote ? 'Vote updated successfully!' : 'Vote submitted successfully!',
    };
  } catch (error) {
    console.error('Submit vote error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit vote',
    };
  }
}

export async function getVoteResults(groupId: string) {
  try {
    const supabase = await createClient();

    const { data: votes, error } = await supabase
      .from('trip_votes')
      .select(
        `
        id,
        destination_id,
        hotel_id,
        trip_participants!inner(name, avatar)
      `
      )
      .eq('group_id', groupId);

    if (error) {
      throw new Error('Failed to fetch vote results');
    }

    return { success: true, data: votes };
  } catch (error) {
    console.error('Get vote results error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch vote results',
    };
  }
}
