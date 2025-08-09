'use server';

import { createClient } from '@/lib/supabase-server';

interface RoomSelectionData {
  participantId: string;
  groupId: string;
  destinationId: string;
  destinationName: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  roomDetails: {
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
  };
}

export async function saveRoomSelection(selectionData: RoomSelectionData) {
  try {
    const supabase = await createClient();
    console.log('saveRoomSelection called with data:', selectionData);

    // First, try to delete any existing selection for this participant/group/hotel combination
    // This allows them to change their room selection at the same hotel
    const deleteResult = await supabase
      .from('trip_room_selections')
      .delete()
      .eq('participant_id', selectionData.participantId)
      .eq('group_id', selectionData.groupId)
      .eq('hotel_id', selectionData.hotelId);

    console.log('Delete result:', deleteResult);

    // Then insert the new selection
    const { data, error } = await supabase
      .from('trip_room_selections')
      .insert({
        participant_id: selectionData.participantId,
        group_id: selectionData.groupId,
        destination_id: selectionData.destinationId,
        destination_name: selectionData.destinationName,
        hotel_id: selectionData.hotelId,
        hotel_name: selectionData.hotelName,
        room_id: selectionData.roomId,
        room_name: selectionData.roomName,
        room_details: selectionData.roomDetails,
      })
      .select()
      .single();

    console.log('Insert result:', { data, error });

    if (error) {
      console.error('Error saving room selection:', error);
      return {
        success: false,
        error: 'Failed to save room selection: ' + error.message,
      };
    }

    return {
      success: true,
      message: 'Room selection saved successfully!',
      data,
    };
  } catch (error) {
    console.error('Save room selection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save room selection',
    };
  }
}

export async function getRoomSelections(groupId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('trip_room_selections')
      .select(
        `
        *,
        participant:trip_participants(name, email)
      `
      )
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching room selections:', error);
      return {
        success: false,
        error: 'Failed to fetch room selections',
      };
    }

    return {
      success: true,
      data: data || [],
    };
  } catch (error) {
    console.error('Get room selections error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch room selections',
    };
  }
}

export async function getUserRoomSelection(
  participantId: string,
  groupId: string,
  hotelId: string
) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('trip_room_selections')
      .select('*')
      .eq('participant_id', participantId)
      .eq('group_id', groupId)
      .eq('hotel_id', hotelId)
      .single();

    if (error) {
      // No selection found is not an error
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: null,
        };
      }
      console.error('Error fetching user room selection:', error);
      return {
        success: false,
        error: 'Failed to fetch room selection',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Get user room selection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch room selection',
    };
  }
}
