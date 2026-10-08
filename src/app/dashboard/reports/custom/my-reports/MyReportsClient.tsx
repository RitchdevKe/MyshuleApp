"use client";

import React, { useTransition } from "react";
import { deleteReport } from "./actions";
import { useRouter } from "next/navigation";
import { FileText, Play, Trash2, Plus, Clock } from "lucide-react";

type CustomReport = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  config: any;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
};

export default function MyReportsClient({ reports }: { reports: CustomReport[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      startTransition(async () => {
        await deleteReport(id);
      });
    }
  };

  const handleRunReport = (report: CustomReport) => {
    // In a real app, this might open a modal or generate a PDF/CSV.
    // For now, trigger a print dialog or alert.
    window.print();
  };

  const navigateToBuilder = () => {
    router.push("/dashboard/reports/custom/builder");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
            My Reports
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">
            View, run, and manage your custom reports.
          </p>
        </div>
        <button
          onClick={navigateToBuilder}
          className="bg-primary-900 hover:bg-secondary-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm shadow-primary-900/20 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Open New Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-xl border border-slate-200/60 rounded-3xl text-center">
            <FileText className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No reports found</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              You haven't created any custom reports yet. Click the button above to get started.
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  {report.type}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{report.name}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-2">
                {report.description || "No description provided."}
              </p>

              <div className="flex items-center text-xs text-slate-400 font-medium mb-6 gap-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Created {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleRunReport(report)}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Play className="w-4 h-4" /> Run
                </button>
                <button
                  onClick={() => handleDelete(report.id)}
                  disabled={isPending}
                  className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                  title="Delete Report"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
