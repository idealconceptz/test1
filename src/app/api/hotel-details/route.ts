// API route for fetching detailed hotel information from LiteAPI
import { NextRequest, NextResponse } from 'next/server';

const LITEAPI_BASE_URL = 'https://api.liteapi.travel/v3.0';

function getLiteApiKey(): string {
  return process.env.LITEAPI_PRIVATE_KEY || process.env.LITEAPI_KEY || 'demo_key';
}

async function fetchHotelDetails(hotelId: string) {
  try {
    console.log(`🏨 Fetching hotel details for ID: ${hotelId}`);

    const response = await fetch(`${LITEAPI_BASE_URL}/data/hotel?hotelId=${hotelId}`, {
      method: 'GET',
      headers: {
        'X-API-Key': getLiteApiKey(),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LiteAPI hotel details error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ LiteAPI hotel details response:', data);

    return { success: true, data: data.data };
  } catch (error) {
    console.error('❌ LiteAPI hotel details fetch failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json({ success: false, error: 'Hotel ID is required' }, { status: 400 });
    }

    const result = await fetchHotelDetails(hotelId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        source: 'liteapi',
      });
    } else {
      // Return a fallback response with limited information
      return NextResponse.json({
        success: true,
        data: {
          id: hotelId,
          name: 'Hotel Details Unavailable',
          description: 'Unable to load detailed hotel information at this time.',
          amenities: [],
          facilities: [],
          rooms: [],
        },
        source: 'fallback',
      });
    }
  } catch (error) {
    console.error('Failed to fetch hotel details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hotel details' },
      { status: 500 }
    );
  }
}
