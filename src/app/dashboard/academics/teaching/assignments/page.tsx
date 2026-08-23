"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search, Plus, MoreHorizontal, BookOpen, Calendar,
  CheckCircle2, X, Pencil, Trash2, AlertCircle,
  FileText, Clock, PenTool
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type AssignmentStatus = "Active" | "Upcoming" | "Completed" | "Draft";

interface Assignment {
  id: string;
  title: string;
  className: string;
  subject: string;
  teacher: string;
  dueDate: string;          // YYYY-MM-DD
  submissions: string;      // e.g. "28/30" or "-"
  status: AssignmentStatus;
}

type FormData = Omit<Assignment, "id">;

// ── Reference data (conceptual link to Classes, Subjects, Teachers) ──────────
const CLASSES  = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];
const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "Kiswahili", "CRE", "Art & Craft"];
const TEACHERS = ["Sarah Mutiso", "David Ochieng", "Mary Wanjiku", "John Kamau", "Grace Njeri", "Peter Otieno"];
const STATUSES: AssignmentStatus[] = ["Active", "Upcoming", "Completed", "Draft"];

const emptyForm: FormData = {
  title: "",
  className: CLASSES[0],
  subject: SUBJECTS[0],
  teacher: TEACHERS[0],
  dueDate: "",
  submissions: "-",
  status: "Draft",
};

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `ASN-${String(idCounter).padStart(3, "0")}`;
}

// ── Actions menu (per-row) ────────────────────────────────────────────────────
function ActionsMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Modal form ────────────────────────────────────────────────────────────────
function AssignmentModal({
  mode,
  initial,
  onSave,
  onCancel,
}: {
  mode: "create" | "edit";
  initial: FormData;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) onSave(form);
  };

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <PenTool className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">
                {mode === "create" ? "New Assignment" : "Edit Assignment"}
              </p>
              <h3 className="font-black text-white text-lg leading-tight">
                {mode === "create" ? "Create Assignment" : "Update Assignment"}
              </h3>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Fractions Worksheet"
              className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow ${errors.title ? "border-rose-300 ring-rose-200" : "border-slate-200"}`}
            />
            {errors.title && <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>}
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Class *</label>
              <select
                value={form.className}
                onChange={(e) => set("className", e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Subject *</label>
              <select
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Teacher & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Teacher *</label>
              <select
                value={form.teacher}
                onChange={(e) => set("teacher", e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                {TEACHERS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Due Date *</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
                className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow ${errors.dueDate ? "border-rose-300 ring-rose-200" : "border-slate-200"}`}
              />
              {errors.dueDate && <p className="text-xs font-bold text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.dueDate}</p>}
            </div>
          </div>

          {/* Status & Submissions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as AssignmentStatus)}
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Submissions</label>
              <input
                type="text"
                value={form.submissions}
                onChange={(e) => set("submissions", e.target.value)}
                placeholder='e.g. "28/30" or "-"'
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm">
              {mode === "create" ? "Create Assignment" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirmation ───────────────────────────────────────────────────────
function DeleteConfirm({
  assignment,
  onConfirm,
  onCancel,
}: {
  assignment: Assignment;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-rose-600" />
        </div>
        <h3 className="text-lg font-black text-slate-800 mb-1">Delete Assignment</h3>
        <p className="text-sm text-slate-500 font-medium mb-6">
          Are you sure you want to delete <span className="font-bold text-slate-700">&ldquo;{assignment.title}&rdquo;</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AssignmentsPage() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [modal, setModal] = useState<{ mode: "create" | "edit"; assignment?: Assignment } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  // ── Derived data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = assignments;
    if (classFilter !== "All Classes") {
      list = list.filter((a) => a.className === classFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subject.toLowerCase().includes(q) ||
          a.teacher.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assignments, search, classFilter]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter((a) => a.status === "Active").length;
    const completed = assignments.filter((a) => a.status === "Completed").length;
    const drafts = assignments.filter((a) => a.status === "Draft").length;
    return { total, active, completed, drafts };
  }, [assignments]);

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleCreate = (data: FormData) => {
    const newAssignment: Assignment = { ...data, id: nextId() };
    setAssignments((prev) => [newAssignment, ...prev]);
    setModal(null);
  };

  const handleUpdate = (data: FormData) => {
    if (!modal?.assignment) return;
    setAssignments((prev) =>
      prev.map((a) => (a.id === modal.assignment!.id ? { ...a, ...data } : a))
    );
    setModal(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setAssignments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Upcoming": return "bg-blue-100/80 text-blue-700 border-blue-200";
      case "Completed": return "bg-slate-100/80 text-slate-700 border-slate-200";
      case "Draft": return "bg-amber-100/80 text-amber-700 border-amber-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  // ── Unique classes present in data (for filter options) ───────────────────
  const classesInData = useMemo(
    () => Array.from(new Set(assignments.map((a) => a.className))).sort(),
    [assignments]
  );

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl border border-primary-800 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10"><BookOpen className="w-6 h-6" /></div>
          </div>
          <p className="text-primary-100 font-bold mb-1 relative z-10">Total Assignments</p>
          <h3 className="text-3xl font-black tracking-tight relative z-10">{stats.total}</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Active</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{stats.active} <span className="text-sm font-bold text-slate-400">assignments</span></h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FileText className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Completed</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{stats.completed} <span className="text-sm font-bold text-slate-400">assignments</span></h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Drafts</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{stats.drafts} <span className="text-sm font-bold text-slate-400">assignments</span></h3>
        </div>
      </div>

      {/* ── Table card ──────────────────────────────────────────────────────── */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments..."
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Classes</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => setModal({ mode: "create" })}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Assignment
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Class & Subject</th>
                <th className="px-6 py-4">Teacher</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Submissions</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-7 h-7 text-slate-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-500">No assignments found</p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">
                          {assignments.length === 0
                            ? "Click \"Create Assignment\" to add your first assignment."
                            : "Try adjusting your search or filter."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.title}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{row.className}</span>
                        <span className="text-xs font-bold text-slate-500">{row.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{row.teacher}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 font-bold text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {row.dueDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-800">{row.submissions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                        {row.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionsMenu
                        onEdit={() => setModal({ mode: "edit", assignment: row })}
                        onDelete={() => setDeleteTarget(row)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>
            Showing {filtered.length} of {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {modal && (
        <AssignmentModal
          mode={modal.mode}
          initial={
            modal.mode === "edit" && modal.assignment
              ? {
                  title: modal.assignment.title,
                  className: modal.assignment.className,
                  subject: modal.assignment.subject,
                  teacher: modal.assignment.teacher,
                  dueDate: modal.assignment.dueDate,
                  submissions: modal.assignment.submissions,
                  status: modal.assignment.status,
                }
              : emptyForm
          }
          onSave={modal.mode === "create" ? handleCreate : handleUpdate}
          onCancel={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          assignment={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}