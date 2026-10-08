import React from "react";
import { Users, Users2, Percent, CheckCircle2 } from "lucide-react";
import { getMealAttendances, getAttendanceStats, getStudentsForDropdown } from "./actions";
import AttendanceClient from "./AttendanceClient";

export default async function AttendancePage() {
  const [attendances, stats, students] = await Promise.all([
    getMealAttendances(),
    getAttendanceStats(),
    getStudentsForDropdown(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Expected Today</p><h3 className="text-2xl font-black text-slate-800">{stats.totalExpected}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users2 className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Served Today</p><h3 className="text-2xl font-black text-slate-800">{stats.served}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Percent className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Attendance Rate</p><h3 className="text-2xl font-black text-slate-800">{stats.percentage}%</h3></div>
        </div>
      </div>
      <AttendanceClient initialAttendances={attendances} initialStudents={students} />
    </div>
  );
}
