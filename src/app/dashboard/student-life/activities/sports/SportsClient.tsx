"use client";

import React, { useState } from "react";
import { Activity, Plus, X, Edit, Trash2 } from "lucide-react";
import { createSport, updateSport, deleteSport } from "./actions";

type Sport = {
  id: string;
  name: string;
  patronId: string | null;
  patron: { firstName: string; lastName: string } | null;
  memberships: any[];
};

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function SportsClient({ initialSports, staff }: { initialSports: Sport[], staff: Staff[] }) {
  const [sports, setSports] = useState<Sport[]>(initialSports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [patronId, setPatronId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openModal = (sport?: Sport) => {
    if (sport) {
      setEditingSport(sport);
      setName(sport.name);
      setPatronId(sport.patronId || "");
    } else {
      setEditingSport(null);
      setName("");
      setPatronId("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSport(null);
    setName("");
    setPatronId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingSport) {
        const res = await updateSport(editingSport.id, { name, patronId });
        if (res.success && res.data) {
          // Update local state instead of full refresh for snappier UI, or rely on revalidatePath
          const updated = {
            ...editingSport,
            ...res.data,
            patron: staff.find(s => s.id === patronId) || null
          };
          setSports(sports.map(s => s.id === editingSport.id ? updated : s));
          closeModal();
        }
      } else {
        const res = await createSport({ name, patronId });
        if (res.success && res.data) {
          const newSport = {
            ...res.data,
            patron: staff.find(s => s.id === patronId) || null,
            memberships: []
          };
          setSports([...sports, newSport as any]);
          closeModal();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sport?")) {
      const res = await deleteSport(id);
      if (res.success) {
        setSports(sports.filter(s => s.id !== id));
      }
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Sports Teams</h2>
            <p className="text-xs font-bold text-slate-500">Manage athletics, fixtures, and coaching staff</p>
          </div>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Team
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Sports</p>
           <p className="text-3xl font-black text-slate-800">{sports.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Total Members</p>
           <p className="text-3xl font-black text-slate-800">
             {sports.reduce((acc, s) => acc + (s.memberships?.length || 0), 0)}
           </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
           <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide">Active Coaches</p>
           <p className="text-3xl font-black text-slate-800">
             {new Set(sports.filter(s => s.patronId).map(s => s.patronId)).size}
           </p>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {sports.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            No sports teams found. Create one to get started!
          </div>
        ) : null}
        
        {sports.map((team) => (
          <div key={team.id} className="bg-white/80 border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl border border-emerald-100 uppercase">
                  {team.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{team.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Sport</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openModal(team)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(team.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Squad Size</div>
                <div className="text-xl font-black text-slate-700">{team.memberships?.length || 0}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Status</div>
                <div className="text-xs font-bold px-2 py-1 inline-block rounded-md bg-emerald-100 text-emerald-700">
                  Active
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Head Coach:</span>
                <span className="text-slate-700">
                  {team.patron ? `${team.patron.firstName} ${team.patron.lastName}` : "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">
                {editingSport ? "Edit Team" : "New Team"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Team Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                  placeholder="e.g. Football U16 Boys"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Head Coach</label>
                <select
                  value={patronId}
                  onChange={(e) => setPatronId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium"
                >
                  <option value="">Unassigned</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? "Saving..." : editingSport ? "Update Team" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
