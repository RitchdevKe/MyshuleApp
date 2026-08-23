"use client";

import React, { useState, useTransition } from "react";
import {
  Search, Plus, UserCheck, CheckCircle, Activity,
  Clock, MoreHorizontal, X, BookOpen,
  ChevronRight, ChevronDown, Trash2, Pencil,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  createAllocation,
  updateAllocation,
  deleteAllocation,
} from "@/app/actions/allocations";
import { useRouter } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────

interface AllocationRow {
  id: string;
  allocationIds: string[];
  staffId: string;
  staffFirstName: string;
  staffLastName: string;
  subjectId: string;
  subjectName: string;
  streams: { allocationId: string; streamId: string; streamName: string; className: string }[];
}

interface StaffOption {
  id: string;
  firstName: string;
  lastName: string;
}

interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

interface StreamOption {
  id: string;
  name: string;
  className: string;
  label: string;
}

interface WorkloadEntry {
  name: string;
  load: number;
  color: string;
}

interface Stats {
  totalStaff: number;
  optimalCount: number;
  overloadedCount: number;
  totalAllocations: number;
}

interface Props {
  allocations: AllocationRow[];
  staffList: StaffOption[];
  subjectsList: SubjectOption[];
  streamsList: StreamOption[];
  academicYearId: string;
  stats: Stats;
  workloadData: WorkloadEntry[];
}

const avatarGrads = [
  "from-primary-700 to-primary-900",
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-sky-500 to-blue-600",
  "from-amber-500 to-orange-500",
];

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

function getStatus(streamCount: number): "Optimal" | "Overloaded" | "Underutilized" {
  if (streamCount > 12) return "Overloaded";
  if (streamCount < 3) return "Underutilized";
  return "Optimal";
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Optimal":       return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
    case "Overloaded":    return "bg-rose-100/80 text-rose-700 border-rose-200";
    case "Underutilized": return "bg-amber-100/80 text-amber-700 border-amber-200";
    default:              return "bg-slate-100/80 text-slate-700 border-slate-200";
  }
}

// ── Modal for create / edit ───────────────────────────────────────────────────

function AllocationModal({
  mode,
  staffList,
  subjectsList,
  streamsList,
  academicYearId,
  initial,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  staffList: StaffOption[];
  subjectsList: SubjectOption[];
  streamsList: StreamOption[];
  academicYearId: string;
  initial?: AllocationRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [staffId, setStaffId] = useState(initial?.staffId ?? "");
  const [subjectId, setSubjectId] = useState(initial?.subjectId ?? "");
  const [selectedStreams, setSelectedStreams] = useState<string[]>(
    initial?.streams.map((s) => s.streamId) ?? []
  );
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const toggleStream = (id: string) => {
    setSelectedStreams((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!staffId || !subjectId || selectedStreams.length === 0) {
      setError("Please select a teacher, subject, and at least one class/stream.");
      return;
    }
    setError("");

    startTransition(async () => {
      let result;
      if (mode === "create") {
        result = await createAllocation({
          staffId,
          subjectId,
          streamIds: selectedStreams,
          academicYearId,
        });
      } else {
        result = await updateAllocation({
          oldAllocationIds: initial?.allocationIds ?? [],
          staffId,
          subjectId,
          streamIds: selectedStreams,
          academicYearId,
        });
      }

      if (result.success) {
        onSaved();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-black text-white">
            {mode === "create" ? "New Allocation" : "Edit Allocation"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="px-4 py-2.5 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-700">
              {error}
            </div>
          )}

          {/* Teacher Select */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Teacher
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
            >
              <option value="">— Select teacher —</option>
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
            >
              <option value="">— Select subject —</option>
              {subjectsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Stream multi-select */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Classes / Streams
            </label>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
              {streamsList.length === 0 ? (
                <p className="text-sm text-slate-400 font-bold px-4 py-3">No streams found. Create classes & streams first.</p>
              ) : (
                streamsList.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStreams.includes(s.id)}
                      onChange={() => toggleStream(s.id)}
                      className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-900"
                    />
                    <span className="text-sm font-bold text-slate-700">{s.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : mode === "create" ? "Create Allocation" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation modal ─────────────────────────────────────────────────

function DeleteModal({
  row,
  onClose,
  onDeleted,
}: {
  row: AllocationRow;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAllocation(row.allocationIds);
      if (result.success) {
        onDeleted();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-1">Delete Allocation?</h3>
        <p className="text-sm text-slate-500 font-bold mb-6">
          Remove <span className="text-slate-800">{row.staffFirstName} {row.staffLastName}</span>&apos;s{" "}
          <span className="text-slate-800">{row.subjectName}</span> allocation across{" "}
          {row.streams.length} stream{row.streams.length !== 1 ? "s" : ""}? This cannot be undone.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-5 py-2 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export default function AllocationClient({
  allocations,
  staffList,
  subjectsList,
  streamsList,
  academicYearId,
  stats,
  workloadData,
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; row?: AllocationRow } | null>(null);
  const [deleteRow, setDeleteRow] = useState<AllocationRow | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Filtered allocations
  const filtered = allocations.filter((row) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      `${row.staffFirstName} ${row.staffLastName}`.toLowerCase().includes(q) ||
      row.subjectName.toLowerCase().includes(q) ||
      row.streams.some((s) => s.streamName.toLowerCase().includes(q))
    );
  });

  const onSaved = () => {
    setModal(null);
    router.refresh();
  };

  const onDeleted = () => {
    setDeleteRow(null);
    router.refresh();
  };

  // Build per-staff stream counts for status display
  const staffStreamCounts = new Map<string, number>();
  for (const row of allocations) {
    staffStreamCounts.set(
      row.staffId,
      (staffStreamCounts.get(row.staffId) ?? 0) + row.streams.length
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl border border-primary-800 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-primary-100 font-bold mb-1 relative z-10">Total Teaching Staff</p>
          <h3 className="text-3xl font-black tracking-tight relative z-10">{stats.totalStaff}</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><CheckCircle className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Optimal Workload</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{stats.optimalCount} <span className="text-sm font-bold text-slate-400">teachers</span></h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl"><Activity className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Overloaded</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{stats.overloadedCount} <span className="text-sm font-bold text-slate-400">teachers</span></h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Total Allocations</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{stats.totalAllocations} <span className="text-sm font-bold text-slate-400">entries</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="xl:col-span-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search teachers, subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
              />
            </div>
            <button
              onClick={() => setModal({ mode: "create" })}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Allocation
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <BookOpen className="w-12 h-12 mb-3 text-slate-300" />
                <p className="text-sm font-bold text-slate-500">
                  {search ? "No allocations match your search." : "No allocations yet. Create one to get started."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Teacher</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Streams</th>
                    <th className="px-6 py-4">Count</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {filtered.map((row, ri) => {
                    const totalForStaff = staffStreamCounts.get(row.staffId) ?? row.streams.length;
                    const status = getStatus(totalForStaff);
                    return (
                      <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                        {/* Teacher */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarGrads[ri % avatarGrads.length]} flex items-center justify-center text-white text-[10px] font-black flex-shrink-0`}>
                              {getInitials(row.staffFirstName, row.staffLastName)}
                            </div>
                            <span className="font-bold text-slate-800">{row.staffFirstName} {row.staffLastName}</span>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-6 py-4 font-bold text-slate-600">{row.subjectName}</td>

                        {/* Streams */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {row.streams.map((s) => (
                              <span
                                key={s.allocationId}
                                className="flex items-center gap-1 px-2.5 py-1 bg-white text-slate-600 rounded-lg border border-slate-200 shadow-sm text-[10px] font-bold uppercase tracking-wider"
                              >
                                {s.streamName}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Count */}
                        <td className="px-6 py-4 font-black text-slate-700">{row.streams.length}</td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(status)}`}>
                            {status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setMenuOpen(menuOpen === row.id ? null : row.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {menuOpen === row.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                                <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[140px]">
                                  <button
                                    onClick={() => { setMenuOpen(null); setModal({ mode: "edit", row }); }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                  </button>
                                  <button
                                    onClick={() => { setMenuOpen(null); setDeleteRow(row); }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Workload Chart */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-6 flex flex-col min-h-[400px]">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Workload Dist.</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Allocations per teacher</p>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[200px]">
            {workloadData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Activity className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-400">No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }} width={60} />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                  <Bar dataKey="load" radius={[0, 4, 4, 0]} barSize={20}>
                    {workloadData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <AllocationModal
          mode={modal.mode}
          staffList={staffList}
          subjectsList={subjectsList}
          streamsList={streamsList}
          academicYearId={academicYearId}
          initial={modal.row}
          onClose={() => setModal(null)}
          onSaved={onSaved}
        />
      )}

      {/* Delete Modal */}
      {deleteRow && (
        <DeleteModal
          row={deleteRow}
          onClose={() => setDeleteRow(null)}
          onDeleted={onDeleted}
        />
      )}
    </div>
  );
}
