import { supabase } from '@/lib/supabase';
import type { Database } from '@/types';

type GroupRow = Database['public']['Tables']['trip_groups']['Row'];
type ParticipantRow = Database['public']['Tables']['trip_participants']['Row'];
type VoteRow = Database['public']['Tables']['trip_votes']['Row'];
type TripSelectionRow = Database['public']['Tables']['trip_selections']['Row'];

export async function createGroup(
  name: string
): Promise<{ success: boolean; data?: GroupRow; error?: string }> {
  try {
    const { data, error } = await supabase.from('trip_groups').insert({ name }).select().single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getGroup(
  groupId: string
): Promise<{ success: boolean; data?: GroupRow; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('trip_groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function addParticipant(
  groupId: string,
  name: string,
  email: string,
  avatar?: string
): Promise<{ success: boolean; data?: ParticipantRow; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('trip_participants')
      .insert({ group_id: groupId, name, email, avatar })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getParticipants(
  groupId: string
): Promise<{ success: boolean; data?: ParticipantRow[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('trip_participants')
      .select('*')
      .eq('group_id', groupId)
      .order('name');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Vote operations
export async function submitVote(
  participantId: string,
  groupId: string,
  destinationId: string,
  destinationName: string,
  hotelId?: string,
  hotelName?: string
): Promise<{ success: boolean; data?: VoteRow; error?: string }> {
  try {
    // First, check if participant has already voted
    const { data: existingVote } = await supabase
      .from('trip_votes')
      .select('id')
      .eq('participant_id', participantId)
      .eq('group_id', groupId)
      .single();

    if (existingVote) {
      // Update existing vote
      const { data, error } = await supabase
        .from('trip_votes')
        .update({
          destination_id: destinationId,
          destination_name: destinationName,
          hotel_id: hotelId || null,
          hotel_name: hotelName || null,
        })
        .eq('id', existingVote.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update participant's voting status
      await supabase.from('trip_participants').update({ has_voted: true }).eq('id', participantId);

      return { success: true, data };
    } else {
      // Create new vote
      const { data, error } = await supabase
        .from('trip_votes')
        .insert({
          participant_id: participantId,
          group_id: groupId,
          destination_id: destinationId,
          destination_name: destinationName,
          hotel_id: hotelId || null,
          hotel_name: hotelName || null,
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Update participant's voting status
      await supabase.from('trip_participants').update({ has_voted: true }).eq('id', participantId);

      return { success: true, data };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getVotes(
  groupId: string
): Promise<{ success: boolean; data?: VoteRow[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('trip_votes')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });
    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function saveTripSelection(
  groupId: string,
  destinationId: string,
  checkIn: string,
  checkOut: string,
  totalPrice: number,
  roomsConfig: Database['public']['Tables']['trip_selections']['Row']['rooms_config'],
  hotelId?: string
): Promise<{ success: boolean; data?: TripSelectionRow; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('trip_selections')
      .insert({
        group_id: groupId,
        destination_id: destinationId,
        hotel_id: hotelId || null,
        check_in: checkIn,
        check_out: checkOut,
        total_price: totalPrice,
        rooms_config: roomsConfig,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getTripSelection(
  groupId: string
): Promise<{ success: boolean; data?: TripSelectionRow; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('trip_selections')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
