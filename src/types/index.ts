// Core types for the ski trip planning app

export interface SkiDestination {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  basePricePerPerson: number;
}

export interface Hotel {
  id: string;
  name: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  imageUrl: string;
  destinationId: string;
  hotelDescription?: string;
  thumbnail?: string;
}

export interface HotelDetails {
  id: string;
  name: string;
  description?: string;
  hotelDescription?: string;
  images?: Array<{ url: string; description?: string }>;
  hotelImages?: Array<{
    url: string;
    urlHd: string;
    caption: string;
    order: number;
    defaultImage: boolean;
  }>;
  photos?: Array<{
    url: string;
    imageDescription: string;
    imageClass1: string;
    imageClass2: string;
    failoverPhoto: string;
    mainPhoto: boolean;
    score: number;
    classId: number;
    classOrder: number;
    hd_url: string;
  }>;
  roomAmenities?: Array<{ amenitiesId: number; name: string }>;
  facilities?: Array<{ facilityId: number; name: string; description?: string }>;
  rooms?: Room[];
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  star_rating?: number;
  latitude?: number;
  longitude?: number;
}

export interface HotelImage {
  url: string;
  urlHd: string;
  caption: string;
  order: number;
  defaultImage: boolean;
}

export interface Room {
  id: string;
  roomName: string;
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
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  hasVoted: boolean;
}

export interface Vote {
  participantId: string;
  destinationId: string;
  destinationName: string;
  hotelId: string;
  hotelName: string;
  timestamp: Date;
}

export interface TripOption {
  destinationId: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms: { roomType: string; quantity: number }[];
  totalPrice: number;
}

export interface Group {
  id: string;
  name: string;
  participants: Participant[];
  votes: Vote[];
  selectedTrip?: TripOption;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Supabase Database Types
export interface RoomsConfig {
  roomType: string;
  quantity: number;
}

export interface Database {
  public: {
    Tables: {
      trip_groups: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      trip_participants: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          email: string;
          avatar: string | null;
          has_voted: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          email: string;
          avatar?: string | null;
          has_voted?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          email?: string;
          avatar?: string | null;
          has_voted?: boolean;
        };
      };
      trip_votes: {
        Row: {
          id: string;
          participant_id: string;
          group_id: string;
          destination_id: string;
          destination_name: string;
          hotel_id: string | null;
          hotel_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          participant_id: string;
          group_id: string;
          destination_id: string;
          destination_name: string;
          hotel_id?: string | null;
          hotel_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          participant_id?: string;
          group_id?: string;
          destination_id?: string;
          destination_name?: string;
          hotel_id?: string | null;
          hotel_name?: string | null;
          created_at?: string;
        };
      };
      trip_selections: {
        Row: {
          id: string;
          group_id: string;
          destination_id: string;
          hotel_id: string | null;
          check_in: string;
          check_out: string;
          total_price: number;
          rooms_config: RoomsConfig[];
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          destination_id: string;
          hotel_id?: string | null;
          check_in: string;
          check_out: string;
          total_price: number;
          rooms_config: RoomsConfig[];
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          destination_id?: string;
          hotel_id?: string | null;
          check_in?: string;
          check_out?: string;
          total_price?: number;
          rooms_config?: RoomsConfig[];
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
