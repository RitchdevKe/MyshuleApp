"use client";

import React, { useState, useTransition } from "react";
import { Clock, Save, Plus, Trash2, CheckCircle, Coffee, Utensils, BookOpen, Loader2 } from "lucide-react";
import { updateAcademicSettings } from "@/app/actions/academicSettings";
import { useRouter } from "next/navigation";

type BreakSlot = { id: string; label: string; startTime: string; durationMinutes: number };

export default function TimetableClient({ settings }: { settings: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    periodsPerDay: settings.periodsPerDay ?? 8,
    periodDurationMinutes: settings.periodDurationMinutes ?? 40,
    schoolStartTime: settings.schoolStartTime ?? "08:00",
    schoolEndTime: settings.schoolEndTime ?? "15:30",
  });

  const [breakSlots, setBreakSlots] = useState<BreakSlot[]>(
    Array.isArray(settings.breakSlots) ? settings.breakSlots : []
  );
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [newBreak, setNewBreak] = useState({ label: "", startTime: "10:00", durationMinutes: 15 });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "number" ? parseInt(value) || 0 : value }));
  };

  const addBreakSlot = () => {
    if (!newBreak.label) return;
    const slot: BreakSlot = { id: Date.now().toString(), ...newBreak };
    setBreakSlots(prev => [...prev, slot]);
    setNewBreak({ label: "", startTime: "10:00", durationMinutes: 15 });
    setShowBreakModal(false);
  };

  const removeBreakSlot = (id: string) => {
    setBreakSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateAcademicSettings({ ...formData, breakSlots });
      router.refresh();
      showToast("Timetable settings saved!");
    });
  };

  const breakIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("lunch")) return <Utensils className="w-4 h-4" />;
    if (l.includes("prep") || l.includes("study")) return <BookOpen className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
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
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Timetable Settings</h3>
            <p className="text-sm font-medium text-slate-500">Configure global daily schedules, periods, and break times.</p>
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

      {/* School Hours */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 mb-6">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">School Hours & Periods</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">School Start Time</label>
            <input type="time" name="schoolStartTime" value={formData.schoolStartTime} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">School End Time</label>
            <input type="time" name="schoolEndTime" value={formData.schoolEndTime} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Periods Per Day</label>
            <input type="number" name="periodsPerDay" value={formData.periodsPerDay} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Period Duration (Minutes)</label>
            <input type="number" name="periodDurationMinutes" value={formData.periodDurationMinutes} onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
          </div>
        </div>
      </div>

      {/* Break Slots */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Break & Prep Slots</h4>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Define break time, lunch, prep time, or any non-lesson slot in the day.</p>
          </div>
          <button onClick={() => setShowBreakModal(true)}
            className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors">
            <Plus className="w-4 h-4" /> Add Slot
          </button>
        </div>

        {breakSlots.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Coffee className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No break slots configured yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {breakSlots.map(slot => (
              <div key={slot.id} className="flex items-center justify-between bg-orange-50/50 border border-orange-100 rounded-xl p-4 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                    {breakIcon(slot.label)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{slot.label}</p>
                    <p className="text-xs font-medium text-slate-500">{slot.startTime} · {slot.durationMinutes} minutes</p>
                  </div>
                </div>
                <button onClick={() => removeBreakSlot(slot.id)}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Break Modal */}
      {showBreakModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-black text-slate-800">Add Break / Prep Slot</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Slot Label</label>
                <input type="text" value={newBreak.label} onChange={e => setNewBreak(p => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Morning Break, Lunch, Prep Time"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Start Time</label>
                <input type="time" value={newBreak.startTime} onChange={e => setNewBreak(p => ({ ...p, startTime: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                <input type="number" value={newBreak.durationMinutes} onChange={e => setNewBreak(p => ({ ...p, durationMinutes: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition-all" />
              </div>
            </div>
            <div className="p-5 bg-slate-50 border-t flex gap-3 justify-end">
              <button onClick={() => setShowBreakModal(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={addBreakSlot} disabled={!newBreak.label}
                className="px-5 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl disabled:opacity-50 transition-colors">Add Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
