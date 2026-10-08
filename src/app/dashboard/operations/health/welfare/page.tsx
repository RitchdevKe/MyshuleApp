import React from "react";
import { ShieldAlert, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { getWelfareSessions, getWelfareStats, getStudentsForDropdown } from "./actions";
import WelfareClient from "./WelfareClient";

export default async function WelfarePage() {
  const [sessions, stats, students] = await Promise.all([
    getWelfareSessions(),
    getWelfareStats(),
    getStudentsForDropdown(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sessions</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalSessions}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Search className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Open Cases</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.openCases}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Resolved</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.resolvedCases}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Referred</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.referredCases}</h3>
          </div>
        </div>
      </div>

      <WelfareClient initialSessions={sessions} initialStudents={students} />
    </div>
  );
}
