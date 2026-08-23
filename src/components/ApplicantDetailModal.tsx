import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, Heart, Shield, GraduationCap, DollarSign, FileText } from 'lucide-react';
import { deleteApplication } from '@/app/actions/applications';
import { useRouter } from 'next/navigation';

interface ApplicantDetailModalProps {
  applicant: any;
  onClose: () => void;
  onRefresh?: () => void;
}

export function ApplicantDetailModal({ applicant, onClose, onRefresh }: ApplicantDetailModalProps) {
  const formData = applicant.formData || {};
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this application?")) {
      setIsDeleting(true);
      const res = await deleteApplication(applicant.id);
      setIsDeleting(false);
      if (res.success) {
        if (onRefresh) onRefresh();
        else router.refresh();
        onClose();
      } else {
        alert("Failed to delete: " + res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 sm:p-0 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl h-full sm:h-[95vh] sm:rounded-l-3xl shadow-2xl flex flex-col animate-slide-left overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 p-6 text-white shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-black shadow-inner">
                {applicant.initials}
              </div>
              <div>
                <h2 className="text-2xl font-black">{applicant.name}</h2>
                <div className="flex items-center gap-2 text-primary-100 mt-1 text-sm font-bold">
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg">#{applicant.admNo}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg">{applicant.grade}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => alert("Edit not implemented yet")} className="px-3 py-1.5 bg-amber-500/20 text-amber-100 hover:bg-amber-500/40 rounded-xl transition text-xs font-bold uppercase tracking-wider">
                Edit
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 bg-red-500/20 text-red-100 hover:bg-red-500/40 disabled:opacity-50 rounded-xl transition text-xs font-bold uppercase tracking-wider"
              >
                {isDeleting ? '...' : 'Delete'}
              </button>
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
          
          {/* Basic & Admission */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4 border-b border-slate-200 pb-2">
              <User className="w-5 h-5 text-primary-600" /> Basic Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date of Birth</p>
                <p className="font-bold text-slate-700">{formData.dob || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                <p className="font-bold text-slate-700">{formData.gender === 'M' ? 'Male' : formData.gender === 'F' ? 'Female' : 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nationality</p>
                <p className="font-bold text-slate-700">{formData.nationality || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Previous School</p>
                <p className="font-bold text-slate-700">{formData.previousSchool || 'N/A'}</p>
              </div>
            </div>
          </section>

          {/* Parents & Contacts */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4 border-b border-slate-200 pb-2">
              <Shield className="w-5 h-5 text-amber-500" /> Family & Contacts
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50">
                <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Primary Guardian</p>
                <p className="font-bold text-slate-800">{applicant.parent}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Phone className="w-4 h-4" /> {applicant.phone || 'N/A'}
                  </div>
                  {applicant.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Mail className="w-4 h-4" /> {applicant.email}
                    </div>
                  )}
                </div>
              </div>
              {formData.emergencyContactName && (
                <div className="p-4 bg-amber-50/50">
                  <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Emergency Contact</p>
                  <p className="font-bold text-slate-800">{formData.emergencyContactName}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mt-1">
                    <Phone className="w-4 h-4" /> {formData.emergencyPhone}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Health & Medical */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4 border-b border-slate-200 pb-2">
              <Heart className="w-5 h-5 text-rose-500" /> Health Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Blood Group</p>
                <p className="font-bold text-rose-700">{formData.bloodGroup || 'N/A'}</p>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-100">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Allergies</p>
                <p className="font-bold text-rose-700">{formData.allergies || 'None'}</p>
              </div>
            </div>
            {(formData.medicalConditions || formData.doctorName) && (
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
                {formData.medicalConditions && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Conditions</p>
                    <p className="font-bold text-slate-700 text-sm mt-1">{formData.medicalConditions}</p>
                  </div>
                )}
                {formData.doctorName && (
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Family Doctor</p>
                    <p className="font-bold text-slate-700 text-sm mt-1">{formData.doctorName} ({formData.doctorPhone})</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Logistics & Admin */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-800 mb-4 border-b border-slate-200 pb-2">
              <MapPin className="w-5 h-5 text-emerald-500" /> Logistics & Admin
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transport</p>
                <p className="font-bold text-slate-700">{formData.usesTransport || 'N/A'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Type</p>
                <p className="font-bold text-slate-700">
                  {formData.studentType || 'Day'}
                  {formData.studentType === 'Boarding Student' && formData.boardingDorm && (
                    <span className="block text-xs text-slate-500 mt-1 font-medium">
                      {formData.boardingDorm} • Room {formData.boardingRoom || 'TBA'} • {formData.boardingPlan}
                    </span>
                  )}
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee Plan</p>
                <p className="font-bold text-slate-700">{formData.feePlan || 'Standard Tuition'}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applied Date</p>
                <p className="font-bold text-slate-700">{applicant.date}</p>
              </div>
            </div>
          </section>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide-left {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-left {
          animation: slide-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
