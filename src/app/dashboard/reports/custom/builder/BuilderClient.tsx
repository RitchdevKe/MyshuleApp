"use client";

import React, { useState } from "react";
import { saveCustomReport } from "./actions";
import { useRouter } from "next/navigation";

export default function BuilderClient() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("FINANCIAL");
  const [sources, setSources] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleAddSource = () => {
    setSources([...sources, "New Source"]);
  };
  
  const handleSourceChange = (index: number, value: string) => {
    const newSources = [...sources];
    newSources[index] = value;
    setSources(newSources);
  };
  
  const handleRemoveSource = (index: number) => {
    const newSources = [...sources];
    newSources.splice(index, 1);
    setSources(newSources);
  };
  
  const handleSave = async () => {
    if (!name.trim()) {
      alert("Report name is required");
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await saveCustomReport({
        name,
        description,
        type,
        config: { sources },
      });
      
      if (result.success) {
        router.push("/dashboard/reports/custom/my-reports");
      } else {
        alert("Error saving report: " + result.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Report Builder</h1>
          <p className="text-sm text-slate-400 mt-1">Create a new custom report</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-800">
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Report Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monthly Revenue Summary"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this report about?"
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Report Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="FINANCIAL">Financial</option>
              <option value="ACADEMIC">Academic</option>
              <option value="OPERATIONAL">Operational</option>
              <option value="ATTENDANCE">Attendance</option>
            </select>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-200">Data Sources</h3>
              <button
                onClick={handleAddSource}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
              >
                Add Source
              </button>
            </div>
            
            {sources.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                <p className="text-slate-500 text-sm">No data sources added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sources.map((source, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <select
                      value={source}
                      onChange={(e) => handleSourceChange(index, e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="New Source" disabled>Select Source...</option>
                      <option value="Invoices">Invoices Data</option>
                      <option value="Payments">Payments Data</option>
                      <option value="Students">Students Roster</option>
                      <option value="Expenses">Expenses</option>
                      <option value="Attendance">Attendance Records</option>
                      <option value="Exams">Exam Results</option>
                    </select>
                    <button
                      onClick={() => handleRemoveSource(index)}
                      className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
                      title="Remove Source"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-8 flex justify-end gap-3 border-t border-slate-800">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 text-slate-300 hover:text-slate-100 font-medium rounded-xl transition-colors hover:bg-slate-800"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? "Saving..." : "Save Report"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
