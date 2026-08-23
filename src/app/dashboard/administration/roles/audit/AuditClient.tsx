"use client";

import React from "react";
import { Search, Filter, Shield, Download, Activity, Key, LogIn, UserPlus, UserMinus } from "lucide-react";

export default function AuditClient({ initialLogs }: { initialLogs: any[] }) {

  const getIconForAction = (action: string) => {
    if (action.includes("Login")) return { icon: LogIn, color: "text-blue-600 bg-blue-50" };
    if (action.includes("Role") || action.includes("Permission")) return { icon: Shield, color: "text-emerald-600 bg-emerald-50" };
    if (action.includes("Create") || action.includes("Add")) return { icon: UserPlus, color: "text-emerald-600 bg-emerald-50" };
    if (action.includes("Suspend") || action.includes("Delete")) return { icon: UserMinus, color: "text-rose-600 bg-rose-50" };
    if (action.includes("Policy")) return { icon: Key, color: "text-amber-600 bg-amber-50" };
    return { icon: Activity, color: "text-primary-600 bg-primary-50" };
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search audit logs..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Download className="w-4 h-4" />
               Export CSV
            </button>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Entity</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {initialLogs.map((log) => {
               const { icon: Icon, color } = getIconForAction(log.action);
               return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-inner ${color}`}>
                              <Icon className="w-4 h-4" />
                           </div>
                           <div>
                              <div className="font-bold text-sm text-slate-800">{log.action}</div>
                              <div className="text-xs text-slate-500">{log.entityName} modified</div>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-xs font-bold text-slate-700">{log.user?.email || "System"}</span>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-xs font-medium text-slate-500">{log.entityName}</span>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-xs font-medium text-slate-500">{new Date(log.createdAt).toLocaleString()}</span>
                     </td>
                     <td className="py-4 px-6">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded-md">
                           {log.ipAddress || "127.0.0.1"}
                        </span>
                     </td>
                  </tr>
               );
            })}
          </tbody>
        </table>
        {initialLogs.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-medium">
            No audit logs found.
          </div>
        )}
      </div>
    </div>
  );
}
