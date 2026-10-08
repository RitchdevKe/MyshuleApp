import React from "react";
import { Heart, Activity, CheckCircle2, CornerUpLeft } from "lucide-react";
import { getClinicVisits, getVisitStats, getStudentsForDropdown } from "./actions";
import VisitsClient from "./VisitsClient";

export default async function VisitsPage() {
  const [visits, stats, students] = await Promise.all([
    getClinicVisits(),
    getVisitStats(),
    getStudentsForDropdown(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Heart className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Visits</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalVisits}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.pendingVisits}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Completed</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.completedVisits}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><CornerUpLeft className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Referred</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.referredVisits}</h3>
          </div>
        </div>
      </div>

      <VisitsClient initialVisits={visits} initialStudents={students} />
    </div>
  );
}
