// Database service for ski trip planning app
// Using localStorage for MVP, easily upgradeable to real database
import { Group, Participant, Vote, TripOption } from '@/types';

export class DatabaseService {
  private readonly STORAGE_KEYS = {
    GROUPS: 'ski_trip_groups',
    CURRENT_GROUP: 'current_group_id',
  };

  // Get all groups
  getGroups(): Group[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEYS.GROUPS);
    return stored ? JSON.parse(stored) : [];
  }

  // Get specific group by ID
  getGroup(groupId: string): Group | null {
    const groups = this.getGroups();
    return groups.find(group => group.id === groupId) || null;
  }

  // Create new group
  createGroup(name: string, participants: Participant[]): Group {
    const newGroup: Group = {
      id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      name,
      participants: participants.map(p => ({ ...p, hasVoted: false })),
      votes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const groups = this.getGroups();
    groups.push(newGroup);
    this.saveGroups(groups);
    this.setCurrentGroup(newGroup.id);

    return newGroup;
  }

  // Update group
  updateGroup(groupId: string, updates: Partial<Group>): Group | null {
    const groups = this.getGroups();
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) return null;

    groups[groupIndex] = {
      ...groups[groupIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.saveGroups(groups);
    return groups[groupIndex];
  }

  // Add vote
  addVote(groupId: string, vote: Omit<Vote, 'timestamp'>): boolean {
    const group = this.getGroup(groupId);
    if (!group) return false;

    // Remove existing vote from this participant
    const filteredVotes = group.votes.filter(v => v.participantId !== vote.participantId);

    // Add new vote
    const newVote: Vote = {
      ...vote,
      timestamp: new Date(),
    };

    // Update participant status
    const updatedParticipants = group.participants.map(p =>
      p.id === vote.participantId ? { ...p, hasVoted: true } : p
    );

    this.updateGroup(groupId, {
      votes: [...filteredVotes, newVote],
      participants: updatedParticipants,
    });

    return true;
  }

  // Set selected trip
  setSelectedTrip(groupId: string, trip: TripOption): boolean {
    const updated = this.updateGroup(groupId, { selectedTrip: trip });
    return updated !== null;
  }

  // Get vote summary
  getVoteSummary(
    groupId: string
  ): Record<string, { destinationId: string; hotelId: string; count: number }> {
    const group = this.getGroup(groupId);
    if (!group) return {};

    const summary: Record<string, { destinationId: string; hotelId: string; count: number }> = {};

    group.votes.forEach(vote => {
      const key = `${vote.destinationId}_${vote.hotelId}`;
      if (summary[key]) {
        summary[key].count++;
      } else {
        summary[key] = {
          destinationId: vote.destinationId,
          hotelId: vote.hotelId,
          count: 1,
        };
      }
    });

    return summary;
  }

  // Current group management
  getCurrentGroup(): Group | null {
    if (typeof window === 'undefined') return null;
    const currentId = localStorage.getItem(this.STORAGE_KEYS.CURRENT_GROUP);
    return currentId ? this.getGroup(currentId) : null;
  }

  setCurrentGroup(groupId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_GROUP, groupId);
  }

  // Private helpers
  private saveGroups(groups: Group[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }

  // Clear all data (for testing)
  clearAllData(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.STORAGE_KEYS.GROUPS);
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_GROUP);
  }
}

export const db = new DatabaseService();
