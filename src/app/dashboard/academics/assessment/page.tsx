"use client";

import React, { useState } from "react";
import { FileEdit, Trophy, LineChart, FileQuestion, BookMarked, Activity, Plus, Play, FileText, Calendar } from "lucide-react";

export default function AssessmentWorkspace() {
  const [activeTab, setActiveTab] = useState("overview");

  // UI Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  // Simulated state data (ready for backend connection)
  const [upcomingAssessments, setUpcomingAssessments] = useState([
    { id: "1", type: "End of Term", title: "Term 2 Finals", status: "Upcoming", daysLeft: 14, icon: Calendar },
    { id: "2", type: "Continuous", title: "Mid-Term Test", status: "Upcoming", daysLeft: 5, icon: Activity },
  ]);

  const [activeCbts, setActiveCbts] = useState([
    { id: "1", title: "Form 4 Mock (Math)", completed: 120, total: 150 },
    { id: "2", title: "Form 3 Science Quiz", completed: 45, total: 80 },
  ]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "examinations", label: "Examinations", icon: FileEdit },
    { id: "continuous", label: "Continuous Assessment", icon: LineChart },
    { id: "cbc-rubrics", label: "CBC Rubrics", icon: BookMarked },
    { id: "cbt", label: "CBT System", icon: FileQuestion },
    { id: "results", label: "Results & Grading", icon: Trophy },
  ];

  const handleQuickAction = (title: string) => {
    setModalTitle(title);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 relative">
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Assessment & Exams</h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Exam management, CBC rubrics, Computer Based Testing, and grading scales.
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
                  ? "bg-white text-rose-700 shadow-sm border border-rose-100"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-lg border border-slate-200/80 rounded-3xl shadow-sm min-h-[500px]">
        {activeTab === "overview" && (
          <div className="p-6 space-y-8">
            
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" /> Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => handleQuickAction("Create New Assessment")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl text-sm font-black shadow-md shadow-primary-900/20 hover:bg-primary-800 hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create Assessment
                </button>
                <button 
                  onClick={() => handleQuickAction("Start New CBT Session")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
                >
                  <Play className="w-4 h-4 text-emerald-500" /> Start CBT
                </button>
                <button 
                  onClick={() => handleQuickAction("Generate Result Reports")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
                >
                  <FileText className="w-4 h-4 text-indigo-500" /> Generate Reports
                </button>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Upcoming Assessments */}
              {upcomingAssessments.map((assessment) => (
                <div key={assessment.id} className="bg-rose-50 border border-rose-100 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute right-0 top-0 opacity-10">
                     <FileEdit className="w-24 h-24 -mt-4 -mr-4" />
                  </div>
                  <div className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2">{assessment.type}</div>
                  <div className="text-xl font-black text-rose-900 mb-1">{assessment.title}</div>
                  <div className="text-sm font-bold text-slate-600 flex items-center gap-1.5 mt-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Starts in {assessment.daysLeft} days
                  </div>
                </div>
              ))}

              {/* Active CBTs */}
              {activeCbts.map((cbt) => (
                <div key={cbt.id} className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                  <div className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Active CBT</div>
                  <div className="text-xl font-black text-slate-800 mb-1">{cbt.title}</div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Progress</span>
                      <span className="text-emerald-600">{cbt.completed}/{cbt.total}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(cbt.completed / cbt.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

        {activeTab !== "overview" && (
          <div className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-4">
              {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Activity, { className: "w-8 h-8" })}
            </div>
            <h3 className="text-xl font-black text-slate-800">Coming Soon</h3>
            <p className="text-sm font-medium text-slate-500 max-w-md mt-2">
              The {tabs.find(t => t.id === activeTab)?.label} workspace is currently being built.
            </p>
          </div>
        )}
      </div>

      {/* Standard UI Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-800">{modalTitle}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-sm font-medium text-slate-500">
                This action is currently simulated. Backend connection to Prisma models will be established here.
              </p>
              {/* Placeholder form elements to represent structure ready for connection */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Name / Title</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Enter details..." />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}