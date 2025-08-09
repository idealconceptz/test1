const LITEAPI_BASE_URL = 'https://api.liteapi.travel/v3.0';

interface LiteApiHotel {
  id: string;
  name: string;
  rate?: {
    total: number;
    currency: string;
  };
  price?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  amenities?: string[];
  images?: string[];
}

interface LiteApiSearchResponse {
  hotels: LiteApiHotel[];
  currency: string;
  checkin: string;
  checkout: string;
}

interface LiteApiRatesResponse {
  data: Array<{
    id: string;
    name: string;
    star_rating?: number;
    latitude?: number;
    longitude?: number;
    address?: string;
    images?: Array<{ url: string }>;
    rates?: Array<{
      rate_id: string;
      room_name: string;
      rate_name: string;
      total_amount: number;
      currency: string;
    }>;
  }>;
}

interface PostBody {
  [key: string]: any;
}

function getApiKey(): string {
  const apiKey =
    process.env.LITEAPI_PRIVATE_KEY ||
    process.env.LITEAPI_KEY ||
    process.env.NEXT_PUBLIC_LITEAPI_KEY ||
    process.env.NEXT_PRIVATE_LITEAPI_KEY ||
    'demo_key';

  console.log('🔑 LiteAPI Key found:', apiKey.substring(0, 9) + '...');
  return apiKey;
}

async function makeRequest<T>(
  endpoint: string,
  params?: Record<string, string>,
  body?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`${LITEAPI_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  console.log('🌐 Making LiteAPI request to:', url.toString());

  const requestOptions: RequestInit = {
    method: body ? 'POST' : 'GET',
    headers: {
      'X-API-Key': getApiKey(),
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    requestOptions.body = JSON.stringify(body);
    console.log('📤 Request body:', JSON.stringify(body, null, 2));
  }

  const response = await fetch(url.toString(), requestOptions);

  console.log('📡 Response status:', response.status, response.statusText);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ LiteAPI error response:', errorText);
    throw new Error(
      `LiteAPI request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // Get the response text first to debug
  const responseText = await response.text();
  console.log('📄 Raw response text:', responseText);

  // Check if response is empty or not JSON
  if (!responseText || responseText.trim() === '') {
    console.warn(
      '⚠️ LiteAPI returned empty response - this might indicate no data found for the request'
    );
    // Return empty search response for hotel searches
    return { hotels: [], currency: 'USD', checkin: '', checkout: '' } as T;
  }

  try {
    return JSON.parse(responseText);
  } catch (jsonError) {
    console.error('❌ JSON parse error:', jsonError);
    console.error('❌ Response text that failed to parse:', responseText);
    throw new Error(`Failed to parse LiteAPI response as JSON: ${jsonError}`);
  }
}

export async function searchHotels(params: {
  cityId: string;
  checkin: string;
  checkout: string;
  guests: number;
  currency?: string;
}): Promise<{
  success: boolean;
  data?: LiteApiSearchResponse;
  error?: string;
  rateLimited?: boolean;
}> {
  try {
    // Use the correct LiteAPI rates endpoint
    const requestBody = {
      checkin: params.checkin,
      checkout: params.checkout,
      currency: params.currency || 'GBP',
      guestNationality: 'GB',
      city: params.cityId, // Use city instead of cityId
      occupancies: [
        {
          adults: params.guests,
          children: [],
        },
      ],
    };

    console.log('🔍 Searching hotel rates with body:', requestBody);
    console.log('🌐 Making request to:', `/hotels/rates`);

    const response = await makeRequest<LiteApiRatesResponse>(
      '/hotels/rates',
      undefined,
      requestBody
    );
    console.log('✅ Hotel rates search successful, response:', response);

    // Convert LiteAPI rates response to our format
    const hotels: LiteApiHotel[] = response.data.map((hotel, index) => ({
      id: hotel.id || `hotel-${index}`,
      name: hotel.name || `Hotel ${index + 1}`,
      rate: hotel.rates?.[0]
        ? {
            total: hotel.rates[0].total_amount,
            currency: hotel.rates[0].currency,
          }
        : undefined,
      price: hotel.rates?.[0]?.total_amount || 150,
      location: {
        latitude: hotel.latitude || 0,
        longitude: hotel.longitude || 0,
      },
      amenities: ['WiFi', 'Parking'], // LiteAPI may not include amenities in rates response
      images: hotel.images?.map(img => img.url) || [],
    }));

    // Check if we got any hotels back
    if (!hotels || hotels.length === 0) {
      console.warn(
        '⚠️ LiteAPI returned empty hotels array - city might not exist or no availability'
      );
      console.log('💡 Consider trying different city names or date ranges');
    }

    const searchResponse: LiteApiSearchResponse = {
      hotels,
      currency: params.currency || 'USD',
      checkin: params.checkin,
      checkout: params.checkout,
    };

    return { success: true, data: searchResponse };
  } catch (error) {
    console.error('❌ LiteAPI hotel rates search failed:', error);

    // Check if it's a rate limiting error
    const isRateLimited =
      error instanceof Error &&
      (error.message.includes('429') || error.message.includes('Too many requests'));

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      rateLimited: isRateLimited,
    };
  }
}

export async function getHotelDetails(hotelId: string, currency: string = 'USD') {
  try {
    const response = await makeRequest(`/hotels/${hotelId}`, { currency });
    return { success: true, data: response };
  } catch (error) {
    console.error('LiteAPI hotel details failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCities(countryCode?: string) {
  try {
    const params = countryCode ? { countryCode } : undefined;
    const response = await makeRequest('/cities', params);
    return { success: true, data: response };
  } catch (error) {
    console.error('LiteAPI cities request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getSkiDestinations() {
  try {
    const destinations = [];
    const requestCount = 0;
    const maxRequests = 2; // Limit API calls to avoid rate limiting

    for (const [destinationId, cityId] of Object.entries(SKI_DESTINATION_CITY_IDS)) {
      const meta = SKI_DESTINATIONS_META[destinationId as keyof typeof SKI_DESTINATIONS_META];
      if (!meta) continue;

      const avgPrice = meta.basePricePerPerson;

      // Only try to get real pricing for the first few destinations to avoid rate limits
      if (requestCount < maxRequests) {
        console.log(
          `🏨 Attempting hotel search for ${destinationId} (${requestCount + 1}/${maxRequests})`
        );

        // const hotelSearch = await searchHotels({
        //   cityId,
        //   checkin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        //   checkout: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 day trip
        //   guests: 2,
        // });

        // requestCount++;

        // // If we got real hotel data, calculate average price
        // if (hotelSearch.success && hotelSearch.data?.hotels?.length) {
        //   const prices = hotelSearch.data.hotels.map(
        //     (hotel: LiteApiHotel) => hotel.rate?.total || hotel.price || 0
        //   );
        //   if (prices.length > 0) {
        //     avgPrice = Math.round(
        //       prices.reduce((sum: number, price: number) => sum + price, 0) / prices.length / 7
        //     ); // Per person per day estimate
        //   }
        //   console.log(`✅ Got real pricing for ${destinationId}: $${avgPrice}/person/day`);
        // } else {
        //   console.log(`⚠️ Using fallback pricing for ${destinationId}: $${avgPrice}/person/day`);
        // }

        // // Add a small delay between requests to be respectful of rate limits
        // if (requestCount < maxRequests) {
        //   await new Promise(resolve => setTimeout(resolve, 500));
        // }
      } else {
        console.log(`⏭️ Skipping hotel search for ${destinationId} (rate limit protection)`);
      }

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

    console.log(`✅ Generated ${destinations.length} destinations with ${requestCount} API calls`);
    return { success: true, data: destinations };
  } catch (error) {
    console.error('Failed to get ski destinations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Real LiteAPI city names for ski destinations
export const SKI_DESTINATION_CITY_IDS = {
  aspen: 'Aspen', // Use actual city names
  whistler: 'Whistler', // LiteAPI expects city names
  vail: 'Vail', // These should work better
};

// Ski destination metadata to complement LiteAPI data
export const SKI_DESTINATIONS_META = {
  aspen: {
    name: 'Aspen Snowmass',
    location: 'Aspen, Colorado, USA',
    description: 'World-class skiing with luxury amenities and stunning mountain views.',
    basePricePerPerson: 450,
    imageUrl:
      'https://images.unsplash.com/photo-1419133203517-f3b3ed0ba2bb?w=800&h=600&fit=crop&auto=format',
  },
  whistler: {
    name: 'Whistler Blackcomb',
    location: 'Whistler, BC, Canada',
    description: 'Iconic Canadian resort with diverse terrain and vibrant village life.',
    basePricePerPerson: 380,
    imageUrl:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&auto=format',
  },
  vail: {
    name: 'Vail Ski Resort',
    location: 'Vail, Colorado, USA',
    description: 'Expansive terrain with European-style village charm.',
    basePricePerPerson: 420,
    imageUrl:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&auto=format',
  },
};

// Initialize the service (API key would come from environment variables)
// Note: Functions now use getApiKey() directly, no need for service instance
