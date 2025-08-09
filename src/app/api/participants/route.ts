// API route for managing participants with Supabase
import { NextRequest, NextResponse } from 'next/server';
import { addParticipant, getParticipants } from '@/services/supabase';

export async function POST(request: NextRequest) {
  try {
    const { groupId, name, email, avatar } = await request.json();

    if (!groupId || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Group ID, name, and email are required' },
        { status: 400 }
      );
    }

    const result = await addParticipant(groupId, name, email, avatar);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to add participant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add participant' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const result = await getParticipants(groupId);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to get participants:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get participants' },
      { status: 500 }
    );
  }
}
