'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-server';

export async function submitVote(
  participantId: string,
  groupId: string,
  destinationId: string,
  hotelId: string
) {
  try {
    const supabase = await createClient();

    // Fetch destination name
    let destinationName = 'Unknown Destination';
    try {
      const destinationsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/destinations`
      );
      const destinationsData = await destinationsResponse.json();
      if (destinationsData.success && destinationsData.data) {
        const destination = destinationsData.data.find((d: any) => d.id === destinationId);
        if (destination) {
          destinationName = destination.name;
        }
      }
    } catch (error) {
      console.error('Failed to fetch destination name:', error);
    }

    // Fetch hotel name if hotelId is provided
    let hotelName: string | null = null;
    if (hotelId) {
      try {
        const hotelsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/hotels?destinationId=${destinationId}`
        );
        const hotelsData = await hotelsResponse.json();
        if (hotelsData.success && hotelsData.data) {
          const hotel = hotelsData.data.find((h: any) => h.id === hotelId);
          if (hotel) {
            hotelName = hotel.name;
          }
        }
      } catch (error) {
        console.error('Failed to fetch hotel name:', error);
      }
    }

    // First, check if participant has already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('trip_votes')
      .select('id')
      .eq('participant_id', participantId)
      .eq('group_id', groupId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected for new votes
      throw new Error('Error checking existing vote');
    }

    // Upsert the vote (insert or update if exists)
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

    // Update participant's has_voted status
    const { error: participantError } = await supabase
      .from('trip_participants')
      .update({ has_voted: true })
      .eq('id', participantId);

    if (participantError) {
      console.error('Participant update error:', participantError);
      throw new Error('Failed to update participant status');
    }

    // Revalidate the page to show updated vote counts
    revalidatePath('/');

    return {
      success: true,
      message: existingVote ? 'Vote updated successfully!' : 'Vote submitted successfully!',
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
