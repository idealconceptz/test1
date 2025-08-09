# Supabase Setup for Ski Trip Planner

This project now includes Supabase integration for persistent data storage.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard
3. Get your project URL and anon key

## Environment Variables

The following environment variables are already configured in `.env.local`:

```
# Public Supabase Configuration (accessible in browser)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `database/setup.sql` to create the tables

This will create:

- `groups` table for ski trip groups
- `participants` table for group members
- `votes` table for destination/hotel votes
- `trip_selections` table for final trip choices

## API Integration

The following API routes now use Supabase:

### Groups API (`/api/groups`)

- `POST /api/groups` - Create a new group
- `GET /api/groups?id={groupId}` - Get group details with participants

### Participants API (`/api/participants`)

- `POST /api/participants` - Add participant to a group
- `GET /api/participants?groupId={groupId}` - Get all participants in a group

### Votes API (`/api/votes`)

- `POST /api/votes` - Submit a vote for destination/hotel
- `GET /api/votes?groupId={groupId}` - Get all votes with summary

## Supabase Client Usage

The project includes three Supabase client configurations:

1. **Server-side** (`src/lib/supabase-server.ts`) - For API routes and server components
2. **Client-side** (`src/lib/supabase-browser.ts`) - For browser/client components
3. **General** (`src/lib/supabase.ts`) - General purpose client and admin client

## Database Services

All database operations are handled in `src/services/supabase.ts`:

- `createGroup(name)` - Create a new ski trip group
- `getGroup(groupId)` - Get group details
- `addParticipant(groupId, name, email, avatar)` - Add participant
- `getParticipants(groupId)` - Get all participants
- `submitVote(participantId, groupId, destinationId, hotelId)` - Submit vote
- `getVotes(groupId)` - Get all votes for a group
- `saveTripSelection(...)` - Save final trip selection
- `getTripSelection(groupId)` - Get trip selection

## Testing

You can test the Supabase integration by:

1. Creating a new group: `curl -X POST http://localhost:3001/api/groups -H "Content-Type: application/json" -d '{"name":"Test Group"}'`
2. Adding participants: `curl -X POST http://localhost:3001/api/participants -H "Content-Type: application/json" -d '{"groupId":"your-group-id","name":"Test User","email":"test@example.com"}'`
3. Submitting votes: `curl -X POST http://localhost:3001/api/votes -H "Content-Type: application/json" -d '{"groupId":"your-group-id","participantId":"your-participant-id","destinationId":"aspen"}'`

## Data Migration

If you have existing data in the mock database, you can migrate it to Supabase by:

1. Running the existing app to see current groups/participants
2. Using the API endpoints to recreate the data in Supabase
3. Updating your components to use the new API endpoints

## Security

The current setup uses permissive RLS (Row Level Security) policies for development. For production, you should implement proper security policies based on your authentication requirements.
