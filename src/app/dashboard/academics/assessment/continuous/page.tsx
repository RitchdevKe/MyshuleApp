"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, MoreHorizontal, Calendar, ArrowUpRight, Clock, BookOpen, FileText, Edit, Trash2, X } from "lucide-react";

type AssessmentStatus = "Draft" | "Published" | "Scheduled";

type Assessment = {
  id: string;
  name: string;
  type: string;
  date: string;
  className: string;
  subject: string;
  teacher: string;
  status: AssessmentStatus;
  avgScore: number | null;
};

const CLASSES = ["Grade 4", "Grade 4 North", "Grade 5", "Grade 6", "All Grades"];
const SUBJECTS = ["Mathematics", "English", "Science", "History"];
const TEACHERS = ["Mr. Smith", "Mrs. Johnson", "Ms. Davis", "Mr. Wilson"];
const TYPES = ["Main Exam", "CAT", "Quiz"];

const initialData: Assessment[] = [
  { id: "EXM-001", name: "Mid Term 2 Exam", type: "Main Exam", date: "2026-06-15", className: "Grade 4", subject: "Mathematics", teacher: "Mr. Smith", status: "Published", avgScore: 68 },
  { id: "EXM-002", name: "Mathematics CAT 1", type: "CAT", date: "2026-05-20", className: "Grade 4 North", subject: "Mathematics", teacher: "Mr. Smith", status: "Published", avgScore: 72 },
  { id: "EXM-003", name: "English Reading Quiz", type: "Quiz", date: "2026-07-02", className: "Grade 5", subject: "English", teacher: "Mrs. Johnson", status: "Draft", avgScore: null },
  { id: "EXM-004", name: "End Term 2 Exam", type: "Main Exam", date: "2026-09-28", className: "All Grades", subject: "Science", teacher: "Ms. Davis", status: "Scheduled", avgScore: null },
];

export default function ContinuousAssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [termFilter, setTermFilter] = useState("All Terms");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState<Partial<Assessment>>({});

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Published": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Scheduled": return "bg-blue-100/80 text-blue-700 border-blue-200";
      case "Draft": return "bg-slate-100/80 text-slate-700 border-slate-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const handleOpenModal = (assessment?: Assessment) => {
    if (assessment) {
      setEditingAssessment(assessment);
      setFormData(assessment);
    } else {
      setEditingAssessment(null);
      setFormData({
        name: "",
        type: "Main Exam",
        date: new Date().toISOString().split('T')[0],
        className: "Grade 4",
        subject: "Mathematics",
        teacher: "Mr. Smith",
        status: "Draft",
        avgScore: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAssessment(null);
    setFormData({});
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssessment) {
      setAssessments(assessments.map(a => a.id === editingAssessment.id ? { ...a, ...formData } as Assessment : a));
    } else {
      const newAssessment: Assessment = {
        ...formData,
        id: `EXM-00${assessments.length + 1}`,
      } as Assessment;
      setAssessments([...assessments, newAssessment]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this assessment?")) {
      setAssessments(assessments.filter(a => a.id !== id));
    }
  };

  // KPIs
  const totalAssessments = assessments.length;
  
  const assessmentsWithScore = assessments.filter(a => a.avgScore !== null);
  const averageScore = assessmentsWithScore.length > 0 
    ? (assessmentsWithScore.reduce((acc, a) => acc + (a.avgScore || 0), 0) / assessmentsWithScore.length).toFixed(1)
    : "0.0";
    
  const upcomingAssessment = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = assessments
      .filter(a => a.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [assessments]);

  const daysUntilUpcoming = upcomingAssessment 
    ? Math.ceil((new Date(upcomingAssessment.date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : 0;

  const filteredAssessments = assessments.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-primary-100 text-primary-900 rounded-2xl">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg">
              <ArrowUpRight className="w-3.5 h-3.5" /> Active
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Total Assessments</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{totalAssessments}</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Average Score</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{averageScore}%</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Upcoming</p>
          <h3 className="text-xl font-black text-slate-800 tracking-tight relative z-10 truncate" title={upcomingAssessment?.name || "None"}>
            {upcomingAssessment ? upcomingAssessment.name : "None Scheduled"}
          </h3>
          {upcomingAssessment && (
             <p className="text-xs font-bold text-amber-600 mt-1">In {daysUntilUpcoming > 0 ? daysUntilUpcoming : 0} days</p>
          )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search exams & CATs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={termFilter}
              onChange={(e) => setTermFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Terms</option>
              <option>Term 1</option>
              <option>Term 2</option>
            </select>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Exam
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Assessment Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Context</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Avg. Score</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No assessments found.
                  </td>
                </tr>
              ) : filteredAssessments.map((row) => (
                <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{row.name}</span>
                      <span className="text-xs font-bold text-slate-400">{row.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{row.type}</td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{row.className} • {row.subject}</span>
                      <span className="text-xs font-medium text-slate-500">{row.teacher}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 font-bold text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {row.date}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-800">{row.avgScore !== null ? `${row.avgScore}%` : '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">
                {editingAssessment ? 'Edit Assessment' : 'New Assessment'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Assessment Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Type</label>
                  <select 
                    value={formData.type || ''}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  >
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.date || ''}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Class</label>
                  <select 
                    value={formData.className || ''}
                    onChange={(e) => setFormData({...formData, className: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  >
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <select 
                    value={formData.subject || ''}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Teacher</label>
                  <select 
                    value={formData.teacher || ''}
                    onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  >
                    {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Status</label>
                  <select 
                    value={formData.status || ''}
                    onChange={(e) => setFormData({...formData, status: e.target.value as AssessmentStatus})}
                    className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Average Score (%) (Optional)</label>
                <input 
                  type="number" 
                  min="0"
                  max="100"
                  value={formData.avgScore === null ? '' : formData.avgScore || ''}
                  onChange={(e) => setFormData({...formData, avgScore: e.target.value === '' ? null : Number(e.target.value)})}
                  className="w-full px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
                >
                  {editingAssessment ? 'Save Changes' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}