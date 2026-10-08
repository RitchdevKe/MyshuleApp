"use client";

import React, { useState } from "react";
import { Users, Search, MoreHorizontal, Plus, X, Edit, Trash2 } from "lucide-react";
import { createClub, updateClub, deleteClub, addMember } from "./actions";

export default function ClubsClient({ initialClubs, staff, students }: { initialClubs: any[], staff: any[], students?: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedClubId, setSelectedClubId] = useState("");
  const [formData, setFormData] = useState({ name: "", patronId: "" });
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const filteredClubs = initialClubs.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingClub(null);
    setFormData({ name: "", patronId: "" });
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleOpenEdit = (club: any) => {
    setEditingClub(club);
    setFormData({ name: club.name, patronId: club.patronId || "" });
    setIsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this club?")) {
      await deleteClub(id);
    }
    setOpenDropdownId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingClub) {
        await updateClub(editingClub.id, { name: formData.name, patronId: formData.patronId || null });
      } else {
        await createClub({ name: formData.name, patronId: formData.patronId || null });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to save club");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Clubs Registry</h2>
            <p className="text-xs font-bold text-slate-500">Manage student clubs and academic societies</p>
          </div>
        </div>
        <button onClick={handleOpenNew} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Club
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search clubs..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club) => (
          <div key={club.id} className="bg-white/80 border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl border border-indigo-100 uppercase">
                  {club.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{club.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Club</p>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setOpenDropdownId(openDropdownId === club.id ? null : club.id)}
                  className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-indigo-50"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {openDropdownId === club.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10">
                    <button onClick={() => handleOpenEdit(club)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => { setOpenDropdownId(null); setSelectedClubId(club.id); setIsMemberModalOpen(true); }} className="w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2">
                      <Users className="w-4 h-4" /> Add Member
                    </button>
                    <button onClick={() => handleDelete(club.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Members</div>
                <div className="text-xl font-black text-slate-700">{club.memberships?.length || 0}</div>
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
                <span className="text-slate-400">Patron:</span>
                <span className="text-slate-700">
                  {club.patron ? `${club.patron.firstName} ${club.patron.lastName}` : "Unassigned"}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredClubs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white/50 rounded-3xl border border-slate-200 border-dashed">
            No clubs found. Create a new one!
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-lg text-slate-800">
                {editingClub ? "Edit Club" : "New Club"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Club Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Debate Club"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Patron</label>
                  <select 
                    value={formData.patronId}
                    onChange={e => setFormData({ ...formData, patronId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select a Patron</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} - {s.jobTitle}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                >
                  {isSubmitting ? "Saving..." : "Save Club"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-black text-lg text-slate-800">
                Add Member to Club
              </h3>
              <button 
                onClick={() => setIsMemberModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await addMember(selectedClubId, selectedStudentId);
                setIsMemberModalOpen(false);
              } catch (err) {
                console.error(err);
                alert("Failed to add member");
              } finally {
                setIsSubmitting(false);
              }
            }} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Student</label>
                  <select 
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="">Select a Student</option>
                    {(students || []).map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName} - {s.admissionNumber}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors shadow-sm"
                >
                  {isSubmitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
