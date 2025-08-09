'use server';

import { createClient } from '@/lib/supabase-server';

export async function getGroupParticipants(groupId: string) {
  try {
    const supabase = await createClient();

    const { data: participants, error } = await supabase
      .from('trip_participants')
      .select('id, name, email, avatar, has_voted')
      .eq('group_id', groupId)
      .order('name');

    if (error) {
      throw new Error('Failed to fetch participants');
    }

    return { success: true, data: participants };
  } catch (error) {
    console.error('Get participants error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch participants',
    };
  }
}

export async function getGroupDetails(groupId: string) {
  try {
    const supabase = await createClient();

    const { data: group, error } = await supabase
      .from('trip_groups')
      .select('id, name, created_at, updated_at')
      .eq('id', groupId)
      .single();

    if (error) {
      throw new Error('Failed to fetch group details');
    }

    return { success: true, data: group };
  } catch (error) {
    console.error('Get group details error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch group details',
    };
  }
}

export async function getFullGroupData(groupId: string) {
  try {
    const [groupResult, participantsResult] = await Promise.all([
      getGroupDetails(groupId),
      getGroupParticipants(groupId),
    ]);

    if (!groupResult.success) {
      throw new Error(groupResult.error);
    }

    if (!participantsResult.success) {
      throw new Error(participantsResult.error);
    }

    const group = groupResult.data!;

    const fullGroupData = {
      id: group.id,
      name: group.name,
      participants: (participantsResult.data || []).map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        avatar: p.avatar,
        hasVoted: p.has_voted,
      })),
      votes: [], // We'll populate this when needed
      createdAt: new Date(group.created_at),
      updatedAt: new Date(group.updated_at),
    };

    return { success: true, data: fullGroupData };
  } catch (error) {
    console.error('Get full group data error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch group data',
    };
  }
}
