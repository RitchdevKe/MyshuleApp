"use client";

import React, { useState, useTransition } from "react";
import { BookOpen, Save, CheckCircle, Loader2, Sunrise, Sunset, Calendar, Sun, Moon } from "lucide-react";
import { updateAcademicSettings } from "@/app/actions/academicSettings";
import { useRouter } from "next/navigation";

export default function RemedialClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    enableRemedialClasses: settings.enableRemedialClasses ?? false,
    remedialBeforeSchool: settings.remedialBeforeSchool ?? false,
    remedialAfterSchool: settings.remedialAfterSchool ?? false,
    remedialWeekends: settings.remedialWeekends ?? false,
    remedialHolidays: settings.remedialHolidays ?? false,
    remedialStartTime: settings.remedialStartTime ?? "06:30",
    remedialEndTime: settings.remedialEndTime ?? "07:30",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggle = (key: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [key]: !prev[key as keyof typeof formData] }));
  };

  const handleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateAcademicSettings(formData);
      router.refresh();
      showToast("Remedial class settings saved!");
    });
  };

  const scheduleOptions = [
    { key: "remedialBeforeSchool", icon: Sunrise, label: "Before School", desc: "Classes held before the regular school day begins (e.g. 6:30 AM – 7:30 AM)." },
    { key: "remedialAfterSchool", icon: Sunset, label: "After School", desc: "Classes held after regular school ends (e.g. 4:00 PM – 5:30 PM)." },
    { key: "remedialWeekends", icon: Calendar, label: "Weekends", desc: "Allow remedial classes on Saturdays and/or Sundays." },
    { key: "remedialHolidays", icon: Sun, label: "School Holidays", desc: "Allow remedial classes during school holiday periods." },
  ];

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {toast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold">
          <CheckCircle className="w-4 h-4 text-green-400" /> {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Remedial Classes</h3>
            <p className="text-sm font-medium text-slate-500">Configure supplementary classes outside normal school hours.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
        </button>
      </div>

      {/* Master Toggle */}
      <div className={`bg-white border rounded-2xl shadow-sm p-6 mb-6 transition-colors ${formData.enableRemedialClasses ? 'border-indigo-200' : 'border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="mt-1"><Moon className="w-5 h-5 text-indigo-500" /></div>
            <div>
              <div className="font-black text-slate-800">Enable Remedial Classes</div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                Activate the remedial classes system school-wide. Teachers will be able to schedule and record supplementary sessions.
              </div>
            </div>
          </div>
          <button
            onClick={() => handleToggle('enableRemedialClasses')}
            className={`w-14 h-7 rounded-full relative transition-colors flex-shrink-0 ml-6 ${formData.enableRemedialClasses ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1.5 w-4 h-4 rounded-full bg-white shadow transition-all ${formData.enableRemedialClasses ? 'left-9' : 'left-1.5'}`}></div>
          </button>
        </div>
      </div>

      {/* Schedule Options */}
      <div className={`space-y-4 transition-all ${formData.enableRemedialClasses ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Permitted Schedules</h4>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Select when remedial classes are allowed to be held.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {scheduleOptions.map(({ key, icon: Icon, label, desc }) => (
              <div key={key} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-4">
                  <div className="mt-0.5"><Icon className="w-5 h-5 text-indigo-400" /></div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{label}</div>
                    <div className="text-xs font-medium text-slate-500 max-w-lg">{desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(key as keyof typeof formData)}
                  className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ml-6 ${formData[key as keyof typeof formData] ? 'bg-indigo-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${formData[key as keyof typeof formData] ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Default Time Slot */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">Default Remedial Time Window</h4>
          <p className="text-xs font-medium text-slate-500 mb-5">The default start/end time for remedial sessions. Teachers can override this per session.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Default Start Time</label>
              <input type="time" name="remedialStartTime" value={formData.remedialStartTime} onChange={handleTime}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Default End Time</label>
              <input type="time" name="remedialEndTime" value={formData.remedialEndTime} onChange={handleTime}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <p className="text-sm font-bold text-indigo-800 mb-1">📌 How Remedial Classes Work</p>
          <ul className="text-xs font-medium text-indigo-700 space-y-1 list-disc list-inside">
            <li>Teachers schedule a remedial session from the Timetable module and assign specific students.</li>
            <li>Sessions held <strong>before school</strong> and <strong>after school</strong> appear in the student's daily schedule.</li>
            <li>Weekend and holiday sessions appear under a separate "Extra Sessions" calendar view.</li>
            <li>Attendance for remedial sessions is tracked separately from regular class attendance.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
