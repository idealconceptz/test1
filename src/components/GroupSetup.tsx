'use client';

import { useState } from 'react';

interface GroupSetupProps {
  readonly onCreateGroup: (groupName: string) => void;
}

export default function GroupSetup({ onCreateGroup }: Readonly<GroupSetupProps>) {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onCreateGroup(groupName.trim());
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎿 Ski Trip Planner</h1>
          <p className="text-xl text-gray-600">Plan the perfect ski trip with your friends</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Create Your Group
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="e.g., Colorado Adventure 2025"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Your Group Members:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    A
                  </div>
                  <span>Alex Johnson</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    S
                  </div>
                  <span>Sarah Chen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    M
                  </div>
                  <span>Mike Rodriguez</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    E
                  </div>
                  <span>Emma Thompson</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Start Planning Trip
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
