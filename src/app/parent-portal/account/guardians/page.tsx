import React, { Fragment } from 'react';
import { User, X, Info } from 'lucide-react';
import Link from 'next/link';
import ActiveStudentHeader from '../../components/ActiveStudentHeader';
import { getParentPortalData } from '../../data';

export default async function GuardiansPage() {
  const { activeStudent } = await getParentPortalData();
  
  if (!activeStudent) {
    return <div>No active student selected</div>;
  }

  const guardians = activeStudent.parents?.map(sg => ({
    id: sg.parent.id,
    firstName: sg.parent.firstName,
    lastName: sg.parent.lastName,
    relation: sg.relationship,
    phoneNumber: sg.parent.phonePrimary,
    email: sg.parent.user?.email,
    address: sg.parent.residentialAddress
  })) || [];

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
      <ActiveStudentHeader />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Guardian Details</h3>
            <p className="text-sm text-slate-500 mt-1">View the student's guardian details.</p>
          </div>
          <Link href="/parent-portal/account" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="p-4 flex flex-col gap-8">
          {guardians.length === 0 ? (
            <div className="text-slate-500 text-center py-4">No guardians found.</div>
          ) : (
            guardians.map((guardian, index) => (
              <Fragment key={guardian.id}>
                {index > 0 && <hr className="border-slate-100" />}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                      {guardian.firstName} {guardian.lastName}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Relation</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 capitalize">
                      {guardian.relation?.toLowerCase() || '-'}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 flex items-center gap-2">
                      <span>{guardian.phoneNumber || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                      {guardian.email || '-'}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Home Address</label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
                      {guardian.address || '-'}
                    </div>
                  </div>
                </div>
              </Fragment>
            ))
          )}

          <div className="mt-4 bg-primary-50 text-primary-800 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm">To make updates to the student details you need to contact the school.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

