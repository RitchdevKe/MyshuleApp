"use client";

import React, { useState, useTransition } from "react";
import { Search, Download, Filter, UserCog, LogIn, FileWarning, ShieldAlert, FileText } from "lucide-react";
import { getFilteredAuditLogs, logAuditExport } from "@/app/actions/security_policies_audit";
import { useRouter } from "next/navigation";

export default function AuditClient({ initialLogs }: { initialLogs: any[] }) {
  const [logs, setLogs] = useState(initialLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const getIcon = (action: string) => {
    const lAction = action.toLowerCase();
    if (lAction.includes("login") && !lAction.includes("fail")) return LogIn;
    if (lAction.includes("fail")) return ShieldAlert;
    if (lAction.includes("export")) return FileWarning;
    if (lAction.includes("role") || lAction.includes("user")) return UserCog;
    return FileText;
  };

  const getColor = (action: string) => {
    const lAction = action.toLowerCase();
    if (lAction.includes("fail") || lAction.includes("error")) return "text-rose-600 bg-rose-50";
    if (lAction.includes("login")) return "text-emerald-600 bg-emerald-50";
    if (lAction.includes("export")) return "text-amber-600 bg-amber-50";
    return "text-indigo-600 bg-indigo-50";
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    startTransition(async () => {
      const filteredLogs = await getFilteredAuditLogs(q, filterState);
      setLogs(filteredLogs);
    });
  };

  const toggleFilter = () => {
    const nextState = filterState === "all" ? "failed" : filterState === "failed" ? "success" : "all";
    setFilterState(nextState);
    startTransition(async () => {
      const filteredLogs = await getFilteredAuditLogs(searchQuery, nextState);
      setLogs(filteredLogs);
    });
  };

  const handleExport = () => {
    startTransition(async () => {
      await logAuditExport();
      router.refresh();
      // create a simple download
      const csvContent = "data:text/csv;charset=utf-8,ID,Date,Action,Target,User,IP,Status\n" 
        + logs.map(l => `${l.id},${l.createdAt},${l.action},${l.entityName},${l.user?.email || "System"},${l.ipAddress || "Unknown"},${l.action.toLowerCase().includes("fail") ? "Failed" : "Success"}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "audit_logs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search event logs..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
            />
         </div>
         <div className="flex gap-2">
            <button 
               onClick={toggleFilter}
               className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-bold text-sm transition-all shadow-sm ${filterState !== 'all' ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-slate-200/60 hover:bg-slate-50 text-slate-700'}`}
            >
               <Filter className="w-4 h-4" />
               Filter: {filterState === 'all' ? 'All' : filterState === 'failed' ? 'Failed Only' : 'Success Only'}
            </button>
            <button 
               onClick={handleExport}
               disabled={isPending}
               className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 disabled:opacity-50"
            >
               <Download className="w-4 h-4" />
               {isPending ? 'Exporting...' : 'Export CSV'}
            </button>
         </div>
      </div>

      <div className="p-6">
         <div className="overflow-x-auto">
            {logs.length === 0 ? (
               <div className="text-center py-12 text-slate-500 font-medium text-sm">
                  No audit logs found.
               </div>
            ) : (
            <table className="w-full text-left border-collapse opacity-100 transition-opacity" style={{ opacity: isPending ? 0.6 : 1 }}>
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Event & Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Action & Resource</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">User & IP</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                   const Icon = getIcon(log.action);
                   const colorClass = getColor(log.action);
                   const status = log.action.toLowerCase().includes("fail") ? "Failed" : "Success";
                   return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                             <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-800 block">{log.id.substring(0,8).toUpperCase()}</span>
                            <span className="text-xs font-medium text-slate-500 mt-0.5">{new Date(log.createdAt).toLocaleString()}</span>
                          </div>
                       </div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="text-sm font-bold text-slate-800">{log.action}</div>
                       <div className="text-xs font-medium text-slate-500 mt-0.5">Target: {log.entityName}</div>
                    </td>
                    <td className="py-4 px-6">
                       <div className="text-sm font-bold text-slate-700">{log.user?.email || "System"}</div>
                       <div className="text-xs font-medium text-slate-500 font-mono mt-0.5">{log.ipAddress || "Unknown IP"}</div>
                    </td>
                    <td className="py-4 px-6">
                       <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                         status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                       }`}>
                          {status}
                       </span>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
            )}
         </div>
      </div>
    </div>
  );
}
