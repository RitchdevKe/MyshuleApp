"use client";

import React from "react";
import { Search, Filter, FileText } from "lucide-react";

const mockStudents = [
  { name: "John Doe", adm: "ADM-001", class: "Grade 4 - Alpha", op: "0.00", charges: "45,000", paid: "45,000", bal: "0.00", status: "Cleared" },
  { name: "Jane Smith", adm: "ADM-002", class: "Grade 4 - Beta", op: "5,000", charges: "45,000", paid: "20,000", bal: "30,000", status: "Arrears" },
  { name: "Michael Johnson", adm: "ADM-003", class: "Grade 5 - Alpha", op: "0.00", charges: "48,000", paid: "24,000", bal: "24,000", status: "Partial" },
  { name: "Emily Davis", adm: "ADM-004", class: "Grade 6 - Gamma", op: "0.00", charges: "52,000", paid: "60,000", bal: "-8,000", status: "Overpaid" },
];

export default function StudentAccountsPage() {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Cleared": return "bg-emerald-50 text-emerald-600 border border-emerald-200";
      case "Arrears": return "bg-rose-50 text-rose-600 border border-rose-200";
      case "Overpaid": return "bg-blue-50 text-blue-600 border border-blue-200";
      default: return "bg-amber-50 text-amber-600 border border-amber-200";
    }
  };

  const getAvatarStyle = (status: string) => {
    switch (status) {
      case "Cleared": return "bg-emerald-100 text-emerald-700";
      case "Arrears": return "bg-rose-100 text-rose-700";
      case "Overpaid": return "bg-blue-100 text-blue-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-5 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student name, ADM no..." 
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Grade/Class
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Status: Arrears
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-black">
              <th className="p-4 pl-6">Student</th>
              <th className="p-4">Grade/Class</th>
              <th className="p-4 text-right">Opening Bal.</th>
              <th className="p-4 text-right">Charges</th>
              <th className="p-4 text-right">Payments</th>
              <th className="p-4 text-right">Balance Due</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 pr-6"></th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100/80">
            {mockStudents.map((student, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarStyle(student.status)}`}>
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-primary-900 transition-colors">{student.name}</p>
                      <p className="text-xs text-slate-500 font-semibold">{student.adm}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600 font-semibold">{student.class}</td>
                <td className="p-4 text-right text-slate-500">{student.op}</td>
                <td className="p-4 text-right font-bold text-slate-700">{student.charges}</td>
                <td className="p-4 text-right font-bold text-emerald-600">{student.paid}</td>
                <td className="p-4 text-right font-black text-slate-800">{student.bal}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${getStatusStyle(student.status)}`}>
                    {student.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="p-2 text-slate-400 hover:text-primary-900 hover:bg-primary-50 rounded-xl transition-colors">
                    <FileText className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
