"use client";

import React, { useState, useMemo } from "react";
import {
  Search, Plus, MoreHorizontal, FileText, CheckCircle2,
  X, Pencil, Trash2, Eye, BookOpen, Users, GraduationCap, ClipboardList,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
export interface LessonPlan {
  id: string;
  topic: string;
  subject: string;
  class: string;
  teacher: string;
  week: string;
  objectives: string;
  activities: string;
  resources: string;
  status: "Draft" | "Pending Review" | "Approved";
  createdAt: string;
}

interface OverviewData {
  teachingStaffCount: number;
  allocatedTeachersCount: number;
  totalAllocations: number;
  subjects: { id: string; name: string; code: string }[];
  classes: { id: string; name: string }[];
  teachers: { id: string; name: string }[];
}

// ── Seed data (used as initial local state) ──────────────────────────────────
const SEED_PLANS: LessonPlan[] = [
  {
    id: "LP-001", topic: "Introduction to Fractions", subject: "Mathematics",
    class: "Grade 4", teacher: "", week: "Week 3", objectives: "Understand basic fractions and their notation.",
    activities: "Fraction wall activity, worksheet practice.", resources: "Fraction wall poster, worksheets",
    status: "Approved", createdAt: new Date().toISOString(),
  },
  {
    id: "LP-002", topic: "Photosynthesis", subject: "Science",
    class: "Grade 5", teacher: "", week: "Week 3", objectives: "Explain the process of photosynthesis.",
    activities: "Lab experiment with plants, diagram labelling.", resources: "Potted plants, sunlight source, diagram sheets",
    status: "Pending Review", createdAt: new Date().toISOString(),
  },
  {
    id: "LP-003", topic: "Reading Comprehension", subject: "English",
    class: "Grade 4", teacher: "", week: "Week 4", objectives: "Improve reading comprehension and inference skills.",
    activities: "Guided reading session, Q&A worksheet.", resources: "Storybook excerpts, comprehension worksheets",
    status: "Draft", createdAt: new Date().toISOString(),
  },
  {
    id: "LP-004", topic: "Creative Writing Basics", subject: "English",
    class: "Grade 6", teacher: "", week: "Week 3", objectives: "Introduce narrative writing structure.",
    activities: "Story starter prompts, peer review.", resources: "Writing journals, story starter cards",
    status: "Approved", createdAt: new Date().toISOString(),
  },
];

// ── Status helpers ───────────────────────────────────────────────────────────
const getStatusStyle = (status: string) => {
  switch (status) {
    case "Approved": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
    case "Pending Review": return "bg-amber-100/80 text-amber-700 border-amber-200";
    case "Draft": return "bg-slate-100/80 text-slate-700 border-slate-200";
    default: return "bg-slate-100/80 text-slate-700 border-slate-200";
  }
};

const STATUS_OPTIONS: LessonPlan["status"][] = ["Draft", "Pending Review", "Approved"];
const WEEK_OPTIONS = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
const ITEMS_PER_PAGE = 6;

// ── Create / Edit Modal ──────────────────────────────────────────────────────
function PlanModal({
  plan,
  subjects,
  classes,
  teachers,
  onSave,
  onClose,
}: {
  plan: LessonPlan | null; // null = create mode
  subjects: { id: string; name: string }[];
  classes: { id: string; name: string }[];
  teachers: { id: string; name: string }[];
  onSave: (data: Omit<LessonPlan, "id" | "createdAt">) => void;
  onClose: () => void;
}) {
  const isEdit = plan !== null;
  const [topic, setTopic] = useState(plan?.topic ?? "");
  const [subject, setSubject] = useState(plan?.subject ?? "");
  const [cls, setCls] = useState(plan?.class ?? "");
  const [teacher, setTeacher] = useState(plan?.teacher ?? "");
  const [week, setWeek] = useState(plan?.week ?? "Week 1");
  const [objectives, setObjectives] = useState(plan?.objectives ?? "");
  const [activities, setActivities] = useState(plan?.activities ?? "");
  const [resources, setResources] = useState(plan?.resources ?? "");
  const [status, setStatus] = useState<LessonPlan["status"]>(plan?.status ?? "Draft");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!topic.trim()) e.topic = "Topic is required.";
    if (!subject.trim()) e.subject = "Subject is required.";
    if (!cls.trim()) e.cls = "Class is required.";
    if (!objectives.trim()) e.objectives = "Objectives are required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ topic: topic.trim(), subject, class: cls, teacher, week, objectives: objectives.trim(), activities: activities.trim(), resources: resources.trim(), status });
  };

  // Build the subject/class dropdown values from DB data or fallback
  const subjectOptions = subjects.length > 0 ? subjects : [{ id: "math", name: "Mathematics" }, { id: "eng", name: "English" }, { id: "sci", name: "Science" }];
  const classOptions = classes.length > 0 ? classes : [{ id: "g4", name: "Grade 4" }, { id: "g5", name: "Grade 5" }, { id: "g6", name: "Grade 6" }];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200/60 flex items-center justify-between bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-t-3xl">
          <div>
            <h2 className="text-lg font-black">{isEdit ? "Edit Lesson Plan" : "Create Lesson Plan"}</h2>
            <p className="text-xs font-medium text-primary-100 mt-0.5">{isEdit ? "Update the lesson details below." : "Fill in the lesson plan details."}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Topic *</label>
            <input
              value={topic} onChange={e => setTopic(e.target.value)}
              className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow ${errors.topic ? "border-rose-400" : "border-slate-200/60"}`}
              placeholder="e.g. Introduction to Algebra"
            />
            {errors.topic && <p className="text-xs text-rose-500 font-bold mt-1">{errors.topic}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Subject *</label>
              <select
                value={subject} onChange={e => setSubject(e.target.value)}
                className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer ${errors.subject ? "border-rose-400" : "border-slate-200/60"}`}
              >
                <option value="">Select subject</option>
                {subjectOptions.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              {errors.subject && <p className="text-xs text-rose-500 font-bold mt-1">{errors.subject}</p>}
            </div>

            {/* Class */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Class *</label>
              <select
                value={cls} onChange={e => setCls(e.target.value)}
                className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer ${errors.cls ? "border-rose-400" : "border-slate-200/60"}`}
              >
                <option value="">Select class</option>
                {classOptions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              {errors.cls && <p className="text-xs text-rose-500 font-bold mt-1">{errors.cls}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Teacher (optional - conceptual link to Staff) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Assigned Teacher</label>
              <select
                value={teacher} onChange={e => setTeacher(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                <option value="">Unassigned</option>
                {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            {/* Week */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Week</label>
              <select
                value={week} onChange={e => setWeek(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                {WEEK_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Learning Objectives *</label>
            <textarea
              value={objectives} onChange={e => setObjectives(e.target.value)}
              rows={2}
              className={`w-full px-4 py-2.5 text-sm font-bold bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow resize-none ${errors.objectives ? "border-rose-400" : "border-slate-200/60"}`}
              placeholder="What should students learn from this lesson?"
            />
            {errors.objectives && <p className="text-xs text-rose-500 font-bold mt-1">{errors.objectives}</p>}
          </div>

          {/* Activities */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Activities</label>
            <textarea
              value={activities} onChange={e => setActivities(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow resize-none"
              placeholder="Describe the classroom activities..."
            />
          </div>

          {/* Resources */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Resources / Materials</label>
            <input
              value={resources} onChange={e => setResources(e.target.value)}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-shadow"
              placeholder="Textbook, charts, worksheets, etc."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
            <select
              value={status} onChange={e => setStatus(e.target.value as LessonPlan["status"])}
              className="w-full px-4 py-2.5 text-sm font-bold bg-white border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/60 flex items-center justify-end gap-3 bg-slate-50/80">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm">
            {isEdit ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── View / Detail Panel ──────────────────────────────────────────────────────
function ViewPanel({ plan, onClose }: { plan: LessonPlan; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-96 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 px-6 py-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-wider">Lesson Plan</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h3 className="font-black text-white text-lg">{plan.topic}</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border backdrop-blur-sm ${getStatusStyle(plan.status)}`}>
              {plan.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
              {plan.status}
            </span>
            <span className="text-[10px] font-bold text-white/60">{plan.id}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          <DetailRow label="Subject" value={plan.subject} icon={<BookOpen className="w-3.5 h-3.5" />} />
          <DetailRow label="Class" value={plan.class} icon={<GraduationCap className="w-3.5 h-3.5" />} />
          <DetailRow label="Teacher" value={plan.teacher || "Unassigned"} icon={<Users className="w-3.5 h-3.5" />} />
          <DetailRow label="Week" value={plan.week} icon={<ClipboardList className="w-3.5 h-3.5" />} />
          <div className="px-6 py-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Learning Objectives</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{plan.objectives || "—"}</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Activities</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{plan.activities || "—"}</p>
          </div>
          <div className="px-6 py-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Resources / Materials</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{plan.resources || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="px-6 py-3 flex items-center gap-3">
      <div className="p-1.5 bg-primary-50 text-primary-900 rounded-lg">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ── Delete confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({ plan, onConfirm, onClose }: { plan: LessonPlan; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-slate-800">Delete Lesson Plan?</h3>
        <p className="text-sm font-bold text-slate-500 mt-2">
          &ldquo;{plan.topic}&rdquo; will be permanently removed. This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
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

// ── Actions dropdown ─────────────────────────────────────────────────────────
function ActionsDropdown({ plan, onView, onEdit, onDelete }: { plan: LessonPlan; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200/60 py-1 w-40 animate-in fade-in duration-100">
            <button onClick={() => { setOpen(false); onView(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Eye className="w-4 h-4 text-slate-400" /> View
            </button>
            <button onClick={() => { setOpen(false); onEdit(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Pencil className="w-4 h-4 text-slate-400" /> Edit
            </button>
            <button onClick={() => { setOpen(false); onDelete(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 className="w-4 h-4 text-rose-400" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Client Component ────────────────────────────────────────────────────
export default function LessonPlanningClient({ overview }: { overview: OverviewData }) {
  // ── Local state CRUD ────────────────────────────────────────────────────────
  const [plans, setPlans] = useState<LessonPlan[]>(SEED_PLANS);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [page, setPage] = useState(1);

  // Modals
  const [modalPlan, setModalPlan] = useState<LessonPlan | null | "create">(null); // null = closed, "create" = new, LessonPlan = edit
  const [viewPlan, setViewPlan] = useState<LessonPlan | null>(null);
  const [deletePlan, setDeletePlan] = useState<LessonPlan | null>(null);

  // ── ID generator ────────────────────────────────────────────────────────────
  const nextId = () => {
    const maxNum = plans.reduce((max, p) => {
      const n = parseInt(p.id.replace("LP-", ""), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    return `LP-${String(maxNum + 1).padStart(3, "0")}`;
  };

  // ── Filtering & searching ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = plans;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.topic.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q) ||
        p.teacher.toLowerCase().includes(q)
      );
    }
    if (filterSubject !== "All Subjects") {
      result = result.filter(p => p.subject === filterSubject);
    }
    if (filterStatus !== "All Statuses") {
      result = result.filter(p => p.status === filterStatus);
    }
    return result;
  }, [plans, search, filterSubject, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCreate = (data: Omit<LessonPlan, "id" | "createdAt">) => {
    const newPlan: LessonPlan = { ...data, id: nextId(), createdAt: new Date().toISOString() };
    setPlans(prev => [newPlan, ...prev]);
    setModalPlan(null);
    setPage(1);
  };

  const handleUpdate = (id: string, data: Omit<LessonPlan, "id" | "createdAt">) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    setModalPlan(null);
  };

  const handleDelete = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    setDeletePlan(null);
    // Adjust page if we deleted the last item on this page
    const newTotal = Math.max(1, Math.ceil((filtered.length - 1) / ITEMS_PER_PAGE));
    if (currentPage > newTotal) setPage(newTotal);
  };

  // ── Stat counts ─────────────────────────────────────────────────────────────
  const approvedCount = plans.filter(p => p.status === "Approved").length;
  const pendingCount = plans.filter(p => p.status === "Pending Review").length;
  const draftCount = plans.filter(p => p.status === "Draft").length;

  // Build subject list for filter (merge DB subjects + any from plans)
  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    overview.subjects.forEach(s => set.add(s.name));
    plans.forEach(p => set.add(p.subject));
    return Array.from(set).sort();
  }, [overview.subjects, plans]);

  return (
    <div className="space-y-6">
      {/* ── Top Stat Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Teaching Staff (real DB data) */}
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl border border-primary-800 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-primary-100 font-bold mb-1 relative z-10">Teaching Staff</p>
          <h3 className="text-3xl font-black tracking-tight relative z-10">
            {overview.teachingStaffCount} <span className="text-sm font-bold text-primary-200">active</span>
          </h3>
        </div>

        {/* Total Plans (local state) */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><FileText className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Total Plans</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">
            {plans.length} <span className="text-sm font-bold text-slate-400">plans</span>
          </h3>
        </div>

        {/* Approved */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><CheckCircle2 className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Approved</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">
            {approvedCount} <span className="text-sm font-bold text-slate-400">plans</span>
          </h3>
        </div>

        {/* Pending Review */}
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><ClipboardList className="w-6 h-6" /></div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Pending / Draft</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">
            {pendingCount + draftCount} <span className="text-sm font-bold text-slate-400">plans</span>
          </h3>
        </div>
      </div>

      {/* ── Main Table Card ──────────────────────────────────────────────── */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search lesson plans..."
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filterSubject}
              onChange={e => { setFilterSubject(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Subjects</option>
              {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={() => setModalPlan("create")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Plan
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300">
              <FileText className="w-12 h-12 mb-3" />
              <p className="text-lg font-black text-slate-400">No lesson plans found</p>
              <p className="text-sm font-bold text-slate-400 mt-1">
                {plans.length === 0
                  ? "Click \"Create Plan\" to add your first lesson plan."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Topic</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Week</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {paginated.map(row => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.topic}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.subject}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.class}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{row.teacher || <span className="text-slate-400 italic">Unassigned</span>}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">{row.week}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                        {row.status === "Approved" && <CheckCircle2 className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ActionsDropdown
                        plan={row}
                        onView={() => setViewPlan(row)}
                        onEdit={() => setModalPlan(row)}
                        onDelete={() => setDeletePlan(row)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer with real pagination */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} lesson plan{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {modalPlan === "create" && (
        <PlanModal
          plan={null}
          subjects={overview.subjects}
          classes={overview.classes}
          teachers={overview.teachers}
          onSave={handleCreate}
          onClose={() => setModalPlan(null)}
        />
      )}
      {modalPlan !== null && modalPlan !== "create" && (
        <PlanModal
          plan={modalPlan as LessonPlan}
          subjects={overview.subjects}
          classes={overview.classes}
          teachers={overview.teachers}
          onSave={data => handleUpdate((modalPlan as LessonPlan).id, data)}
          onClose={() => setModalPlan(null)}
        />
      )}
      {viewPlan && <ViewPanel plan={viewPlan} onClose={() => setViewPlan(null)} />}
      {deletePlan && (
        <DeleteConfirm
          plan={deletePlan}
          onConfirm={() => handleDelete(deletePlan.id)}
          onClose={() => setDeletePlan(null)}
        />
      )}
    </div>
  );
}
