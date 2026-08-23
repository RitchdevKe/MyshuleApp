import React, { useState } from 'react';
import { Plus, X, Search, FileText, CheckCircle2, Bookmark, BarChart3, Edit, Trash2, Award, Activity, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function AssessmentsTab() {
  const mockStudents = [
    { id: '1', name: 'Douglas Omari', admissionNo: 'AD1001' },
    { id: '2', name: 'Emily Wanjala', admissionNo: 'AD1002' },
    { id: '3', name: 'Pius Mwambia', admissionNo: 'AD1003' },
    { id: '4', name: 'Lilian Chepotip', admissionNo: 'AD1004' },
    { id: '5', name: 'Adrian Kipirono', admissionNo: 'AD1005' },
  ];

  const mockSubjects = ['Mathematics', 'English', 'Kiswahili', 'Chemistry', 'Biology'];

  const [assessments, setAssessments] = useState([
    { id: '1', student: 'Douglas Omari', subject: 'Mathematics', form: 4, stream: 'North', score: 28, maxScore: 30, catType: 'CAT 1' },
    { id: '2', student: 'Emily Wanjala', subject: 'Mathematics', form: 4, stream: 'South', score: 24, maxScore: 30, catType: 'CAT 1' },
    { id: '3', student: 'Douglas Omari', subject: 'Chemistry', form: 4, stream: 'North', score: 22, maxScore: 30, catType: 'CAT 2' },
    { id: '4', student: 'Pius Mwambia', subject: 'Mathematics', form: 2, stream: 'North', score: 19, maxScore: 30, catType: 'CAT 1' }
  ]);

  const [assessmentsSearch, setAssessmentsSearch] = useState('');
  const [assessmentsSubjectFilter, setAssessmentsSubjectFilter] = useState('All');

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.student.toLowerCase().includes(assessmentsSearch.toLowerCase()) ||
                          a.catType.toLowerCase().includes(assessmentsSearch.toLowerCase()) ||
                          a.subject.toLowerCase().includes(assessmentsSearch.toLowerCase());
    const matchesSubject = assessmentsSubjectFilter === 'All' || a.subject === assessmentsSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  const uniqueAssessmentSubjects = Array.from(new Set(assessments.map(a => a.subject)));

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-800">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Total Recorded CATs</span>
            <span className="text-4xl font-bold text-[var(--color-secondary)] tabular-nums block mt-1">{assessments.length}</span>
            <span className="text-[16px] font-bold block mt-1.5 bg-rose-50 text-[var(--color-secondary)] w-fit px-2 py-0.5 rounded-md">
              Mean: {Math.round(assessments.reduce((acc, a) => acc + (a.score / a.maxScore * 100), 0) / Math.max(assessments.length, 1))}%
            </span>
          </div>
          <FileText className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Top Score Track</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">
              {assessments.length ? Math.max(...assessments.map(a => Math.round((a.score / a.maxScore) * 100))) : 0}%
            </span>
            <span className="text-[16px] text-indigo-600 font-bold block mt-1.5 bg-indigo-50 w-fit px-2 py-0.5 rounded-md">Consistent tracking</span>
          </div>
          <Award className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Active Tiers</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">
               {Array.from(new Set(assessments.map(a => a.catType))).length} Tier(s)
            </span>
            <span className="text-[16px] text-emerald-600 font-bold block mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">Multi-stage assessment</span>
          </div>
           <BarChart3 className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
      </div>

      {/* Zeraki-Inspired Performance Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-1.5 rounded-[2.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm space-y-1.5">
           <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-wide font-sans">Grade Distribution (Cohort)</h4>
                <p className="text-[15px] text-slate-400 font-bold uppercase mt-1">Current Term Pass/Fail Curve</p>
              </div>
              <Activity className="w-5 h-5 text-indigo-500" />
           </div>
           
           <div className="flex items-end justify-between h-48 gap-2 pt-4">
              {[
                { grade: 'A', height: '15%', color: 'bg-emerald-500' },
                { grade: 'B', height: '35%', color: 'bg-emerald-400' },
                { grade: 'C', height: '25%', color: 'bg-indigo-400' },
                { grade: 'D', height: '15%', color: 'bg-amber-400' },
                { grade: 'E', height: '10%', color: 'bg-rose-500' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                   <div className="w-full relative group">
                      <div className={`w-full ${bar.color} rounded-t-xl transition-all duration-700 hover:brightness-110`} style={{ height: bar.height }} />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[14px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {bar.height}
                      </div>
                   </div>
                   <span className="text-[15px] font-bold text-slate-400 uppercase tracking-wide">{bar.grade}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-1.5 rounded-[2.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm space-y-1.5">
           <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 uppercase tracking-wide font-sans">Subject Mean Comparison</h4>
                <p className="text-[15px] text-slate-400 font-bold uppercase mt-1">Academic Year MS Streaks</p>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
           </div>

           <div className="space-y-4">
              {[
                { sub: 'Mathematics', ms: 8.4, trend: 'up' },
                { sub: 'English', ms: 7.2, trend: 'down' },
                { sub: 'Kiswahili', ms: 7.9, trend: 'up' },
                { sub: 'Biology', ms: 6.8, trend: 'stable' },
              ].map((s, i) => (
                <div key={i} className="space-y-1.5">
                   <div className="flex justify-between text-[15px] font-bold uppercase tracking-tight">
                     <span className="text-slate-900">{s.sub}</span>
                     <span className={s.trend === 'up' ? 'text-emerald-600' : s.trend === 'down' ? 'text-rose-600' : 'text-slate-500'}>
                        {s.ms} MS
                     </span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${s.trend === 'up' ? 'bg-emerald-500' : s.trend === 'down' ? 'bg-rose-500' : 'bg-slate-400'}`} 
                        style={{ width: `${(s.ms / 12) * 100}%` }} 
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Continuous Assessments (CAT) Register
          </h3>
          <p className="text-[17px] text-slate-500 mt-1 font-medium">Capture midterm examination tracking and regular testing inputs seamlessly.</p>
        </div>

        {/* Quick Record Booking Section */}
        <div className="p-5 bg-indigo-50/30 border-b border-indigo-100 space-y-4 text-slate-800 text-lg font-semibold relative">
          <span className="text-[15px] uppercase font-bold tracking-widest text-[var(--color-secondary)] bg-rose-50 px-2 py-1 rounded inline-block">Quick-Book Terminal Score</span>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="w-full">
              <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Select Student</label>
              <select 
                id="cat-student-select"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 cursor-pointer appearance-none"
              >
                <option value="">-- Choose Candidate --</option>
                {mockStudents.map(s => (
                  <option key={s.id} value={s.name}>{s.name} (Ad. #{s.admissionNo})</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Subject</label>
              <select 
                id="cat-subject-select"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 cursor-pointer appearance-none"
              >
                {mockSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Tier & Score (Out of 30)</label>
              <div className="flex gap-2">
                <select 
                  id="cat-tier-select"
                  className="w-24 px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[17px] font-bold text-slate-800 cursor-pointer appearance-none"
                >
                  <option value="CAT 1">CAT 1</option>
                  <option value="CAT 2">CAT 2</option>
                  <option value="CAT 3">CAT 3</option>
                </select>
                <input 
                  type="number" 
                  id="cat-score-val" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 tabular-nums shadow-inner" 
                  placeholder="e.g. 25" 
                  min="0" 
                  max="30" 
                />
              </div>
            </div>
            <div className="w-full">
              <button 
                onClick={() => {
                  const studentSelect = document.getElementById('cat-student-select') as HTMLSelectElement;
                  const subjectSelect = document.getElementById('cat-subject-select') as HTMLSelectElement;
                  const tierSelect = document.getElementById('cat-tier-select') as HTMLSelectElement;
                  const scoreVal = document.getElementById('cat-score-val') as HTMLInputElement;

                  const studentName = studentSelect?.value;
                  const subjectName = subjectSelect?.value;
                  const tierName = tierSelect?.value || 'CAT 1';
                  const scoreStr = scoreVal?.value;

                  if (studentName && subjectName && scoreStr) {
                    const scoreNum = Number(scoreStr);
                    if (scoreNum < 0 || scoreNum > 30) {
                      toast.error('CAT scores must be within the absolute 0 - 30 range.');
                      return;
                    }
                    const rando = Math.random() > 0.5;
                    setAssessments([{
                      id: String(Date.now()),
                      student: studentName,
                      subject: subjectName,
                      form: rando ? 4 : 3,
                      stream: rando ? 'North' : 'South',
                      score: scoreNum,
                      maxScore: 30,
                      catType: tierName
                    }, ...assessments]);
                    
                    scoreVal.value = '';
                    toast.success(`CAT marks allocated successfully for ${studentName}!`);
                  } else {
                    toast.error('Please specify the candidate student and recorded score.');
                  }
                }}
                className="w-full px-5 py-3 bg-[var(--color-secondary)] text-white text-[13.5px] font-bold rounded-xl hover:bg-[var(--color-primary)] transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[var(--color-secondary)]/20"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Add Score Record
              </button>
            </div>
          </div>
        </div>

        {/* Filtering Bar */}
        <div className="p-4 border-b border-slate-150 bg-white flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -mt-2" />
            <input 
              type="text" 
              placeholder="Filter by student, tier..." 
              value={assessmentsSearch}
              onChange={e => setAssessmentsSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 transition-all tabular-nums"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 border border-slate-200 bg-slate-50 rounded-xl px-3 py-2">
            <Bookmark className="w-4 h-4 text-slate-400" />
            <select 
              value={assessmentsSubjectFilter}
              onChange={e => setAssessmentsSubjectFilter(e.target.value)}
              className="bg-transparent text-[17px] font-bold focus:outline-none text-slate-700 cursor-pointer appearance-none pr-4 font-sans"
            >
              <option value="All">All Subjects</option>
              {uniqueAssessmentSubjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-lg border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Pupil Identity</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Course/Subject</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Form Stream</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums text-center">Class Tier</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums text-right">Raw Score</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums text-right">Percentage</th>
                <th className="px-5 py-3.5 text-right font-bold uppercase tracking-wider text-[15px] tabular-nums">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              <AnimatePresence>
                {filteredAssessments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">
                       <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3 stroke-[1.5]" />
                      No matching assessment marks sheets are currently active.
                    </td>
                  </tr>
                ) : (
                  filteredAssessments.map(a => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={a.id} 
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 font-bold text-[18px] text-slate-900 leading-tight">
                        {a.student}
                      </td>
                      <td className="px-5 py-4 text-slate-700 text-[17px]">{a.subject}</td>
                      <td className="px-5 py-4 text-slate-500 text-[17px]">Form {a.form} <span className="text-slate-400">({a.stream})</span></td>
                      <td className="px-5 py-4 text-center">
                        <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 font-bold text-[15px] uppercase tracking-wider tabular-nums">
                          {a.catType}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="font-bold text-slate-900 tabular-nums text-[18px]">{a.score}</span>
                        <span className="text-slate-400 tabular-nums text-[16px]"> /{a.maxScore}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[16px] ${
                          (a.score / a.maxScore) >= 0.8 ? 'bg-emerald-100 text-emerald-800' :
                          (a.score / a.maxScore) >= 0.6 ? 'bg-blue-100 text-blue-800' :
                          (a.score / a.maxScore) >= 0.5 ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {Math.round((a.score / a.maxScore) * 100)}%
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setAssessments(prev => prev.filter(item => item.id !== a.id));
                            toast.success(`Assessment entry cleared.`);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Revoke / Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
