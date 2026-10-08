"use client";

import React, { useState } from 'react';
import { FileWarning, Gift, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Approval = { id: string; title: string; subtitle: string; type: string; action: string };
type Birthday = { id: string; name: string; role: string };

export default function RightPanelClient({ 
  initialApprovals, 
  birthdays 
}: { 
  initialApprovals: Approval[], 
  birthdays: Birthday[] 
}) {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [modalAction, setModalAction] = useState<'Approve' | 'View'>('Approve');
  const router = useRouter();

  const handleActionClick = (approval: Approval, action: 'Approve' | 'View') => {
    setSelectedApproval(approval);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const confirmAction = () => {
    if (modalAction === 'Approve' && selectedApproval) {
      // Optimistic update
      setApprovals(prev => prev.filter(a => a.id !== selectedApproval.id));
      setIsModalOpen(false);
      router.refresh(); // In real app, call a server action here to approve
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Action Required */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 backdrop-blur-xl">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-amber-500" /> Pending Approvals
          </h3>
          
          {approvals.length === 0 ? (
            <p className="text-sm text-slate-500">No pending approvals.</p>
          ) : (
            <div className="space-y-4">
              {approvals.map((approval) => (
                <div key={approval.id} className={`p-4 rounded-2xl border ${approval.type === 'Budget' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className="text-sm font-semibold text-slate-800">{approval.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{approval.subtitle}</p>
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => handleActionClick(approval, 'Approve')}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${approval.type === 'Budget' ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-primary-900 text-white hover:bg-primary-800'}`}
                    >
                      {approval.action}
                    </button>
                    {approval.type === 'Budget' && (
                      <button 
                        onClick={() => handleActionClick(approval, 'View')}
                        className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Birthdays */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 backdrop-blur-xl">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" /> Today's Birthdays
          </h3>
          
          {birthdays.length === 0 ? (
            <p className="text-sm text-slate-500">No birthdays today.</p>
          ) : (
            <div className="space-y-4">
              {birthdays.map((person) => (
                <div key={person.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Native Modal */}
      {isModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {modalAction === 'Approve' ? 'Confirm Approval' : 'View Details'}
            </h2>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 mt-4">
              <p className="font-semibold text-slate-800">{selectedApproval.title}</p>
              <p className="text-sm text-slate-500 mt-1">{selectedApproval.subtitle}</p>
              
              {modalAction === 'View' && (
                <div className="mt-4 text-sm text-slate-600">
                  <p><strong>Type:</strong> {selectedApproval.type}</p>
                  <p><strong>Status:</strong> Pending</p>
                  <p className="mt-2">More detailed information about this {selectedApproval.type.toLowerCase()} request would appear here.</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              {modalAction === 'Approve' && (
                <button 
                  onClick={confirmAction}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 transition-colors shadow-md"
                >
                  Confirm Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
