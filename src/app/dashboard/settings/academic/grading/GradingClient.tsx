"use client";

import React, { useState, useTransition } from "react";
import { Award, Plus, Trash2, Scale, CheckCircle, Loader2 } from "lucide-react";
import { createGradingScale, deleteGradingScale, createGradingScaleRange, deleteGradingScaleRange } from "@/app/actions/grading";
import { useRouter } from "next/navigation";

export default function GradingClient({ gradingScales: initialScales }: { gradingScales: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [selectedScaleId, setSelectedScaleId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [scaleName, setScaleName] = useState("");
  const [scaleType, setScaleType] = useState<"PERCENTAGE" | "GPA" | "CBC" | "CUSTOM">("PERCENTAGE");

  const [gradeLabel, setGradeLabel] = useState("");
  const [minScore, setMinScore] = useState<number | "">("");
  const [maxScore, setMaxScore] = useState<number | "">("");
  const [remarks, setRemarks] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddScale = () => {
    if (!scaleName) return;
    startTransition(async () => {
      await createGradingScale({ name: scaleName, scaleType });
      setShowScaleModal(false);
      setScaleName("");
      router.refresh();
      showToast("Grading scale created!");
    });
  };

  const handleAddRange = () => {
    if (!selectedScaleId || !gradeLabel || minScore === "" || maxScore === "") return;
    startTransition(async () => {
      await createGradingScaleRange({
        gradingScaleId: selectedScaleId,
        gradeLabel,
        minScore: Number(minScore),
        maxScore: Number(maxScore),
        defaultRemarks: remarks || undefined,
      });
      setShowRangeModal(false);
      setGradeLabel(""); setMinScore(""); setMaxScore(""); setRemarks("");
      router.refresh();
      showToast("Grade range added!");
    });
  };

  const handleDeleteScale = (id: string) => {
    startTransition(async () => {
      await deleteGradingScale(id);
      router.refresh();
      showToast("Scale deleted.");
    });
  };

  const handleDeleteRange = (id: string) => {
    startTransition(async () => {
      await deleteGradingScaleRange(id);
      router.refresh();
      showToast("Grade removed.");
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Grading Systems</h3>
            <p className="text-sm font-medium text-slate-500">Define grading rubrics and scales for different class levels.</p>
          </div>
        </div>
        <button
          onClick={() => setShowScaleModal(true)}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" /> Create Scale
        </button>
      </div>

      {initialScales.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-12 h-12 bg-green-50 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Scale className="w-6 h-6" />
          </div>
          <h4 className="text-slate-700 font-bold mb-1">No Grading Scales</h4>
          <p className="text-sm text-slate-500 mb-4">Create your first grading scale to get started.</p>
          <button onClick={() => setShowScaleModal(true)} className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-200 transition-colors">
            <Plus className="w-4 h-4" /> Create Scale
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {initialScales.map((scale) => (
          <div key={scale.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-black text-slate-800">{scale.name}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                  <Scale className="w-3 h-3" /> {scale.scaleType}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setSelectedScaleId(scale.id); setShowRangeModal(true); }}
                  className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  + Add Grade
                </button>
                <button
                  onClick={() => handleDeleteScale(scale.id)}
                  disabled={isPending}
                  className="text-slate-400 hover:text-red-500 p-1.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-3 pl-5 border-b border-slate-100">Grade</th>
                    <th className="p-3 border-b border-slate-100">Score Range</th>
                    <th className="p-3 border-b border-slate-100">Remarks</th>
                    <th className="p-3 pr-5 border-b border-slate-100 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {scale.ranges.map((range: any) => (
                    <tr key={range.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-3 pl-5">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-700 font-black text-sm">
                          {range.gradeLabel}
                        </span>
                      </td>
                      <td className="p-3 text-sm font-bold text-slate-700">
                        {range.minScore} – {range.maxScore}
                      </td>
                      <td className="p-3 text-sm font-medium text-slate-500">
                        {range.defaultRemarks || "–"}
                      </td>
                      <td className="p-3 pr-5 text-right">
                        <button
                          onClick={() => handleDeleteRange(range.id)}
                          disabled={isPending}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {scale.ranges.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-sm font-medium text-slate-400">
                        No grades defined yet. Click "+ Add Grade" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Create Scale Modal */}
      {showScaleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Create Grading Scale</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Scale Name</label>
                <input type="text" value={scaleName} onChange={(e) => setScaleName(e.target.value)} placeholder="e.g. Primary Standard, KCSE" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Scale Type</label>
                <select value={scaleType} onChange={(e) => setScaleType(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="GPA">GPA (4.0 Scale)</option>
                  <option value="CBC">CBC (Competency-Based)</option>
                  <option value="CUSTOM">Custom / Letter Grade</option>
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowScaleModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddScale} disabled={isPending || !scaleName} className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm disabled:opacity-50 flex items-center gap-2 transition-colors">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Create Scale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Grade Range Modal */}
      {showRangeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add Grade Range</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Grade Label</label>
                <input type="text" value={gradeLabel} onChange={(e) => setGradeLabel(e.target.value)} placeholder="e.g. A, B+, Distinction, EE" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Min Score</label>
                  <input type="number" value={minScore} onChange={(e) => setMinScore(e.target.value ? Number(e.target.value) : "")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Max Score</label>
                  <input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value ? Number(e.target.value) : "")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Remarks (Optional)</label>
                <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Excellent!" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowRangeModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddRange} disabled={isPending || !gradeLabel || minScore === "" || maxScore === ""} className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-sm disabled:opacity-50 flex items-center gap-2 transition-colors">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Grade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
