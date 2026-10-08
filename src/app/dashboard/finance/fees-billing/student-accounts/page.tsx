import React from "react";
import { FileText } from "lucide-react";
import { fetchStudentAccounts, fetchClasses } from "./actions";
import FilterControls from "./FilterControls";

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Cleared": return "bg-emerald-50 text-emerald-600 border border-emerald-200";
    case "Arrears": return "bg-rose-50 text-rose-600 border border-rose-200";
    case "Overpaid": return "bg-blue-50 text-blue-600 border border-blue-200";
    default: return "bg-amber-50 text-amber-600 border border-amber-200"; // Partial
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

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default async function StudentAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; classId?: string; arrearsOnly?: string }>;
}) {
  const resolvedParams = await searchParams;
  const [students, classes] = await Promise.all([
    fetchStudentAccounts({
      search: resolvedParams.search,
      classId: resolvedParams.classId,
      arrearsOnly: resolvedParams.arrearsOnly === "true",
    }),
    fetchClasses(),
  ]);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      <FilterControls classes={classes} />

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
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No students found matching the criteria.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
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
                  <td className="p-4 text-right text-slate-500">{formatCurrency(student.op)}</td>
                  <td className="p-4 text-right font-bold text-slate-700">{formatCurrency(student.charges)}</td>
                  <td className="p-4 text-right font-bold text-emerald-600">{formatCurrency(student.paid)}</td>
                  <td className="p-4 text-right font-black text-slate-800">{formatCurrency(student.bal)}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
