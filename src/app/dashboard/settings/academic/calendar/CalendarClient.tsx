"use client";

import React, { useState, useTransition } from "react";
import { Calendar, Plus, CheckCircle2, ChevronRight, X, CalendarDays, Loader2 } from "lucide-react";
import { 
  createAcademicYear, 
  createAcademicTerm, 
  setActiveAcademicYear, 
  setActiveAcademicTerm 
} from "@/app/actions/academic";
import { useRouter } from "next/navigation";

type Term = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActiveTerm: boolean;
};

type Year = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  isActiveYear: boolean;
  terms: Term[];
};

export default function CalendarClient({ initialYears }: { initialYears: Year[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});

  // Modal states
  const [showYearModal, setShowYearModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState<{ isOpen: boolean; yearId: string | null }>({
    isOpen: false,
    yearId: null
  });

  const toggleYear = (id: string) => {
    setExpandedYears(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateYear = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);

    startTransition(async () => {
      await createAcademicYear({ name, startDate, endDate });
      setShowYearModal(false);
      router.refresh();
    });
  };

  const handleCreateTerm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showTermModal.yearId) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);

    startTransition(async () => {
      await createAcademicTerm({
        academicYearId: showTermModal.yearId as string,
        name,
        startDate,
        endDate
      });
      setShowTermModal({ isOpen: false, yearId: null });
      router.refresh();
    });
  };

  const handleSetActiveYear = (id: string) => {
    startTransition(async () => {
      await setActiveAcademicYear(id);
      router.refresh();
    });
  };

  const handleSetActiveTerm = (id: string) => {
    startTransition(async () => {
      await setActiveAcademicTerm(id);
      router.refresh();
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Academic Calendar</h3>
            <p className="text-sm font-medium text-slate-500">Manage academic years, terms, and active periods.</p>
          </div>
        </div>
        <button
          onClick={() => setShowYearModal(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Academic Year
        </button>
      </div>

      <div className="space-y-4">
        {initialYears.map((year) => (
          <div key={year.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
            <div className={`p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${year.isActiveYear ? 'bg-sky-50/30' : ''}`} onClick={() => toggleYear(year.id)}>
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${year.isActiveYear ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-800">{year.name}</h4>
                    {year.isActiveYear && (
                      <span className="flex items-center gap-1 bg-sky-100 text-sky-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3" /> Active Year
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-500">
                    {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!year.isActiveYear && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSetActiveYear(year.id); }}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-colors shadow-sm"
                    disabled={isPending}
                  >
                    Set Active
                  </button>
                )}
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${expandedYears[year.id] ? 'rotate-90' : ''}`} />
              </div>
            </div>

            {expandedYears[year.id] && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-bold text-slate-700 text-sm">Terms in {year.name}</h5>
                  <button
                    onClick={() => setShowTermModal({ isOpen: true, yearId: year.id })}
                    className="flex items-center gap-1.5 text-sky-600 text-sm font-bold hover:text-sky-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Term
                  </button>
                </div>
                
                {year.terms.length === 0 ? (
                  <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-200">
                    <p className="text-sm font-medium text-slate-400">No terms configured for this year.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {year.terms.map((term) => (
                      <div key={term.id} className={`bg-white p-4 rounded-xl border ${term.isActiveTerm ? 'border-sky-300 shadow-sm' : 'border-slate-200'} relative group`}>
                        <div className="flex justify-between items-start mb-2">
                          <h6 className="font-bold text-slate-800">{term.name}</h6>
                          {term.isActiveTerm && (
                            <span className="text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-500 mb-4">
                          {new Date(term.startDate).toLocaleDateString()} - {new Date(term.endDate).toLocaleDateString()}
                        </p>
                        {!term.isActiveTerm && (
                          <button
                            onClick={() => handleSetActiveTerm(term.id)}
                            className="w-full py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-colors"
                            disabled={isPending}
                          >
                            Set Active Term
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {initialYears.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-slate-700 font-bold mb-1">No Academic Years</h4>
            <p className="text-sm text-slate-500 mb-4">Get started by creating your first academic year.</p>
            <button
              onClick={() => setShowYearModal(true)}
              className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-sky-200 transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Year
            </button>
          </div>
        )}
      </div>

      {/* Add Year Modal */}
      {showYearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-800">Add Academic Year</h3>
              <button onClick={() => setShowYearModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateYear} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Year Name</label>
                <input required name="name" type="text" placeholder="e.g. 2024-2025" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input required name="startDate" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input required name="endDate" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isPending} className="w-full bg-slate-800 text-white rounded-xl py-2.5 font-bold text-sm shadow-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Term Modal */}
      {showTermModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-800">Add Term</h3>
              <button onClick={() => setShowTermModal({ isOpen: false, yearId: null })} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTerm} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Term Name</label>
                <input required name="name" type="text" placeholder="e.g. Fall Term" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input required name="startDate" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input required name="endDate" type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={isPending} className="w-full bg-slate-800 text-white rounded-xl py-2.5 font-bold text-sm shadow-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
