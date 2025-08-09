import { NextResponse } from 'next/server';
import { searchHotels } from '@/services/liteApi';

export async function GET() {
  try {
    console.log('🔍 Testing LiteAPI city search...');

    // Try some major cities that definitely should have hotels
    const testIds = [
      'new_york',
      'london',
      'paris',
      'tokyo',
      'NEW_YORK',
      'LONDON',
      'PARIS',
      'TOKYO',
      'NYC',
      'LON',
      'PAR',
      'TYO',
      'newyork',
      'losangeles',
      'chicago',
      'miami',
    ];

    const results = [];

    for (const cityId of testIds) {
      try {
        console.log(`Testing cityId: ${cityId}`);
        const result = await searchHotels({
          cityId,
          checkin: '2024-03-15', // Try future dates
          checkout: '2024-03-16',
          guests: 2,
        });

        const hasHotels = result.success && result.data?.hotels && result.data.hotels.length > 0;

        results.push({
          cityId,
          success: result.success,
          hotelCount: hasHotels ? result.data!.hotels!.length : 0,
          error: result.success ? null : 'API call failed',
        });

        if (hasHotels) {
          console.log(`✅ Found ${result.data!.hotels!.length} hotels for cityId: ${cityId}`);
        } else {
          console.log(`❌ No hotels for cityId: ${cityId}`);
        }
      } catch (error) {
        results.push({
          cityId,
          success: false,
          hotelCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.log(`❌ Error for cityId ${cityId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      workingCities: results.filter(r => r.hotelCount > 0),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
