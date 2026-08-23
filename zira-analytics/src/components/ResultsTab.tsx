import React, { useState } from 'react';
import { Plus, X, Search, FileSignature, Award, CheckCircle2, Bookmark, BarChart3, Edit, Trash2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function ResultsTab() {
  const mockStudents = [
    { id: '1', name: 'Douglas Omari', admissionNo: 'AD1001' },
    { id: '2', name: 'Emily Wanjala', admissionNo: 'AD1002' },
    { id: '3', name: 'Lilian Chepotip', admissionNo: 'AD1004' },
    { id: '4', name: 'Adrian Kipirono', admissionNo: 'AD1005' },
    { id: '5', name: 'Pius Mwambia', admissionNo: 'AD1003' },
  ];

  const [examSheets, setExamSheets] = useState([
    { student: 'Douglas Omari', form: 4, averageMark: 81.2, remarks: 'Excellent performance, consistent focus' },
    { student: 'Emily Wanjala', form: 4, averageMark: 75.6, remarks: 'Very good score, keep up the effort' },
    { student: 'Lilian Chepotip', form: 4, averageMark: 72.1, remarks: 'Strong outcomes, capable of A grade' },
    { student: 'Adrian Kipirono', form: 4, averageMark: 68.4, remarks: 'Steady progress, enhance science revisions' }
  ]);

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newExamStudent, setNewExamStudent] = useState('');
  const [newExamForm, setNewExamForm] = useState(4);
  const [newExamAvg, setNewExamAvg] = useState(75.0);
  const [newExamRemarks, setNewExamRemarks] = useState('');
  const [examFormFilter, setExamFormFilter] = useState('All');
  const [examSearchQuery, setExamSearchQuery] = useState('');

  // Automatically derive rankings dynamically by descending order of averageMark!
  const rankedSheets = [...examSheets]
    .sort((a, b) => b.averageMark - a.averageMark)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));

  const filteredSheets = rankedSheets.filter(e => {
    const matchesSearch = e.student.toLowerCase().includes(examSearchQuery.toLowerCase()) ||
                          e.remarks.toLowerCase().includes(examSearchQuery.toLowerCase());
    const matchesForm = examFormFilter === 'All' || String(e.form) === examFormFilter;
    return matchesSearch && matchesForm;
  });

  const classMean = Math.round(examSheets.reduce((sum, e) => sum + e.averageMark, 0) / (examSheets.length || 1) * 10) / 10;

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-800">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Graded Pupils</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">{examSheets.length}</span>
            <span className="text-[16px] font-bold block mt-1.5 bg-indigo-50 text-indigo-700 w-fit px-2 py-0.5 rounded-md">
              Grade release version 1.4
            </span>
          </div>
          <FileSignature className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">School Mean Mark</span>
            <span className="text-4xl font-bold text-[var(--color-secondary)] tabular-nums block mt-1">{classMean}%</span>
            <span className="text-[16px] text-emerald-700 font-bold block mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">Passing requirement 50%+</span>
          </div>
          <Award className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-indigo-600 to-[var(--color-secondary)] p-5 md:p-6 rounded-2xl border border-transparent shadow-md relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-indigo-200 font-bold uppercase tracking-wider block">Principal Remarks</span>
            <span className="text-4xl font-bold text-white font-sans tracking-tight block mt-1">Released</span>
            <span className="text-[16px] text-white/80 font-bold block mt-1.5 tabular-nums">Open for parent inquiries</span>
          </div>
           <GraduationCap className="w-24 h-24 text-white opacity-10 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
      </div>

      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-indigo-600" />
              Term Final Exams Master Sheets
            </h3>
            <p className="text-[17px] text-slate-500 mt-1 font-medium max-w-xl">Automated compilation of end-of-term marks sheets with dynamic positional ranking calculation.</p>
          </div>
          <button 
            onClick={() => {
              setNewExamStudent('');
              setNewExamAvg(75.0);
              setNewExamRemarks('');
              setShowAddExamModal(true);
            }}
            className="px-4.5 py-2.5 bg-indigo-600 text-white text-[17px] font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add Master Record
          </button>
        </div>

        {/* Filtering Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -mt-2" />
            <input 
              type="text" 
              placeholder="Search candidate or comments..." 
              value={examSearchQuery}
              onChange={e => setExamSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 px-1.5 py-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[15px]">Form Level Filter</span>
            <select 
              value={examFormFilter}
              onChange={e => setExamFormFilter(e.target.value)}
              className="bg-transparent text-[17px] font-bold focus:outline-none text-slate-700 cursor-pointer appearance-none pl-2 pr-4 border-l border-slate-300 tabular-nums"
            >
              <option value="All">All Form Levels</option>
              <option value="4">Form 4</option>
              <option value="3">Form 3</option>
              <option value="2">Form 2</option>
              <option value="1">Form 1</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-lg border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums w-24">Rank #</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Candidate Name</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums text-center">Form Level</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums text-right">Mean Score Avg</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Performance Remarks</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[15px] tabular-nums">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 bg-white">
              <AnimatePresence>
                {filteredSheets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-400 font-bold">
                       <FileSignature className="w-10 h-10 text-slate-200 mx-auto mb-3 stroke-[1.5]" />
                      No pupil records found on the master sheet.
                    </td>
                  </tr>
                ) : (
                  filteredSheets.map(e => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={e.student} 
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-[17px] tabular-nums
                          ${e.rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                            e.rank === 2 ? 'bg-slate-200 text-slate-700 border border-slate-300' : 
                            e.rank === 3 ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                            'bg-slate-50 text-slate-500'}`}
                        >
                          {e.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[18px] text-slate-900 leading-tight">
                        {e.student}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold text-[16px] uppercase">Form {e.form}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-[var(--color-secondary)] tabular-nums text-[20px]">{e.averageMark.toFixed(1)}%</span>
                      </td>
                      <td className="px-6 py-4 text-[17px] text-slate-500 italic max-w-sm font-medium">"{e.remarks}"</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setExamSheets(prev => prev.filter(item => item.student !== e.student));
                            toast.success(`Exam credentials for ${e.student} excluded successfully.`);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                          title="Exclude Result Record"
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

      {/* ADD EXAM MASTER SHEET MODAL */}
      <AnimatePresence>
        {showAddExamModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2 tracking-tight uppercase tabular-nums">
                  <FileSignature className="w-5 h-5 text-indigo-600" /> Input Master Sheet Record
                </h3>
                <button onClick={() => setShowAddExamModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4 font-sans">
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Candidate Student</label>
                  <select 
                    value={newExamStudent}
                    onChange={e => setNewExamStudent(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-shadow"
                  >
                    <option value="">-- Choose Student --</option>
                    {mockStudents.map(s => (
                      <option key={s.id} value={s.name}>{s.name} (Ad. #{s.admissionNo})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Class Form Level</label>
                    <select 
                      value={newExamForm}
                      onChange={e => setNewExamForm(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-shadow"
                    >
                      <option value={1}>Form 1</option>
                      <option value={2}>Form 2</option>
                      <option value={3}>Form 3</option>
                      <option value={4}>Form 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Term Mean Score</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={newExamAvg}
                        onChange={e => setNewExamAvg(parseFloat(e.target.value) || 0)}
                        className="w-full pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold tabular-nums transition-shadow shadow-inner text-slate-900"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                      <span className="absolute right-3 top-1/2 -mt-2 text-slate-400 font-bold tabular-nums text-base">%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Evaluation Remarks</label>
                  <textarea 
                    value={newExamRemarks}
                    onChange={e => setNewExamRemarks(e.target.value)}
                    placeholder="e.g. Strong term results, consistent performance!"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold transition-shadow resize-none h-20 placeholder:text-slate-300"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      if (!newExamStudent) {
                        toast.error('Please specify a valid student candidate.');
                        return;
                      }
                      if (newExamAvg < 0 || newExamAvg > 100) {
                        toast.error('Marks averages must reside in the standard 0% to 100% threshold.');
                        return;
                      }
                      const finalRemarks = newExamRemarks.trim() || (newExamAvg > 70 ? 'Excellent score, keep it up!' : 'Satisfactory output, strive for improvements.');
                      
                      setExamSheets(prev => {
                        const filtered = prev.filter(item => item.student !== newExamStudent);
                        return [...filtered, {
                          student: newExamStudent,
                          form: newExamForm,
                          averageMark: newExamAvg,
                          remarks: finalRemarks
                        }];
                      });

                      toast.success(`Marksheet finalized successfully for ${newExamStudent}!`);
                      setShowAddExamModal(false);
                    }}
                    className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 text-[13.5px] hover:bg-indigo-700 transition-colors"
                  >
                    Commit Record Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
