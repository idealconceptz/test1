import { Hotel } from '@/types';

export interface HotelSearchParams {
  destinationId: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
}

/**
 * Get hotels for a specific destination
 * @param params - Search parameters including destinationId and optional date/guest filters
 * @returns Promise<Hotel[]> - Array of hotels for the destination
 */
export async function getHotels(params: HotelSearchParams): Promise<Hotel[]> {
  try {
    const searchParams = new URLSearchParams({
      destinationId: params.destinationId,
    });

    // Add optional parameters if provided
    if (params.checkin) {
      searchParams.append('checkin', params.checkin);
    }
    if (params.checkout) {
      searchParams.append('checkout', params.checkout);
    }
    if (params.guests) {
      searchParams.append('guests', params.guests.toString());
    }

    const response = await fetch(`/api/hotels?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch hotels: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch hotels');
    }

    return data.data || [];
  } catch (error) {
    console.error('Hotels service error:', error);
    throw error;
  }
}

export async function getHotelDetails(hotelId: string): Promise<Hotel | null> {
  try {
    const response = await fetch(`/api/hotels/${hotelId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch hotel details: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch hotel details');
    }

    return data.data;
  } catch (error) {
    console.error('Hotel details service error:', error);
    throw error;
  }
}
