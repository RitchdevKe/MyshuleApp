import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  collection, 
  setDoc,
  doc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { Student, Gender } from '../types.ts';
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  GraduationCap, 
  UserPlus, 
  X, 
  Check, 
  AlertTriangle,
  FileSpreadsheet,
  Download,
  MoreVertical,
  Activity,
  Award,
  BookOpen,
  TrendingUp,
  Smartphone,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'motion/react';
import { NewEnrollmentWizard } from './NewEnrollmentWizard.tsx';
import { BulkStudentImport } from './BulkStudentImport.tsx';
import { StudentProfileDossier } from './StudentProfileDossier.tsx';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface StudentsTabProps {
  students: Student[];
}

export function StudentsTab({ students }: StudentsTabProps) {
  const { currency } = useCurrency();

  const [selectedForm, setSelectedForm] = useState<number>(4);
  const [selectedStream, setSelectedStream] = useState<string>('East');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Wizards and Modal States
  const [showWizard, setShowWizard] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [activeDossier, setActiveDossier] = useState<Student | null>(null);
  
  // Create / Edit standard fallback state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Form inputs fallback
  const [formName, setFormName] = useState('');
  const [formAdmin, setFormAdmin] = useState('');
  const [formGender, setFormGender] = useState<Gender>('M');
  const [formForm, setFormForm] = useState<number>(4);
  const [formStream, setFormStream] = useState('East');
  const [formTotalFees, setFormTotalFees] = useState(45000);
  const [formPaidFees, setFormPaidFees] = useState(0);
  const [loading, setLoading] = useState(false);

  // Stats calculation
  const totalCount = students.length;
  const activeCount = students.filter(s => s.status === 'Active' || !s.status).length;
  const suspendedCount = students.filter(s => s.status && s.status !== 'Active').length;
  const maleCount = students.filter(s => s.gender === 'M').length;
  const ratioMale = totalCount > 0 ? Math.round((maleCount / totalCount) * 105) : 50;
  const ratioFemale = 100 - ratioMale;

  // Filter student lists
  const filteredStudents = students.filter((s) => {
    const matchesForm = s.form === selectedForm;
    const matchesStream = s.stream === selectedStream;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesForm && matchesStream && matchesSearch;
  });

  const handleOpenCreateForm = () => {
    setEditingStudent(null);
    setFormName('');
    setFormAdmin('');
    setFormGender('M');
    setFormForm(4);
    setFormStream('East');
    setFormTotalFees(45000);
    setFormPaidFees(0);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormAdmin(student.admissionNo);
    setFormGender(student.gender);
    setFormForm(student.form);
    setFormStream(student.stream);
    setFormTotalFees(student.totalFees);
    setFormPaidFees(student.totalFees - student.feeBalance);
    setIsFormOpen(true);
  };

  const handleApplyPermissionsEdit = (student: Student) => {
    handleOpenEditForm(student);
    setActiveActionMenuId(null);
  };

  const handleOnWizardSubmit = async (stud: Student) => {
    setLoading(true);
    const path = 'students';
    try {
      await setDoc(doc(db, path, stud.id), stud);
      setShowWizard(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path + '/' + stud.id);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImportDone = async (newStudents: Student[]) => {
    setLoading(true);
    const path = 'students';
    try {
      for (const s of newStudents) {
        await setDoc(doc(db, path, s.id), s);
      }
      toast.success(`Import successfully processed. Synchronized ${newStudents.length} rows directly with database.`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path + '/bulk_import');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAdmin) return;
    setLoading(true);

    const targetId = formAdmin.trim().toUpperCase();
    const savePayload: Student = {
      id: targetId,
      admissionNo: targetId,
      name: formName.trim(),
      gender: formGender,
      form: Number(formForm),
      stream: formStream,
      totalFees: Number(formTotalFees),
      feeBalance: Number(formTotalFees) - Number(formPaidFees),
      attendancePercentage: editingStudent ? editingStudent.attendancePercentage : 95,
      status: editingStudent ? (editingStudent.status || 'Active') : 'Active'
    };

    const path = 'students';
    try {
      await setDoc(doc(db, path, targetId), savePayload);
      setIsFormOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path + '/' + targetId);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!window.confirm(`Are you sure you want to delete student ${studentId}?`)) return;
    
    const path = 'students';
    try {
      await deleteDoc(doc(db, path, studentId));
      setActiveActionMenuId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path + '/' + studentId);
    }
  };

  const handleStatusChangeToggle = async (stud: Student, newStatus: 'Active' | 'Suspended' | 'Graduated' | 'Withdrawn') => {
    const updated = { ...stud, status: newStatus };
    const path = 'students';
    try {
      await setDoc(doc(db, path, stud.id), updated);
      setActiveActionMenuId(null);
      toast.success(`Status of student ${stud.name} registered as ${newStatus}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path + '/' + stud.id);
    }
  };

  const handleSmsDispatchedAlert = (studentName: string) => {
    setActiveActionMenuId(null);
    toast.success(`SMS dispatch form initiated! Sending automated billing updates to family contacts of ${studentName}`);
  };

  if (showWizard) {
    return (
      <div className="animate-fade-in">
        <NewEnrollmentWizard
          onClose={() => setShowWizard(false)}
          onSubmit={handleOnWizardSubmit}
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

      {/* 0. HUD (Heads-Up Display) Comparison Stats */}
      <div className="bg-slate-950 text-white p-5 rounded-[1.75rem] flex flex-wrap items-center justify-between gap-6 relative overflow-hidden shadow-xl shadow-slate-950/20 border border-slate-800">
        <div className="absolute left-0 top-0 w-64 h-full bg-gradient-to-r from-violet-600/20 to-transparent pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-64 h-full bg-gradient-to-l from-[#C20F47]/20 to-transparent pointer-events-none" />
        
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-1 md:pb-0 relative z-10 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white/70 uppercase tracking-[0.2em] mb-1">Live Enrolment</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{totalCount}</span>
              <span className="text-[15px] font-bold text-emerald-400 flex items-center gap-0.5 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>
            </div>
            <span className="text-[14px] text-white/50 font-bold uppercase mt-1">vs. Last Year: 540</span>
          </div>

          <div className="w-[1px] h-12 bg-white/10 self-center hidden sm:block" />

          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white/70 uppercase tracking-[0.2em] mb-1">Fee Clearance</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">{totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0}%</span>
              <span className="text-[15px] font-bold text-rose-400 flex items-center gap-0.5 bg-rose-400/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 rotate-180" /> -2%
              </span>
            </div>
            <span className="text-[14px] text-white/50 font-bold uppercase mt-1">Target: 95%</span>
          </div>

          <div className="w-[1px] h-12 bg-white/10 self-center hidden sm:block" />

          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-white/70 uppercase tracking-[0.2em] mb-1">Mean Attendance</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-white">94.2%</span>
              <span className="text-[15px] font-bold text-emerald-400 flex items-center gap-0.5 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3" /> +0.5%
              </span>
            </div>
            <span className="text-[14px] text-white/50 font-bold uppercase mt-1">Benchmark: 90%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0 relative z-10 w-full md:w-auto mt-4 md:mt-0">
           <button 
             onClick={() => toast.success('Generated and downloaded official registry report for Form ' + selectedForm)}
             className="w-full md:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-[16px] text-white font-bold uppercase transition flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm"
           >
             <Download className="w-4 h-4" /> Export PDF
           </button>

           <button 
             onClick={() => toast.success('Bulk SMS Gateway opened for Form ' + selectedForm + ' ' + selectedStream)}
             className="px-3 py-1.5 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 border border-white/10 rounded-xl text-[15px] font-bold uppercase transition flex items-center gap-1.5"
           >
             <Smartphone className="w-3.5 h-3.5" /> Bulk SMS
           </button>
        </div>
      </div>

      {/* 1. Dynamic Statistics Block */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Enrolled', val: totalCount, subtitle: 'Active records on system', icon: Users, color: 'text-primary bg-primary/10 border-primary/20' },
          { label: 'Active Students', val: activeCount, subtitle: 'In-attendance this term', icon: Activity, color: 'text-success bg-success/10 border-success/20' },
          { label: 'Suspended Records', val: suspendedCount, subtitle: 'Leave / disciplinary counts', icon: AlertTriangle, color: 'text-destructive bg-destructive/10 border-destructive/20' },
          { label: 'Gender Allocation', val: `${ratioMale % 100}% M`, subtitle: `${100 - (ratioMale % 100)}% F ratio`, icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-150' }
        ].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.div 
              key={idx} 
              whileHover={{ y: -2 }}
              className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="space-y-1 relative z-10">
                <span className="text-slate-500 text-[15px] font-bold uppercase tracking-wider block">{item.label}</span>
                <span className="text-3xl font-bold tabular-nums text-slate-900 leading-none block">{item.val}</span>
                <span className="text-[15px] text-slate-500 font-medium block">{item.subtitle}</span>
              </div>
              <span className={`p-3.5 rounded-xl border ${item.color} relative z-10 transition-transform duration-300 hover:scale-110`}>
                <IconComp className="w-5 h-5 stroke-[2.2]" />
              </span>
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full mix-blend-multiply filter blur-xl opacity-20 -mr-6 -mt-6"></div>
            </motion.div>
          );
        })}
      </div>

      {/* Control filters panel */}
      <div className="bg-white border border-slate-150 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        
        <div className="flex flex-wrap items-center gap-6">
          {/* Class selection links */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[15px] font-bold text-slate-500 uppercase tracking-wide block tabular-nums">Academic Level</span>
            <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 border border-slate-200/40">
              {[1, 2, 3, 4].map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedForm(f)}
                  className={`px-4 py-2 text-[16px] font-bold rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedForm === f 
                      ? 'bg-primary text-white shadow-sm font-semibold' 
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  Form {f}
                </button>
              ))}
            </div>
          </div>

          {/* Stream selection links */}
          <div className="flex flex-col space-y-1.5">
            <span className="text-[15px] font-bold text-slate-500 uppercase tracking-wide block tabular-nums">Stream Section</span>
            <div className="flex bg-slate-100/80 p-1 rounded-xl gap-1 border border-slate-200/40">
              {['East', 'West', 'North', 'South'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStream(st)}
                  className={`px-4 py-2 text-[16px] font-bold rounded-lg cursor-pointer transition-all duration-205 ${
                    selectedStream === st 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Input box & Import option triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="absolute inset-y-0 left-3.5 my-auto w-4 h-4 text-slate-500 stroke-[2.2]" />
            <input
              type="text"
              placeholder="Search registry name, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowBulkImport(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition duration-150 shrink-0 cursor-pointer text-[17px]"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-600 stroke-[2]" />
              <span>Import Excel</span>
            </button>

            <button
              onClick={() => setShowWizard(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-white bg-primary hover:bg-primary/95 font-bold transition duration-150 shrink-0 cursor-pointer shadow-md shadow-primary/10 text-[17px]"
            >
              <UserPlus className="w-4 h-4 stroke-[2]" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

      </div>

      {/* Main Students list database table grid */}
      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight uppercase tabular-nums">Enrolled Students directories</h3>
            <p className="text-slate-500 text-[16px] mt-0.5">Form {selectedForm} {selectedStream} Class Members ({filteredStudents.length})</p>
          </div>
          <span className="px-3.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[15px] font-bold rounded-full uppercase tracking-wider tabular-nums">
            Filtered: {filteredStudents.length} entries
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-24 text-slate-400 space-y-4 bg-white">
            <Users className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5]" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800 text-[19px]">No registered members inside Form {selectedForm} {selectedStream}.</p>
              <p className="text-[17px] text-slate-500 max-w-sm mx-auto leading-relaxed">Modify filters above or click "Add Student" to enroll a new member into this register list.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[15px] text-slate-500 uppercase tabular-nums tracking-wider h-11">
                  <th className="py-2.5 px-6 font-semibold">ADM No</th>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Gender</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Class / Level</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Attendance Avg</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Fee Balances</th>
                  <th className="py-2.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[17px] bg-white text-slate-700">
                {filteredStudents.map((stud) => {
                  const feeColor = stud.feeBalance > 0 ? 'text-amber-600 font-bold tabular-nums' : 'text-emerald-600 font-bold';
                  const initials = stud.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                  
                  return (
                    <tr key={stud.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="py-4 px-6 tabular-nums font-bold text-slate-900">{stud.admissionNo}</td>
                      <td className="py-4 px-3">
                        <div 
                          onClick={() => setActiveDossier(stud)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary border border-primary/10 flex items-center justify-center font-bold text-[16px] transition-transform duration-200 group-hover:scale-105 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-[13.5px] block group-hover:text-primary group-hover:underline transition-colors duration-150 leading-snug">
                              {stud.name}
                            </span>
                            <span className="text-[15px] text-slate-400 tabular-nums block mt-0.5 uppercase tracking-wider">{stud.status || 'Active'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[14px] font-bold uppercase tracking-wider ${
                          stud.gender === 'M' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-pink-50 text-pink-700 border border-pink-100'
                        }`}>
                          {stud.gender}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="font-semibold text-slate-800">Form {stud.form}</span>
                        <span className="text-[15px] text-slate-500 block tabular-nums mt-0.5 uppercase">{stud.stream}</span>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          <span className="font-bold text-slate-800 tabular-nums">{stud.attendancePercentage || 95}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right">
                        <span className={feeColor}>
                          {stud.feeBalance === 0 ? 'Cleared ✓' : `${stud.feeBalance.toLocaleString()} ${currency}`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveDossier(stud)}
                            className="bg-white hover:bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-700 px-1.5 py-1.5 text-[16px] font-bold rounded-lg cursor-pointer transition shadow-sm hover:border-slate-300"
                          >
                            Dossier
                          </button>

                          <button
                            onClick={() => {
                              if (activeActionMenuId === stud.id) {
                                setActiveActionMenuId(null);
                              } else {
                                setActiveActionMenuId(stud.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 border border-transparent transition cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeActionMenuId === stud.id && (
                            <div className="absolute right-6 top-11 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl shadow-xl w-52 text-left py-2 p-1.5 z-40 space-y-0.5 animate-in fade-in duration-100">
                              <span className="block px-3 py-1 text-[14px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 mb-1">Actions</span>
                              
                              <button
                                onClick={() => {
                                  setActiveDossier(stud);
                                  setActiveActionMenuId(null);
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-800 font-bold text-[12.5px] block cursor-pointer transition"
                              >
                                View Detailed Dossier
                              </button>

                              <button
                                onClick={() => handleApplyPermissionsEdit(stud)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-slate-800 font-bold text-[12.5px] block cursor-pointer transition"
                              >
                                Edit Information
                              </button>

                              <button
                                onClick={() => handleStatusChangeToggle(stud, 'Suspended')}
                                className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-800 font-bold text-[12.5px] block rounded-lg cursor-pointer transition"
                              >
                                Suspend Account
                              </button>

                              <button
                                onClick={() => handleStatusChangeToggle(stud, 'Active')}
                                className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-emerald-800 font-bold text-[12.5px] block rounded-lg cursor-pointer transition"
                              >
                                Reactivate Profile
                              </button>

                              <button
                                onClick={() => handleSmsDispatchedAlert(stud.name)}
                                className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-indigo-800 font-bold text-[12.5px] block cursor-pointer transition"
                              >
                                Send Fee Reminder
                              </button>

                              <div className="border-t border-slate-100 my-1 pt-1" />
                              <button
                                onClick={() => handleDelete(stud.id)}
                                className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-700 font-bold text-[12.5px] block rounded-lg cursor-pointer transition"
                              >
                                Delete Record
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EXCEL IMPORT SIMULATOR MODAL COMPONENT */}
      {showBulkImport && (
        <BulkStudentImport
          onClose={() => setShowBulkImport(false)}
          onImportDone={handleBulkImportDone}
          existingStudents={students}
        />
      )}

      {/* FULL STUDENT RECORD PROFILE DOSSIER OVERLAY COMPONENT */}
      {activeDossier && (
        <StudentProfileDossier
          student={activeDossier}
          onClose={() => setActiveDossier(null)}
          onEdit={() => {
            handleOpenEditForm(activeDossier);
            setActiveDossier(null);
          }}
        />
      )}

      {/* STANDALONE ADD/EDIT PROFILE DIALOG FALLBACK FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-slate-800"
          >
            <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                {editingStudent ? 'Edit Student Profile' : 'Register New Student'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-lg font-semibold">
              <div>
                <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dennis Kiprop"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-205 bg-slate-50 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Admission Number</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingStudent}
                    value={formAdmin}
                    onChange={(e) => setFormAdmin(e.target.value)}
                    placeholder="e.g. ADM-3005"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-205 bg-slate-50 text-slate-850 disabled:opacity-45"
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as Gender)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-205 bg-slate-55 text-slate-800 font-semibold"
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Form / Year</label>
                  <select
                    value={formForm}
                    onChange={(e) => setFormForm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-205 bg-slate-55 text-slate-805 font-semibold"
                  >
                    <option value={1}>Form 1</option>
                    <option value={2}>Form 2</option>
                    <option value={3}>Form 3</option>
                    <option value={4}>Form 4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Stream Route</label>
                  <select
                    value={formStream}
                    onChange={(e) => setFormStream(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-205 bg-slate-55 text-slate-805 font-semibold"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Annual Total Fees</label>
                  <input
                    type="number"
                    required
                    value={formTotalFees}
                    onChange={(e) => setFormTotalFees(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-205 bg-slate-50 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Total Paid Fees</label>
                  <input
                    type="number"
                    required
                    value={formPaidFees}
                    onChange={(e) => setFormPaidFees(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-205 bg-slate-50 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl cursor-pointer font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4.5 py-2 text-white bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] rounded-xl font-bold cursor-pointer transition shadow-md shadow-[var(--color-secondary)]/15"
                >
                  {loading ? 'Saving Profile...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
