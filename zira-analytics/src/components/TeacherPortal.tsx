import { toast } from "react-hot-toast";
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { Student, Exam, MarkSheet, FeeTransaction, SmsLog } from '../types.ts';
import { 
  getSubjectGradeAndPoints, 
  getMeanGradeByPoints, 
  getColorForGrade, 
  calculateSummary,
  SubjectMarksMap 
} from '../utils.ts';
import { 
  Award, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Save, 
  CheckCircle, 
  Calculator, 
  TrendingUp, 
  Users, 
  Phone, 
  Tv, 
  TrendingDown, 
  Search, 
  Lock, 
  Mail, 
  Send,
  HelpCircle,
  FileCheck,
  Check,
  Percent,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface TeacherPortalProps {
  students: Student[];
  exams: Exam[];
  transactions: FeeTransaction[];
  smsLogs: SmsLog[];
  teacherName: string;
}

interface TeacherLesson {
  id: string;
  form: number;
  stream: string;
  subject: keyof SubjectMarksMap;
  subjectName: string;
  studentCount: number;
}

export function TeacherPortal({ 
  students, 
  exams, 
  transactions, 
  smsLogs, 
  teacherName 
}: TeacherPortalProps) {
  // 1. Core State
  const [activePortalTab, setActivePortalTab] = useState<'lessons' | 'class_teacher' | 'target_predictor' | 'subject_analytics'>('lessons');
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  
  // Lessons Taught by Daniel Gitumu Hia (Mathematics and History)
  const teacherLessons: TeacherLesson[] = [
    { id: 'l1', form: 4, stream: 'East', subject: 'mathematics', subjectName: 'Mathematics', studentCount: 7 },
    { id: 'l2', form: 4, stream: 'East', subject: 'history', subjectName: 'History', studentCount: 7 },
    { id: 'l3', form: 3, stream: 'West', subject: 'history', subjectName: 'History', studentCount: 4 }
  ];

  const [selectedLessonId, setSelectedLessonId] = useState<string>('l1');
  const [spreadsheetMarks, setSpreadsheetMarks] = useState<Record<string, number>>({});
  const [markSheets, setMarkSheets] = useState<MarkSheet[]>([]);
  const [savingLoading, setSavingLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncStatus, setSyncStatus] = useState<string>('');

  // Target Setting States
  const [targetStudentId, setTargetStudentId] = useState<string>('ADM-2041');
  const [targetKCSEGrade, setTargetKCSEGrade] = useState<string>('A-');

  // Class Teacher remarks local storage/state memory
  const [studentRemarks, setStudentRemarks] = useState<Record<string, string>>({
    'ADM-2041': 'Consistent, highly motivated and very helpful in class chemistry experiments.',
    'ADM-2042': 'Excellent display of vocabulary. Highly focused, keep it up.',
    'ADM-2043': 'Active and participatory, though has minor attendance slips.',
    'ADM-2044': 'Exceptional discipline. Outstanding academic streak across all sciences.',
    'ADM-2045': 'Great practical skills, requires strict discipline in homework revision.',
    'ADM-2046': 'A dedicated tutee with stellar performance. Recommended directly for university track.',
    'ADM-2047': 'Very smart and cooperative. Focus more on analytical problems.'
  });
  const [editingRemarksStudentId, setEditingRemarksStudentId] = useState<string | null>(null);
  const [tempRemarksText, setTempRemarksText] = useState<string>('');

  // Settle Fee deficit desks locally inside Class Teacher view
  const [mpesaPhone, setMpesaPhone] = useState<string>('+254711843820');
  const [feeDeficitLoading, setFeeDeficitLoading] = useState<string | null>(null);

  // Set default active exam
  useEffect(() => {
    if (exams.length > 0 && !selectedExamId) {
      const active = exams.find(e => e.status === 'active');
      setSelectedExamId(active ? active.id : exams[0].id);
    }
  }, [exams, selectedExamId]);

  // Fetch mark sheets for calculations
  useEffect(() => {
    if (!selectedExamId) return;

    const sheetsPath = `exams/${selectedExamId}/marks`;
    const unsubscribe = onSnapshot(collection(db, sheetsPath), (snap) => {
      const list: MarkSheet[] = [];
      snap.forEach((doc) => {
        list.push(doc.data() as MarkSheet);
      });
      setMarkSheets(list);

      // Load marks into editable spreadsheet form for selected lesson
      const activeLesson = teacherLessons.find(l => l.id === selectedLessonId);
      if (activeLesson) {
        const marksMap: Record<string, number> = {};
        list.forEach(sheet => {
          if (sheet.form === activeLesson.form && (activeLesson.stream === 'All' || sheet.stream === activeLesson.stream)) {
            const val = sheet[activeLesson.subject];
            if (val !== undefined && typeof val === 'number') {
              marksMap[sheet.studentId] = val;
            }
          }
        });
        setSpreadsheetMarks(marksMap);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, sheetsPath);
    });

    return () => unsubscribe();
  }, [selectedExamId, selectedLessonId]);

  const activeLesson = teacherLessons.find(l => l.id === selectedLessonId) || teacherLessons[0];

  // Filters students for spreadsheet
  const activeLessonStudents = students.filter(student => {
    const matchesLesson = student.form === activeLesson.form && student.stream === activeLesson.stream;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLesson && matchesSearch;
  });

  // Target Student Object Selector
  const currentTargetStudentSheet = markSheets.find(s => s.studentId === targetStudentId);
  const currentTargetStudent = students.find(s => s.id === targetStudentId);

  // Trigger Bulk Filler action to make trial easy and visual
  const handleBulkPerformanceAids = () => {
    const draft: Record<string, number> = {};
    activeLessonStudents.forEach((student, index) => {
      // Seed score 65 to 90
      const randomizedScore = 65 + ((index * 7 + student.name.length) % 26);
      draft[student.id] = randomizedScore;
    });
    setSpreadsheetMarks(draft);
    setSyncStatus('Preparsed bulk marks values. Ready to save!');
    setTimeout(() => setSyncStatus(''), 4000);
  };

  const handleMarkChange = (studentId: string, value: string) => {
    const num = Math.min(100, Math.max(0, parseInt(value) || 0));
    setSpreadsheetMarks(prev => ({
      ...prev,
      [studentId]: num
    }));
  };

  // Submit and save marks to firebase
  const handleSaveSpreadsheetMarks = async () => {
    if (!selectedExamId) return;
    setSavingLoading(true);
    setSyncStatus('Calculating grades and points index bounds...');

    try {
      // We will perform updates for each student in the spreadsheet
      for (const student of activeLessonStudents) {
        const proposedMark = spreadsheetMarks[student.id] ?? 0;
        
        // Find existing mark sheet
        const existingCard = markSheets.find(m => m.studentId === student.id);
        
        let initialMarks: SubjectMarksMap = {};
        if (existingCard) {
          initialMarks = {
            english: existingCard.english,
            kiswahili: existingCard.kiswahili,
            mathematics: existingCard.mathematics,
            biology: existingCard.biology,
            chemistry: existingCard.chemistry,
            physics: existingCard.physics,
            history: existingCard.history,
            geography: existingCard.geography,
            cre: existingCard.cre,
            business: existingCard.business,
            agriculture: existingCard.agriculture
          };
        }

        // Apply our subject mark
        initialMarks[activeLesson.subject] = proposedMark;

        // Recompute aggregates
        const computed = calculateSummary(initialMarks);

        // Build complete marksheet payload
        const updatedMarksSheet: MarkSheet = {
          studentId: student.id,
          studentName: student.name,
          form: student.form,
          stream: student.stream,
          ...initialMarks,
          totalMarks: computed.totalMarks,
          averagePoints: computed.averagePoints,
          meanGrade: computed.meanGrade,
          classPosition: existingCard?.classPosition || 1,
          streamPosition: existingCard?.streamPosition || 1
        };

        // Write row safely to Firestore exams/{examId}/marks/{studentId}
        const docRef = doc(db, 'exams', selectedExamId, 'marks', student.id);
        await setDoc(docRef, updatedMarksSheet);
      }

      setSyncStatus('📢 Synchronized marks successfully saved inside Zira Core Registry!');
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (err) {
      console.error(err);
      toast.success('Could not synchronize grade spread. Please retry.');
    } finally {
      setSavingLoading(false);
    }
  };

  // Save Class teacher Remarks
  const handleOpenRemarksEditor = (studentId: string, text: string) => {
    setEditingRemarksStudentId(studentId);
    setTempRemarksText(text);
  };

  const handleSaveRemarks = (studentId: string) => {
    setStudentRemarks(prev => ({
      ...prev,
      [studentId]: tempRemarksText
    }));
    setEditingRemarksStudentId(null);
    setSyncStatus(`Updated Teacher remarks statement for student ADM No: ${studentId}`);
    setTimeout(() => setSyncStatus(''), 4000);
  };

  // Dispatch parent push marks alerts SMS
  const handleTriggerParentSMS = async (sheet: MarkSheet, student: Student) => {
    setSyncStatus(`Preparing push alert message box for ${student.name}...`);
    try {
      const parentNum = student.guardianPhone || '+254711843820';
      const briefMessage = `Dear parent of ${sheet.studentName}, her Term 1 Mid-Term score for ${activeLesson.subjectName} is ${spreadsheetMarks[sheet.studentId] || 0} (${getSubjectGradeAndPoints(spreadsheetMarks[sheet.studentId] || 0).grade}). Overall Term Mean: ${sheet.meanGrade}. Settle fee balance: KES ${student.feeBalance}. Zira Alerts.`;
      
      const newSmsId = 'BMS-' + Math.floor(1000 + Math.random() * 9000);
      const payload: SmsLog = {
        id: newSmsId,
        studentId: sheet.studentId,
        studentName: sheet.studentName,
        recipient: parentNum,
        message: briefMessage,
        sentAt: new Date().toISOString(),
        status: 'sent',
        type: 'exam'
      };

      // Set inside firestore sms_logs
      await setDoc(doc(db, 'sms_logs', newSmsId), payload);
      setSyncStatus(`✅ Marks Report Card SMS sent to parent (${parentNum}) successfully!`);
      setTimeout(() => setSyncStatus(''), 4000);
    } catch (e) {
      console.error(e);
      toast.success('SMS gateway timed out. Please retry.');
    }
  };

  // STK Push simulated payment desk
  const handleTriggerStkPush = (studentId: string, name: string, balance: number) => {
    if (balance <= 0) {
      toast.success("This student holds a zero balance credit.");
      return;
    }
    setFeeDeficitLoading(studentId);
    setTimeout(async () => {
      try {
        // Build mock transaction reference
        const txId = 'TXT-' + Math.floor(10000 + Math.random() * 90000);
        
        // Push transaction to firestore
        const txPayload: FeeTransaction = {
          id: txId,
          studentId: studentId,
          studentName: name,
          amount: Math.min(balance, 10000), // pay 10k or balance
          date: new Date().toISOString(),
          type: 'M-Pesa',
          reference: 'MPX' + Math.floor(100000 + Math.random() * 900000),
          receivedBy: teacherName
        };

        await setDoc(doc(db, 'fee_transactions', txId), txPayload);

        // Update student fee balance
        const studentRef = doc(db, 'students', studentId);
        await updateDoc(studentRef, {
          feeBalance: balance - txPayload.amount
        });

        setSyncStatus(`M-Pesa push receipt validated! KES ${txPayload.amount.toLocaleString()} received for ${name}.`);
        setTimeout(() => setSyncStatus(''), 4000);
      } catch (e) {
        console.error(e);
      } finally {
        setFeeDeficitLoading(null);
      }
    }, 2000);
  };

  // KCSE Target calculations
  const calculateSubjectKCSETarget = (desiredGrade: string) => {
    const pointsList = {
      'A': 12, 'A-': 11, 'B+': 10, 'B': 9, 'B-': 8, 'C+': 7, 'C': 6, 'C-': 5, 'D+': 4, 'D': 3, 'D-': 2, 'E': 1
    };
    
    const scalePoints = (pointsList as any)[desiredGrade] || 7;

    // Define Kenyan standard subject required marks scaling lists
    const targetMathScore = Math.min(100, scalePoints * 7 + 14); // e.g. B (9 pts) * 7 + 14 = 77% marks!
    const targetEnglishScore = Math.min(100, scalePoints * 7 + 11);
    const targetKiswahiliScore = Math.min(100, scalePoints * 7 + 10);
    const targetScienceScore = Math.min(100, scalePoints * 7 + 13);
    const targetHumanityScore = Math.min(100, scalePoints * 7 + 9);

    return {
      mathematics: targetMathScore,
      english: targetEnglishScore,
      kiswahili: targetKiswahiliScore,
      biology: targetScienceScore,
      history: targetHumanityScore,
      points: scalePoints
    };
  };

  const targetScale = calculateSubjectKCSETarget(targetKCSEGrade);

  // Grade Analytics charts dataset for Daniel Gitumu's subjects
  const getSubjectGradeDistribution = () => {
    const subject = activeLesson.subject;
    // count grade distributions
    const counts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0 };
    markSheets.forEach(m => {
      const val = m[subject];
      if (val !== undefined && typeof val === 'number') {
        const gradeLetter = getSubjectGradeAndPoints(val).grade.substring(0, 1);
        if (gradeLetter in counts) {
          (counts as any)[gradeLetter]++;
        }
      }
    });

    return [
      { Grade: 'A', Count: counts['A'], color: '#10b981' },
      { Grade: 'B', Count: counts['B'], color: '#14b8a6' },
      { Grade: 'C', Count: counts['C'], color: '#3b82f6' },
      { Grade: 'D', Count: counts['D'], color: '#f59e0b' },
      { Grade: 'E', Count: counts['E'], color: '#ef4444' }
    ];
  };

  const gradeDistributionData = getSubjectGradeDistribution();

  return (
    <div className="space-y-4">
      
      {/* 1. Header Mini Panel for Teacher Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold font-sans text-slate-800 flex flex-wrap items-center gap-2 leading-none">
            Welcome Back, {teacherName}
            <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-500" /> Zira Partner
            </span>
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1.5 tabular-nums">
            TUTOR ID: ZIRA-9801 • Math & History • <span className="font-bold text-[var(--color-secondary)]">Form 4 East (C+)</span>
          </p>
        </div>

        <div className="flex bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-3 py-1.5 rounded-xl border border-[var(--color-secondary)]/15 items-center gap-2 self-start md:self-auto shadow-sm">
          <div className="text-right hidden sm:block">
            <div className="text-xs uppercase font-bold tracking-wider">Assigned Stream</div>
            <div className="text-sm font-bold">Form 4 East</div>
          </div>
          <div className="w-8 h-8 bg-white border border-[var(--color-secondary)]/20 rounded-lg flex items-center justify-center font-bold text-base shadow-sm">
            🎯
          </div>
        </div>
      </div>

        {/* Global sync and toast banner */}
        {syncStatus && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs flex items-center gap-2"
          >
            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span className="font-medium">{syncStatus}</span>
          </motion.div>
        )}

      {/* 2. Zira Tab Selector Controls bar */}
      <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto gap-1 border border-slate-200 w-fit max-w-full select-none">
        <button
          onClick={() => setActivePortalTab('lessons')}
          className={`px-3 py-2 text-xs font-medium rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 border-none whitespace-nowrap ${
            activePortalTab === 'lessons'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          My Subjects
        </button>
        <button
          onClick={() => setActivePortalTab('class_teacher')}
          className={`px-3 py-2 text-xs font-medium rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 border-none whitespace-nowrap ${
            activePortalTab === 'class_teacher'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Class Tutees
        </button>
        <button
          onClick={() => setActivePortalTab('target_predictor')}
          className={`px-3 py-2 text-xs font-medium rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 border-none whitespace-nowrap ${
            activePortalTab === 'target_predictor'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          KCSE Predictor
        </button>
        <button
          onClick={() => setActivePortalTab('subject_analytics')}
          className={`px-3 py-2 text-xs font-medium rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 border-none whitespace-nowrap ${
            activePortalTab === 'subject_analytics'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 bg-transparent'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Analytics
        </button>
      </div>

      {/* TAB 1: MY SUBJECTS & MARKS SPREADSHEET ENTERING */}
      {activePortalTab === 'lessons' && (
        <div className="space-y-6">
          {/* Controls Segment */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-[1.25rem] flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              
              {/* Select Lesson Taught */}
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Lesson Selection</span>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20"
                >
                  {teacherLessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      {lesson.subjectName} — Form {lesson.form} {lesson.stream} ({lesson.studentCount} Students)
                    </option>
                  ))}
                </select>
              </div>

              {/* Assessment Term Selector */}
              <div className="flex flex-col space-y-1">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Assessment Period</span>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20"
                >
                  {exams.map(exam => (
                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                  ))}
                </select>
              </div>

              {/* Quick Helper Tools */}
              <div className="self-end">
                <button
                  onClick={handleBulkPerformanceAids}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-none text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  title="Auto-fills sample score values to test grading"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Seed Trial Marks
                </button>
              </div>
            </div>

            {/* Quick search input filter */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search tutees in stream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-normal rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* SPREADSHEET CARD */}
          <div className="bg-white shadow-sm border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
                  Marks Entry
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  <span className="font-medium text-[#C20F47]">{activeLesson.subjectName}</span> · Form {activeLesson.form} {activeLesson.stream}
                </p>
              </div>

              {/* SAVE BUTTONS */}
              <button
                onClick={handleSaveSpreadsheetMarks}
                disabled={savingLoading}
                className="px-3.5 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-80 disabled:cursor-wait border-none shadow-sm"
              >
                {savingLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-white" />
                    Save & Sync
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-xs font-medium text-slate-500">
                    <th className="px-4 py-2.5 text-center">ADM</th>
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5 text-center">Gender</th>
                    <th className="px-4 py-2.5 text-center bg-indigo-50/40">Score (0–100)</th>
                    <th className="px-4 py-2.5 text-center">Grade</th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                    <th className="px-4 py-2.5 text-right">Parent Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeLessonStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                        No students registered under Form {activeLesson.form} {activeLesson.stream}
                      </td>
                    </tr>
                  ) : (
                    activeLessonStudents.map((student) => {
                      const value = spreadsheetMarks[student.id] ?? '';
                      const gradeResult = typeof value === 'number' ? getSubjectGradeAndPoints(value) : { grade: '-', points: 0 };
                      const gradeColor = getColorForGrade(gradeResult.grade);
                      const existingCard = markSheets.find(m => m.studentId === student.id);

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-2.5 text-center tabular-nums text-slate-400 text-xs">{student.admissionNo}</td>
                          <td className="px-4 py-2.5">
                            <div className="font-semibold text-slate-800 text-sm">{student.name}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Form {student.form} {student.stream}</div>
                          </td>
                          <td className="px-4 py-2.5 text-center text-slate-400 text-xs">{student.gender}</td>
                          <td className="px-4 py-2.5 text-center bg-indigo-50/30">
                            <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-2 py-1 focus-within:ring-2 focus-within:ring-[#C20F47]/20 transition">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={value}
                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                className="w-10 text-center font-semibold text-slate-800 text-sm focus:outline-none"
                              />
                              <span className="text-[10px] font-medium text-slate-400 tabular-nums">%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] border tabular-nums ${gradeColor}`}>
                              {gradeResult.grade} ({gradeResult.points} pts)
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-center">
                            {value !== '' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                                <CheckCircle className="w-3 h-3" /> Entered
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded animate-pulse">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            {existingCard ? (
                              <button
                                onClick={() => handleTriggerParentSMS(existingCard, student)}
                                className="px-2.5 py-1.5 text-[11px] font-medium text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 transition rounded-lg cursor-pointer border-none"
                              >
                                Send SMS
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">Save marks first</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY CLASS TUTEES DESK (FORM 4 EAST CLASS TEACHER WORKSPACE) */}
      {activePortalTab === 'class_teacher' && (
        <div className="space-y-6">
          {/* Bento analytics aggregate metrics for Form 4 East */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="px-4 py-3.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Class Strengths</span>
              <div className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">7</div>
              <p className="text-xs text-slate-400 mt-1 tabular-nums">4 boys, 3 girls</p>
            </div>
            
            <div className="px-4 py-3.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide tabular-nums">Class Stream Mean</span>
              <div className="text-2xl font-bold text-indigo-600 mt-1.5">C+</div>
              <p className="text-xs text-emerald-600 mt-1 tabular-nums">▲ +0.6 pts (7.4)</p>
            </div>

            <div className="px-4 py-3.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Global Fee Deficit</span>
              <div className="text-2xl font-bold text-rose-600 mt-1.5 tabular-nums">
                KES {(students.filter(s=>s.form===4 && s.stream==='East').reduce((sum,s)=>sum+s.feeBalance, 0)).toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">Pending M-Pesa clearance</p>
            </div>

            <div className="px-4 py-3.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.25rem] shadow-sm flex flex-col justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Attendance index</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1.5 tabular-nums">94.4%</div>
              <p className="text-xs text-slate-400 mt-1">Excellent daily records</p>
            </div>
          </div>

          {/* Form 4 East Directory Grid */}
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C20F47]" />
                Form 4 East Tutees
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Fee validation & remarks as Class Teacher</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100 text-xs font-medium text-slate-500">
                    <th className="px-4 py-2.5">Pupil</th>
                    <th className="px-4 py-2.5 text-center">Class</th>
                    <th className="px-4 py-2.5 text-center">Fee Status</th>
                    <th className="px-4 py-2.5 text-center">Balance</th>
                    <th className="px-4 py-2.5">Remarks</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.filter(student => student.form === 4 && student.stream === 'East').map((student) => {
                    const currentRemarks = studentRemarks[student.id] || 'Write diagnostic review here...';
                    const isEditing = editingRemarksStudentId === student.id;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* pupil profile */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-rose-50 text-[#C20F47] flex items-center justify-center font-semibold text-xs shrink-0 tabular-nums">
                              {student.gender}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-slate-800 text-sm leading-tight truncate">{student.name}</div>
                              <div className="text-[11px] text-slate-400 tabular-nums mt-0.5">ADM {student.admissionNo} · {student.attendancePercentage}% attend.</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-2.5 text-center text-slate-500 text-xs">
                          F4 East
                        </td>

                        <td className="px-4 py-2.5 text-center">
                          {student.feeBalance <= 0 ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium rounded tabular-nums">
                              Cleared
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[11px] font-medium rounded tabular-nums animate-pulse">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-2.5 text-center tabular-nums font-medium text-slate-700 text-sm">
                          KES {student.feeBalance.toLocaleString()}
                        </td>

                        {/* teacher remarks area */}
                        <td className="px-4 py-2.5 max-w-sm">
                          {isEditing ? (
                            <div className="flex flex-col gap-1.5 w-full">
                              <textarea
                                value={tempRemarksText}
                                onChange={(e) => setTempRemarksText(e.target.value)}
                                rows={2}
                                className="w-full border border-slate-200 rounded-lg p-2 text-xs text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white"
                              />
                              <div className="flex justify-end gap-1.5 self-end">
                                <button
                                  onClick={() => setEditingRemarksStudentId(null)}
                                  className="px-2 py-1 text-[11px] font-medium text-slate-500 bg-slate-100 rounded hover:bg-slate-200 transition border-none"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveRemarks(student.id)}
                                  className="px-2 py-1 text-[11px] font-medium text-white bg-[#C20F47] rounded hover:bg-[#3D1D3F] transition border-none"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-1 justify-between text-slate-500 text-xs italic group">
                              <span className="leading-relaxed">"{currentRemarks}"</span>
                              <button
                                onClick={() => handleOpenRemarksEditor(student.id, currentRemarks)}
                                className="p-1 text-indigo-500 hover:text-indigo-700 transition invisible group-hover:visible cursor-pointer self-start border-none bg-transparent"
                                title="Edit comments"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-2.5 text-right">
                          {student.feeBalance > 0 ? (
                            <button
                              id={`desk-pay-${student.id}`}
                              onClick={() => handleTriggerStkPush(student.id, student.name, student.feeBalance)}
                              disabled={feeDeficitLoading !== null}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-medium rounded-lg cursor-pointer transition disabled:opacity-80 border-none"
                            >
                              {feeDeficitLoading === student.id ? (
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                              ) : (
                                "Collect Fee"
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-medium">Good standing</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KCSE PREDICTOR & TARGET SETTING FOR DANIEL'S CLASSES */}
      {activePortalTab === 'target_predictor' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Target Student Selector Box  (Col span 1) */}
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm h-fit gap-4 flex flex-col">
            <div className="flex items-center gap-2">
              <Calculator className="w-3.5 h-3.5 text-indigo-500" />
              <h3 className="font-semibold text-sm text-slate-800">Configure Student Targets</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Set a target KCSE grade to see the minimum marks required per subject.
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Choose Tutee</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer"
                >
                  {students.filter(student => student.form === 4 && student.stream === 'East').map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.admissionNo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Target Mean Grade</label>
                <select
                  value={targetKCSEGrade}
                  onChange={(e) => setTargetKCSEGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 cursor-pointer"
                >
                  {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'].map(g => (
                    <option key={g} value={g}>KCSE Grade {g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5">
              <div className="font-medium text-slate-600">Points Mapping</div>
              <div className="flex items-baseline justify-between text-slate-400 tabular-nums">
                <span>Grade targeted</span>
                <span className="font-semibold text-indigo-600">{targetKCSEGrade}</span>
              </div>
              <div className="flex items-baseline justify-between text-slate-400 tabular-nums">
                <span>Points required</span>
                <span className="font-semibold text-[#C20F47]">{targetScale.points}/12.0</span>
              </div>
            </div>
          </div>

          {/* Predictor Dashboard Sheet (Col span 2) */}
          <div className="md:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-sm text-slate-800">KCSE Grade Forecast</h3>
                <p className="text-xs text-slate-400 mt-0.5">For <span className="font-medium text-[#C20F47]">{currentTargetStudent?.name || 'Loading'}</span></p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-medium rounded-lg">
                Forecast Engine
              </span>
            </div>

            {currentTargetStudentSheet ? (
              <div className="space-y-4 flex-1 flex flex-col">
                {/* actual vs target meter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-center">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Current Mean Grade</span>
                    <div className="text-2xl font-bold text-rose-600 mt-1 tabular-nums">{currentTargetStudentSheet.meanGrade}</div>
                    <span className="text-[11px] text-slate-400 block mt-0.5 tabular-nums">{currentTargetStudentSheet.averagePoints}/12 pts</span>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-xl text-center">
                    <span className="text-[11px] font-medium text-indigo-400 uppercase tracking-wide block">Target Grade</span>
                    <div className="text-2xl font-bold text-indigo-600 mt-1 tabular-nums">{targetKCSEGrade}</div>
                    <span className="text-[11px] text-indigo-400 block mt-0.5 tabular-nums">{targetScale.points}/12 pts</span>
                  </div>
                </div>

                {/* Target checklist list */}
                <div>
                  <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-2">Minimum scores required</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { subject: 'mathematics', label: 'Mathematics (Core Science)', target: targetScale.mathematics, actual: currentTargetStudentSheet.mathematics || 0 },
                      { subject: 'english', label: 'English (Language)', target: targetScale.english, actual: currentTargetStudentSheet.english || 0 },
                      { subject: 'kiswahili', label: 'Kiswahili (Language)', target: targetScale.kiswahili, actual: currentTargetStudentSheet.kiswahili || 0 },
                      { subject: 'biology', label: 'Biology (Science Group)', target: targetScale.biology, actual: currentTargetStudentSheet.biology || 0 },
                      { subject: 'history', label: 'History & Government', target: targetScale.history, actual: currentTargetStudentSheet.history || 0 }
                    ].map((row) => {
                      const scoreDelta = row.target - row.actual;
                      const hasSucceeded = scoreDelta <= 0;

                      return (
                        <div key={row.subject} className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-700 block">{row.label}</span>
                            <div className="text-[11px] text-slate-400 mt-0.5 tabular-nums">
                              {row.actual}% actual · {row.target}% required
                            </div>
                          </div>
                          
                          <div className="text-right shrink-0">
                            {hasSucceeded ? (
                              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                <Check className="w-3 h-3" /> Met
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded animate-pulse">
                                +{scoreDelta}% needed
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* General Remedial Strategy suggestions */}
                <div className="bg-indigo-50 p-3 rounded-xl flex items-start gap-2.5 mt-auto">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-indigo-900 text-xs">Recommended focus</h5>
                    <p className="text-xs text-indigo-700/80 mt-0.5 leading-relaxed">
                      To reach {targetKCSEGrade}, focus on {targetKCSEGrade.startsWith('A') ? 'Mathematics & Biology' : 'quantitative electives'} with a 30-day prep track.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-400 space-y-2">
                <HelpCircle className="w-7 h-7 text-slate-300" />
                <p className="font-semibold text-sm text-slate-600">No scores found for this student yet.</p>
                <p className="text-xs">Enter marks in the spreadsheet first.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: ZIRA ANALYTICS GRAPHS AND CHARTS */}
      {activePortalTab === 'subject_analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chart element Col span 2 */}
          <div className="md:col-span-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-sm text-slate-800">Grade Distribution</h3>
                <p className="text-xs text-slate-400 mt-0.5">Letter grades for <span className="font-medium text-[#C20F47]">{activeLesson.subjectName}</span></p>
              </div>
              <div className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[11px] font-medium rounded">{exams.find(e=>e.id===selectedExamId)?.name || 'E'}</div>
            </div>

            <div className="h-64 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="Grade" stroke="#94a3b8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 11 }}
                  />
                  <Bar dataKey="Count" radius={[4, 4, 0, 0]}>
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick analysis summary cards */}
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm flex flex-col h-full justify-between gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-sm text-slate-800">Stream Comparison</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subject averages across East and West streams.
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-1">Form 4 East · Maths</div>
                  <div className="text-2xl font-bold text-slate-800 tabular-nums">B- (62.3%)</div>
                  <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                    <span>▲</span> Stream leader (D. Gitumu Hia)
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[11px] font-medium uppercase tracking-wide mb-1">Form 4 West · Maths</div>
                  <div className="text-2xl font-bold text-slate-800 tabular-nums">C (51.8%)</div>
                  <div className="text-xs text-slate-400 mt-1">Tutor: Mrs. Mercy Chepkoech</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-400 leading-relaxed">
              Rankings follow KNEC scale coefficients.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline Sub-Cell component for Bar color mappings
function Cell(props: any) {
  const { fill, ...rest } = props;
  return <rect fill={fill} {...rest} />;
}
