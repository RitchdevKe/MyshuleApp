import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Bookmark,
  Sparkles,
  Search,
  BookMarked
} from 'lucide-react';
import { Student, Exam, FeeTransaction } from '../types.ts';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface StudentPortalProps {
  students: Student[];
  exams: Exam[];
}

export function StudentPortal({ students, exams }: StudentPortalProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'ADM-2041');
  const activeStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'timetable' | 'assignments' | 'results' | 'library'>('profile');

  // Simulated scores formula (consistent with ParentPortal)
  const getSubjectScores = (studId: string) => {
    let seed = 0;
    for (let i = 0; i < studId.length; i++) seed += studId.charCodeAt(i);

    const scores = [
      { subject: 'Mathematics', score: Math.floor((seed * 7) % 55 + 40) },
      { subject: 'English', score: Math.floor((seed * 11) % 45 + 50) },
      { subject: 'Kiswahili', score: Math.floor((seed * 13) % 40 + 55) },
      { subject: 'Biology', score: Math.floor((seed * 17) % 50 + 45) },
      { subject: 'Chemistry', score: Math.floor((seed * 19) % 45 + 45) },
      { subject: 'Physics', score: Math.floor((seed * 23) % 40 + 50) },
    ];

    const total = scores.reduce((sum, s) => sum + s.score, 0);
    const average = Math.round(total / scores.length);
    
    let meanGrade = 'D';
    if (average >= 80) meanGrade = 'A';
    else if (average >= 75) meanGrade = 'A-';
    else if (average >= 70) meanGrade = 'B+';
    else if (average >= 65) meanGrade = 'B';
    else if (average >= 60) meanGrade = 'B-';
    else if (average >= 55) meanGrade = 'C+';
    else if (average >= 50) meanGrade = 'C';
    else if (average >= 45) meanGrade = 'C-';
    else if (average >= 40) meanGrade = 'D+';

    return { scores, total, average, meanGrade };
  };

  const results = getSubjectScores(activeStudent?.id || 'ADM-2041');

  // Library records mock
  const [borrowedBooks, setBorrowedBooks] = useState([
    { id: '1', title: 'Secondary School Mathematics Form 4', borrowDate: '2026-05-15', dueDate: '2026-06-01', status: 'Active' },
    { id: '2', title: 'Blossoms of the Savannah Guidebook', borrowDate: '2026-04-10', dueDate: '2026-05-10', status: 'Overdue' },
    { id: '3', title: 'Secondary Biology Textbook Vol 3', borrowDate: '2026-05-28', dueDate: '2026-06-12', status: 'Active' }
  ]);

  // Fines calculation (fines accumulate Ksh. 50 per day past due date)
  const calculateFine = (dueDateStr: string): number => {
    const today = new Date('2026-06-02'); // Fixed sandbox calendar today logic
    const dueDate = new Date(dueDateStr);
    if (today > dueDate) {
      const diffTime = Math.abs(today.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays * 50; // 50 KES/day fine
    }
    return 0;
  };

  // Student Timetable mock
  const timetableDays = [
    { day: 'Monday', periods: [
      { r: '08:00 AM', s: 'Mathematics', t: 'Mr. Gitumu' },
      { r: '09:00 AM', s: 'English', t: 'Mrs. Ndwiga' },
      { r: '10:00 AM', s: 'Break Interval', t: '-' },
      { r: '10:20 AM', s: 'Biology', t: 'Mrs. Chepkoech' },
      { r: '11:20 AM', s: 'Kiswahili', t: 'Mr. Omwamba' },
      { r: '12:20 PM', s: 'Physics', t: 'Mr. Gitumu' }
    ]},
    { day: 'Tuesday', periods: [
      { r: '08:00 AM', s: 'Chemistry', t: 'Mr. Gitumu' },
      { r: '09:00 AM', s: 'CRE', t: 'Mrs. J. Tabitha' },
      { r: '10:00 AM', s: 'Break Interval', t: '-' },
      { r: '10:20 AM', s: 'Mathematics', t: 'Mr. Gitumu' },
      { r: '11:20 AM', s: 'Geography', t: 'Mr. Omwamba' },
      { r: '12:20 PM', s: 'English', t: 'Mrs. Ndwiga' }
    ]},
    { day: 'Wednesday', periods: [
      { r: '08:00 AM', s: 'Biology', t: 'Mrs. Chepkoech' },
      { r: '09:00 AM', s: 'Physics', t: 'Mr. Gitumu' },
      { r: '10:00 AM', s: 'Break Interval', t: '-' },
      { r: '10:20 AM', s: 'Kiswahili', t: 'Mr. Omwamba' },
      { r: '11:20 AM', s: 'Chemistry', t: 'Mr. Gitumu' },
      { r: '12:20 PM', s: 'History', t: 'Mr. K. Dennis' }
    ]}
  ];

  const [activeTimetableDay, setActiveTimetableDay] = useState('Monday');

  // Student assignments checklist
  const [assignments, setAssignments] = useState([
    { id: '1', title: 'Organic Chemistry Practical Report', subject: 'Chemistry', due: '2026-06-04', status: 'Pending', points: 20 },
    { id: '2', title: 'Calculus Trigonometry Practice Sheet 4', subject: 'Mathematics', due: '2026-06-05', status: 'Pending', points: 15 },
    { id: '3', title: 'Form 4 English Essay - Blossoms of Savannah Theme', subject: 'English', due: '2026-06-08', status: 'Submitted', points: 30 },
    { id: '4', title: 'Mendelian Genetics Crossbreeding CAT review', subject: 'Biology', due: '2026-06-10', status: 'Pending', points: 25 },
  ]);

  const handleToggleAssignmentStatus = (id: string) => {
    setAssignments(prev => prev.map(a => 
      a.id === id 
        ? { ...a, status: a.status === 'Pending' ? 'Submitted' : 'Pending' } 
        : a
    ));
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Search selection simulator bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-2 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl gap-1.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-secondary)]" />
          <span className="text-lg font-bold text-slate-900 uppercase">Impersonate Student Access:</span>
        </div>
        <select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 text-lg font-bold text-slate-850 cursor-pointer"
        >
          {students.map(s => (
            <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
          ))}
        </select>
      </div>

      {/* Profile Plate Card */}
      <div className="bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-header-bg)] text-white p-6 rounded-3xl border-[4px] border-[var(--color-secondary)] shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-inner tabular-nums">
            {activeStudent?.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-sans">{activeStudent?.name}</h2>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1 text-[17px] text-white/85 font-semibold">
              <span className="bg-white/15 px-2 py-0.5 rounded-lg">ADM No: {activeStudent?.id}</span>
              <span>•</span>
              <span>Form {activeStudent?.form} {activeStudent?.stream}</span>
              <span>•</span>
              <span className="text-yellow-400 font-bold">{results.meanGrade} Mean Grade</span>
            </div>
          </div>
        </div>

        <div className="text-right text-[17px] font-semibold bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <span className="text-white/60 block text-[15px] font-bold uppercase">Tuition Fee Clearance</span>
          <span className="font-bold text-white text-xl block mt-0.5">
            KES {activeStudent?.feeBalance === 0 ? 'CLEARED' : `${activeStudent?.feeBalance.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 font-bold text-lg uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'profile'
              ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Profile Card
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2.5 font-bold text-lg uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'timetable'
              ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Timetable
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2.5 font-bold text-lg uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'assignments'
              ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Assignments
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2.5 font-bold text-lg uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'results'
              ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Exam Scores
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2.5 font-bold text-lg uppercase tracking-wider border-b-2 transition cursor-pointer ${
            activeTab === 'library'
              ? 'border-[var(--color-secondary)] text-[var(--color-secondary)]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Library Books
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg font-semibold">
          {/* Detailed Metadata fields */}
          <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
            <h3 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-indigo-600" /> Bio & Contact Particulars
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Gender</span>
                <span className="text-slate-800 mt-1 block">{activeStudent?.gender === 'M' ? 'Male Candidate' : 'Female Candidate'}</span>
              </div>
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Primary Phone No</span>
                <span className="text-slate-800 mt-1 block">+254 756 201192</span>
              </div>
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Boarding Type</span>
                <span className="text-indigo-600 mt-1 block">Boarding Candidate</span>
              </div>
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Admission Date</span>
                <span className="text-slate-800 mt-1 block">Jan 12, 2024</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
            <h3 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" /> Hostel & Transport Assignments
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Hostel Block</span>
                <span className="text-slate-800 mt-1 block">Aberdares Crest Dormitory</span>
              </div>
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Transport Assignment</span>
                <span className="text-slate-800 mt-1 block">Route B - Ngong / Karen Ring</span>
              </div>
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Blood Group</span>
                <span className="text-indigo-600 mt-1 block">O- Positive</span>
              </div>
              <div>
                <span className="text-[16px] text-slate-400 block uppercase font-bold">Allergies Info</span>
                <span className="text-slate-800 mt-1 block">None registered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timetable' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <h3 className="text-lg font-bold text-slate-900 uppercase">Class Form Weekly Rotations</h3>
            <div className="flex gap-1.5">
              {['Monday', 'Tuesday', 'Wednesday'].map(day => (
                <button
                  key={day}
                  onClick={() => setActiveTimetableDay(day)}
                  className={`px-3 py-1 text-[16px] font-bold rounded-lg uppercase tracking-wide cursor-pointer border ${
                    activeTimetableDay === day
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {timetableDays.find(d => d.day === activeTimetableDay)?.periods.map((p, idx) => (
              <div key={idx} className="flex justify-between items-center text-lg font-semibold p-3 bg-slate-50 rounded-2xl border border-slate-150">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 tabular-nums text-[16px] block">{p.r}</span>
                  <div>
                    <span className="font-bold text-slate-900 block">{p.s}</span>
                    <span className="text-[15px] text-slate-400 font-normal uppercase mt-0.5 block">{p.t}</span>
                  </div>
                </div>
                <span className="text-[16px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold uppercase">Approved Period</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">Assignments Checklist</h3>

          <div className="space-y-3">
            {assignments.map(a => (
              <div key={a.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-150 text-lg font-semibold">
                <div>
                  <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 rounded text-[15px] uppercase tracking-wider block w-fit mb-1.5">{a.subject}</span>
                  <span className="font-bold text-slate-950 text-xl block">{a.title}</span>
                  <span className="text-[16px] text-slate-400 font-bold uppercase mt-1 block">Due: {a.due} • Value: {a.points} Pts</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${a.status === 'Submitted' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-rose-50 text-rose-700 border-rose-250'}`}>
                    {a.status}
                  </span>
                  <button
                    onClick={() => handleToggleAssignmentStatus(a.id)}
                    className="px-3.5 py-1.5 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white text-[16px] font-bold rounded-xl uppercase transition cursor-pointer"
                  >
                    {a.status === 'Pending' ? 'Hand In' : 'Recall Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detailed results sheet */}
          <div className="lg:col-span-2 bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
            <h3 className="text-lg font-bold text-slate-900 uppercase">End-of-Term Continuous Assessment</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-lg border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-250 text-slate-400 text-[16px] uppercase font-bold">
                    <th className="px-4 py-2 whitespace-nowrap">Subject Course</th>
                    <th className="px-4 py-2 text-center whitespace-nowrap">Score Mark</th>
                    <th className="px-4 py-2 text-center whitespace-nowrap">Mean Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {results.scores.map(sc => (
                    <tr key={sc.subject} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-bold whitespace-nowrap">{sc.subject}</td>
                      <td className="px-4 py-2.5 text-center tabular-nums whitespace-nowrap">{sc.score} %</td>
                      <td className="px-4 py-2.5 text-center font-bold text-[19px] text-indigo-600 tabular-nums whitespace-nowrap">
                        {sc.score >= 80 ? 'A' : sc.score >= 70 ? 'B+' : sc.score >= 60 ? 'B-' : sc.score >= 50 ? 'C' : 'D'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results stats gauge */}
          <div className="lg:col-span-1 bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 uppercase border-b border-slate-100 pb-2">Academic Metrics</h3>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-center space-y-1">
                <span className="text-[16px] font-bold text-indigo-700 uppercase tracking-wide">Weighted School Mean</span>
                <span className="text-4xl font-bold text-slate-900 block font-sans">{results.average}%</span>
                <span className="text-lg text-slate-500 font-bold block">Terminal Rank Factor: {results.meanGrade}</span>
              </div>
            </div>

            <div className="text-[16px] bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl px-1.5 py-2.5 text-center tabular-nums">
              ✔️ Certified dynamic parent sign-off signature requested on report dispatch.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-150 pb-3">
            <h3 className="text-lg font-bold text-slate-900 uppercase">My Library checked out books</h3>
            <span className="text-[16px] bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] px-2 py-0.5 rounded font-bold uppercase">Dynamic lend ledger</span>
          </div>

          <div className="space-y-3">
            {borrowedBooks.map(bk => {
              const fineVal = calculateFine(bk.dueDate);
              return (
                <div key={bk.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-150 text-lg font-semibold">
                  <div>
                    <span className="font-bold text-slate-900 text-xl block">{bk.title}</span>
                    <span className="text-[16px] text-slate-400 font-bold block mt-1 uppercase">Borrowed: {bk.borrowDate} • Due Date: {bk.dueDate}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {fineVal > 0 && (
                      <span className="text-rose-600 font-bold tabular-nums text-center">
                        Accrued Fine: KES {fineVal.toLocaleString()}
                        <span className="text-[15px] font-bold block text-slate-400 uppercase">Ksh. 50 / day fine</span>
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-full font-bold text-[15px] uppercase tracking-wider border ${bk.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' : 'bg-rose-50 text-rose-700 border-rose-250 animate-pulse'}`}>
                      {bk.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
