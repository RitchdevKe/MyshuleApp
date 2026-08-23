import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  School, 
  Users, 
  Heart, 
  DollarSign, 
  FileText, 
  Download,
  Flame,
  Award,
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import { Student } from '../types.ts';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface StudentProfileDossierProps {
  student: Student;
  onClose: () => void;
  onEdit?: () => void;
}

export function StudentProfileDossier({ student, onClose, onEdit }: StudentProfileDossierProps) {
  const { currency } = useCurrency();

  const [activeSubTab, setActiveSubTab] = useState<'bio' | 'parents' | 'academics' | 'medical' | 'finance' | 'docs'>('bio');

  const subTabs = [
    { id: 'bio' as const, label: 'Bio & Admission', icon: User },
    { id: 'parents' as const, label: 'Family & Contact', icon: Users },
    { id: 'academics' as const, label: 'Academics', icon: Award },
    { id: 'medical' as const, label: 'Medical', icon: Heart },
    { id: 'finance' as const, label: 'Logistics & Finance', icon: DollarSign },
    { id: 'docs' as const, label: 'Docs & Compliance', icon: FileSpreadsheet }
  ];

  const handleExportDossierSim = () => {
    toast.success(`Triggered download of comprehensive student dossier details for ${student.name} (${student.id})! Saved as PDF to system downloads.`);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-2xl overflow-hidden flex flex-col font-sans text-slate-800">
        
        {/* Header bar and Close */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full bg-[var(--color-secondary)] text-white text-[16px] font-bold uppercase tracking-wider tabular-nums">
              Student Record Dossier
            </span>
            <span className="text-[17px] text-slate-400 font-bold tabular-nums">/ ID: {student.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master details section splitting (Profile info panel Left | Tabs content Right) */}
        <div className="flex flex-1 min-h-0 overflow-hidden flex-col md:flex-row">
          
          {/* Left panel: Info Panel */}
          <div className="w-full md:w-72 border-r border-slate-100 bg-slate-50/50 p-6 flex flex-col items-center text-center shrink-0 space-y-6 overflow-y-auto">
            
            {/* Avatar inside circle */}
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-[var(--color-secondary)] text-white border-4 border-white shadow-xl flex items-center justify-center text-3xl font-bold select-none">
                {student.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-2xl text-slate-900 leading-tight">{student.name}</h3>
                <span className="text-[16px] font-bold text-slate-500 tabular-nums block mt-1 tracking-wider uppercase bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 px-2 py-0.5 rounded-full">
                  Grade F{student.form} ({student.stream})
                </span>
              </div>
            </div>

            {/* Quick Metrics list */}
            <div className="w-full bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-2 rounded-2xl grid grid-cols-2 gap-3.5 text-left shadow-sm">
              <div>
                <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider block">Status</span>
                <span className={`px-2 py-0.5 rounded text-[14px] font-bold uppercase tracking-wider inline-block mt-0.5 ${
                  student.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {student.status || 'Active'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider block">Joined Date</span>
                <span className="font-bold text-[16px] text-slate-800 block mt-0.5 tabular-nums">{student.admissionDate || '2026-05-27'}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 col-span-2 flex justify-between items-center text-lg">
                <div>
                  <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider block">Attendance</span>
                  <span className="font-bold text-slate-800 mt-0.5 text-xl tabular-nums leading-none">{student.attendancePercentage || 95}%</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wider block text-right">GPA</span>
                  <span className="font-bold text-emerald-600 mt-0.5 text-xl tabular-nums leading-none block text-right">98%</span>
                </div>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="w-full space-y-2 pt-4">
              <button
                onClick={handleExportDossierSim}
                className="w-full py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] text-white text-[17px] font-bold rounded-xl shadow-md shadow-[var(--color-secondary)]/15 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Export Dossier
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="w-full py-2 bg-white hover:bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-700 text-[17px] font-bold rounded-xl transition cursor-pointer"
                >
                  Edit Student Details
                </button>
              )}
            </div>
          </div>

          {/* Right panel: Tabs with specific details */}
          <div className="flex-1 flex flex-col min-w-0 bg-white">
            
            {/* Tabs Bar triggers */}
            <div className="px-6 border-b border-slate-100 flex items-center gap-1 bg-slate-50/20 overflow-x-auto shrink-0 scrollbar-hide py-1">
              {subTabs.map(t => {
                const IsActive = activeSubTab === t.id;
                const IconComp = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveSubTab(t.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-3 text-lg font-bold whitespace-nowrap border-b-2 hover:text-slate-900 transition mt-1 select-none cursor-pointer ${
                      IsActive 
                        ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]' 
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${IsActive ? 'text-[var(--color-secondary)]' : 'text-slate-400'}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab content view */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 text-lg text-slate-600">
              
              {/* BIO & ADMISSIONS */}
              {activeSubTab === 'bio' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border border-slate-200/60 rounded-3xl p-5 space-y-4">
                    <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <User className="w-4 h-4 text-[var(--color-secondary)]" /> Personal Identification
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Full Name</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Preferred Name</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.name.split(' ')[0]}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Gender</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.gender === 'M' ? 'Male' : 'Female'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Date of Birth</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">{student.dob || '2010-01-01'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Nationality</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.nationality || 'Kenyan'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">National ID / Passport</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">{student.nationalId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200/60 rounded-3xl p-5 space-y-4">
                    <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <School className="w-4 h-4 text-[var(--color-secondary)]" /> Enrollment Context
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Admission Date</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">{student.admissionDate || '2026-05-27'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Academic Year</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">2026</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Assigned Class / Grade</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">Grade F{student.form}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Stream Section</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.stream}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAMILY & CONTACT */}
              {activeSubTab === 'parents' && (
                <div className="space-y-6 animate-fade-in border border-slate-200/60 rounded-3xl p-5">
                  <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Users className="w-4 h-4 text-[var(--color-secondary)]" /> Family Contacts & Guardians
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Primary Guardian</span>
                        <p className="font-bold text-slate-800 text-xl mt-0.5">{student.guardianName || 'Bernard Kiprop'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Relationship</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.guardianRelation || 'Father'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Mobile Phone</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">{student.guardianPhone || '+254 720 192837'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Guardian Email</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">{student.guardianEmail || 'parent@karegasec.co.ke'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Occupation</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.guardianOccupation || 'Agronomist / Consultant'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Home Address</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.address || 'House 22-A, Eldoret South'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACADEMICS */}
              {activeSubTab === 'academics' && (
                <div className="space-y-6 animate-fade-in border border-slate-200/60 rounded-3xl p-5">
                  <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Award className="w-4 h-4 text-[var(--color-secondary)]" /> Academic Assessment & Progress
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-slate-400 font-bold block text-[15px] tracking-wider uppercase">Class rank</span>
                      <span className="text-slate-800 text-3xl font-bold tabular-nums block mt-1">#4 / 45</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-slate-400 font-bold block text-[15px] tracking-wider uppercase">Term Performance</span>
                      <span className="text-emerald-500 text-3xl font-bold tabular-nums block mt-1">A- Excellent</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <span className="text-slate-400 font-bold block text-[15px] tracking-wider uppercase">Average Score</span>
                      <span className="text-slate-800 text-3xl font-bold tabular-nums block mt-1">78.4%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="block font-bold text-slate-500 uppercase text-[15px] tracking-wider">Historical Assessment Sheets</span>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-[15px] text-slate-500 uppercase tabular-nums">
                          <th className="py-2.5 px-3">Academic Period</th>
                          <th className="py-2.5 px-1 font-semibold">Grades Profile</th>
                          <th className="py-2.5 px-1 font-semibold text-right">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">2026 Term 1 End-Term Exam</td>
                          <td className="py-2.5 px-1 tabular-nums font-bold text-emerald-600">76.5 (B+)</td>
                          <td className="py-2.5 px-1 text-right font-medium">Strong progress in math</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">2025 Term 3 End-Term Exam</td>
                          <td className="py-2.5 px-1 tabular-nums font-bold text-indigo-500">78.0 (A-)</td>
                          <td className="py-2.5 px-1 text-right font-medium">Excellent overall marks</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MEDICAL */}
              {activeSubTab === 'medical' && (
                <div className="space-y-6 animate-fade-in border border-slate-200/60 rounded-3xl p-5">
                  <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Heart className="w-4 h-4 text-[var(--color-secondary)]" /> Medical Profile
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Blood Group</span>
                      <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.bloodGroup || 'O+'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Allergies Profile</span>
                      <p className="font-bold text-slate-800 text-[17px] mt-0.5 text-amber-600">{student.allergies || 'None recorded'}</p>
                    </div>
                    <div className="col-span-2 bg-slate-50 p-4 rounded-xl">
                      <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Chronic Conditions</span>
                      <p className="font-bold text-slate-800 text-[17px] mt-1">{student.medicalConditions || 'None configured'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Family Physician</span>
                      <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.doctorName || 'Dr. Arthur Chep'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Doctor Phone Contact</span>
                      <p className="font-bold text-slate-800 text-[17px] mt-0.5 tabular-nums">{student.doctorPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* LOGISTICS & FINANCE */}
              {activeSubTab === 'finance' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border border-slate-200/60 rounded-3xl p-5 space-y-4">
                    <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                      <DollarSign className="w-4 h-4 text-[var(--color-secondary)]" /> Financial Ledger
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                        <span className="text-slate-400 text-[14px] font-bold uppercase tracking-wider block">Total Billed</span>
                        <span className="font-bold text-xl text-slate-800 block mt-1 tabular-nums">{student.totalFees || 45000} ${currency}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                        <span className="text-slate-400 text-[14px] font-bold uppercase tracking-wider block">Amount Paid</span>
                        <span className="font-bold text-xl text-emerald-600 block mt-1 tabular-nums">{((student.totalFees || 45000) - (student.feeBalance || 0))} ${currency}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
                        <span className="text-slate-400 text-[14px] font-bold uppercase tracking-wider block">Outstanding Cash</span>
                        <span className="font-bold text-xl text-amber-600 block mt-1 tabular-nums">{student.feeBalance || 0} ${currency}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Active Fee Plan</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.feePlan || 'Standard Tuition'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Billing Cycle</span>
                        <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.paymentFreq || 'Termly Options'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200/60 rounded-3xl p-5 space-y-2">
                    <h4 className="font-bold text-lg text-slate-905 pb-1 block">Logistics Options</h4>
                    <span className="text-slate-400 uppercase text-[15px] tracking-wider font-bold">Uses School Transport?</span>
                    <p className="font-bold text-slate-800 text-[17px] mt-0.5">{student.usesTransport || 'No, private transport'}</p>
                  </div>
                </div>
              )}

              {/* DOCUMENTS & COMPLIANCE */}
              {activeSubTab === 'docs' && (
                <div className="space-y-6 animate-fade-in border border-slate-200/60 rounded-3xl p-5">
                  <h4 className="font-bold text-lg text-slate-905 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <FileSpreadsheet className="w-4 h-4 text-[var(--color-secondary)]" /> Documents Onboard Registry
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-50 p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]/70 rounded-2xl">
                      <span className="font-bold text-slate-700">Birth Certificate Document Onboarded</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[15px] font-bold rounded-md tabular-nums">ON FILE</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]/70 rounded-2xl">
                      <span className="font-bold text-slate-700">Guardian Data Privacy Consent signed</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[15px] font-bold rounded-md tabular-nums">SIGNED ✓</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]/70 rounded-2xl">
                      <span className="font-bold text-slate-700">Previous School Transcript Academic Results</span>
                      <span className="px-2 py-0.5 bg-slate-250 text-slate-500 text-[15px] font-bold rounded-md tabular-nums">N/A</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
