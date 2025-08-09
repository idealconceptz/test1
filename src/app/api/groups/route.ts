// API route for managing groups with Supabase
import { NextRequest, NextResponse } from 'next/server';
import { createGroup, getGroup, getParticipants } from '@/services/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('id');

    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Group ID is required' }, { status: 400 });
    }

    const groupResult = await getGroup(groupId);

    if (!groupResult.success) {
      return NextResponse.json(groupResult, { status: 404 });
    }

    // Also get participants for the group
    const participantsResult = await getParticipants(groupId);
    const participants = participantsResult.success ? participantsResult.data : [];

    return NextResponse.json({
      success: true,
      data: {
        ...groupResult.data,
        participants,
      },
    });
  } catch (error) {
    console.error('Failed to fetch group:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch group' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 }
      );
    }

    const result = await createGroup(name);

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Failed to create group:', error);
    return NextResponse.json({ success: false, error: 'Failed to create group' }, { status: 500 });
  }
}
