'use client';

import { useState, useEffect } from 'react';
import { Group } from '@/types';
import { getFullGroupData } from '@/app/actions/group';
import SkiTripPlanner from '@/components/SkiTripPlanner';

export default function Home() {
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the specific group ID from the database
  const SAMPLE_GROUP_ID = '550e8400-e29b-41d4-a716-446655440000';

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const result = await getFullGroupData(SAMPLE_GROUP_ID);
        if (result.success && result.data) {
          setCurrentGroup(result.data);
        } else {
          console.error('Failed to load group:', result.error);
        }
      } catch (error) {
        console.error('Error loading group:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, []);

  const handleResetGroup = () => {
    // For now, just reload the page to reset
    // In a real app, you might clear votes or create a new group
    window.location.reload();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!currentGroup) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Group not found</p>
          <p className="text-gray-500 text-sm mt-2">Unable to load the trip group</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SkiTripPlanner group={currentGroup} onResetGroup={handleResetGroup} />
    </main>
  );
}
