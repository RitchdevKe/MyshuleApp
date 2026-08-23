"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Search, Plus, MoreHorizontal, FileArchive, X,
  Edit3, Trash2, Archive, CheckCircle, Clock, AlertCircle,
  UserCheck, FolderOpen
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Attendance", "Discipline", "Learning Support", "Meetings", "Reports"] as const;
type Category = (typeof CATEGORIES)[number];

const STATUSES = ["Active", "Archived"] as const;
type RecordStatus = (typeof STATUSES)[number];

interface TeachingRecord {
  id: string;
  name: string;
  category: Category;
  date: string;       // ISO date string
  addedBy: string;    // Conceptual link to Staff member name
  status: RecordStatus;
  linkedAllocation: string; // Conceptual link to a SubjectAllocation description
}

// ── Helpers ───────────────────────────────────────────────────────────────────

let idCounter = 0;
function generateId() {
  idCounter += 1;
  return `REC-${String(idCounter).padStart(3, "0")}`;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

// ── Action Dropdown ───────────────────────────────────────────────────────────

function ActionsDropdown({
  onEdit,
  onDelete,
  onArchive,
  isArchived,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
  isArchived: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => { onArchive(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Archive className="w-3.5 h-3.5" /> {isArchived ? "Restore" : "Archive"}
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Add / Edit Modal ──────────────────────────────────────────────────────────

interface ModalProps {
  title: string;
  initial?: Partial<TeachingRecord>;
  onSave: (data: Omit<TeachingRecord, "id" | "date">) => void;
  onClose: () => void;
}

function RecordModal({ title, initial, onSave, onClose }: ModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? CATEGORIES[0]);
  const [addedBy, setAddedBy] = useState(initial?.addedBy ?? "");
  const [status, setStatus] = useState<RecordStatus>(initial?.status ?? "Active");
  const [linkedAllocation, setLinkedAllocation] = useState(initial?.linkedAllocation ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Record name is required";
    if (!addedBy.trim()) e.addedBy = "Staff name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({ name: name.trim(), category, addedBy: addedBy.trim(), status, linkedAllocation: linkedAllocation.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Record Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grade 4 Term 1 Attendance"
              className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow ${errors.name ? "border-rose-300" : "border-slate-200"}`}
            />
            {errors.name && <p className="text-xs font-bold text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Added By (Staff link) */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Added By (Staff) *
            </label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                placeholder="e.g. James Mwangi"
                className={`w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow ${errors.addedBy ? "border-rose-300" : "border-slate-200"}`}
              />
            </div>
            {errors.addedBy && <p className="text-xs font-bold text-rose-500 mt-1">{errors.addedBy}</p>}
          </div>

          {/* Linked Allocation (conceptual) */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">
              Linked Allocation <span className="normal-case text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={linkedAllocation}
                onChange={(e) => setLinkedAllocation(e.target.value)}
                placeholder="e.g. Mathematics — Grade 4N"
                className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow"
              />
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-1">Conceptual link to a subject allocation</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
            <div className="flex gap-3">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-xl border transition-colors ${
                    status === s
                      ? s === "Active"
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-slate-100 border-slate-300 text-slate-700"
                      : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm">
              {initial ? "Save Changes" : "Add Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation ───────────────────────────────────────────────────────

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-1">Delete Record?</h3>
          <p className="text-sm font-medium text-slate-500 mb-6">
            Are you sure you want to delete <strong className="text-slate-700">{name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RecordsPage() {
  // ── Local CRUD State ──
  const [records, setRecords] = useState<TeachingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");

  // ── Modal State ──
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TeachingRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<TeachingRecord | null>(null);

  // ── CRUD Handlers ──

  function handleAdd(data: Omit<TeachingRecord, "id" | "date">) {
    const newRecord: TeachingRecord = {
      id: generateId(),
      date: todayISO(),
      ...data,
    };
    setRecords((prev) => [newRecord, ...prev]);
    setShowAddModal(false);
  }

  function handleEdit(data: Omit<TeachingRecord, "id" | "date">) {
    if (!editingRecord) return;
    setRecords((prev) =>
      prev.map((r) => (r.id === editingRecord.id ? { ...r, ...data } : r))
    );
    setEditingRecord(null);
  }

  function handleDelete() {
    if (!deletingRecord) return;
    setRecords((prev) => prev.filter((r) => r.id !== deletingRecord.id));
    setDeletingRecord(null);
  }

  function handleToggleArchive(record: TeachingRecord) {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? { ...r, status: r.status === "Archived" ? "Active" : "Archived" }
          : r
      )
    );
  }

  // ── Filtering ──

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        !searchQuery ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.addedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.linkedAllocation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || r.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [records, searchQuery, categoryFilter]);

  // ── Summary Stats (computed from real state) ──

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.status === "Active").length;
    const archived = records.filter((r) => r.status === "Archived").length;
    const uniqueStaff = new Set(records.map((r) => r.addedBy)).size;
    return { total, active, archived, uniqueStaff };
  }, [records]);

  // ── Style Helpers ──

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":   return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Archived": return "bg-slate-200/80 text-slate-700 border-slate-300";
      default:         return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":   return <CheckCircle className="w-3 h-3" />;
      case "Archived": return <Archive className="w-3 h-3" />;
      default:         return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 text-primary-900 rounded-xl">
              <FileArchive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Total Records</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.active}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Active</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <Archive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.archived}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Archived</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800">{stats.uniqueStaff}</p>
          <p className="text-xs font-bold text-slate-500 mt-0.5">Contributing Staff</p>
        </div>
      </div>

      {/* ── Main Table Card ── */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">

        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records by name, ID, or staff..."
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as "All" | Category)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          {filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                <FileArchive className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-700 mb-1">
                {records.length === 0 ? "No records yet" : "No matching records"}
              </h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">
                {records.length === 0
                  ? "Click \"Add Record\" to create your first teaching record. Records are linked to staff members and subject allocations."
                  : "Try adjusting your search or filter criteria."}
              </p>
              {records.length === 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add First Record
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Record Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4">Added By <span className="text-blue-400 normal-case font-black">(Staff)</span></th>
                  <th className="px-6 py-4">Linked Allocation</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {filteredRecords.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <FileArchive className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.name}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">{row.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold text-slate-700">{row.addedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {row.linkedAllocation ? (
                        <span className="bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200 text-xs font-bold text-indigo-600">
                          {row.linkedAllocation}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                        {getStatusIcon(row.status)}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionsDropdown
                        isArchived={row.status === "Archived"}
                        onEdit={() => setEditingRecord(row)}
                        onDelete={() => setDeletingRecord(row)}
                        onArchive={() => handleToggleArchive(row)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>
            Showing {filteredRecords.length} of {records.length} record{records.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            Local state — data resets on refresh
          </div>
        </div>
      </div>

      {/* ── Modals ── */}

      {showAddModal && (
        <RecordModal
          title="Add New Record"
          onSave={handleAdd}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {editingRecord && (
        <RecordModal
          title="Edit Record"
          initial={editingRecord}
          onSave={handleEdit}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {deletingRecord && (
        <DeleteConfirm
          name={deletingRecord.name}
          onConfirm={handleDelete}
          onCancel={() => setDeletingRecord(null)}
        />
      )}
    </div>
  );
}