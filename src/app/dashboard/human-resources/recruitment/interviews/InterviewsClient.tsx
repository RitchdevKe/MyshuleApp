"use client";

import React, { useState, useMemo } from "react";
import { CalendarDays, Plus, Clock, MapPin, Video, User, CheckCircle2, XCircle, Trash2, Edit } from "lucide-react";
import { createInterview, updateInterview, deleteInterview } from "./actions";
import { useRouter } from "next/navigation";

type InterviewStatus = "Scheduled" | "Completed" | "Canceled" | "Passed" | "Rejected";

type InterviewData = {
  id: string;
  applicantId: string;
  staffId: string;
  scheduledDate: Date;
  status: string;
  applicant: { id: string, firstName: string, lastName: string, jobOpening: { id: string, title: string } };
  staff: { id: string, firstName: string, lastName: string };
};

type ApplicantData = {
  id: string;
  firstName: string;
  lastName: string;
  jobOpening: { id: string, title: string };
};

type StaffData = {
  id: string;
  firstName: string;
  lastName: string;
};

export default function InterviewsClient({ 
  initialInterviews, 
  applicants, 
  staff 
}: { 
  initialInterviews: InterviewData[], 
  applicants: ApplicantData[], 
  staff: StaffData[] 
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past">("Upcoming");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    applicantId: applicants[0]?.id || "",
    staffId: staff[0]?.id || "",
    scheduledDate: "",
    status: "Scheduled" as InterviewStatus
  });

  const scheduledCount = useMemo(() => initialInterviews.filter(i => i.status === "Scheduled").length, [initialInterviews]);
  const completedCount = useMemo(() => initialInterviews.filter(i => i.status === "Passed" || i.status === "Completed").length, [initialInterviews]);
  const cancelledCount = useMemo(() => initialInterviews.filter(i => i.status === "Rejected" || i.status === "Canceled").length, [initialInterviews]);

  const filteredInterviews = useMemo(() => {
    return initialInterviews.filter(i => {
      if (activeTab === "Upcoming") return i.status === "Scheduled";
      return i.status === "Passed" || i.status === "Rejected" || i.status === "Canceled" || i.status === "Completed";
    });
  }, [initialInterviews, activeTab]);

  const handleOpenModal = (interview?: InterviewData) => {
    if (interview) {
      setEditingId(interview.id);
      
      const dateStr = new Date(interview.scheduledDate).toISOString().slice(0, 16);

      setFormData({
        applicantId: interview.applicantId,
        staffId: interview.staffId,
        scheduledDate: dateStr,
        status: interview.status as InterviewStatus
      });
    } else {
      setEditingId(null);
      setFormData({
        applicantId: applicants[0]?.id || "",
        staffId: staff[0]?.id || "",
        scheduledDate: "",
        status: "Scheduled"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateInterview(editingId, {
          ...formData,
          scheduledDate: new Date(formData.scheduledDate)
        });
      } else {
        await createInterview({
          ...formData,
          scheduledDate: new Date(formData.scheduledDate)
        });
      }
      handleCloseModal();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error saving interview");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: InterviewStatus) => {
    try {
      await updateInterview(id, { status: newStatus });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await deleteInterview(id);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4">
         <h2 className="text-lg font-black text-slate-800 ml-2">Interview Schedule</h2>
         <div className="flex gap-3">
            <div className="flex bg-slate-100 rounded-xl p-1">
               <button 
                onClick={() => setActiveTab("Upcoming")}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg ${activeTab === "Upcoming" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
               >
                 Upcoming
               </button>
               <button 
                onClick={() => setActiveTab("Past")}
                className={`px-4 py-1.5 text-sm font-bold rounded-lg ${activeTab === "Past" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
               >
                 Past
               </button>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20"
            >
              <Plus className="w-4 h-4" />
              Schedule Interview
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Calendar/Date Picker Placeholder Area */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center">
               <h3 className="font-bold text-slate-800 mb-4">Select Date</h3>
               {/* Mock Calendar Grid */}
               <div className="grid grid-cols-7 gap-1 text-sm mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                     <div key={day} className="text-xs font-bold text-slate-400 py-1">{day}</div>
                  ))}
                  {Array.from({length: 31}).map((_, i) => (
                     <button key={i} className={`p-2 rounded-xl flex items-center justify-center font-medium ${i === 14 ? 'bg-secondary-500 text-white shadow-sm' : 'hover:bg-slate-100 text-slate-700'}`}>
                        {i + 1}
                     </button>
                  ))}
               </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6">
               <h3 className="font-bold text-slate-800 mb-4">Database Stats</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-500">Scheduled</span>
                     <span className="text-sm font-bold text-slate-800">{scheduledCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-500">Completed / Passed</span>
                     <span className="text-sm font-bold text-emerald-600">{completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-500">Cancellations / Rejections</span>
                     <span className="text-sm font-bold text-rose-500">{cancelledCount}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Schedule List */}
         <div className="lg:col-span-2 space-y-4">
            {filteredInterviews.length === 0 ? (
               <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200/50">
                  <p className="text-slate-500 font-medium">No interviews found.</p>
               </div>
            ) : filteredInterviews.map((interview) => (
               <div key={interview.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                     <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
                        <User className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-slate-800">{interview.applicant.firstName} {interview.applicant.lastName}</h4>
                        <p className="text-sm font-bold text-primary-600 mb-2">{interview.applicant.jobOpening?.title || 'No Role'}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(interview.scheduledDate).toLocaleString()}
                           </div>
                           <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-700">Interviewer:</span> {interview.staff.firstName} {interview.staff.lastName}
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                     <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          interview.status === 'Scheduled' ? 'bg-amber-50 text-amber-600' : 
                          (interview.status === 'Passed' || interview.status === 'Completed') ? 'bg-emerald-50 text-emerald-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                           {interview.status}
                        </span>
                     </div>
                     <div className="flex items-center gap-2 flex-wrap justify-end">
                        {activeTab === "Upcoming" && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(interview.id, "Passed")}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors tooltip-trigger" 
                              title="Mark as Passed"
                            >
                               <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(interview.id, "Rejected")}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors tooltip-trigger" 
                              title="Mark as Rejected"
                            >
                               <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleOpenModal(interview)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors tooltip-trigger" 
                          title="Edit Interview"
                        >
                           <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(interview.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors tooltip-trigger" 
                          title="Delete Interview"
                        >
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Modal for Scheduling/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">
                {editingId ? "Edit Interview" : "Schedule Interview"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto">
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Candidate</label>
                  <select 
                    required
                    value={formData.applicantId}
                    onChange={(e) => setFormData({...formData, applicantId: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a Candidate...</option>
                    {applicants.map(app => (
                      <option key={app.id} value={app.id}>
                        {app.firstName} {app.lastName} - {app.jobOpening?.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as InterviewStatus})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Passed">Passed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Interviewer (Staff)</label>
                  <select 
                    required
                    value={formData.staffId}
                    onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select an Interviewer...</option>
                    {staff.map(st => (
                      <option key={st.id} value={st.id}>{st.firstName} {st.lastName}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 transition-colors"
                  >
                    {editingId ? "Save Changes" : "Schedule"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
