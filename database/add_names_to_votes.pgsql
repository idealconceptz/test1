-- Migration script to add destination_name and hotel_name to trip_votes table
-- Run this in your Supabase SQL Editor if you have existing data

-- Add new columns to trip_votes table
ALTER TABLE public.trip_votes 
ADD COLUMN IF NOT EXISTS destination_name TEXT,
ADD COLUMN IF NOT EXISTS hotel_name TEXT;

-- Note: After running this migration, you'll need to populate the destination_name 
-- and hotel_name for any existing votes by fetching the data from your APIs
-- or you can delete existing votes to start fresh with the new schema
