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

function getApiKey(): string {
  const apiKey =
    process.env.LITEAPI_PRIVATE_KEY ||
    process.env.LITEAPI_KEY ||
    process.env.NEXT_PUBLIC_LITEAPI_KEY ||
    process.env.NEXT_PRIVATE_LITEAPI_KEY ||
    'demo_key';

  console.log('LiteAPI Key found:', apiKey.substring(0, 9) + '...');
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

  console.log('Response status:', response.status, response.statusText);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('LiteAPI error response:', errorText);
    throw new Error(
      `LiteAPI request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const responseText = await response.text();
  console.log('📄 Raw response text:', responseText);

  if (!responseText || responseText.trim() === '') {
    console.warn(
      'LiteAPI returned empty response - this might indicate no data found for the request'
    );
    return { hotels: [], currency: 'GBP', checkin: '', checkout: '' } as T;
  }

  try {
    return JSON.parse(responseText);
  } catch (jsonError) {
    console.error('JSON parse error:', jsonError);
    console.error('Response text that failed to parse:', responseText);
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
    const requestBody = {
      checkin: params.checkin,
      checkout: params.checkout,
      currency: params.currency || 'GBP',
      guestNationality: 'GB',
      city: params.cityId,
      occupancies: [
        {
          adults: params.guests,
          children: [],
        },
      ],
    };

    console.log('Searching hotel rates with body:', requestBody);
    console.log('Making request to:', `/hotels/rates`);

    const response = await makeRequest<LiteApiRatesResponse>(
      '/hotels/rates',
      undefined,
      requestBody
    );
    console.log('Hotel rates search successful, response:', response);

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
      amenities: ['WiFi', 'Parking'],
      images: hotel.images?.map(img => img.url) || [],
    }));

    if (!hotels || hotels.length === 0) {
      console.warn('LiteAPI returned empty hotels array - city might not exist or no availability');
      console.log('💡 Consider trying different city names or date ranges');
    }

    const searchResponse: LiteApiSearchResponse = {
      hotels,
      currency: params.currency || 'GBP',
      checkin: params.checkin,
      checkout: params.checkout,
    };

    return { success: true, data: searchResponse };
  } catch (error) {
    console.error('LiteAPI hotel rates search failed:', error);

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

export async function getHotelDetails(hotelId: string, currency: string = 'GBP') {
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

export const SKI_DESTINATION_CITY_IDS = {
  aspen: 'Aspen',
  whistler: 'Whistler',
  vail: 'Vail',
};

export const SKI_DESTINATIONS_META = {
  aspen: {
    name: 'Aspen Snowmass',
    location: 'Aspen, Colorado, USA',
    description: 'World-class skiing with luxury amenities and stunning mountain views.',
    basePricePerPerson: 450,
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
  },
  whistler: {
    name: 'Whistler Blackcomb',
    location: 'Whistler, BC, Canada',
    description: 'Iconic Canadian resort with diverse terrain and vibrant village life.',
    basePricePerPerson: 380,
    imageUrl:
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop&auto=format',
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
