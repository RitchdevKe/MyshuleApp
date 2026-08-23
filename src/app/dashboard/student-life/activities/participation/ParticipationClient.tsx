"use client";

import React, { useState } from "react";
import { Star, Search, Filter, Plus, Edit2, Trash2, X, Activity, Users, Trophy } from "lucide-react";

type DBStudent = { id: string; firstName: string; lastName: string; admissionNumber: string; status: string };
type DBStaff = { id: string; firstName: string; lastName: string; employeeNumber: string; department: string };

type Participation = {
  id: string;
  studentId: string;
  staffId?: string;
  name: string;
  grade: string;
  activities: number;
  points: number;
  status: "Highly Active" | "Active" | "Inactive";
};

export default function ParticipationClient({ dbStudents, dbStaff }: { dbStudents: DBStudent[], dbStaff: DBStaff[] }) {
  const [participations, setParticipations] = useState<Participation[]>([
    { id: "1", studentId: "s1", name: "Mary Wanjiku", grade: "Grade 10", activities: 4, points: 120, status: "Highly Active" },
    { id: "2", studentId: "s2", name: "John Kamau", grade: "Grade 11", activities: 2, points: 45, status: "Active" },
    { id: "3", studentId: "s3", name: "Brian Mwangi", grade: "Grade 8", activities: 0, points: 0, status: "Inactive" },
    { id: "4", studentId: "s4", name: "Alice Wambui", grade: "Grade 9", activities: 3, points: 85, status: "Active" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Participation>>({
    studentId: "",
    staffId: "",
    name: "",
    grade: "Grade 10",
    activities: 0,
    points: 0,
    status: "Active"
  });

  const handleOpenModal = (p?: Participation) => {
    if (p) {
      setEditingId(p.id);
      setFormData(p);
    } else {
      setEditingId(null);
      setFormData({
        studentId: "",
        staffId: "",
        name: "",
        grade: "Grade 10",
        activities: 0,
        points: 0,
        status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setParticipations(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      alert("Name is required");
      return;
    }
    const dataToSave = {
      ...formData,
      activities: Number(formData.activities) || 0,
      points: Number(formData.points) || 0,
    } as Participation;

    if (editingId) {
      setParticipations(prev => prev.map(p => p.id === editingId ? { ...p, ...dataToSave } : p));
    } else {
      setParticipations(prev => [...prev, { ...dataToSave, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const filteredParticipations = participations.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary Metrics
  const totalPoints = participations.reduce((sum, p) => sum + p.points, 0);
  const avgPoints = participations.length > 0 ? Math.round(totalPoints / participations.length) : 0;
  const totalActivities = participations.reduce((sum, p) => sum + p.activities, 0);

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Student Participation</h2>
            <p className="text-xs font-bold text-slate-500">Track extracurricular engagement levels</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Tracked Students</p>
            <p className="text-2xl font-black text-slate-800">{participations.length}</p>
          </div>
        </div>
        <div className="bg-white/80 p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Total Activities</p>
            <p className="text-2xl font-black text-slate-800">{totalActivities}</p>
          </div>
        </div>
        <div className="bg-white/80 p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">Avg Points per Student</p>
            <p className="text-2xl font-black text-slate-800">{avgPoints}</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white/80 border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student or grade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/60">
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Activities Enrolled</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-center">Engagement Points</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Supervisor</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredParticipations.length > 0 ? (
                filteredParticipations.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/30 transition-colors">
                    <td className="p-4">
                      <div className="text-sm font-bold text-slate-800">{s.name}</div>
                      <div className="text-xs font-medium text-slate-500">{s.grade}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 font-black text-slate-700">
                        {s.activities}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-lg font-black text-purple-600">{s.points}</span>
                    </td>
                    <td className="p-4">
                      {s.staffId && dbStaff ? (
                        <span className="text-xs font-medium text-slate-600">
                          {dbStaff.find(st => st.id === s.staffId)?.firstName} {dbStaff.find(st => st.id === s.staffId)?.lastName}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">None</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded shadow-sm ${
                        s.status === 'Highly Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        s.status === 'Active' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                        'bg-rose-50 text-rose-600 border-rose-200'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModal(s)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Record"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No participation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Participation" : "Add Participation"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {dbStudents && dbStudents.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select DB Student</label>
                  <select 
                    value={formData.studentId}
                    onChange={(e) => {
                      const st = dbStudents.find(x => x.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        studentId: e.target.value, 
                        name: st ? `${st.firstName} ${st.lastName}` : formData.name 
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="">-- Manual Entry --</option>
                    {dbStudents.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

              {dbStaff && dbStaff.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Supervisor (Staff)</label>
                  <select 
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="">-- No Supervisor --</option>
                    {dbStaff.map(s => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
                <input 
                  type="text" 
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Grade Level</label>
                  <select 
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Participation["status"] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  >
                    <option value="Highly Active">Highly Active</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Activities Count</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.activities || 0}
                    onChange={(e) => setFormData({ ...formData, activities: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Points</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.points || 0}
                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 text-sm font-bold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
