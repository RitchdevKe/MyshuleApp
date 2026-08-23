"use client";

import React, { useState } from "react";
import { Shield, Heart, GraduationCap, Award, BookOpen, Target, Download, Share2, X } from "lucide-react";

// Simulated Data
const INITIAL_STUDENT_DATA = {
  id: "STU-001",
  name: "John Kamau",
  initials: "JK",
  grade: "Grade 11A",
  admission: "ADM-2023-001",
  points: "1,250",
  badges: [
    { id: 1, icon: Shield, text: "School Captain", containerClass: "text-primary-700 border-primary-100" },
    { id: 2, icon: Award, text: "Best Debater '25", containerClass: "text-secondary-700 border-secondary-200" },
    { id: 3, icon: Heart, text: "45 Community Hrs", containerClass: "text-rose-700 border-rose-200" }
  ],
  academics: [
    { id: 1, label: "Overall Attendance", value: "98.2%", valueColor: "text-emerald-600" },
    { id: 2, label: "Behaviour Record", value: "Excellent", valueColor: "text-emerald-600" },
    { id: 3, label: "Latest Academic Average", value: "A-", valueColor: "text-indigo-600" }
  ],
  extracurriculars: [
    { id: 1, name: "School Football U16", role: "Team Captain • 2024-Present", hours: null },
    { id: 2, name: "Debate Club", role: "Member • 2023-Present", hours: null },
    { id: 3, name: "Tree Planting Initiative", role: "Community Service", hours: "24 Hrs" }
  ]
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function EngagementOverviewPage() {
  const [studentData, setStudentData] = useState(INITIAL_STUDENT_DATA);
  const [activeModal, setActiveModal] = useState<"profile" | "download" | "share" | null>(null);

  const handleCloseModal = () => setActiveModal(null);

  return (
    <div className="p-8">
      {/* The MyShule Student Passport Preview */}
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-secondary-500" /> MyShule Student Passport
          </h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-wider rounded-lg border border-slate-200">Preview Mode</span>
            <button onClick={() => setActiveModal("download")} className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"><Download className="w-4 h-4" /></button>
            <button onClick={() => setActiveModal("share")} className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Passport Header */}
        <div className="bg-white/60 backdrop-blur-md border border-white rounded-3xl p-8 shadow-sm mb-6 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div 
            className="w-32 h-32 rounded-3xl bg-primary-50 flex items-center justify-center border-4 border-white shadow-md shrink-0 relative group cursor-pointer"
            onClick={() => setActiveModal("profile")}
          >
            <span className="text-4xl font-black text-primary-900">{studentData.initials}</span>
            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
               <span className="text-white text-[10px] font-bold uppercase tracking-wider">View Profile</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
               <div>
                 <h1 className="text-4xl font-black text-slate-800 mb-1">{studentData.name}</h1>
                 <p className="text-sm font-bold text-slate-500 mb-6 flex items-center gap-2">
                   <span>{studentData.grade}</span> 
                   <span className="w-1 h-1 rounded-full bg-slate-300"></span> 
                   <span>{studentData.admission}</span>
                 </p>
               </div>
               <div className="text-right">
                  <div className="text-2xl font-black text-secondary-500">{studentData.points}</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Passport Points</div>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {studentData.badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <span key={badge.id} className={`px-3 py-1.5 bg-white/80 backdrop-blur text-xs font-bold rounded-xl border shadow-sm flex items-center gap-1.5 ${badge.containerClass}`}>
                    <Icon className="w-3.5 h-3.5" /> {badge.text}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Passport Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Academics & Attendance */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-500" /> Academic & Attendance
            </h3>
            <div className="space-y-3">
              {studentData.academics.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
                  <span className="text-sm font-bold text-slate-600">{item.label}</span>
                  <span className={`font-black ${item.valueColor}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Extracurricular */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary-500" /> Extracurricular
            </h3>
            <div className="space-y-3">
              {studentData.extracurriculars.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-secondary-200 transition-colors flex justify-between items-center">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.role}</div>
                  </div>
                  {item.hours && (
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
                      {item.hours}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === "profile"} onClose={handleCloseModal} title="Student Profile">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center border-2 border-white shadow-sm shrink-0">
              <span className="text-2xl font-black text-primary-900">{studentData.initials}</span>
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800">{studentData.name}</h4>
              <p className="text-sm font-bold text-slate-500">{studentData.grade} • {studentData.admission}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 font-medium">
            This modal displays detailed student profile information. In a full implementation, this would fetch data from the server.
          </p>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button onClick={handleCloseModal} className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
              Close Profile
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "download"} onClose={handleCloseModal} title="Download Passport">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            Choose the format you would like to download the student passport in.
          </p>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-left flex justify-between items-center">
              <span>PDF Document (.pdf)</span>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
            <button className="px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-colors text-left flex justify-between items-center">
              <span>Image (.png)</span>
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === "share"} onClose={handleCloseModal} title="Share Passport">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            Share this student's passport with parents, guardians, or teachers.
          </p>
          <div className="flex gap-2">
            <input type="email" placeholder="Enter email address" className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary-500 text-sm font-medium" />
            <button className="px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

