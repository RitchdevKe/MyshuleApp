"use client";

import React, { useState, useMemo } from "react";
import { Award, Search, Filter, Plus, Star, Edit, Trash2, X } from "lucide-react";

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
};

type AwardLog = {
  id: string;
  studentId: string;
  title: string;
  category: "Excellence" | "Academic" | "Service" | "Athletics" | "Other";
  date: string;
};

export default function AwardsClient({ students }: { students: Student[] }) {
  const [logs, setLogs] = useState<AwardLog[]>([
    { id: "1", studentId: students[0]?.id || "s1", title: "Student of the Year", category: "Excellence", date: "2024-12-10" },
    { id: "2", studentId: students[1]?.id || "s2", title: "Best Debater", category: "Academic", date: "2024-11-15" },
    { id: "3", studentId: students[2]?.id || "s3", title: "Community Service Gold", category: "Service", date: "2024-10-20" },
    { id: "4", studentId: students[3]?.id || "s4", title: "Sports Personality", category: "Athletics", date: "2024-09-05" },
  ]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<AwardLog | null>(null);

  // Form State
  const [formStudentId, setFormStudentId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<AwardLog["category"]>("Academic");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);

  // Derived state
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const student = students.find((s) => s.id === log.studentId);
      const studentName = student ? `${student.firstName} ${student.lastName}` : "";
      const matchesSearch = log.title.toLowerCase().includes(search.toLowerCase()) || studentName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === "All" || log.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [logs, search, filterCategory, students]);

  const totalAwards = logs.length;
  const uniqueStudents = new Set(logs.map(l => l.studentId)).size;
  const popularCategory = useMemo(() => {
    if (logs.length === 0) return "N/A";
    const counts = logs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [logs]);

  const openModal = (log?: AwardLog) => {
    if (log) {
      setEditingLog(log);
      setFormStudentId(log.studentId);
      setFormTitle(log.title);
      setFormCategory(log.category);
      setFormDate(log.date);
    } else {
      setEditingLog(null);
      setFormStudentId(students[0]?.id || "");
      setFormTitle("");
      setFormCategory("Academic");
      setFormDate(new Date().toISOString().split("T")[0]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStudentId || !formTitle) return;

    if (editingLog) {
      setLogs(logs.map(l => l.id === editingLog.id ? {
        ...l,
        studentId: formStudentId,
        title: formTitle,
        category: formCategory,
        date: formDate,
      } : l));
    } else {
      setLogs([...logs, {
        id: Math.random().toString(36).substring(7),
        studentId: formStudentId,
        title: formTitle,
        category: formCategory,
        date: formDate,
      }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this award log?")) {
      setLogs(logs.filter(l => l.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Awards Issued</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalAwards}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unique Students</p>
              <h3 className="text-2xl font-bold text-slate-800">{uniqueStudents}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Filter className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Top Category</p>
              <h3 className="text-2xl font-bold text-slate-800">{popularCategory}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title or student name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500/20 shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="Excellence">Excellence</option>
            <option value="Academic">Academic</option>
            <option value="Service">Service</option>
            <option value="Athletics">Athletics</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Issue Award
          </button>
        </div>
      </div>

      {/* Grid of Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLogs.map((log) => {
          const student = students.find((s) => s.id === log.studentId);
          return (
            <div key={log.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(log)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(log.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
                  <Star className="w-5 h-5 fill-amber-500" />
                </div>
                
                <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">{log.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg mb-4 inline-block border border-amber-200">
                  {log.category}
                </span>

                <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
                  <div className="flex flex-col text-sm">
                    <span className="font-medium text-slate-500 text-xs">Awarded To</span>
                    <span className="font-bold text-slate-800 truncate">
                      {student ? `${student.firstName} ${student.lastName}` : "Unknown Student"}
                    </span>
                    <span className="text-xs text-slate-400">{student?.admissionNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2">
                    <span className="font-medium text-slate-500">Date</span>
                    <span className="font-bold text-slate-600">{new Date(log.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredLogs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No awards found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingLog ? "Edit Award" : "Issue Award"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                <select
                  required
                  value={formStudentId}
                  onChange={(e) => setFormStudentId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                >
                  <option value="" disabled>Select a student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Award Title</label>
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Science Fair Winner"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                >
                  <option value="Excellence">Excellence</option>
                  <option value="Academic">Academic</option>
                  <option value="Service">Service</option>
                  <option value="Athletics">Athletics</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  required
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  {editingLog ? "Save Changes" : "Issue Award"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
