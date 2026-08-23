import React, { useState } from 'react';
import { Plus, X, Search, BookOpen, BarChart, Layers, Trash2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function SubjectsTab() {
  const [subjectsList, setSubjectsList] = useState([
    { id: '1', code: 'MAT', name: 'Mathematics', dept: 'Sciences', coefficient: 1.2, average: 74, lead: 'Mr. Daniel Gitumu' },
    { id: '2', code: 'ENG', name: 'English', dept: 'Languages', coefficient: 1.0, average: 68, lead: 'Mrs. Angela Ndwiga' },
    { id: '3', code: 'KIS', name: 'Kiswahili', dept: 'Languages', coefficient: 1.0, average: 71, lead: 'Mr. Dennis Omwamba' },
    { id: '4', code: 'CHE', name: 'Chemistry', dept: 'Sciences', coefficient: 1.1, average: 59, lead: 'Mr. Daniel Gitumu' },
    { id: '5', code: 'BIO', name: 'Biology', dept: 'Sciences', coefficient: 1.1, average: 65, lead: 'Mrs. Mercy Chepkoech' }
  ]);

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjCode, setNewSubjCode] = useState('');
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjDept, setNewSubjDept] = useState('Sciences');
  const [newSubjCoeff, setNewSubjCoeff] = useState(1.0);
  const [newSubjAvg, setNewSubjAvg] = useState(70);
  const [newSubjLead, setNewSubjLead] = useState('');
  const [subjSearchQuery, setSubjSearchQuery] = useState('');
  const [subjDeptFilter, setSubjDeptFilter] = useState('All');

  const filteredSubjects = subjectsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(subjSearchQuery.toLowerCase()) || 
                          s.code.toLowerCase().includes(subjSearchQuery.toLowerCase()) ||
                          s.lead.toLowerCase().includes(subjSearchQuery.toLowerCase());
    const matchesDept = subjDeptFilter === 'All' || s.dept === subjDeptFilter;
    return matchesSearch && matchesDept;
  });

  const uniqueDepts = Array.from(new Set(subjectsList.map(s => s.dept)));

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-800">
        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Coordinated Courses</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">{subjectsList.length}</span>
            <span className="text-[12.5px] text-emerald-600 font-bold block mt-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">Syllabus compliance active</span>
          </div>
          <BookOpen className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Departments Listed</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">{uniqueDepts.length}</span>
            <span className="text-[12.5px] text-indigo-600 font-bold block mt-1.5 bg-indigo-50 w-fit px-2 py-0.5 rounded-md">Sciences, Languages & Arts</span>
          </div>
           <Layers className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
           <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">School Midterm Mean</span>
            <span className="text-4xl font-bold text-slate-900 tabular-nums block mt-1">
              {Math.round(subjectsList.reduce((acc, s) => acc + s.average, 0) / (subjectsList.length || 1))}%
            </span>
            <span className="text-[12.5px] text-amber-600 font-bold block mt-1.5 bg-amber-50 w-fit px-2 py-0.5 rounded-md">Target coefficient: 1.12</span>
          </div>
          <BarChart className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
      </div>

      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Interactive Subjects Coordinator
            </h3>
            <p className="text-[17px] text-slate-500 mt-1 font-medium">Central register of course subjects, coefficient weights, and department leads</p>
          </div>
          <button 
            onClick={() => {
              setNewSubjCode('');
              setNewSubjName('');
              setNewSubjDept('Sciences');
              setNewSubjCoeff(1.0);
              setNewSubjLead('');
              setShowAddSubjectModal(true);
            }}
            className="px-4.5 py-2.5 bg-indigo-600 text-white text-[17px] font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Add Academic Subject
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -mt-2" />
            <input 
              type="text" 
              placeholder="Search code, name..." 
              value={subjSearchQuery}
              onChange={e => setSubjSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-lg font-semibold text-slate-800 transition-all"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 px-1.5 py-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={subjDeptFilter}
              onChange={e => setSubjDeptFilter(e.target.value)}
              className="bg-transparent text-[17px] font-bold focus:outline-none text-slate-700 cursor-pointer appearance-none pr-4"
            >
              <option value="All">All Departments</option>
              <option value="Sciences">Sciences</option>
              <option value="Languages">Languages</option>
              <option value="Humanities">Humanities</option>
              <option value="Applied">Applied Sciences</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-lg border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Code</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Subject Name</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Department</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Coefficient</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">School Mean</th>
                <th className="px-5 py-3.5 font-bold uppercase tracking-wider text-[15px] tabular-nums">Department Lead</th>
                <th className="px-5 py-3.5 text-right font-bold uppercase tracking-wider text-[15px] tabular-nums">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              <AnimatePresence>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400 font-bold">
                       <Layers className="w-10 h-10 text-slate-200 mx-auto mb-3 stroke-[1.5]" />
                      No subjects matched the specified criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map(s => (
                    <motion.tr 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={s.id} 
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-5 py-4 tabular-nums font-bold text-[17px]">
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">{s.code}</span>
                      </td>
                      <td className="px-5 py-4 font-bold text-[18px] text-slate-900">{s.name}</td>
                      <td className="px-5 py-4 text-slate-600 text-[17px]">{s.dept}</td>
                      <td className="px-5 py-4 tabular-nums text-[17px] text-slate-600 bg-slate-50/30">x{s.coefficient}</td>
                      <td className="px-5 py-4 tabular-nums font-bold text-[17px] text-slate-900">
                        {s.average}%
                      </td>
                      <td className="px-5 py-4 text-[17px] text-slate-700 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[14px] font-bold text-slate-500">
                          {s.lead.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                        {s.lead}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => {
                            setSubjectsList(prev => prev.filter(item => item.id !== s.id));
                            toast.success(`${s.name} successfully removed from subjects matrix.`);
                          }}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove subject"
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

      {/* ADD SUBJECT MODAL DIALOG */}
      <AnimatePresence>
        {showAddSubjectModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl p-1.5 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-bold text-slate-900 text-xl tabular-nums uppercase tracking-tight">Register New Subject</h3>
                <button 
                  onClick={() => setShowAddSubjectModal(false)} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <div className="space-y-4 font-sans border-b border-transparent">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Code</label>
                    <input 
                      type="text" 
                      value={newSubjCode}
                      onChange={e => setNewSubjCode(e.target.value.toUpperCase())}
                      placeholder="MAT"
                      maxLength={3}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold tabular-nums text-center tracking-wider transition-shadow"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Title</label>
                    <input 
                      type="text" 
                      value={newSubjName}
                      onChange={e => setNewSubjName(e.target.value)}
                      placeholder="e.g. Mathematics"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold transition-shadow"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Department</label>
                  <select 
                    value={newSubjDept}
                    onChange={e => setNewSubjDept(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow appearance-none"
                  >
                    <option value="Sciences">Sciences</option>
                    <option value="Languages">Languages</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Applied">Applied Sciences</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Coefficient</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={newSubjCoeff}
                      onChange={e => setNewSubjCoeff(parseFloat(e.target.value) || 1.0)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold tabular-nums transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Mean (%)</label>
                    <input 
                      type="number" 
                      value={newSubjAvg}
                      onChange={e => setNewSubjAvg(parseInt(e.target.value) || 70)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold tabular-nums transition-shadow"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">HOD Lead</label>
                  <input 
                    type="text" 
                    value={newSubjLead}
                    onChange={e => setNewSubjLead(e.target.value)}
                    placeholder="e.g. Mr. Daniel Gitumu"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold transition-shadow"
                  />
                </div>
                
                <button 
                  onClick={() => {
                    if (!newSubjCode.trim() || !newSubjName.trim()) {
                      toast.error('Code and Name are required variables.');
                      return;
                    }
                    const newId = Math.random().toString(36).substring(7);
                    setSubjectsList([...subjectsList, {
                      id: newId,
                      code: newSubjCode,
                      name: newSubjName,
                      dept: newSubjDept,
                      coefficient: newSubjCoeff,
                      average: newSubjAvg,
                      lead: newSubjLead || 'Unassigned'
                    }]);
                    toast.success('Course registry updated matrix configuration!');
                    setShowAddSubjectModal(false);
                  }}
                  className="w-full py-3 mt-4 bg-indigo-600 text-white font-bold rounded-xl text-[13.5px] shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition"
                >
                  Save Subject Configuration
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
