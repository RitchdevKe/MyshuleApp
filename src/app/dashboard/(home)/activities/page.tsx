import React from 'react';
import ActivitiesClient from './ActivitiesClient';
import RightPanelClient from './RightPanelClient';
import { getActivities, getRightPanelData } from './actions';

export default async function ActivitiesPage() {
  const initialActivities = await getActivities(20);
  const { approvals, birthdays } = await getRightPanelData();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-md border-t-4 border-t-primary-900 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Activity Center</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time pulse of school operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2">
          <ActivitiesClient initialActivities={initialActivities} />
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <RightPanelClient initialApprovals={approvals} birthdays={birthdays} />
        </div>
      </div>
    </div>
  );
}
