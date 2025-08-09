// API route for voting with Supabase
import { NextRequest, NextResponse } from 'next/server';
import { submitVote, getVotes } from '@/services/supabase';

export async function POST(request: NextRequest) {
  try {
    const { groupId, participantId, destinationId, hotelId } = await request.json();

    if (!groupId || !participantId || !destinationId) {
      return NextResponse.json(
        { success: false, error: 'Group ID, participant ID, and destination ID are required' },
        { status: 400 }
      );
    }

    const result = await submitVote(participantId, groupId, destinationId, hotelId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit vote' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const result = await getVotes(groupId);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }
    console.log(result);
    // Create a vote summary
    const votes = result.data || [];

    interface VoteSummaryItem {
      destinationId: string;
      destinationName: string;
      hotelId: string | null;
      hotelName: string | null;
      count: number;
      participants: string[];
    }

    // const voteSummary = votes.reduce(
    //   (acc, vote) => {
    //     const key = `${vote.destination_id}:${vote.hotel_id || 'no-hotel'}`;
    //     if (!acc[key]) {
    //       acc[key] = {
    //         destinationId: vote.destination_id,
    //         destinationName: vote.destination_name || 'Unknown Destination',
    //         hotelId: vote.hotel_id,
    //         hotelName: vote.hotel_name || null,
    //         count: 0,
    //         participants: [],
    //       };
    //     }
    //     acc[key].count++;
    //     acc[key].participants.push(vote.participant_id);
    //     return acc;
    //   },
    //   {} as Record<string, VoteSummaryItem>
    // );
    // if(!result.error) {
    // const voteSummary: Record<string, VoteSummaryItem> = {};
    // votes.forEach(vote => {
    return NextResponse.json({
      success: true,
      data: result.data, //Object.values(voteSummary),
    });
  } catch (error) {
    console.error('Failed to get votes:', error);
    return NextResponse.json({ success: false, error: 'Failed to get votes' }, { status: 500 });
  }
}
