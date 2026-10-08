import React from 'react';
import { User, X, Info } from 'lucide-react';
import Link from 'next/link';
import ActiveStudentHeader from '../../components/ActiveStudentHeader';
import { getParentPortalData } from '../../data';
import { format } from 'date-fns';

export default async function EducationInfoPage() {
  const { activeStudent } = await getParentPortalData();
  
  if (!activeStudent) {
    return <div>No active student selected</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
      <ActiveStudentHeader />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Education Information</h3>
            <p className="text-sm text-slate-500 mt-1">View the student's education details.</p>
          </div>
          <Link href="/parent-portal/account" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Date of Admission</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              {activeStudent.enrollmentDate ? format(new Date(activeStudent.enrollmentDate), 'MMMM d, yyyy') : '-'}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Admission Number</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              {activeStudent.admissionNumber || '-'}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Enrollment Form</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
              {activeStudent.enrollments?.[0]?.class?.name || '-'}
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Status</label>
            <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 capitalize">
              {activeStudent.status?.toLowerCase() || '-'}
            </div>
          </div>

          <div className="mt-4 bg-primary-50 text-primary-800 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm">To make updates to the student details you need to contact the school.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

