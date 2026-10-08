import React from 'react';
import { User } from 'lucide-react';
import { getParentPortalData } from '../data';

export default async function ActiveStudentHeader() {
  const { parent, activeStudent } = await getParentPortalData();
  
  if (!parent || !activeStudent) {
    return null;
  }

  const enrollment = activeStudent.enrollments?.[0];
  const gradeString = enrollment ? `${enrollment.class?.name || ''} ${enrollment.stream?.name || ''}`.trim() : 'N/A';
  const schoolName = parent.tenant?.name || "School";

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4 border border-slate-100">
      <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <User className="w-8 h-8 text-slate-400" />
      </div>
      <div className="flex flex-col">
        <h2 className="font-bold text-slate-800 leading-tight uppercase">
          {activeStudent.firstName} {activeStudent.lastName}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{schoolName}</p>
        <div className="text-sm font-medium text-slate-700 mt-2 flex items-center gap-2">
          <span>Adm No: {activeStudent.admissionNumber}</span>
          <span className="text-slate-300">|</span>
          <span>Grade: {gradeString}</span>
        </div>
      </div>
    </div>
  );
}

