"use client";

import React, { useState, useMemo } from "react";
import { Vote, Users, Search, Play, CheckCircle2, AlertCircle, Plus, Edit2, Trash2, X, BarChart3, UserCheck, Shield } from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  role: string;
  votes: number;
};

type ElectionStatus = "Live" | "Upcoming" | "Completed";
type Audience = "Students" | "Staff" | "All";

type Election = {
  id: string;
  title: string;
  status: ElectionStatus;
  date: string;
  audience: Audience;
  voters: number;
  candidates: Candidate[];
};

const initialElections: Election[] = [
  { 
    id: "1", 
    title: "2026 Prefect Elections", 
    status: "Live", 
    date: "2025-10-24", 
    audience: "Students",
    voters: 850, 
    candidates: [
      { id: "c1", name: "Alice Johnson", role: "Head Prefect", votes: 300 },
      { id: "c2", name: "Bob Smith", role: "Head Prefect", votes: 278 }
    ]
  },
  { 
    id: "2", 
    title: "Staff Representative 2025", 
    status: "Upcoming", 
    date: "2025-11-15", 
    audience: "Staff",
    voters: 120, 
    candidates: []
  },
  { 
    id: "3", 
    title: "2025 School Captain", 
    status: "Completed", 
    date: "2025-01-10", 
    audience: "All",
    voters: 1200, 
    candidates: [
      { id: "c3", name: "Charlie Brown", role: "Captain", votes: 600 },
      { id: "c4", name: "Diana Prince", role: "Captain", votes: 504 }
    ]
  },
];

const calculateTurnout = (election: Election) => {
  if (election.voters === 0) return 0;
  const totalVotes = election.candidates.reduce((acc, curr) => acc + curr.votes, 0);
  return Math.min(100, Math.round((totalVotes / election.voters) * 100));
};

export default function LeadershipElectionsPage() {
  const [elections, setElections] = useState<Election[]>(initialElections);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [editingElection, setEditingElection] = useState<Election | null>(null);
  
  const [isCandidatesModalOpen, setIsCandidatesModalOpen] = useState(false);
  const [activeElectionId, setActiveElectionId] = useState<string | null>(null);

  // Form states for election
  const [formData, setFormData] = useState<{title: string, status: ElectionStatus, date: string, audience: Audience, voters: number}>({
    title: "",
    status: "Upcoming",
    date: "",
    audience: "Students",
    voters: 0,
  });

  // Form state for candidate
  const [candidateForm, setCandidateForm] = useState({ name: "", role: "", votes: 0 });

  // Derived state
  const filteredElections = useMemo(() => {
    return elections.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [elections, searchQuery]);

  const totalElections = elections.length;
  const liveElections = elections.filter(e => e.status === "Live").length;
  
  const avgTurnout = useMemo(() => {
    if (totalElections === 0) return 0;
    const totalTurnout = elections.reduce((acc, curr) => acc + calculateTurnout(curr), 0);
    return Math.round(totalTurnout / totalElections);
  }, [elections, totalElections]);

  const totalVoters = elections.reduce((acc, curr) => acc + curr.voters, 0);

  // Handlers
  const handleOpenElectionModal = (election?: Election) => {
    if (election) {
      setEditingElection(election);
      setFormData({
        title: election.title,
        status: election.status,
        date: election.date,
        audience: election.audience,
        voters: election.voters,
      });
    } else {
      setEditingElection(null);
      setFormData({
        title: "",
        status: "Upcoming",
        date: "",
        audience: "Students",
        voters: 0,
      });
    }
    setIsElectionModalOpen(true);
  };

  const handleSaveElection = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingElection) {
      setElections(elections.map(el => el.id === editingElection.id ? { 
        ...el, 
        title: formData.title, 
        status: formData.status, 
        date: formData.date, 
        audience: formData.audience,
        voters: Number(formData.voters) 
      } : el));
    } else {
      const newElection: Election = {
        id: Math.random().toString(36).substring(7),
        title: formData.title,
        status: formData.status,
        date: formData.date,
        audience: formData.audience,
        voters: Number(formData.voters) || 0,
        candidates: []
      };
      setElections([...elections, newElection]);
    }
    setIsElectionModalOpen(false);
  };

  const handleDeleteElection = (id: string) => {
    if (confirm("Are you sure you want to delete this election?")) {
      setElections(elections.filter(el => el.id !== id));
      if (activeElectionId === id) setIsCandidatesModalOpen(false);
    }
  };

  const handleOpenCandidatesModal = (id: string) => {
    setActiveElectionId(id);
    setIsCandidatesModalOpen(true);
  };

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.name || !candidateForm.role) return;
    
    setElections(elections.map(el => {
      if (el.id === activeElectionId) {
        return {
          ...el,
          candidates: [...el.candidates, { 
            id: Math.random().toString(36).substring(7), 
            name: candidateForm.name, 
            role: candidateForm.role, 
            votes: Number(candidateForm.votes) || 0 
          }]
        };
      }
      return el;
    }));
    setCandidateForm({ name: "", role: "", votes: 0 });
  };

  const handleDeleteCandidate = (electionId: string, candidateId: string) => {
    setElections(elections.map(el => {
      if (el.id === electionId) {
        return {
          ...el,
          candidates: el.candidates.filter(c => c.id !== candidateId)
        };
      }
      return el;
    }));
  };

  const activeElection = elections.find(e => e.id === activeElectionId);

  return (
    <div className="p-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900">
            <Vote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Elections</p>
            <p className="text-2xl font-black text-slate-800">{totalElections}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Live Now</p>
            <p className="text-2xl font-black text-slate-800">{liveElections}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Turnout</p>
            <p className="text-2xl font-black text-slate-800">{avgTurnout}%</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Eligible Voters</p>
            <p className="text-2xl font-black text-slate-800">{totalVoters}</p>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search elections..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => handleOpenElectionModal()} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-secondary-500 rounded-xl hover:bg-secondary-600 transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Create Election
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredElections.length > 0 ? (
          filteredElections.map((election) => {
            const turnout = calculateTurnout(election);
            
            return (
              <div key={election.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col relative group">
                
                {/* Actions that appear on hover */}
                <div className="absolute top-4 right-4 hidden group-hover:flex items-center gap-1">
                  <button onClick={() => handleOpenElectionModal(election)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteElection(election.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex justify-between items-start mb-4 pr-16">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 shadow-inner">
                      {election.audience === 'Staff' ? <Shield className="w-6 h-6" /> : <Vote className="w-6 h-6" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{election.audience}</span>
                      
                      {election.status === 'Live' && (
                        <span className="flex items-center gap-1 text-secondary-600 text-[10px] font-black uppercase tracking-wider mt-0.5">
                          <Play className="w-3 h-3 fill-current" /> Live
                        </span>
                      )}
                      {election.status === 'Upcoming' && (
                        <span className="flex items-center gap-1 text-amber-600 text-[10px] font-black uppercase tracking-wider mt-0.5">
                          <AlertCircle className="w-3 h-3" /> Upcoming
                        </span>
                      )}
                      {election.status === 'Completed' && (
                        <span className="flex items-center gap-1 text-green-700 text-[10px] font-black uppercase tracking-wider mt-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="font-black text-lg text-slate-800 mb-1">{election.title}</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">
                  {election.date ? new Date(election.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date set'}
                </p>

                <div className="mt-auto space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> {election.voters} Eligible</span>
                    <span>{turnout}% Turnout</span>
                  </div>
                  
                  {turnout > 0 && (
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className={`h-2 rounded-full ${election.status === 'Live' ? 'bg-secondary-500' : 'bg-primary-500'}`} style={{ width: `${turnout}%` }}></div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handleOpenCandidatesModal(election.id)} className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors">
                      {election.candidates.length} Candidates
                    </button>
                    <button onClick={() => handleOpenElectionModal(election)} className="flex-1 py-2 bg-primary-900 hover:bg-primary-800 text-white text-xs font-bold rounded-xl border border-primary-900 transition-colors">
                      {election.status === 'Completed' ? 'View Details' : 'Manage'}
                    </button>
                  </div>
                </div>
                
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">
            No elections found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Election Modal */}
      {isElectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">
                {editingElection ? 'Edit Election' : 'Create Election'}
              </h2>
              <button onClick={() => setIsElectionModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveElection} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. 2026 Prefect Elections"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as ElectionStatus})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Audience</label>
                  <select 
                    value={formData.audience}
                    onChange={e => setFormData({...formData, audience: e.target.value as Audience})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Students">Students</option>
                    <option value="Staff">Staff</option>
                    <option value="All">All</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Eligible Voters</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.voters}
                    onChange={e => setFormData({...formData, voters: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsElectionModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                >
                  {editingElection ? 'Save Changes' : 'Create Election'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidates Modal */}
      {isCandidatesModalOpen && activeElection && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-800">Candidates</h2>
                <p className="text-sm font-medium text-slate-500">{activeElection.title}</p>
              </div>
              <button onClick={() => setIsCandidatesModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {activeElection.candidates.length > 0 ? (
                <div className="space-y-3">
                  {activeElection.candidates.map(candidate => (
                    <div key={candidate.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{candidate.name}</h4>
                          <p className="text-xs font-medium text-slate-500">{candidate.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-black text-lg text-slate-800">{candidate.votes}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Votes</div>
                        </div>
                        <button 
                          onClick={() => handleDeleteCandidate(activeElection.id, candidate.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 font-medium">
                  No candidates added yet.
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Add Candidate</h3>
              <form onSubmit={handleAddCandidate} className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Name" 
                  required
                  value={candidateForm.name}
                  onChange={e => setCandidateForm({...candidateForm, name: e.target.value})}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <input 
                  type="text" 
                  placeholder="Role" 
                  required
                  value={candidateForm.role}
                  onChange={e => setCandidateForm({...candidateForm, role: e.target.value})}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <input 
                  type="number" 
                  placeholder="Votes" 
                  min="0"
                  value={candidateForm.votes === 0 ? '' : candidateForm.votes}
                  onChange={e => setCandidateForm({...candidateForm, votes: Number(e.target.value)})}
                  className="w-24 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
                <button type="submit" className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl transition-colors whitespace-nowrap">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
