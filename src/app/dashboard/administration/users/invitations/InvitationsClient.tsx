"use client";

import React, { useState, useTransition } from "react";
import { Search, Mail, RotateCcw, X, Plus } from "lucide-react";
import { createInvitation, resendInvitation, revokeInvitation } from "@/app/actions/userManagement";
import { useRouter } from "next/navigation";

export default function InvitationsClient({ initialInvitations, roles }: { initialInvitations: any[], roles: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");

  const handleCreate = async () => {
    if (!email || !roleId) return;
    await createInvitation({ email, roleId });
    setShowModal(false);
    setEmail("");
    setRoleId("");
  };

  const handleAction = async (action: 'resend' | 'revoke', id: string) => {
    startTransition(async () => {
      if (action === 'resend') await resendInvitation(id);
      if (action === 'revoke') await revokeInvitation(id);
      router.refresh();
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search invitations..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
         <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" />
            Send Invite
         </button>
      </div>

      <div className="overflow-x-auto relative">
        <table className={`w-full text-left border-collapse transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sent Date</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialInvitations.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shadow-inner">
                         <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-800">{inv.email}</span>
                   </div>
                </td>
                <td className="py-4 px-6">
                   <span className="text-xs font-bold text-slate-600">{inv.role?.name || "Unknown"}</span>
                </td>
                <td className="py-4 px-6">
                   <span className="text-xs font-medium text-slate-500">{new Date(inv.sentAt).toLocaleDateString()}</span>
                </td>
                <td className="py-4 px-6">
                   <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                     inv.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700' : 
                     inv.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                   }`}>
                      {inv.status}
                   </span>
                </td>
                <td className="py-4 px-6 text-right">
                   <div className="flex items-center justify-end gap-2">
                      {inv.status === 'PENDING' && (
                         <>
                          <button onClick={() => handleAction('resend', inv.id)} className="flex items-center gap-1.5 text-xs font-bold bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg transition-colors border border-primary-200">
                              <RotateCcw className="w-3 h-3" /> Resend
                          </button>
                          <button onClick={() => handleAction('revoke', inv.id)} className="flex items-center gap-1.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg transition-colors border border-rose-200">
                              <X className="w-3 h-3" /> Revoke
                          </button>
                         </>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {initialInvitations.length === 0 && (
           <div className="p-12 text-center text-slate-500 font-medium">
             No invitations sent yet.
           </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Send Invitation</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white">
                  <option value="">Select a Role...</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleCreate} disabled={!email || !roleId} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm disabled:opacity-50">Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
