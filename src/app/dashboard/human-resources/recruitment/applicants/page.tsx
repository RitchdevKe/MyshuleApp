"use client";

import React, { useState, useEffect } from "react";
import { Filter, Search, Mail, Phone, ArrowRight, Plus, Trash2, Edit } from "lucide-react";
import { getApplicants, createApplicant, updateApplicant, deleteApplicant, updateApplicantStage, getJobOpenings, ensureDefaultJobOpenings } from "./actions";

type StageName = "Applied" | "Reviewing" | "Interviewing" | "Offered" | "Hired" | "Rejected";

const STAGE_NAMES: StageName[] = ["Applied", "Reviewing", "Interviewing", "Offered"];

interface JobOpeningType {
  id: string;
  title: string;
}

interface ApplicantType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  jobOpeningId: string;
  status: string;
  createdAt: string | Date;
  jobOpening?: JobOpeningType;
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<ApplicantType[]>([]);
  const [jobOpenings, setJobOpenings] = useState<JobOpeningType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ApplicantType>>({});

  const loadData = async () => {
    await ensureDefaultJobOpenings();
    const [apps, jobs] = await Promise.all([
      getApplicants(),
      getJobOpenings()
    ]);
    setApplicants(apps);
    setJobOpenings(jobs);
    window.dispatchEvent(new Event("hr_applicants_updated"));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData().then(() => setIsLoaded(true));
  }, []);

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.jobOpeningId) return;
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateApplicant(editingId, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          jobOpeningId: formData.jobOpeningId,
          status: formData.status || "Applied",
        });
      } else {
        await createApplicant({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          jobOpeningId: formData.jobOpeningId,
          status: formData.status || "Applied",
        });
      }
      
      await loadData();
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this applicant?")) {
      await deleteApplicant(id);
      await loadData();
    }
  };

  const handleEdit = (app: ApplicantType) => {
    setFormData({
      firstName: app.firstName,
      lastName: app.lastName,
      email: app.email,
      phone: app.phone,
      jobOpeningId: app.jobOpeningId,
      status: app.status,
    });
    setEditingId(app.id);
    setIsFormOpen(true);
  };

  const moveStage = async (id: string, newStage: StageName) => {
    // Optimistic update
    setApplicants(apps => apps.map(a => a.id === id ? { ...a, status: newStage } : a));
    await updateApplicantStage(id, newStage);
    window.dispatchEvent(new Event("hr_applicants_updated"));
  };

  const filteredApplicants = applicants.filter(a => {
    const fullName = `${a.firstName} ${a.lastName}`.toLowerCase();
    const roleName = a.jobOpening?.title?.toLowerCase() || "";
    const matchesSearch = fullName.includes(search.toLowerCase()) || roleName.includes(search.toLowerCase());
    const matchesRole = filterRole === "All Roles" || a.jobOpening?.id === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">Loading applicants...</div>;

  return (
    <div className="space-y-6">
      {/* Top Summary Card driven by database state */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
             <Filter className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Apps</p>
            <p className="text-2xl font-black text-slate-800">{applicants.length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
             <Search className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reviewing</p>
            <p className="text-2xl font-black text-slate-800">{applicants.filter(a => a.status === 'Reviewing').length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
             <Phone className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interviewing</p>
            <p className="text-2xl font-black text-slate-800">{applicants.filter(a => a.status === 'Interviewing').length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
             <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Offered</p>
            <p className="text-2xl font-black text-slate-800">{applicants.filter(a => a.status === 'Offered').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer w-full md:w-auto"
            >
               <option value="All Roles">All Roles</option>
               {jobOpenings.map(j => (
                 <option key={j.id} value={j.id}>{j.title}</option>
               ))}
            </select>
            <button 
              onClick={() => { setEditingId(null); setFormData({}); setIsFormOpen(true); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm w-full md:w-auto"
            >
               <Plus className="w-4 h-4" />
               Add Applicant
            </button>
         </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-800 mb-4">{editingId ? "Edit Applicant" : "Add Applicant"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName || ""} 
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName || ""} 
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email || ""} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                <input 
                  type="text" 
                  value={formData.phone || ""} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Job Role</label>
                <select 
                  value={formData.jobOpeningId || ""}
                  onChange={(e) => setFormData({...formData, jobOpeningId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select a role...</option>
                  {jobOpenings.map(j => (
                    <option key={j.id} value={j.id}>{j.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Stage</label>
                <select 
                  value={formData.status || "Applied"}
                  onChange={(e) => setFormData({...formData, status: e.target.value as StageName})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  {STAGE_NAMES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setIsFormOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.firstName || !formData.lastName || !formData.jobOpeningId || isSubmitting}
                className="flex-1 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
         {STAGE_NAMES.map((stageName, i) => {
           const stageApplicants = filteredApplicants.filter(a => a.status === stageName);
           return (
           <div key={i} className="min-w-[320px] max-w-[320px] flex-shrink-0 flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                 <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    {stageName}
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{stageApplicants.length}</span>
                 </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                 {stageApplicants.map((applicant) => (
                    <div key={applicant.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all cursor-grab group">
                       <div className="flex justify-between items-start mb-3">
                          <div>
                             <h4 className="font-bold text-slate-800">{applicant.firstName} {applicant.lastName}</h4>
                             <p className="text-xs font-medium text-slate-500">{applicant.jobOpening?.title}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(applicant)} className="p-1.5 text-slate-400 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                               <Edit className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(applicant.id)} className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                             <svg key={star} className={`w-3.5 h-3.5 ${star <= 4 ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                             </svg>
                          ))}
                       </div>

                       <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                          <span>{new Date(applicant.createdAt).toLocaleDateString()}</span>
                          <div className="flex gap-2">
                             <a href={`mailto:${applicant.email}`} className="p-1.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                                <Mail className="w-3.5 h-3.5" />
                             </a>
                             {applicant.phone && (
                               <a href={`tel:${applicant.phone}`} className="p-1.5 bg-slate-50 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                                  <Phone className="w-3.5 h-3.5" />
                               </a>
                             )}
                          </div>
                       </div>
                       
                       <div className="mt-4 pt-4 border-t border-slate-100 hidden group-hover:flex items-center justify-between">
                          <select 
                            value=""
                            onChange={(e) => { if(e.target.value) moveStage(applicant.id, e.target.value as StageName) }}
                            className="text-xs font-bold text-slate-500 bg-transparent cursor-pointer hover:text-slate-800 focus:outline-none"
                          >
                            <option value="" disabled>Move to...</option>
                            {STAGE_NAMES.filter(s => s !== stageName).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-900 hover:bg-primary-800 text-white rounded-lg text-xs font-bold transition-colors">
                             Review
                             <ArrowRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 ))}
                 
                 {stageApplicants.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                       <p className="text-sm font-medium text-slate-400">No applicants</p>
                    </div>
                 )}
              </div>
           </div>
         )})}
      </div>
    </div>
  );
}

