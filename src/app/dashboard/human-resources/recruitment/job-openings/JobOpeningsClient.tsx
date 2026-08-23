"use client";

import React, { useState, useMemo } from "react";
import { Briefcase, Users, MapPin, Clock, ArrowRight, Activity, Plus, X, Trash2, Edit } from "lucide-react";
import { createJobOpening, updateJobOpening, deleteJobOpening } from "./actions";

type Applicant = {
  id: string;
  status: string;
};

type Job = {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  status: string;
  createdAt: Date;
  applicants: Applicant[];
};

export default function JobOpeningsClient({ initialJobOpenings }: { initialJobOpenings: any[] }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobOpenings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Job>>({
    title: "",
    department: "Academics",
    type: "Full-Time",
    location: "",
    status: "Draft"
  });

  const getDaysOpen = (createdAt: Date, status: string) => {
    if (status !== 'Active') return 0;
    const diffTime = Math.abs(new Date().getTime() - new Date(createdAt).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgress = (applicants: Applicant[]) => {
    if (!applicants || applicants.length === 0) return 0;
    const hired = applicants.filter(a => a.status === 'Hired').length;
    const interviewing = applicants.filter(a => a.status === 'Interviewing').length;
    const offered = applicants.filter(a => a.status === 'Offered').length;
    
    if (hired > 0) return 100;
    if (offered > 0) return 80;
    if (interviewing > 0) return 50;
    return 20;
  };

  const capitalize = (s: string) => {
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const activeOpeningsCount = useMemo(() => jobs.filter(j => j.status === 'Active').length, [jobs]);
  const totalApplicantsCount = useMemo(() => jobs.reduce((sum, j) => sum + (j.applicants?.length || 0), 0), [jobs]);
  
  const avgDaysOpen = useMemo(() => {
    const activeJobs = jobs.filter(j => j.status === 'Active');
    if (activeJobs.length === 0) return 0;
    const totalDays = activeJobs.reduce((sum, j) => sum + getDaysOpen(j.createdAt, j.status), 0);
    return Math.round(totalDays / activeJobs.length);
  }, [jobs]);

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        department: capitalize(job.department),
        type: job.type,
        location: job.location,
        status: job.status
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: "",
        department: "Academics",
        type: "Full-Time",
        location: "",
        status: "Draft"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (editingJob) {
      const res = await updateJobOpening(editingJob.id, formData as any);
      if (res.success) {
        setJobs(jobs.map(j => j.id === editingJob.id ? { ...j, ...res.data, applicants: j.applicants } : j));
      }
    } else {
      const res = await createJobOpening(formData as any);
      if (res.success) {
        setJobs([{ ...res.data, applicants: [] }, ...jobs]);
      }
    }
    setIsSaving(false);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job opening?")) return;
    const res = await deleteJobOpening(id);
    if (res.success) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black text-slate-800">Job Postings Manager</h2>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Job Posting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
             <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Openings</p>
            <p className="text-3xl font-black text-slate-800">{activeOpeningsCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary-50 rounded-2xl text-primary-600">
             <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Applicants</p>
            <p className="text-3xl font-black text-slate-800">{totalApplicantsCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-secondary-50 rounded-2xl text-secondary-600">
             <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Avg Time Open</p>
            <p className="text-3xl font-black text-slate-800">{avgDaysOpen} <span className="text-lg text-slate-500 font-bold">days</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : job.status === 'Draft' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-500">{capitalize(job.department)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(job)} 
                  className="p-2 text-slate-400 hover:text-primary-900 bg-slate-50 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(job.id)} 
                  className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {job.type}
               </div>
               <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.location}
               </div>
            </div>

            <div className="flex items-center gap-6 mb-6 p-4 bg-slate-50/50 rounded-2xl">
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    job.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                    job.status === 'Draft' ? 'bg-amber-100 text-amber-800' : 
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {job.status}
                  </span>
              </div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Days Open</p>
                  <p className="text-sm font-bold text-slate-700">{getDaysOpen(job.createdAt, job.status)}</p>
              </div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pipeline</p>
                  <div className="flex items-center gap-2">
                     <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${job.status === 'Active' ? 'bg-emerald-500' : job.status === 'Closed' ? 'bg-slate-400' : 'bg-primary-500'}`} style={{ width: `${getProgress(job.applicants)}%` }}></div>
                     </div>
                     <span className="text-xs font-bold text-slate-600">{getProgress(job.applicants)}%</span>
                  </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <Users className="w-4 h-4 text-slate-400" />
                  {job.applicants?.length || 0} Applicants
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-primary-900/20">
                  Manage Pipeline
                  <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="col-span-1 md:col-span-2 py-12 text-center text-slate-500 font-medium">
            No job openings found. Click "New Job Posting" to create one.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">{editingJob ? "Edit Job Posting" : "New Job Posting"}</h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. Senior Mathematics Teacher"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={formData.department || ""}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                >
                  <option value="Academics">Academics</option>
                  <option value="Administration">Administration</option>
                  <option value="Transport">Transport</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type || ""}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status || ""}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. Main Campus"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? "Saving..." : editingJob ? "Save Changes" : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
