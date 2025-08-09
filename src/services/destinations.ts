import { SkiDestination } from '@/types';
import { mockDestinations } from '@/data/mockData';

// Cache for destinations - cache invalidated for testing
let destinationsCache: SkiDestination[] | null = null;
let cacheExpiry: number = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getDestinations(): Promise<SkiDestination[]> {
  console.log('🏔️ getDestinations called');

  // Check cache first
  if (destinationsCache && Date.now() < cacheExpiry) {
    console.log('📦 Using cached destinations');
    return destinationsCache;
  }

  try {
    console.log('🌐 Fetching destinations from API...');
    // Call our API route instead of LiteAPI directly
    const response = await fetch('/api/destinations');

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      console.log(`✅ Got destinations from ${result.source}:`, result.data.length, 'destinations');
      console.log(
        '🖼️ Image URLs:',
        result.data.map((d: SkiDestination) => ({ name: d.name, imageUrl: d.imageUrl }))
      );

      // Cache the results
      destinationsCache = result.data;
      cacheExpiry = Date.now() + CACHE_DURATION;

      return result.data;
    } else {
      console.warn('⚠️ API returned unsuccessful result, falling back to mock data');
      return mockDestinations;
    }
  } catch (error) {
    console.error('❌ Error fetching destinations:', error);
    return mockDestinations;
  }
}

// Force refresh the cache
export async function refreshDestinations(): Promise<SkiDestination[]> {
  destinationsCache = null;
  cacheExpiry = 0;
  return getDestinations();
}

// Clear cache
export function clearDestinationsCache(): void {
  destinationsCache = null;
  cacheExpiry = 0;
}
