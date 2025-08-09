// API route for hotel data (integrating with liteAPI)
import { NextRequest, NextResponse } from 'next/server';
import { mockHotels } from '@/data/mockData';
import { Hotel } from '@/types';

// LiteAPI configuration
const LITEAPI_BASE_URL = 'https://api.liteapi.travel/v3.0';

function getLiteApiKey(): string {
  return process.env.LITEAPI_PRIVATE_KEY || process.env.LITEAPI_KEY || 'demo_key';
}

async function searchLiteApiHotels(params: {
  destinationId: string;
  checkin?: string;
  checkout?: string;
  guests: number;
}) {
  try {
    // First, get hotel data from the data/hotels endpoint
    const hotelsDataUrl = `${LITEAPI_BASE_URL}/data/hotels?countryCode=US&cityName=${encodeURIComponent(params.destinationId)}&limit=6`;
    console.log('🔍 Fetching hotel data from:', hotelsDataUrl);

    const hotelsResponse = await fetch(hotelsDataUrl, {
      method: 'GET',
      headers: {
        'X-API-Key': getLiteApiKey(),
      },
    });

    if (!hotelsResponse.ok) {
      const errorText = await hotelsResponse.text();
      throw new Error(`LiteAPI hotels data error: ${hotelsResponse.status} - ${errorText}`);
    }

    const hotelsData = await hotelsResponse.json();
    console.log('✅ LiteAPI hotels data response:', hotelsData);
    return { success: true, hotels: hotelsData.data || [] };
    // Convert LiteAPI response to our Hotel format
    const hotels: Hotel[] = (hotelsData.data || []).map(
      (
        hotel: {
          id?: string;
          name?: string;
          star_rating?: number;
          images?: Array<{ url: string }>;
          amenities?: Array<{ name: string }>;
          facilities?: Array<{ name: string }>;
          description?: string;
          latitude?: number;
          longitude?: number;
        },
        index: number
      ) => {
        // Extract amenities from various possible fields
        const amenityList = [
          ...(hotel.amenities?.map(a => a.name) || []),
          ...(hotel.facilities?.map(f => f.name) || []),
        ];

        console.log(hotel.amenities, hotel.facilities, amenityList);

        // Add some default amenities if none found, or limit to reasonable number
        const finalAmenities = amenityList;
        // amenityList.length > 0
        //   ? amenityList.slice(0, 6) // Limit to 6 amenities
        //   : ['WiFi', 'Parking', 'Front Desk', 'Room Service'];

        // Use base pricing if no specific dates, otherwise this could be enhanced with rates
        const basePrice = 150 + (hotel.star_rating || 3) * 50; // Simple pricing based on star rating

        return {
          id: hotel.id || `liteapi-${index}`,
          name: hotel.name || `Hotel ${index + 1}`,
          pricePerNight: basePrice,
          rating: hotel.star_rating,
          amenities: finalAmenities,
          imageUrl:
            hotel.images?.[0]?.url ||
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          destinationId: params.destinationId,
        };
      }
    );

    return { success: true, hotels };
  } catch (error) {
    console.error('❌ LiteAPI hotels data search failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');
    const checkin = searchParams.get('checkin');
    const checkout = searchParams.get('checkout');
    const guests = searchParams.get('guests') || '2';

    if (!destinationId) {
      return NextResponse.json(
        { success: false, error: 'Destination ID is required' },
        { status: 400 }
      );
    }

    // Try LiteAPI for live hotel data using the data/hotels endpoint
    console.log(`🏨 Searching live hotels for ${destinationId}`);

    const liteApiResult = await searchLiteApiHotels({
      destinationId,
      checkin: checkin || undefined,
      checkout: checkout || undefined,
      guests: parseInt(guests, 10),
    });

    if (liteApiResult.success && liteApiResult.hotels && liteApiResult.hotels.length > 0) {
      console.log(`✅ Found ${liteApiResult.hotels.length} live hotels`);
      return NextResponse.json({
        success: true,
        data: liteApiResult.hotels,
        source: 'liteapi',
        pricing: checkin && checkout ? 'live' : 'base',
      });
    } else {
      console.warn('⚠️ LiteAPI returned no hotels, falling back to mock data');
    }

    // Fallback to mock data
    const filteredHotels = mockHotels.filter(hotel => hotel.destinationId === destinationId);
    console.log(`⚠️ Using mock data: Found ${filteredHotels.length} hotels for ${destinationId}`);

    return NextResponse.json({
      success: true,
      data: filteredHotels,
      source: 'mock',
    });
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch hotels' }, { status: 500 });
  }
}
