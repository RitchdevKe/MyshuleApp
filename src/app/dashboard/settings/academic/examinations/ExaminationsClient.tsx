"use client";

import React, { useState, useTransition } from "react";
import { FileText, EyeOff, FileSignature, Send, ShieldCheck, AlertCircle, Save, CheckCircle, Loader2 } from "lucide-react";
import { updateAcademicSettings } from "@/app/actions/academicSettings";
import { useRouter } from "next/navigation";

export default function ExaminationsClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    anonymousGrading: settings.anonymousGrading ?? false,
    strictInvigilation: settings.strictInvigilation ?? true,
    autoPublishResults: settings.autoPublishResults ?? false,
    lockGradesAfterPublish: settings.lockGradesAfterPublish ?? true,
    minPassMark: settings.minPassMark ?? 40,
    distinctionMark: settings.distinctionMark ?? 80,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof formData] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: parseFloat(e.target.value) || 0 }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateAcademicSettings(formData);
      router.refresh();
      showToast("Examination settings saved!");
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Examination Policies</h3>
            <p className="text-sm font-medium text-slate-500">Configure rules for invigilation, grading anonymity, and publishing.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Policies
        </button>
      </div>

      <div className="space-y-10">
        <div>
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Global Exam Rules</h4>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">

            {[
              { key: "anonymousGrading", icon: EyeOff, label: "Anonymous Grading", desc: "Hide student names from teachers during the grading process to prevent bias. Student IDs will be used instead." },
              { key: "strictInvigilation", icon: FileSignature, label: "Strict Invigilation (Dual Sign-off)", desc: "Require both the primary invigilator and the department head to sign off on exam attendance sheets." },
              { key: "autoPublishResults", icon: Send, label: "Automatic Result Publishing", desc: "Instantly publish results to the Student and Parent portals as soon as teachers submit the final grades." },
              { key: "lockGradesAfterPublish", icon: ShieldCheck, label: "Lock Grades After Publishing", desc: "Prevent any modifications to grades by teachers once the results have been published." },
            ].map(({ key, icon: Icon, label, desc }) => (
              <div key={key} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  <div className="mt-1"><Icon className="w-5 h-5 text-slate-400" /></div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{label}</div>
                    <div className="text-xs font-medium text-slate-500 max-w-lg">{desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(key as keyof typeof formData)}
                  className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ml-6 ${formData[key as keyof typeof formData] ? 'bg-purple-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${formData[key as keyof typeof formData] ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Pass/Fail Thresholds</h4>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Minimum Pass Mark (%)</label>
              <div className="flex items-center gap-3">
                <input type="number" name="minPassMark" value={formData.minPassMark} onChange={handleChange}
                  className="w-24 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition-all shadow-sm" />
                <span className="text-sm font-medium text-slate-600">%</span>
              </div>
            </div>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Distinction Mark (%)</label>
              <div className="flex items-center gap-3">
                <input type="number" name="distinctionMark" value={formData.distinctionMark} onChange={handleChange}
                  className="w-24 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-purple-500 transition-all shadow-sm" />
                <span className="text-sm font-medium text-slate-600">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
