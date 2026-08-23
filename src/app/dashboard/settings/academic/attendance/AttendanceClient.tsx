"use client";

import React, { useState, useTransition } from "react";
import { CheckSquare, Save, Bell, ShieldAlert, Clock, CheckCircle, Loader2 } from "lucide-react";
import { updateAcademicSettings } from "@/app/actions/academicSettings";
import { useRouter } from "next/navigation";

export default function AttendanceClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    requireDailyAttendance: settings.requireDailyAttendance ?? true,
    notifyParentsOnAbsence: settings.notifyParentsOnAbsence ?? false,
    absenceWarningThreshold: settings.absenceWarningThreshold ?? 3,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof formData] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateAcademicSettings(formData);
      router.refresh();
      showToast("Attendance settings saved!");
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
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Attendance Policies</h3>
            <p className="text-sm font-medium text-slate-500">Configure rules for student attendance tracking and alerts.</p>
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
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Global Attendance Rules</h4>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">

            <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex gap-4">
                <div className="mt-1"><Clock className="w-5 h-5 text-slate-400" /></div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Require Daily Attendance</div>
                  <div className="text-xs font-medium text-slate-500 max-w-lg">Mandate homeroom teachers to submit an attendance register by 9:00 AM every school day.</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('requireDailyAttendance')}
                className={`w-12 h-6 rounded-full relative transition-colors ${formData.requireDailyAttendance ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${formData.requireDailyAttendance ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>

            <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex gap-4">
                <div className="mt-1"><Bell className="w-5 h-5 text-slate-400" /></div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Notify Parents on Absence</div>
                  <div className="text-xs font-medium text-slate-500 max-w-lg">Automatically send an SMS/Email to parents if their child is marked absent without prior leave approval.</div>
                </div>
              </div>
              <button
                onClick={() => handleToggle('notifyParentsOnAbsence')}
                className={`w-12 h-6 rounded-full relative transition-colors ${formData.notifyParentsOnAbsence ? 'bg-green-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${formData.notifyParentsOnAbsence ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Warning Thresholds</h4>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">Consecutive Absence Warning (Days)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="absenceWarningThreshold"
                  value={formData.absenceWarningThreshold}
                  onChange={handleChange}
                  className="w-24 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-green-500 transition-all shadow-sm"
                />
                <span className="text-sm font-medium text-slate-600">days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
