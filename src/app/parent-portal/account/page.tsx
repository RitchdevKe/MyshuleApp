import React from 'react';
import { User } from 'lucide-react';
import { getParentPortalData } from '../data';
import { AccountSubNav } from './AccountSubNav';
import { ProfileAccordions } from './ProfileAccordions';

export default async function AccountPage() {
  const { parent, activeStudent } = await getParentPortalData();
  
  if (!parent || !activeStudent) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p>No active student found.</p>
      </div>
    );
  }

  const enrollment = activeStudent.enrollments?.[0];
  const gradeString = enrollment ? `${enrollment.class?.name || ''} ${enrollment.stream?.name || ''}`.trim() : 'N/A';

  return (
    <div className="flex flex-col w-full bg-slate-100 min-h-screen">
      <AccountSubNav />
      
      <div className="p-4 flex flex-col gap-4 max-w-2xl mx-auto w-full">
        {/* Student Card */}
        <div className="bg-slate-200/60 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-slate-200 shadow-sm">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-400 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
            <User className="w-16 h-16 text-slate-100" />
          </div>
          <div className="flex flex-col text-center sm:text-left pt-2">
            <h2 className="text-2xl font-medium text-slate-900 leading-tight">
              {activeStudent.firstName}
            </h2>
            <h2 className="text-2xl font-medium text-slate-900 leading-tight">
              {activeStudent.lastName}
            </h2>
            <div className="mt-4 text-slate-600 text-lg">
              Admission Number:
              <div className="font-semibold text-slate-800 ml-2 inline-block">{activeStudent.admissionNumber || 'N/A'}</div>
            </div>
            <div className="mt-1 text-slate-600 text-lg">
              {gradeString}
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-2">
          <ProfileAccordions student={activeStudent} />
        </div>
      </div>
    </div>
  );
}

