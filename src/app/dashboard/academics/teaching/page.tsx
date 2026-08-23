"use client";

import React, { useState } from "react";
import { Users, FileText, CheckSquare, Clock, BookOpen, Presentation } from "lucide-react";

export default function TeachingWorkspace() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Presentation },
    { id: "classes", label: "My Classes", icon: Users },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "grading", label: "Grading", icon: CheckSquare },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "notes", label: "Teacher Notes", icon: BookOpen },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Teaching Workspace</h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Manage your classes, grade assignments, and track daily academic operations.
          </p>
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/40 p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-white text-emerald-700 shadow-sm border border-emerald-100"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-sm min-h-[500px]">
        {activeTab === "overview" && (
          <div className="p-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Today's Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <div className="text-xs font-black text-slate-500 mb-1">08:00 AM - 08:40 AM</div>
                <h4 className="font-bold text-slate-800">Grade 4 Mathematics</h4>
                <p className="text-xs text-emerald-600 font-bold mt-2">Room 102</p>
              </div>
              <div className="bg-white border border-indigo-200 p-4 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
                <div className="text-xs font-black text-slate-500 mb-1">08:40 AM - 09:20 AM</div>
                <h4 className="font-bold text-slate-800">Grade 4 Science</h4>
                <p className="text-xs text-indigo-600 font-bold mt-2">Room 102</p>
              </div>
            </div>
          </div>
        )}

        {activeTab !== "overview" && (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
              {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Presentation, { className: "w-8 h-8" })}
            </div>
            <h3 className="text-xl font-black text-slate-800">Coming Soon</h3>
            <p className="text-sm font-medium text-slate-500 max-w-md mt-2">
              The {tabs.find(t => t.id === activeTab)?.label} workspace is currently being built.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}