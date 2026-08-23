import { toast } from "react-hot-toast";
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Award, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Building, 
  TrendingUp, 
  UserPlus, 
  CalendarDays,
  Menu,
  MoreVertical,
  X,
  FileText,
  ChevronLeft
} from 'lucide-react';
import { Applicant, ApplicantStatus, Student, Gender } from '../types.ts';
import { NewEnrollmentWizard } from './NewEnrollmentWizard.tsx';
import { collection, addDoc, setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.ts';

interface AdmissionsTabProps {
  students: Student[];
  onAddStudent: (stud: Student) => void;
  onRefreshData?: () => void;
}

const DEFAULT_APPLICANTS: Applicant[] = [
  {
    id: 'APP-1025',
    name: 'Kofi Owusu',
    gender: 'M',
    dob: '2011-04-12',
    email: 'kofi.owusu@gmail.com',
    phone: '+233 24 551 2930',
    nationality: 'Ghanaian',
    grade: 'Grade 9',
    academicYear: '2026',
    previousSchool: 'Achimota Basic School',
    transferReason: 'Relocation to Accra East',
    guardianName: 'George Owusu',
    guardianRelation: 'Father',
    guardianPhone: '+233 24 551 2930',
    guardianEmail: 'g.owusu@gmail.com',
    guardianOccupation: 'Bank Auditor',
    medicalBloodGroup: 'O+',
    medicalAllergies: 'Shellfish',
    medicalConditions: 'None',
    transportMode: 'No, private transport',
    feePlan: 'Standard Tuition',
    scholarship: 'None',
    paymentFreq: 'Termly',
    status: 'applied',
    appliedDate: '2026-05-10',
    notes: 'Kofi displays excellent math interests. Previous teacher praised discipline.'
  },
  {
    id: 'APP-1026',
    name: 'Esi Mansah',
    gender: 'F',
    dob: '2010-08-30',
    email: 'esi.mansah@outlook.com',
    phone: '+233 20 182 9301',
    nationality: 'Ghanaian',
    grade: 'Grade 10',
    academicYear: '2026',
    previousSchool: 'Ridge Church School',
    transferReason: 'Closer proximity to parent office',
    guardianName: 'Grace Mansah',
    guardianRelation: 'Mother',
    guardianPhone: '+233 20 182 9301',
    guardianEmail: 'grace.m@outlook.com',
    guardianOccupation: 'Chief pediatric nurse',
    medicalBloodGroup: 'A+',
    medicalAllergies: 'Penicillin',
    medicalConditions: 'Mild Asthma',
    transportMode: 'No, private transport',
    feePlan: 'Standard Tuition',
    scholarship: 'Sports Scholarship (50%)',
    paymentFreq: 'Monthly',
    status: 'interview',
    appliedDate: '2026-05-12',
    notes: 'National junior hurdle runner under 14. Excellent physical discipline.',
    interviewDate: '2026-06-02T10:00:00Z'
  },
  {
    id: 'APP-1027',
    name: 'Kweku Appiah',
    gender: 'M',
    dob: '2009-12-05',
    email: 'kweku.appiah@gmail.com',
    phone: '+233 55 930 4810',
    nationality: 'Ghanaian',
    grade: 'Grade 11',
    academicYear: '2026',
    previousSchool: 'Seven Arrows Academy',
    transferReason: 'Academic upgrade opportunities',
    guardianName: 'Robert Appiah',
    guardianRelation: 'Father',
    guardianPhone: '+233 55 930 4810',
    guardianEmail: 'r.appiah@sevenarrows.com',
    guardianOccupation: 'Architect',
    medicalBloodGroup: 'B-',
    medicalAllergies: 'None',
    medicalConditions: 'None',
    transportMode: 'Yes, assigned route A',
    feePlan: 'International Plan',
    scholarship: 'None',
    paymentFreq: 'Full Year',
    status: 'tested',
    appliedDate: '2026-05-15',
    notes: 'Aptitude entrance scored 88%. Strong logic, average literature scores.',
    examScore: '88/100'
  },
  {
    id: 'APP-1028',
    name: 'Yaa Serwaa',
    gender: 'F',
    dob: '2012-02-18',
    email: 'yaa.serwaa@gmail.com',
    phone: '+233 24 391 1039',
    nationality: 'Ghanaian',
    grade: 'Grade 9',
    academicYear: '2026',
    previousSchool: 'St. Marys Girls Primary',
    transferReason: 'Family decision',
    guardianName: 'Albert Serwaa',
    guardianRelation: 'Father',
    guardianPhone: '+233 24 391 1039',
    guardianEmail: 'albert.s@gmail.com',
    guardianOccupation: 'Lecuturer',
    medicalBloodGroup: 'O-',
    medicalAllergies: 'Eggs',
    medicalConditions: 'Allergic rhinitis',
    transportMode: 'No, private transport',
    feePlan: 'Standard Tuition',
    scholarship: 'Academic Merit (100%)',
    paymentFreq: 'Termly',
    status: 'accepted',
    appliedDate: '2026-05-20',
    notes: 'Outstanding class performance previously (A+ straight). Merit scholar.',
    examScore: '96/100'
  }
];

export function AdmissionsTab({ students, onAddStudent, onRefreshData }: AdmissionsTabProps) {
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    const cached = localStorage.getItem('zira_applicants');
    return cached ? JSON.parse(cached) : DEFAULT_APPLICANTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Wizards
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedApplicantForEnroll, setSelectedApplicantForEnroll] = useState<Applicant | null>(null);
  
  // Slide Over detailed review model
  const [activeDossierReview, setActiveDossierReview] = useState<Applicant | null>(null);

  // Interaction dropdown controls
  const [activeActionDropdown, setActiveActionDropdown] = useState<string | null>(null);

  // Quick Action Forms inside Modal dialogs
  const [showInterviewModal, setShowInterviewModal] = useState<Applicant | null>(null);
  const [interviewDateVal, setInterviewDateVal] = useState('2026-06-05');
  const [interviewTimeVal, setInterviewTimeVal] = useState('10:00');

  const [showExamScoreModal, setShowExamScoreModal] = useState<Applicant | null>(null);
  const [examScoreVal, setExamScoreVal] = useState('');

  useEffect(() => {
    localStorage.setItem('zira_applicants', JSON.stringify(applicants));
  }, [applicants]);

  const stats = [
    { label: 'New Apps This Term', val: applicants.filter(a => a.status === 'applied').length, icon: UserPlus, color: 'text-blue-500 bg-blue-50 border-blue-100' },
    { label: 'Pending Assessment', val: applicants.filter(a => a.status === 'interview' || a.status === 'tested').length, icon: CalendarDays, color: 'text-amber-500 bg-amber-50 border-amber-100' },
    { label: 'Offer Extended', val: applicants.filter(a => a.status === 'accepted').length, icon: Award, color: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
    { label: 'Formally Enrolled', val: applicants.filter(a => a.status === 'enrolled').length, icon: Check, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' }
  ];

  const handleStatusChange = (applicantId: string, newStatus: ApplicantStatus) => {
    setApplicants(prev => prev.map(a => {
      if (a.id === applicantId) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
    setActiveActionDropdown(null);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInterviewModal) return;

    setApplicants(prev => prev.map(a => {
      if (a.id === showInterviewModal.id) {
        return { 
          ...a, 
          status: 'interview', 
          interviewDate: `${interviewDateVal}T${interviewTimeVal}:00Z` 
        };
      }
      return a;
    }));

    setShowInterviewModal(null);
    setActiveActionDropdown(null);
  };

  const handleRegisterExamScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showExamScoreModal) return;

    setApplicants(prev => prev.map(a => {
      if (a.id === showExamScoreModal.id) {
        return { 
          ...a, 
          status: 'tested', 
          examScore: `${examScoreVal}/100` 
        };
      }
      return a;
    }));

    setShowExamScoreModal(null);
    setActiveActionDropdown(null);
  };

  const handleEnrollApplicantClick = (app: Applicant) => {
    setSelectedApplicantForEnroll(app);
    setShowWizard(true);
    setActiveActionDropdown(null);
  };

  const handleNewAdmissionsEnrollDone = async (stud: Student) => {
    try {
      // Save direct to Firebase
      await setDoc(doc(db, 'students', stud.id), stud);
      
      // Update applicant in local list to reflect 'enrolled'
      if (selectedApplicantForEnroll) {
        setApplicants(prev => prev.map(a => {
          if (a.id === selectedApplicantForEnroll.id) {
            return { ...a, status: 'enrolled' };
          }
          return a;
        }));
      }

      onAddStudent(stud);
      setShowWizard(false);
      setSelectedApplicantForEnroll(null);
      
      if (onRefreshData) onRefreshData();
      toast.success(`Student ${stud.name} of ${stud.stream} successfully onboarded in firebase and state lists.`);
    } catch (err) {
      console.error('Admissions onboarding failed:', err);
      // fallback-add
      onAddStudent(stud);
      setShowWizard(false);
      setSelectedApplicantForEnroll(null);
    }
  };

  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list');

  // Filter application pipeline list
  const filteredApplicants = applicants.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = gradeFilter === 'All' ? true : a.grade === gradeFilter;
    const matchesStatus = statusFilter === 'All' ? true : a.status === statusFilter;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  const pipelineStages: {id: ApplicantStatus, label: string, color: string}[] = [
    { id: 'applied', label: 'Registered', color: 'bg-slate-100 border-slate-200' },
    { id: 'interview', label: 'Interviewed', color: 'bg-amber-50 border-amber-200' },
    { id: 'tested', label: 'Tested', color: 'bg-purple-50 border-purple-200' },
    { id: 'accepted', label: 'Accepted', color: 'bg-indigo-50 border-indigo-200' },
    { id: 'enrolled', label: 'Enrolled', color: 'bg-emerald-50 border-emerald-200' }
  ];

  if (showWizard) {
    return (
      <div className="animate-fade-in">
        <NewEnrollmentWizard
          onClose={() => {
            setShowWizard(false);
            setSelectedApplicantForEnroll(null);
          }}
          onSubmit={handleNewAdmissionsEnrollDone}
          existingGrades={['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']}
          existingStreams={['East', 'West', 'North', 'South']}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans text-lg text-slate-700">
      
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('navTo', { detail: 'students_data_hub' }))}
          className="flex items-center gap-1.5 px-1.5 py-1.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition text-[16px] font-bold cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Data Hub
        </button>
      </div>

      {/* Top statistics overview bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'New Apps This Term', val: applicants.filter(a => a.status === 'applied').length, icon: UserPlus, color: 'text-blue-600 bg-blue-50 border-blue-150' },
          { label: 'Pending Assessment', val: applicants.filter(a => a.status === 'interview' || a.status === 'tested').length, icon: CalendarDays, color: 'text-amber-600 bg-amber-50 border-amber-150' },
          { label: 'Offer Extended', val: applicants.filter(a => a.status === 'accepted').length, icon: Award, color: 'text-indigo-600 bg-indigo-50 border-indigo-150' },
          { label: 'Formally Enrolled', val: applicants.filter(a => a.status === 'enrolled').length, icon: Check, color: 'text-emerald-600 bg-emerald-50 border-emerald-150' }
        ].map((s, idx) => {
          const IconComponent = s.icon;
          return (
            <motion.div 
              key={idx} 
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="relative z-10 space-y-1">
                <span className="text-slate-500 text-[15px] font-bold uppercase tracking-wider block">{s.label}</span>
                <span className="text-3xl font-bold tabular-nums tracking-tight text-slate-900 block leading-none">{s.val}</span>
              </div>
              <span className={`p-3.5 rounded-xl border ${s.color} relative z-10 transition-transform duration-300 hover:scale-110`}>
                <IconComponent className="w-5 h-5 stroke-[2.2]" />
              </span>
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full mix-blend-multiply filter blur-xl opacity-20 -mr-6 -mt-6"></div>
            </motion.div>
          );
        })}
      </div>

      {/* Control bar filter search and "+ Start Admission" action buttons */}
      <div className="bg-white border border-slate-150 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
             <button 
               onClick={() => setViewMode('list')}
               className={`px-3 py-1.5 rounded-lg text-base font-bold transition-all flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <Menu className="w-3.5 h-3.5" /> List
             </button>
             <button 
               onClick={() => setViewMode('pipeline')}
               className={`px-3 py-1.5 rounded-lg text-base font-bold transition-all flex items-center gap-1.5 ${viewMode === 'pipeline' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
             >
                <TrendingUp className="w-3.5 h-3.5" /> Pipeline
             </button>
          </div>

          <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

          {/* SEARCH */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5 stroke-[2.2]" />
            <input 
              type="text" 
              placeholder="Search applicant..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Start admission click trigger */}
        <button
          onClick={() => {
            setSelectedApplicantForEnroll(null);
            setShowWizard(true);
          }}
          className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[17px] rounded-xl flex items-center gap-1.5 shadow-md transition shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.2]" /> Start Admission
        </button>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <span className="font-bold text-slate-900 text-lg tracking-tight uppercase tabular-nums">Admissions Applications Pipeline ({filteredApplicants.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[15px] text-slate-500 uppercase tabular-nums tracking-wider h-11">
                  <th className="py-3 px-6 h-11 font-semibold">Applicant ID</th>
                  <th className="py-3 px-3 h-11 font-semibold">Name</th>
                  <th className="py-3 px-3 h-11 font-semibold">Grade</th>
                  <th className="py-3 px-3 h-11 font-semibold">Guardian Phone</th>
                  <th className="py-3 px-3 h-11 font-semibold">Applied Date</th>
                  <th className="py-3 px-3 h-11 font-semibold">Stage Status</th>
                  <th className="py-3 px-6 h-11 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium text-[17px]">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 text-slate-400">
                      <div className="space-y-3">
                        <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto stroke-[1.5]" />
                        <p className="font-bold text-slate-800 text-lg">No applicant matches selected pipeline filtering parameters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map(a => {
                    const initials = a.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="py-4 px-6 tabular-nums font-bold text-slate-900">{a.id}</td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/5 text-primary font-bold flex items-center justify-center rounded-lg border border-primary/10 text-[11.5px] whitespace-nowrap shrink-0">
                              {initials}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 text-[13.5px] block leading-snug">{a.name}</span>
                              <span className="text-[15px] text-slate-400 block mt-0.5 uppercase tracking-wide tabular-nums">{a.gender === 'M' ? 'Male' : 'Female'} • DOB {a.dob}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="font-bold text-slate-800 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] px-2 py-1 rounded text-[15px] tabular-nums uppercase">{a.grade}</span>
                        </td>
                        <td className="py-4 px-3 tabular-nums text-[16px] text-slate-505">{a.guardianPhone}</td>
                        <td className="py-4 px-3 tabular-nums text-[16px] text-slate-505">{a.appliedDate}</td>
                        <td className="py-4 px-3">
                          <span className={`px-2.5 py-1 rounded-md text-[14px] font-bold uppercase tracking-wider border ${
                            a.status === 'enrolled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            a.status === 'accepted' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                            a.status === 'interview' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                            a.status === 'tested' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                            'bg-slate-50 text-slate-650 border-slate-200'
                          }`}>
                            {a.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right relative">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setActiveDossierReview(a)}
                              className="px-1.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] text-[16px] font-bold rounded-lg transition inline-flex items-center gap-1 cursor-pointer hover:border-slate-300 shadow-sm"
                            >
                              <ExternalLink className="w-3 h-3 text-slate-500" /> Dossier
                            </button>
  
                            {/* Dropdown controls */}
                            <button
                              onClick={() => {
                                if (activeActionDropdown === a.id) {
                                  setActiveActionDropdown(null);
                                } else {
                                  setActiveActionDropdown(a.id);
                                }
                              }}
                              className="p-1.5 hover:bg-slate-100 rounded-lg border border-transparent transition cursor-pointer text-slate-500 hover:text-slate-800"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
  
                            {activeActionDropdown === a.id && (
                              <div className="absolute right-6 top-11 bg-white border border-slate-250 rounded-xl shadow-xl w-56 text-left py-2 p-1.5 z-40 space-y-0.5 animate-in fade-in duration-100">
                                <span className="block px-3 py-1 text-[14px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 mb-1">Update Pipeline</span>
                                
                                <button
                                  onClick={() => {
                                    setShowInterviewModal(a);
                                    setActiveActionDropdown(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-amber-850 font-bold text-[12.5px] block cursor-pointer transition"
                                >
                                  Schedule Interview
                                </button>
                            
                                <button
                                  onClick={() => {
                                    setShowExamScoreModal(a);
                                    setActiveActionDropdown(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-purple-800 font-bold text-[12.5px] block cursor-pointer transition"
                                >
                                  Enter Assessment Score
                                </button>
  
                                <button
                                  onClick={() => handleStatusChange(a.id, 'accepted')}
                                  className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-indigo-805 font-bold text-[12.5px] block cursor-pointer transition"
                                >
                                  Promote to Accepted Offer
                                </button>
  
                                {a.status !== 'enrolled' ? (
                                  <button
                                    onClick={() => handleEnrollApplicantClick(a)}
                                    className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-805 font-bold text-[12.5px] block rounded-lg cursor-pointer transition border border-transparent hover:border-emerald-200"
                                  >
                                    Finalize Onboarding
                                  </button>
                                ) : (
                                  <span className="block px-3 py-2 text-emerald-600 font-bold text-[16px] tabular-nums uppercase">Onboarding Complete</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 scroller-hide overflow-x-auto pb-4">
           {pipelineStages.map(stage => {
             const stageApplicants = filteredApplicants.filter(a => a.status === stage.id);
             return (
               <div key={stage.id} className="min-w-[280px] space-y-4">
                  <div className={`p-4 rounded-2xl border-2 flex items-center justify-between shadow-sm bg-white ${stage.color}`}>
                     <span className="font-bold text-[15px] uppercase tracking-wide text-slate-900">{stage.label}</span>
                     <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[14px] font-bold">{stageApplicants.length}</span>
                  </div>

                  <div className="space-y-3">
                     {stageApplicants.map(a => (
                       <motion.div 
                         layoutId={a.id}
                         key={a.id}
                         onClick={() => setActiveDossierReview(a)}
                         className="bg-white border border-slate-150 p-4 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                       >
                          <div className="flex justify-between items-start mb-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400 text-base border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                                {a.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                             </div>
                             <span className="text-[14px] font-bold text-slate-400 tabular-nums">{a.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-[17px] uppercase tracking-tight mb-1">{a.name}</h4>
                          <p className="text-[15px] text-slate-500 font-bold mb-3">{a.grade}</p>
                          
                          <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                             <span className="text-[14px] font-bold text-slate-300 uppercase tracking-wide leading-none">Registered</span>
                             <span className="text-[14px] font-bold text-slate-400 tabular-nums leading-none">{a.appliedDate}</span>
                          </div>
                       </motion.div>
                     ))}
                     {stageApplicants.length === 0 && (
                       <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                          <Plus className="w-10 h-10 opacity-20 mb-2" />
                          <span className="text-[14px] font-bold uppercase tracking-wide">Empty Stage</span>
                       </div>
                     )}
                  </div>
               </div>
             )
           })}
        </div>
      )}

      {/* SINGLE APPLICANT DOSSIER REVIEW SIDE PANEL OR OVERLAY */}
      {activeDossierReview && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-lg h-screen shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between font-sans text-slate-700 animate-slide-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-lg">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl leading-tight">{activeDossierReview.name}</h3>
                    <span className="text-[16px] text-slate-400 tabular-nums">Application: {activeDossierReview.id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveDossierReview(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bio Grid */}
              <div className="space-y-4">
                <span className="block font-bold text-slate-500 uppercase text-[15px] tracking-wider tabular-nums">Biological & Previous Logs</span>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-150 rounded-2xl">
                  <div>
                    <span className="text-slate-400 text-[16px]">Gender</span>
                    <p className="font-bold text-slate-800 mt-0.5">{activeDossierReview.gender === 'M' ? 'Male' : 'Female'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[16px]">DOB</span>
                    <p className="font-bold text-slate-800 mt-0.5 tabular-nums">{activeDossierReview.dob}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[16px]">Previous School</span>
                    <p className="font-bold text-slate-800 mt-0.5">{activeDossierReview.previousSchool}</p>
                  </div>
                  {activeDossierReview.interviewDate && (
                    <div>
                      <span className="text-rose-500 text-[16px] font-bold">Interview Scheduled</span>
                      <p className="font-bold text-slate-800 mt-0.5 tabular-nums">{activeDossierReview.interviewDate.replace('Z', '').replace('T', ' ')}</p>
                    </div>
                  )}
                  {activeDossierReview.examScore && (
                    <div>
                      <span className="text-purple-600 text-[16px] font-bold">Assessment Score</span>
                      <p className="font-bold text-purple-700 mt-0.5 tabular-nums">{activeDossierReview.examScore}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Parents / Contacts */}
              <div className="space-y-4">
                <span className="block font-bold text-slate-500 uppercase text-[15px] tracking-wider tabular-nums font-bold">Parents & Financial info</span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 text-[16px]">Guardian</span>
                    <p className="font-bold text-slate-800 mt-0.5">{activeDossierReview.guardianName} ({activeDossierReview.guardianRelation})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[16px]">Contact Phone</span>
                    <p className="font-bold text-slate-800 mt-0.5 tabular-nums">{activeDossierReview.guardianPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[16px]">Scholarship Bracket</span>
                    <p className="font-bold text-slate-800 mt-0.5">{activeDossierReview.scholarship || 'None'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[16px]">Billing Cycle</span>
                    <p className="font-bold text-slate-800 mt-0.5">{activeDossierReview.paymentFreq}</p>
                  </div>
                </div>
              </div>

              {/* Admission Notes */}
              {activeDossierReview.notes && (
                <div className="space-y-2 bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl text-[17px] text-amber-900">
                  <span className="font-bold block text-amber-800 uppercase text-[15px] tracking-wider">Internal admissions notes</span>
                  <p className="leading-relaxed mt-1 font-semibold">{activeDossierReview.notes}</p>
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setActiveDossierReview(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close Review
              </button>
              {activeDossierReview.status !== 'enrolled' && (
                <button
                  onClick={() => {
                    handleEnrollApplicantClick(activeDossierReview);
                    setActiveDossierReview(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                >
                  Onboard Student <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK FORM: MODAL FOR INTERVIEW */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleScheduleInterview} className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2">
            <h3 className="font-bold text-xl text-slate-900">Schedule Interview for {showInterviewModal.name}</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Interview Date *</label>
                <input 
                  type="date" 
                  required
                  value={interviewDateVal}
                  onChange={e => setInterviewDateVal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Schedule Time *</label>
                <input 
                  type="time" 
                  required
                  value={interviewTimeVal}
                  onChange={e => setInterviewTimeVal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button" 
                onClick={() => setShowInterviewModal(null)}
                className="px-4.5 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Schedule & Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* QUICK FORM: MODAL FOR EXAM ENTRY */}
      {showExamScoreModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRegisterExamScore} className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2">
            <h3 className="font-bold text-xl text-slate-900">Entrance Exam for {showExamScoreModal.name}</h3>
            
            <div>
              <label className="block text-[16px] font-bold text-slate-500 uppercase mb-1">Assessment Score (out of 100) *</label>
              <input 
                type="number" 
                required
                min="0"
                max="100"
                placeholder="e.g. 85"
                value={examScoreVal}
                onChange={e => setExamScoreVal(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 tabular-nums"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button" 
                onClick={() => setShowExamScoreModal(null)}
                className="px-4.5 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Register Score
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
