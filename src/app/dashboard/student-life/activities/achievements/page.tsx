"use client";

import React, { useState, useMemo } from "react";
import { Trophy, Medal, Search, Plus, Filter, Award, Scroll, Edit, Trash2, X } from "lucide-react";

type AchievementType = "Trophy" | "Medal" | "Certificate";

interface Achievement {
  id: string;
  title: string;
  entity: string; // Student or Team
  category: string;
  date: string;
  type: AchievementType;
}

const initialAchievements: Achievement[] = [
  { id: "1", title: "National Science Fair - 1st Place", entity: "Science Club", category: "Academic", date: "2026-10-15", type: "Trophy" },
  { id: "2", title: "Regional Debate Finals - MVP", entity: "John Kamau", category: "Debate", date: "2026-09-28", type: "Medal" },
  { id: "3", title: "Inter-School Swimming - Gold", entity: "Mary Wanjiku", category: "Sports", date: "2026-09-15", type: "Medal" },
  { id: "4", title: "Community Service Excellence", entity: "Grade 11 Volunteers", category: "Community", date: "2026-08-30", type: "Certificate" },
];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    entity: "",
    category: "",
    date: "",
    type: "Trophy" as AchievementType
  });

  const filteredAchievements = achievements.filter(ach => 
    ach.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ach.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ach.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derived Summary Data
  const stats = useMemo(() => {
    return {
      total: achievements.length,
      trophies: achievements.filter(a => a.type === "Trophy").length,
      medals: achievements.filter(a => a.type === "Medal").length,
      certificates: achievements.filter(a => a.type === "Certificate").length,
    };
  }, [achievements]);

  const handleOpenModal = (achievement?: Achievement) => {
    if (achievement) {
      setEditingId(achievement.id);
      setFormData({
        title: achievement.title,
        entity: achievement.entity,
        category: achievement.category,
        date: achievement.date,
        type: achievement.type
      });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        entity: "",
        category: "",
        date: new Date().toISOString().split('T')[0],
        type: "Trophy"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAchievements(prev => prev.map(ach => 
        ach.id === editingId ? { ...formData, id: editingId } : ach
      ));
    } else {
      setAchievements(prev => [
        { ...formData, id: Math.random().toString(36).substr(2, 9) },
        ...prev
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this achievement?")) {
      setAchievements(prev => prev.filter(ach => ach.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Trophy Cabinet</h2>
            <p className="text-xs font-bold text-slate-500">Record and celebrate student and team achievements</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
             <Award className="w-6 h-6" />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500">Total</p>
             <h3 className="text-xl font-black text-slate-800">{stats.total}</h3>
           </div>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
             <Trophy className="w-6 h-6" />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500">Trophies</p>
             <h3 className="text-xl font-black text-slate-800">{stats.trophies}</h3>
           </div>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shrink-0">
             <Medal className="w-6 h-6" />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500">Medals</p>
             <h3 className="text-xl font-black text-slate-800">{stats.medals}</h3>
           </div>
        </div>
        <div className="bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm flex items-center gap-4">
           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
             <Scroll className="w-6 h-6" />
           </div>
           <div>
             <p className="text-xs font-bold text-slate-500">Certificates</p>
             <h3 className="text-xl font-black text-slate-800">{stats.certificates}</h3>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search achievements by title, student, or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredAchievements.map((ach) => (
          <div key={ach.id} className="bg-gradient-to-r from-amber-50/80 to-yellow-50/30 border border-amber-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex items-center gap-6 group relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
              ach.type === 'Trophy' ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white' :
              ach.type === 'Medal' ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
              'bg-gradient-to-br from-emerald-300 to-emerald-500 text-white'
            }`}>
              {ach.type === 'Trophy' ? <Trophy className="w-8 h-8 drop-shadow-sm" /> : 
               ach.type === 'Medal' ? <Medal className="w-8 h-8 drop-shadow-sm" /> : 
               <Scroll className="w-8 h-8 drop-shadow-sm" />}
            </div>
            
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1 inline-block">{ach.category}</span>
              <h3 className="font-black text-slate-800 text-lg leading-tight mb-1 group-hover:text-amber-700 transition-colors pr-12">{ach.title}</h3>
              <p className="text-sm font-medium text-slate-600">
                <span className="text-slate-400">Awarded to:</span> {ach.entity}
              </p>
            </div>
            
            <div className="text-right flex flex-col items-end justify-between h-full py-1">
              <span className="text-xs font-bold text-slate-400 block whitespace-nowrap mb-2">{new Date(ach.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(ach)}
                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(ach.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredAchievements.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-12 bg-white/40 rounded-3xl border border-white/60">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-600">No achievements found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search query.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Achievement" : "Add Achievement"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="e.g. National Science Fair - 1st Place"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Awarded To (Student/Team)</label>
                <input 
                  type="text" 
                  required
                  value={formData.entity}
                  onChange={(e) => setFormData({...formData, entity: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  placeholder="e.g. Science Club or John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    placeholder="e.g. Academic"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Award Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as AchievementType})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                >
                  <option value="Trophy">Trophy</option>
                  <option value="Medal">Medal</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-sm"
                >
                  {editingId ? "Save Changes" : "Add Achievement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
