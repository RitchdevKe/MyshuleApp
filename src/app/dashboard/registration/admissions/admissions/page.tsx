"use client";

import React, { useState, useEffect } from "react";
import {
  MoreHorizontal, Calendar, MessageSquare, Plus, ArrowRight,
  User, GraduationCap, Phone, AlertTriangle, CheckCircle2,
  ChevronRight, X, Hash, Shield, Search
} from "lucide-react";
import { getApplications, createApplication, updateApplicationStage } from "@/app/actions/applications";
import { NewApplicantWizardModal } from "@/components/NewApplicantWizardModal";
import { ApplicantDetailModal } from "@/components/ApplicantDetailModal";

type Stage = "APPLIED" | "REVIEW" | "INTERVIEW" | "ADMITTED" | "REJECTED";

interface Applicant {
  id: string;
  admNo: string;       
  name: string;
  grade: string;
  parent: string;
  phone: string;
  email?: string;
  date: string;
  alert: boolean;
  initials: string;
  formData?: any;
}

const columns: { id: Stage; title: string; count: number; colorClass: string; headerGrad: string; cardBorder: string; badge: string }[] = [
  { id: "APPLIED",   title: "Applied",   count: 0,  colorClass: "from-primary-900 to-primary-700", headerGrad: "bg-primary-900", cardBorder: "border-primary-100 hover:border-primary-300", badge: "bg-primary-100 text-primary-800 border-primary-200" },
  { id: "REVIEW",    title: "In Review", count: 0,  colorClass: "from-amber-600 to-amber-500",      headerGrad: "bg-amber-600",   cardBorder: "border-amber-100 hover:border-amber-300",   badge: "bg-amber-100 text-amber-800 border-amber-200" },
  { id: "INTERVIEW", title: "Interview", count: 0,  colorClass: "from-indigo-600 to-violet-600",    headerGrad: "bg-indigo-600",  cardBorder: "border-indigo-100 hover:border-indigo-300", badge: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  { id: "ADMITTED",  title: "Admitted",  count: 0,  colorClass: "from-emerald-600 to-teal-600",     headerGrad: "bg-emerald-600", cardBorder: "border-emerald-100 hover:border-emerald-300", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { id: "REJECTED",  title: "Rejected",  count: 0,  colorClass: "from-rose-600 to-red-600",         headerGrad: "bg-rose-600",    cardBorder: "border-rose-100 hover:border-rose-300",     badge: "bg-rose-100 text-rose-800 border-rose-200" },
];

const avatarGrads = [
  "from-primary-600 to-primary-400",
  "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400",
  "from-indigo-500 to-violet-400",
  "from-rose-500 to-pink-400"
];

const GRADE_OPTIONS = [
  "Pre-Primary 1", "Pre-Primary 2", "Grade 1", "Grade 2", "Grade 3",
  "Grade 4", "Grade 5", "Grade 6", "Junior Secondary 1", "Junior Secondary 2", "Junior Secondary 3"
];

export default function AdmissionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [cards, setCards] = useState<Record<Stage, Applicant[]>>({
    APPLIED: [], REVIEW: [], INTERVIEW: [], ADMITTED: [], REJECTED: []
  });
  const [form, setForm] = useState({ name: "", grade: "Grade 1", parent: "", phone: "" });
  const [duplicate, setDuplicate] = useState<Applicant | null>(null);
  const [activeTab, setActiveTab] = useState<Stage | 'ALL'>('ALL');

  const fetchApplications = async () => {
    const res = await getApplications();
    if (res.success && res.data) {
      const grouped: Record<Stage, Applicant[]> = {
        APPLIED: [], REVIEW: [], INTERVIEW: [], ADMITTED: [], REJECTED: []
      };
      res.data.forEach((app: any) => {
        const initials = app.studentName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
        const applicant: Applicant = {
          id: app.id,
          admNo: app.admissionNumber,
          name: app.studentName,
          grade: app.grade,
          parent: app.parentName,
          phone: app.parentPhone,
          email: app.formData?.guardianEmail || app.formData?.email || '',
          date: new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
          alert: false, // You could add logic here
          initials,
          formData: app.formData || {},
        };
        const st: Stage = app.stage || "APPLIED";
        if (grouped[st]) grouped[st].push(applicant);
      });
      setCards(grouped);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalCount = Object.values(cards).flat().length;
  const allApplicants = Object.values(cards).flat();

  function checkDuplicate(name: string, parent: string): Applicant | null {
    const n = name.trim().toLowerCase();
    const p = parent.trim().toLowerCase();
    if (!n || !p) return null;
    return allApplicants.find(a =>
      a.name.toLowerCase() === n && a.parent.toLowerCase() === p
    ) ?? null;
  }

  function handleFormChange(field: string, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (field === "name" || field === "parent") {
      setDuplicate(checkDuplicate(next.name, next.parent));
    }
  }

  async function handleWizardSubmit(data: any) {
    const res = await createApplication(data);
    if (res.success) {
      setModalOpen(false);
      fetchApplications();
    } else {
      throw new Error(res.error || "Failed to submit");
    }
  }

  async function handleMove(id: string, newStage: Stage) {
    const res = await updateApplicationStage(id, newStage);
    if (res.success) {
      fetchApplications();
    }
  }

  const displayedApplicants = activeTab === 'ALL' 
    ? columns.flatMap(c => cards[c.id].map(card => ({ card, col: c })))
    : cards[activeTab].map(card => ({ card, col: columns.find(c => c.id === activeTab)! }));

  const tabs = [{ id: 'ALL', title: 'All' }, ...columns];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 rounded-full bg-primary-900 flex-[3]"  title="Applied" />
        <div className="h-2 rounded-full bg-amber-500 flex-[2]"    title="In Review" />
        <div className="h-2 rounded-full bg-indigo-600 flex-[1]"   title="Interview" />
        <div className="h-2 rounded-full bg-emerald-500 flex-[2]"  title="Admitted" />
        <div className="h-2 rounded-full bg-rose-500 flex-[1]"     title="Rejected" />
        <span className="text-xs font-black text-slate-500 ml-1">{allApplicants.length} total</span>

        <button
          id="new-applicant-btn"
          onClick={() => setModalOpen(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 text-xs font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> New Applicant
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-primary-900 text-white shadow-md' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-8">
        {displayedApplicants.map(({ card, col }, i) => (
          <div
            key={card.id}
            onClick={() => setSelectedApplicant(card)}
            className={`bg-white rounded-xl border ${col.cardBorder} shadow-sm hover:shadow-md cursor-pointer transition-all group relative overflow-hidden`}
          >
            {card.alert && (
              <div className="absolute top-0 right-0 px-1.5 py-0.5 bg-secondary-500 rounded-bl-xl">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
            )}

            {/* Top color bar matching stage */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${col.colorClass}`} />

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-primary-400" />
                  <p className="text-[11px] font-black text-primary-600 tracking-wider">{card.admNo}</p>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${col.badge} uppercase tracking-widest`}>
                  {col.title}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex items-center justify-center text-white text-[11px] font-black shadow-sm flex-shrink-0`}>
                  {card.initials}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm leading-tight">{card.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{card.parent}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className={`flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-lg border bg-slate-50 text-slate-600 border-slate-200`}>
                  <GraduationCap className="w-3 h-3" />
                  {card.grade}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                  <Phone className="w-3 h-3" />
                  {card.phone}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {card.date}
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Select dropdown to move stages instead of inline buttons since space allows it */}
                  <select
                    className="text-[10px] font-bold bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-primary-300 transition-colors"
                    value={col.id}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleMove(card.id, e.target.value as Stage);
                    }}
                  >
                    {columns.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
        {displayedApplicants.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <User className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-bold">No applicants found for this category</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <NewApplicantWizardModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleWizardSubmit}
          existingApplicants={allApplicants}
        />
      )}

      {selectedApplicant && (
        <ApplicantDetailModal
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onRefresh={fetchApplications}
        />
      )}
    </div>
  );
}
