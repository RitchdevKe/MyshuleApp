"use client";

import React, { useState } from "react";
import { Award, Vote, Shield, Users, TrendingUp, Edit2, Trash2, Plus, X } from "lucide-react";

type Leader = {
  id: number;
  name: string;
  role: string;
  grade: string;
};

export default function LeadershipOverviewPage() {
  const [leaders, setLeaders] = useState<Leader[]>([
    { id: 1, name: "John Kamau", role: "School Captain", grade: "Grade 11A" },
    { id: 2, name: "Mary Wanjiku", role: "Deputy Captain", grade: "Grade 11B" },
    { id: 3, name: "Peter Otieno", role: "Sports Captain", grade: "Grade 11C" },
    { id: 4, name: "Jane Doe", role: "Welfare Captain", grade: "Grade 10A" },
  ]);

  const [electionStats, setElectionStats] = useState({
    title: "2026 Prefect Elections",
    turnout: 68,
    status: "Ends Today",
    subtext: "Results auto-publish at 4:00 PM"
  });

  const quickStats = [
    { label: "Active Roles", value: "24", icon: Shield, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Leaders", value: leaders.length.toString(), icon: Users, color: "text-green-500", bg: "bg-green-50" },
    { label: "Initiatives", value: "8", icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  // Modals state
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);

  // Handlers
  const handleSaveLeader = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLeader: Leader = {
      id: editingLeader ? editingLeader.id : Date.now(),
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      grade: formData.get("grade") as string,
    };

    if (editingLeader) {
      setLeaders(leaders.map(l => l.id === newLeader.id ? newLeader : l));
    } else {
      setLeaders([...leaders, newLeader]);
    }
    setIsLeaderModalOpen(false);
    setEditingLeader(null);
  };

  const handleDeleteLeader = (id: number) => {
    if (confirm("Are you sure you want to remove this leader?")) {
      setLeaders(leaders.filter(l => l.id !== id));
    }
  };

  const handleSaveElection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setElectionStats({
      title: formData.get("title") as string,
      turnout: Number(formData.get("turnout")),
      status: formData.get("status") as string,
      subtext: formData.get("subtext") as string,
    });
    setIsElectionModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Executive Council */}
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary-500" /> Executive Council
            </h3>
            <button 
              onClick={() => { setEditingLeader(null); setIsLeaderModalOpen(true); }}
              className="px-3 py-1.5 bg-primary-50 text-primary-900 hover:bg-primary-100 rounded-xl transition text-xs font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Leader
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leaders.map((leader) => (
              <div key={leader.id} className="group p-4 bg-white/60 backdrop-blur-md border border-white rounded-2xl shadow-sm flex items-center justify-between hover:shadow-md hover:bg-white transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center font-black text-primary-900 text-lg shadow-inner">
                    {leader.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-secondary-500 mb-0.5">{leader.role}</div>
                    <div className="font-bold text-slate-800">{leader.name}</div>
                    <div className="text-xs text-slate-500">{leader.grade}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => { setEditingLeader(leader); setIsLeaderModalOpen(true); }}
                    className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteLeader(leader.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {leaders.length === 0 && (
               <div className="col-span-1 md:col-span-2 p-8 text-center text-slate-500 bg-white/40 rounded-2xl border border-dashed border-slate-300">
                 No leaders found.
               </div>
            )}
          </div>
        </div>

        {/* Election Status Widget */}
        <div className="bg-primary-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
            <Vote className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-xs font-black text-secondary-400 uppercase tracking-widest mb-6">{electionStats.title}</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-primary-100">Voting Progress</span>
                    <span className="text-white">{electionStats.turnout}% Turnout</span>
                  </div>
                  <div className="w-full bg-primary-800 rounded-full h-2.5 shadow-inner overflow-hidden">
                    <div className="bg-gradient-to-r from-secondary-500 to-amber-300 h-2.5 rounded-full relative transition-all duration-1000" style={{ width: `${electionStats.turnout}%` }}>
                       <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-primary-800">
                  <div className="text-3xl font-black tracking-tight mb-1">{electionStats.status}</div>
                  <div className="text-xs font-medium text-primary-200">{electionStats.subtext}</div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsElectionModalOpen(true)}
              className="w-full mt-6 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-secondary-500/20 flex items-center justify-center gap-2"
            >
              <Vote className="w-4 h-4" /> Manage Election
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {quickStats.map((stat, idx) => {
             const Icon = stat.icon;
             return (
               <div key={idx} className="bg-white/60 backdrop-blur-md border border-white p-5 rounded-2xl shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
               </div>
             )
          })}
        </div>
      </div>

      {/* Leader Modal */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-800">{editingLeader ? 'Edit Leader' : 'Add Leader'}</h2>
              <button onClick={() => setIsLeaderModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveLeader} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                <input required name="name" defaultValue={editingLeader?.name} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Role</label>
                <input required name="role" defaultValue={editingLeader?.role} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. School Captain" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade / Class</label>
                <input required name="grade" defaultValue={editingLeader?.grade} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="e.g. Grade 11A" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsLeaderModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition">
                  {editingLeader ? 'Save Changes' : 'Add Leader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Election Modal */}
      {isElectionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-800">Manage Election</h2>
              <button onClick={() => setIsElectionModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveElection} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Election Title</label>
                <input required name="title" defaultValue={electionStats.title} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Turnout %</label>
                <input required type="number" min="0" max="100" name="turnout" defaultValue={electionStats.turnout} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Line</label>
                <input required name="status" defaultValue={electionStats.status} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Subtext</label>
                <input required name="subtext" defaultValue={electionStats.subtext} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsElectionModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition">
                  Update Election
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
