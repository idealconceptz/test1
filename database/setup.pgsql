-- Supabase Database Setup for Ski Trip Planner
-- Run these commands in your Supabase SQL Editor


-- Create trip_groups table (renamed to support any type of group trip in the future)
CREATE TABLE IF NOT EXISTS public.trip_groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_participants table
CREATE TABLE IF NOT EXISTS public.trip_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.trip_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar TEXT,
    has_voted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trip_votes table
CREATE TABLE IF NOT EXISTS public.trip_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_id UUID NOT NULL REFERENCES public.trip_participants(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.trip_groups(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    destination_name TEXT NOT NULL,
    hotel_id TEXT,
    hotel_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure one vote per participant per group
    CONSTRAINT unique_trip_participant_group UNIQUE(participant_id, group_id)
);

-- Create trip_selections table
CREATE TABLE IF NOT EXISTS public.trip_selections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES public.trip_groups(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    hotel_id TEXT,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    rooms_config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_participants_group_id ON public.trip_participants(group_id);
CREATE INDEX IF NOT EXISTS idx_trip_votes_group_id ON public.trip_votes(group_id);
CREATE INDEX IF NOT EXISTS idx_trip_votes_participant_id ON public.trip_votes(participant_id);
CREATE INDEX IF NOT EXISTS idx_trip_selections_group_id ON public.trip_selections(group_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for trip_groups table
CREATE TRIGGER update_trip_groups_updated_at 
    BEFORE UPDATE ON public.trip_groups 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS)
ALTER TABLE public.trip_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_selections ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - you may want to restrict this later)
-- Trip groups policies
CREATE POLICY "Allow all operations on trip_groups" ON public.trip_groups
    FOR ALL USING (true) WITH CHECK (true);

-- Trip participants policies
CREATE POLICY "Allow all operations on trip_participants" ON public.trip_participants
    FOR ALL USING (true) WITH CHECK (true);

-- Trip votes policies
CREATE POLICY "Allow all operations on trip_votes" ON public.trip_votes
    FOR ALL USING (true) WITH CHECK (true);

-- Trip selections policies
CREATE POLICY "Allow all operations on trip_selections" ON public.trip_selections
    FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO public.trip_groups (id, name) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Friends Ski Trip 2025')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.trip_participants (group_id, name, email, avatar) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Alice Johnson', 'alice@example.com', '👩'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Bob Smith', 'bob@example.com', '👨'),
    ('550e8400-e29b-41d4-a716-446655440000', 'Carol Davis', 'carol@example.com', '👩‍🦰'),
    ('550e8400-e29b-41d4-a716-446655440000', 'David Wilson', 'david@example.com', '👨‍🦱')
ON CONFLICT DO NOTHING;
