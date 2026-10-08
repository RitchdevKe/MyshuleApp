import React from "react";
import { Phone, Users, UserCheck } from "lucide-react";
import { getEmergencyContacts, getEmergencyStats, getStudentsForDropdown } from "./actions";
import EmergencyClient from "./EmergencyClient";

export default async function EmergencyPage() {
  const [contacts, stats, students] = await Promise.all([
    getEmergencyContacts(),
    getEmergencyStats(),
    getStudentsForDropdown(),
  ]);

  const missingContacts = stats.totalStudents - stats.studentsWithContacts;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Phone className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Contacts</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalContacts}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><UserCheck className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Students Covered</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.studentsWithContacts}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Missing Contacts</p>
            <h3 className="text-2xl font-black text-slate-800">{missingContacts < 0 ? 0 : missingContacts}</h3>
          </div>
        </div>
      </div>

      <EmergencyClient initialContacts={contacts} initialStudents={students} />
    </div>
  );
}
