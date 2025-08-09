// API route for voting with Supabase
import { NextRequest, NextResponse } from 'next/server';
import { submitVote, getVotes } from '@/services/supabase';

export async function POST(request: NextRequest) {
  try {
    const { participantId, groupId, destinationId, hotelId } = await request.json();

    if (!participantId || !groupId || !destinationId) {
      return NextResponse.json(
        { success: false, error: 'participantId, groupId, and destinationId are required' },
        { status: 400 }
      );
    }

    const result = await submitVote(participantId, groupId, destinationId, hotelId);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Vote submission error:', error);
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Get votes error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get votes' }, { status: 500 });
  }
}
