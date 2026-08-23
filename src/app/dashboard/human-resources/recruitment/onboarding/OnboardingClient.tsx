"use client";

import React, { useState, useMemo } from "react";
import { UserPlus, Plus, Mail, ShieldCheck, FileText, CheckCircle2, ChevronRight, Laptop, X, Trash2, Check } from "lucide-react";
import { createOnboarding, updateOnboardingStep, removeOnboarding, promoteToStaff } from "./actions";

type Step = {
  name: string;
  completed: boolean;
  icon: string;
};

type Hire = {
  id: string;
  name: string;
  role: string;
  startDate: string;
  department: string;
  progress: number;
  steps: Step[];
};

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'CheckCircle2': return CheckCircle2;
    case 'FileText': return FileText;
    case 'ShieldCheck': return ShieldCheck;
    case 'Laptop': return Laptop;
    default: return CheckCircle2;
  }
};

const defaultSteps = (): Step[] => [
  { name: "Offer Accepted", completed: true, icon: "CheckCircle2" },
  { name: "Documents", completed: false, icon: "FileText" },
  { name: "Background Check", completed: false, icon: "ShieldCheck" },
  { name: "IT Setup", completed: false, icon: "Laptop" },
];

export default function OnboardingClient({ initialHires }: { initialHires: Hire[] }) {
  const hires = initialHires;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [managingHireId, setManagingHireId] = useState<string | null>(null);

  const [newHireForm, setNewHireForm] = useState({
    name: '',
    role: '',
    department: '',
    startDate: ''
  });

  const pendingDocs = useMemo(() => hires.filter(h => h.steps.some(s => s.name === "Documents" && !s.completed)).length, [hires]);
  const awaitingChecks = useMemo(() => hires.filter(h => h.steps.some(s => s.name === "Background Check" && !s.completed)).length, [hires]);
  const readyToStart = useMemo(() => hires.filter(h => h.progress === 100).length, [hires]);

  const handleAddHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHireForm.name || !newHireForm.role || !newHireForm.startDate) return;

    await createOnboarding({
      name: newHireForm.name,
      role: newHireForm.role,
      department: newHireForm.department,
      startDate: newHireForm.startDate,
    });

    setIsAddModalOpen(false);
    setNewHireForm({ name: '', role: '', department: '', startDate: '' });
  };

  const toggleStep = async (hireId: string, stepIndex: number) => {
    // optimistic UI could be used, but for simplicity we just await the server action
    await updateOnboardingStep(hireId, stepIndex);
  };

  const removeHireAction = async (hireId: string) => {
    await removeOnboarding(hireId);
    setManagingHireId(null);
  };

  const promoteToStaffAction = async (hireId: string) => {
    await promoteToStaff(hireId);
    alert("Onboarding complete. Staff profile has been created.");
    setManagingHireId(null);
  };

  const managingHire = hires.find(h => h.id === managingHireId);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4">
         <h2 className="text-lg font-black text-slate-800 ml-2">Onboarding Pipelines</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Mail className="w-4 h-4" />
               Send Reminders
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20"
            >
              <Plus className="w-4 h-4" />
              New Hire Flow
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center">
            <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-2xl mb-3">
               <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">{pendingDocs}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Docs</p>
         </div>
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center">
            <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">{awaitingChecks}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Awaiting Checks</p>
         </div>
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3">
               <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">{readyToStart}</h3>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ready to Start</p>
         </div>
      </div>

      <div className="space-y-4">
         {hires.map((hire) => (
            <div key={hire.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
               
               <div className="md:w-1/4">
                  <h4 className="text-lg font-black text-slate-800">{hire.name}</h4>
                  <p className="text-sm font-bold text-primary-600">{hire.role}</p>
                  <p className="text-xs font-medium text-slate-500 mt-1">Starts: {hire.startDate}</p>
               </div>

               <div className="md:w-2/4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                     <span className="text-xs font-black text-slate-700">{hire.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                     <div className={`h-full transition-all duration-500 ${hire.progress === 100 ? 'bg-emerald-500' : 'bg-primary-500'}`} style={{ width: `${hire.progress}%` }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between relative">
                     {/* Connecting Line */}
                     <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                     
                     {hire.steps.map((step, j) => {
                        const StepIcon = getIcon(step.icon);
                        return (
                           <div key={j} className="flex flex-col items-center gap-2 bg-white px-2 relative z-10">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${step.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                                 <StepIcon className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] font-bold ${step.completed ? 'text-slate-800' : 'text-slate-400'}`}>{step.name}</span>
                           </div>
                        )
                     })}
                  </div>
               </div>

               <div className="md:w-1/4 flex justify-end">
                  <button 
                    onClick={() => setManagingHireId(hire.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-primary-900/20"
                  >
                     Manage
                     <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         ))}
         
         {hires.length === 0 && (
           <div className="text-center py-12 text-slate-500 font-medium bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm">
             No active onboarding pipelines.
           </div>
         )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">Add New Hire</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddHire} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  value={newHireForm.name}
                  onChange={e => setNewHireForm({...newHireForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                <input 
                  type="text" 
                  value={newHireForm.role}
                  onChange={e => setNewHireForm({...newHireForm, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                <input 
                  type="text" 
                  value={newHireForm.department}
                  onChange={e => setNewHireForm({...newHireForm, department: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                <input 
                  type="text" 
                  placeholder="e.g. Sep 1, 2026"
                  value={newHireForm.startDate}
                  onChange={e => setNewHireForm({...newHireForm, startDate: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  Create Flow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Modal */}
      {managingHire && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-800">Manage Pipeline</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">{managingHire.name} • {managingHire.role}</p>
              </div>
              <button onClick={() => setManagingHireId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {managingHire.steps.map((step, idx) => {
                const StepIcon = getIcon(step.icon);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${step.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${step.completed ? 'text-slate-800' : 'text-slate-600'}`}>{step.name}</p>
                        <p className="text-xs text-slate-500">{step.completed ? 'Completed' : 'Pending Action'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleStep(managingHire.id, idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:border-emerald-600' 
                          : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-4">
              <button 
                onClick={() => removeHireAction(managingHire.id)}
                className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 font-bold text-sm rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setManagingHireId(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                >
                  Done
                </button>
                {managingHire.progress === 100 && (
                  <button 
                    onClick={() => promoteToStaffAction(managingHire.id)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-emerald-500/20"
                  >
                    Promote to Staff
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
