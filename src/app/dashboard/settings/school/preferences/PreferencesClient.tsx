"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save } from "lucide-react";
import { updateSchoolProfile } from "../actions";

export default function PreferencesClient({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    timezone: tenant?.timezone || "Africa/Nairobi",
    dateFormat: tenant?.dateFormat || "DD/MM/YYYY",
    motto: tenant?.motto || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSchoolProfile(formData);
        router.refresh();
        alert("Preferences saved successfully!");
      } catch (e) {
        alert("Failed to save preferences");
      }
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">System Preferences</h3>
            <p className="text-sm font-medium text-slate-500">Localization and general settings.</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {isPending ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      <div className="max-w-3xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Timezone</label>
            <select 
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" 
            >
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
              <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Date Format</label>
            <select 
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" 
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 31/12/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 12/31/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-12-31)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">School Motto</label>
          <input 
            type="text" 
            name="motto"
            value={formData.motto}
            onChange={handleChange}
            placeholder="e.g. Excellence in Education"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:bg-white" 
          />
        </div>
      </div>
    </div>
  );
}
