import React, { useState } from 'react';
import { Plus, X, Search, CheckCircle2, Bookmark, BarChart3, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function CurriculumTab() {
  const mockSubjects = ['Mathematics', 'English', 'Kiswahili', 'Chemistry', 'Biology'];

  const [curriculumState, setCurriculumState] = useState([
    { id: '1', topic: 'Quadratic Expressions & Equations', subject: 'Mathematics Form 3', progress: 100, teacher: 'Mr. Daniel Gitumu' },
    { id: '2', topic: 'Matrices & Transformations', subject: 'Mathematics Form 4', progress: 40, teacher: 'Mr. Daniel Gitumu' },
    { id: '3', topic: 'The River and the Source Review', subject: 'English Form 4', progress: 85, teacher: 'Mrs. Angela Ndwiga' },
    { id: '4', topic: 'Organic Chemistry II', subject: 'Chemistry Form 4', progress: 20, teacher: 'Mr. Daniel Gitumu' },
    { id: '5', topic: 'Support and Movement', subject: 'Biology Form 4', progress: 60, teacher: 'Mrs. Mercy Chepkoech' }
  ]);

  const [showAddCurriculumModal, setShowAddCurriculumModal] = useState(false);
  const [newCurrTopic, setNewCurrTopic] = useState('');
  const [newCurrSubject, setNewCurrSubject] = useState('Mathematics Form 4');
  const [newCurrProgress, setNewCurrProgress] = useState(50);
  const [newCurrTeacher, setNewCurrTeacher] = useState('');
  const [currSearchQuery, setCurrSearchQuery] = useState('');

  const filteredCurriculum = curriculumState.filter(c => {
    return c.topic.toLowerCase().includes(currSearchQuery.toLowerCase()) || 
           c.subject.toLowerCase().includes(currSearchQuery.toLowerCase()) ||
           c.teacher.toLowerCase().includes(currSearchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      
      {/* Header Card */}
      <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm p-6 relative group">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-slate-100 pb-0">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Syllabus Completion Index
            </h3>
            <p className="text-[17px] text-slate-500 mt-1 font-medium max-w-xl">Live termly topic syllabus coverage tracking records to ensure educational milestones are reached predictably.</p>
          </div>
          <button 
            onClick={() => {
              setNewCurrTopic('');
              setNewCurrTeacher('');
              setNewCurrProgress(50);
              setShowAddCurriculumModal(true);
            }}
            className="px-4.5 py-2.5 bg-indigo-600 text-white text-[17px] font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Book Scheme
          </button>
        </div>
        <BarChart3 className="w-32 h-32 text-indigo-50 absolute -right-6 -bottom-8 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -mt-2" />
          <input 
            type="text" 
            placeholder="Search schemes of work..." 
            value={currSearchQuery}
            onChange={e => setCurrSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AnimatePresence>
          {filteredCurriculum.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-16 text-center text-slate-400 font-bold lg:col-span-2 bg-white border border-slate-150 rounded-2xl shadow-sm"
            >
              <Bookmark className="w-10 h-10 mx-auto text-slate-200 mb-3 stroke-[1.5]" />
              No syllabus topics matched the filter parameters.
            </motion.div>
          ) : (
            filteredCurriculum.map(c => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={c.id} 
                className="p-5 bg-white rounded-2xl border border-slate-150 shadow-sm relative group hover:border-indigo-200 transition-colors hover:shadow-md"
              >
                <div className="flex justify-between items-start text-lg font-bold text-slate-900 mb-4">
                  <div className="pr-12">
                    <span className="text-[14px] uppercase font-bold tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                      {c.subject}
                    </span>
                    <h4 className="text-xl font-bold text-slate-900 leading-tight">{c.topic}</h4>
                  </div>
                  
                  <div className="flex items-center gap-1 absolute top-5 right-5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setCurriculumState(prev => prev.filter(item => item.id !== c.id));
                        toast.success(`Archived topic: ${c.topic}`);
                      }}
                      className="w-8 h-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center text-base cursor-pointer transition-colors"
                      title="De-register Topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Visual Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[15px] font-bold text-slate-500 uppercase tracking-wide tabular-nums">Completion</span>
                    <span className="text-base font-bold text-slate-900 tabular-nums">{c.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${c.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${c.progress}%` }} 
                    />
                  </div>
                </div>
                
                {/* Inline Controls & Instructor */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-3 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[14px] font-bold text-slate-500 shrink-0">
                      {c.teacher.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                    </div>
                    <span className="text-slate-600 font-semibold text-[17px] truncate max-w-[150px]">{c.teacher}</span>
                  </div>

                  <div className="flex bg-slate-50 p-1 rounded-xl items-center border border-slate-150">
                    <button
                      onClick={() => setCurriculumState(prev => prev.map(item => item.id === c.id ? { ...item, progress: Math.max(0, item.progress - 5) } : item))}
                      className="w-7 h-7 bg-white hover:bg-slate-100 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] text-slate-500 font-bold rounded-lg flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 text-[15px] font-bold text-slate-500 uppercase tabular-nums w-16 text-center">+/- 5%</span>
                    <button
                      onClick={() => setCurriculumState(prev => prev.map(item => item.id === c.id ? { ...item, progress: Math.min(100, item.progress + 5) } : item))}
                      className="w-7 h-7 bg-white hover:bg-slate-100 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] text-slate-500 font-bold rounded-lg flex items-center justify-center cursor-pointer shadow-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ADD TOPIC SCHEMA MODAL */}
      <AnimatePresence>
        {showAddCurriculumModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-sm w-full space-y-2 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-bold text-slate-900 text-xl uppercase flex items-center gap-2 tabular-nums tracking-tight">
                  <Bookmark className="w-5 h-5 text-indigo-600" />
                  Book Scheme Topic
                </h3>
                <button onClick={() => setShowAddCurriculumModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-4 border-b border-transparent font-sans">
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Topic Name</label>
                  <input 
                    type="text" 
                    value={newCurrTopic}
                    onChange={e => setNewCurrTopic(e.target.value)}
                    placeholder="e.g. Calculus II - Integration limits"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 transition-shadow transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Affiliated Course</label>
                  <select 
                    value={newCurrSubject}
                    onChange={e => setNewCurrSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-shadow"
                  >
                    {mockSubjects.map(s => (
                      <React.Fragment key={s}>
                        <option value={`${s} Form 4`}>{s} Form 4</option>
                        <option value={`${s} Form 3`}>{s} Form 3</option>
                        <option value={`${s} Form 2`}>{s} Form 2</option>
                        <option value={`${s} Form 1`}>{s} Form 1</option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Assigned Teacher</label>
                  <input 
                    type="text" 
                    value={newCurrTeacher}
                    onChange={e => setNewCurrTeacher(e.target.value)}
                    placeholder="e.g. Mr. Daniel Gitumu"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold text-slate-800 transition-shadow"
                  />
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide tabular-nums">Initial Coverage</label>
                    <span className="tabular-nums text-indigo-600 font-bold text-[17px] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{newCurrProgress}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={newCurrProgress}
                    onChange={e => setNewCurrProgress(parseInt(e.target.value) || 0)}
                    className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <button 
                  onClick={() => {
                    if (!newCurrTopic || !newCurrTeacher) {
                      toast.error('Please input complete topic scheme details.');
                      return;
                    }
                    const newItem = {
                      id: String(Date.now()),
                      topic: newCurrTopic,
                      subject: newCurrSubject,
                      progress: newCurrProgress,
                      teacher: newCurrTeacher
                    };
                    setCurriculumState([...curriculumState, newItem]);
                    toast.success(`Topic logged successfully!`);
                    setShowAddCurriculumModal(false);
                  }}
                  className="w-full py-3 mt-5 bg-indigo-600 text-white font-bold rounded-xl text-[13.5px] shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors"
                >
                  Create Scheme
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
