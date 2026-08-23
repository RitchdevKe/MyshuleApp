import React, { useState } from 'react';
import { Student } from '../types.ts';
import { StudentAttendanceTab } from './StudentAttendanceTab.tsx';
import { StaffAttendanceTab } from './StaffAttendanceTab.tsx';
import { Users, UserCheck } from 'lucide-react';

interface AttendanceHubProps {
  students: Student[];
}

export function AttendanceHub({ students }: AttendanceHubProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');

  return (
    <div className="space-y-4">
      {/* Segmented tab control */}
      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit gap-1">
        <button
          onClick={() => setActiveTab('student')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer border-none ${
            activeTab === 'student'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Students
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer border-none ${
            activeTab === 'staff'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          Staff
        </button>
      </div>

      <div>
        {activeTab === 'student' && <StudentAttendanceTab students={students} />}
        {activeTab === 'staff' && <StaffAttendanceTab />}
      </div>
    </div>
  );
}
