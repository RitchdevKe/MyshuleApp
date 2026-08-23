"use client";

import React, { useTransition } from "react";
import { Search, Monitor, Smartphone, Globe, ShieldOff, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { revokeSession, revokeAllSessions } from "@/app/actions/security_privacy_sessions";

export default function SessionsClient({ initialSessions }: { initialSessions: any[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Desktop": return <Monitor className="w-4 h-4" />;
      case "Mobile": return <Smartphone className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const handleRevoke = (id: string) => {
    if (confirm("Are you sure you want to revoke this session?")) {
      startTransition(async () => {
        await revokeSession(id);
        router.refresh();
      });
    }
  };

  const handleRevokeAll = () => {
    if (confirm("Are you sure you want to force revoke all sessions?")) {
      startTransition(async () => {
        await revokeAllSessions();
        router.refresh();
      });
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px] ${isPending ? 'opacity-70' : ''}`}>
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search sessions by user or IP..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" disabled={isPending} />
         </div>
         <div className="flex gap-2">
            <button 
              disabled={isPending || initialSessions.length === 0} 
              onClick={handleRevokeAll} 
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50"
            >
               <ShieldOff className="w-4 h-4" />
               Force Revoke All
            </button>
         </div>
      </div>

      <div className="p-6">
         <div className="overflow-x-auto">
            {initialSessions.length === 0 ? (
               <div className="text-center py-12 text-slate-500">
                  <Globe className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="font-medium text-sm">No active sessions tracking available</p>
               </div>
            ) : (
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50/50 border-b border-slate-200/60">
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Device & Browser</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address & Location</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {initialSessions.map((sess) => (
                     <tr key={sess.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {sess.user?.email?.charAt(0).toUpperCase() || "U"}
                             </div>
                             <div>
                               <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                                  {sess.user?.email || 'Unknown User'}
                               </div>
                               <div className="text-xs font-medium text-slate-500 mt-0.5">User</div>
                             </div>
                          </div>
                       </td>
                       <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                             {getDeviceIcon("Unknown")}
                             Unknown Device
                          </div>
                       </td>
                       <td className="py-4 px-6">
                          <div className="text-sm font-bold text-slate-800 font-mono">{sess.ipAddress || "Unknown IP"}</div>
                          <div className="text-xs font-medium text-slate-500 mt-0.5">Unknown Location</div>
                       </td>
                       <td className="py-4 px-6">
                          <span className="inline-flex items-center text-xs font-bold text-slate-500">
                             {new Date(sess.createdAt).toLocaleString()}
                          </span>
                       </td>
                       <td className="py-4 px-6 text-right">
                          <button 
                            disabled={isPending}
                            onClick={() => handleRevoke(sess.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                             <LogOut className="w-3.5 h-3.5" /> Revoke
                          </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            )}
         </div>
      </div>
    </div>
  );
}
