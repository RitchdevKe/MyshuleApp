"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, MoreHorizontal, CheckCircle2,
  XCircle, Clock, Eye, MessageSquare, ChevronLeft,
  ChevronRight, SlidersHorizontal, FileText
} from "lucide-react";

import { getApplications } from "@/app/actions/applications";
import { ApplicantDetailModal } from "@/components/ApplicantDetailModal";


const statusConfig: Record<string, { pill: string; icon: any; dot: string }> = {
  ADMITTED: { pill: "bg-emerald-100 text-emerald-700 border border-emerald-200", icon: CheckCircle2, dot: "bg-emerald-500" },
  APPLIED:  { pill: "bg-amber-100 text-amber-700 border border-amber-200",       icon: Clock,        dot: "bg-amber-500" },
  REVIEW:   { pill: "bg-sky-100 text-sky-700 border border-sky-200",             icon: Eye,          dot: "bg-sky-500" },
  INTERVIEW:   { pill: "bg-indigo-100 text-indigo-700 border border-indigo-200", icon: Eye,          dot: "bg-indigo-500" },
  REJECTED: { pill: "bg-rose-100 text-rose-700 border border-rose-200",          icon: XCircle,      dot: "bg-rose-500" },
};

const avatarColors = [
  "from-primary-700 to-primary-900",
  "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-600",
];

const STATUSES = ["All", "APPLIED", "REVIEW", "INTERVIEW", "ADMITTED", "REJECTED"];

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [applications, setApplications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  React.useEffect(() => {
    getApplications().then(res => {
      if (res.success) {
        setApplications(res.data);
      }
    });
  }, []);


  const filtered = applications.filter(a => {
    const matchSearch = !search || a.studentName.toLowerCase().includes(search.toLowerCase()) || a.admissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || a.stage === filterStatus;
    return matchSearch && matchStatus;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedApp = applications.find(a => a.id === selectedAppId);
  const mappedSelectedApp = selectedApp ? {
    id: selectedApp.id,
    admNo: selectedApp.admissionNumber,
    name: selectedApp.studentName,
    grade: selectedApp.grade,
    parent: selectedApp.parentName,
    phone: selectedApp.parentPhone,
    email: selectedApp.formData?.guardianEmail || selectedApp.formData?.email || '',
    date: new Date(selectedApp.createdAt).toLocaleDateString(),
    alert: false,
    initials: selectedApp.studentName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
    formData: selectedApp.formData || {},
  } : null;


  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden">

      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search applications..."
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all w-52 placeholder:text-slate-400"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  filterStatus === s
                    ? "bg-primary-900 text-white shadow-md shadow-primary-900/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => alert("Advanced filtering coming soon")} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-4 h-4" /> Advanced Filter
          </button>
          <Link href="/dashboard/registration/admissions/applications/new" className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-all shadow-md shadow-primary-900/20 hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> New Application
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">App ID</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Student</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Applying For</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Parent / Guardian</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Contact</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Date Applied</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((app, i) => {
              const cfg = statusConfig[app.stage as keyof typeof statusConfig] || statusConfig['APPLIED'];
              const StatusIcon = cfg.icon;
              const avatarGrad = avatarColors[i % avatarColors.length];
              const initials = app.studentName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
              return (
                <tr key={app.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-black text-primary-900 bg-primary-50 border border-primary-100 px-2 py-1 rounded-lg">{app.admissionNumber}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white text-[10px] font-black shadow-sm flex-shrink-0`}>
                        {initials}
                      </div>
                      <span className="font-bold text-slate-800 text-sm">{app.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">{app.grade}</span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-600">{app.parentName}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-slate-500">{app.parentPhone}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${cfg.pill}`}>
                      <StatusIcon className="w-3 h-3" />
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setSelectedAppId(app.id)} className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => alert("Messaging not implemented yet")} className="p-1.5 text-secondary-600 bg-secondary-50 hover:bg-secondary-100 border border-secondary-100 rounded-lg transition-colors" title="Message">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => alert("More options not implemented yet")} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="More">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold text-slate-500">No applications found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60">
        <span className="font-bold">Showing <span className="text-primary-900">{paginated.length}</span> of {filtered.length} applications</span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                currentPage === page 
                  ? "bg-primary-900 text-white font-black" 
                  : "text-slate-600 hover:bg-slate-100 bg-white border border-slate-200"
              }`}
            >
              {page}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 disabled:opacity-40 font-bold transition-colors"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {mappedSelectedApp && (
        <ApplicantDetailModal
          applicant={mappedSelectedApp}
          onClose={() => setSelectedAppId(null)}
          onRefresh={() => {
            getApplications().then(res => {
              if (res.success) setApplications(res.data);
            });
          }}
        />
      )}
    </div>
  );
}