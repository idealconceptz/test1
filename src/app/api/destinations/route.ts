import { NextResponse } from 'next/server';
// import { getSkiDestinations } from '@/services/liteApi';
import { mockDestinations } from '@/data/mockData';
import { SKI_DESTINATION_CITY_IDS, SKI_DESTINATIONS_META } from '@/services/liteApi';

export async function GET() {
  try {
    console.log('🏔️ Destinations API called');

    // Try to get real data from LiteAPI
    const response = await getDestinations();

    if (response.success && response.data) {
      console.log('✅ Using real LiteAPI data for destinations');
      console.log('📊 Destination data:', JSON.stringify(response.data, null, 2));

      return NextResponse.json({
        success: true,
        data: response.data,
        source: 'liteapi',
      });
    } else {
      console.warn('⚠️ LiteAPI failed, falling back to mock data:', response.error);
      return NextResponse.json({
        success: true,
        data: mockDestinations,
        source: 'mock',
      });
    }
  } catch (error) {
    console.error('❌ Error in destinations API:', error);
    return NextResponse.json({
      success: true,
      data: mockDestinations,
      source: 'mock_fallback',
    });
  }
}

async function getDestinations() {
  try {
    const destinations = [];
    // const requestCount = 0;

    for (const [destinationId, cityId] of Object.entries(SKI_DESTINATION_CITY_IDS)) {
      const meta = SKI_DESTINATIONS_META[destinationId as keyof typeof SKI_DESTINATIONS_META];
      if (!meta) continue;

      const avgPrice = meta.basePricePerPerson;

      destinations.push({
        id: destinationId,
        name: meta.name,
        location: meta.location,
        description: meta.description,
        imageUrl: meta.imageUrl,
        basePricePerPerson: avgPrice,
        cityId, // Include for hotel searches
      });
    }

    console.log(`✅ Generated ${destinations.length} destinations API calls`);
    return { success: true, data: destinations };
  } catch (error) {
    console.error('Failed to get ski destinations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
