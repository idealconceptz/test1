'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-server';
import type { SupabaseClient } from '@supabase/supabase-js';

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
  hotelName: string
): Promise<void> {
  console.log('upsert', participantId, groupId, destinationId, destinationName, hotelId, hotelName);

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
  destinationName: string,
  hotelId: string,
  hotelName: string
) {
  try {
    console.log(participantId, groupId, destinationId, destinationName, hotelId, hotelName);

    const supabase = await createClient();

    const hasExistingVote = await checkExistingVote(supabase, participantId, groupId);

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
        participant_id,
        group_id,
        destination_id,
        destination_name,
        hotel_id,
        hotel_name,
        created_at,
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
