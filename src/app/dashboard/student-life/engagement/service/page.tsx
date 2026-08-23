"use client";

import React, { useState, useMemo } from "react";
import { Heart, Search, Filter, Plus, Clock, CheckCircle2, Edit, Trash2, X, AlertCircle } from "lucide-react";

export default function EngagementServicePage() {
  // Local state for CRUD operations, conceptually linking to Students and Staff (Supervisors)
  const [records, setRecords] = useState([
    { id: 1, studentId: "S001", studentName: "John Kamau", grade: "11A", activity: "Tree Planting Initiative", hours: 24, status: "Verified", date: "2025-10-12", supervisorId: "T001", supervisorName: "Mr. Smith" },
    { id: 2, studentId: "S002", studentName: "Jane Doe", grade: "10A", activity: "Local Orphanage Visit", hours: 8, status: "Pending", date: "2025-11-02", supervisorId: "T002", supervisorName: "Mrs. Jones" },
    { id: 3, studentId: "S003", studentName: "Peter Otieno", grade: "11C", activity: "Beach Clean-up", hours: 12, status: "Verified", date: "2025-09-28", supervisorId: "T001", supervisorName: "Mr. Smith" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    studentName: "",
    grade: "",
    activity: "",
    hours: 0,
    date: "",
    status: "Pending",
    supervisorName: "",
  });

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        studentName: record.studentName,
        grade: record.grade,
        activity: record.activity,
        hours: record.hours,
        date: record.date,
        status: record.status,
        supervisorName: record.supervisorName || "",
      });
    } else {
      setEditingRecord(null);
      setFormData({
        studentName: "",
        grade: "",
        activity: "",
        hours: 0,
        date: new Date().toISOString().split('T')[0],
        status: "Pending",
        supervisorName: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...formData } : r));
    } else {
      const newRecord = {
        ...formData,
        id: Date.now(),
        studentId: "S" + Math.floor(Math.random() * 1000), // mock student conceptually
        supervisorId: "T" + Math.floor(Math.random() * 1000), // mock staff conceptually
      };
      setRecords([...records, newRecord]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setRecords(records.map(r => {
      if (r.id === id) {
        return { ...r, status: r.status === "Verified" ? "Pending" : "Verified" };
      }
      return r;
    }));
  };

  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Derived calculations for the summary cards from local state
  const stats = useMemo(() => {
    const verifiedHours = records.reduce((acc, curr) => acc + (curr.status === "Verified" ? Number(curr.hours) : 0), 0);
    const pendingRecords = records.filter(r => r.status === "Pending").length;
    const uniqueStudents = new Set(records.map(r => r.studentId)).size;
    const totalRecords = records.length;
    
    return [
      { label: "Verified Service Hours", value: verifiedHours, icon: Clock, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Pending Approvals", value: pendingRecords, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Active Participants", value: uniqueStudents, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
      { label: "Total Activities Logged", value: totalRecords, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];
  }, [records]);

  return (
    <div className="p-6">
      {/* Top Summary Cards (Calculated from Local State) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by student, activity or grade..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Log Hours
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Activity & Staff</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Hours</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No service records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-900 font-bold text-xs shrink-0">
                          {record.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{record.studentName}</div>
                          <div className="text-[10px] text-slate-500">Grade {record.grade} • ID: {record.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{record.activity}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Sup: {record.supervisorName}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Clock className="w-4 h-4 text-slate-400" /> {record.hours}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleToggleStatus(record.id)}
                        className="focus:outline-none"
                        title="Click to toggle status"
                      >
                        {record.status === 'Verified' ? (
                          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-200 flex items-center gap-1 w-max cursor-pointer hover:bg-green-100 transition-colors">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-amber-200 flex items-center gap-1 w-max cursor-pointer hover:bg-amber-100 transition-colors">
                            <AlertCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(record)}
                          className="p-1.5 text-slate-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(record.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log/Edit Hours Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800">
                {editingRecord ? "Edit Service Record" : "Log Service Hours"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="recordForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Student Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.studentName}
                      onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="e.g. John Kamau"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Grade</label>
                    <input 
                      type="text" 
                      required
                      value={formData.grade}
                      onChange={(e) => setFormData({...formData, grade: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      placeholder="e.g. 11A"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Activity Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="e.g. Community Clean-up"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Date</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Hours Completed</label>
                    <input 
                      type="number" 
                      required
                      min="0.5"
                      step="0.5"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: Number(e.target.value)})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Supervisor (Staff)</label>
                  <input 
                    type="text" 
                    required
                    value={formData.supervisorName}
                    onChange={(e) => setFormData({...formData, supervisorName: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="e.g. Mr. Smith"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="recordForm"
                className="px-6 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
              >
                {editingRecord ? "Save Changes" : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
