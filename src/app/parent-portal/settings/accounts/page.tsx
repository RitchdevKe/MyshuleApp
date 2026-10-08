import React from 'react';
import { getParentPortalData } from '../../data';
import { User } from 'lucide-react';
import Link from 'next/link';

export default async function MyAccountsPage() {
  const { parent, activeStudent } = await getParentPortalData();
  const schoolName = parent?.tenant?.name || "MyShule Analytics";

  const enrollment = activeStudent?.enrollments?.[0];
  const gradeString = enrollment ? `${enrollment.class?.name || ''} ${enrollment.stream?.name || ''}`.trim() : 'N/A';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2">My Accounts</h2>
      <p className="text-slate-500 mb-8">
        Manage all your accounts in {schoolName} linked to your phone number
      </p>

      <div className="mb-8">
        <h3 className="font-semibold text-slate-700 text-lg mb-4">Teacher Details</h3>
        <p className="text-slate-400 italic">No teacher account linked to this profile</p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-700 text-lg mb-4">Student Details</h3>
        
        {activeStudent ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0 text-white font-medium text-xl">
                {activeStudent.firstName?.[0]}{activeStudent.lastName?.[0]}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 uppercase leading-tight">
                  {activeStudent.firstName} {activeStudent.lastName}
                </span>
                <span className="text-slate-500">{schoolName}</span>
                <span className="text-slate-700 mt-1">Adm No: {activeStudent.admissionNumber || 'N/A'}</span>
                <span className="text-slate-700">Grade: {gradeString}</span>
              </div>
            </div>
            
            <div className="flex gap-4 mt-2">
              <button className="flex-1 py-2 border border-red-500 text-red-500 rounded-md font-medium hover:bg-red-50 transition-colors">
                Unlink Profile
              </button>
              <Link href="/parent-portal/account" className="flex-1 py-2 bg-primary-600 text-white text-center rounded-md font-medium hover:bg-primary-700 transition-colors">
                Go to Account
              </Link>
            </div>
          </div>
        ) : (
          <p className="text-slate-400 italic">No student account linked to this profile</p>
        )}
      </div>
    </div>
  );
}

