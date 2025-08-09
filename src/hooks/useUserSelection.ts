import { useState, useEffect } from 'react';
import { Participant } from '@/types';

const STORAGE_KEY = 'ski_trip_selected_user';

export function useUserSelection(participants: Participant[] = []) {
  const [selectedUser, setSelectedUser] = useState<Participant | null>(null);

  // Load saved user from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Verify the saved user still exists in the current participants list
          const userExists = participants.find(p => p.id === parsedUser.id);
          if (userExists) {
            setSelectedUser(userExists); // Use the current participant data
          } else {
            // User no longer exists, clear localStorage
            localStorage.removeItem(STORAGE_KEY);
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [participants]);

  const selectUser = (user: Participant) => {
    setSelectedUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  };

  const clearUser = () => {
    setSelectedUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
    selectedUser,
    selectUser,
    clearUser,
    hasSelectedUser: selectedUser !== null,
  };
}
