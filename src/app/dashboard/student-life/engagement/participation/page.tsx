"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Activity, Plus, Edit, Trash2, Users, Percent, ClipboardList, Target, X, Check } from "lucide-react";

type ActivityCategory = "Academic" | "Sports" | "Arts" | "Other";

interface ActivityItem {
  id: string;
  name: string;
  category: ActivityCategory;
  members: number; // Conceptually number of students
  sponsor: string; // Conceptually Staff member
  avgAttendance: number; // percentage
}

const initialActivities: ActivityItem[] = [
  { id: "1", name: "Debate Club", category: "Academic", members: 45, sponsor: "Mr. Smith", avgAttendance: 92 },
  { id: "2", name: "Football U16", category: "Sports", members: 22, sponsor: "Coach Taylor", avgAttendance: 88 },
  { id: "3", name: "Drama Club", category: "Arts", members: 30, sponsor: "Ms. Darbus", avgAttendance: 75 },
  { id: "4", name: "Chess Team", category: "Academic", members: 15, sponsor: "Mr. Harmon", avgAttendance: 95 },
];

export default function EngagementParticipationPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | "All">("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityItem | null>(null);
  const [formData, setFormData] = useState<Partial<ActivityItem>>({});

  // Summary Calculations
  const totalActivities = activities.length;
  const totalMembers = activities.reduce((acc, curr) => acc + curr.members, 0);
  const avgSystemAttendance = totalActivities > 0
    ? Math.round(activities.reduce((acc, curr) => acc + curr.avgAttendance, 0) / totalActivities)
    : 0;

  // Search & Filter
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch = activity.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            activity.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterCategory === "All" || activity.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [activities, searchQuery, filterCategory]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const openModal = (activity?: ActivityItem) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData(activity);
    } else {
      setEditingActivity(null);
      setFormData({
        name: "",
        category: "Academic",
        members: 0,
        sponsor: "",
        avgAttendance: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
    setFormData({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.sponsor) {
      alert("Please fill out all required fields.");
      return;
    }

    if (editingActivity) {
      setActivities((prev) =>
        prev.map((a) => (a.id === editingActivity.id ? { ...a, ...formData } as ActivityItem : a))
      );
    } else {
      const newActivity: ActivityItem = {
        ...(formData as ActivityItem),
        id: Math.random().toString(36).substring(2, 9),
      };
      setActivities((prev) => [...prev, newActivity]);
    }
    closeModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 shadow-inner">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Activities</p>
            <h4 className="text-2xl font-bold text-slate-800">{totalActivities}</h4>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Members</p>
            <h4 className="text-2xl font-bold text-slate-800">{totalMembers}</h4>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Attendance</p>
            <h4 className="text-2xl font-bold text-slate-800">{avgSystemAttendance}%</h4>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search activities or sponsors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ActivityCategory | "All")}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none shadow-sm cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Academic">Academic</option>
              <option value="Sports">Sports</option>
              <option value="Arts">Arts</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Log Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredActivities.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No activities found matching your criteria.
          </div>
        )}
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group relative">
            
            {/* Action buttons appear on hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button 
                onClick={() => openModal(activity)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Activity"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(activity.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Activity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 mb-4 shadow-inner">
              <Activity className="w-5 h-5" />
            </div>
            
            <h3 className="font-bold text-slate-800 mb-1 pr-12 truncate" title={activity.name}>{activity.name}</h3>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg inline-block">
                {activity.category}
              </span>
              <span className="text-xs text-slate-500 truncate" title={"Sponsor: " + activity.sponsor}>
                {activity.sponsor}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Members</span>
                <span className="font-bold text-slate-800">{activity.members}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-500">Avg. Attendance</span>
                <span className="font-bold text-emerald-600">{activity.avgAttendance}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">
                {editingActivity ? "Edit Activity" : "Log New Activity"}
              </h3>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Activity Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g., Debate Club"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                  <select 
                    required
                    value={formData.category || "Academic"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ActivityCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sponsor (Staff) *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.sponsor || ""}
                    onChange={(e) => setFormData({ ...formData, sponsor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="e.g., Mr. Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Members</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.members || 0}
                    onChange={(e) => setFormData({ ...formData, members: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Avg. Attendance (%)</label>
                  <input 
                    type="number"
                    min="0"
                    max="100"
                    value={formData.avgAttendance || 0}
                    onChange={(e) => setFormData({ ...formData, avgAttendance: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-900 rounded-lg hover:bg-primary-800 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingActivity ? "Save Changes" : "Create Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
