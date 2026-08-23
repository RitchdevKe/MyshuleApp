import React, { useState, useEffect } from 'react';
import { Plus, X, Users, Edit3, Grid, Shield, Filter, Search, Award, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAcademicLevels } from '../utils/academicLevels.ts';

export function ClassesTab() {
  const dynamicLevels = getAcademicLevels();
  const defaultClasses = dynamicLevels.slice(-4).map((level, idx) => ({
    form: level,
    streamsCount: 2,
    totalStudents: 40 + idx * 5,
    classTeacher: 'Assigned Teacher'
  }));

  const [classesList, setClassesList] = useState(defaultClasses);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  
  const [editingClass, setEditingClass] = useState<any>(null);
  const [newClassForm, setNewClassForm] = useState<string>(dynamicLevels[0] || 'Form 1');
  const [newClassStreams, setNewClassStreams] = useState(2);
  const [newClassStudentsNum, setNewClassStudentsNum] = useState(40);
  const [newClassTeacher, setNewClassTeacher] = useState('');

  const filteredClasses = classesList.filter(c => 
    c.form.toString().includes(searchQuery) ||
    c.classTeacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 md:p-6 border border-slate-150 rounded-2xl shadow-sm gap-4 relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-600" />
            Classroom Divisions Roster
          </h3>
          <p className="text-[17px] text-slate-500 font-medium">Configure active student levels, associated streams, and faculty leads.</p>
        </div>
        <div className="relative z-10 flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -mt-2" />
            <input 
              type="text"
              placeholder="Search forms, teachers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => {
              setNewClassForm(dynamicLevels[0] || 'Form 1');
              setNewClassStreams(2);
              setNewClassStudentsNum(40);
              setNewClassTeacher('');
              setShowAddClassModal(true);
            }}
            className="px-4.5 py-2.5 bg-indigo-600 text-white text-[17px] font-bold rounded-xl hover:bg-indigo-700 transition cursor-pointer flex items-center gap-2 shadow-md shadow-indigo-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" /> Setup Form
          </button>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-full mix-blend-multiply blur-2xl opacity-40 -mr-10 -mt-10 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <AnimatePresence>
          {filteredClasses.map(c => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              key={c.form} 
              className="bg-white p-2.5 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-sm flex flex-col justify-between group transition-all duration-300 hover:shadow-lg hover:border-indigo-200 relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10.5px] font-bold uppercase tracking-wide tabular-nums">
                    <Grid className="w-3.5 h-3.5" /> Level Group
                  </span>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 font-bold text-[14px] shadow-inner px-2">
                    {c.form}
                  </div>
                </div>
                <h4 className="text-3xl font-bold text-slate-900 mb-5 tabular-nums tracking-tighter">{c.form}</h4>
                
                <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-[17px]">
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Active Streams:</span>
                    <span className="font-bold text-slate-900">{c.streamsCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" /> Enrollments:</span>
                    <span className="font-bold text-slate-900">{c.totalStudents}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-150/60 mt-2">
                    <span className="font-semibold flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-slate-400" /> Faculty Head:</span>
                    <span className="font-bold text-indigo-600 truncate max-w-[110px]" title={c.classTeacher}>{c.classTeacher}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 relative z-10 flex gap-2">
                <button
                  onClick={() => {
                    setEditingClass(c);
                    setNewClassTeacher(c.classTeacher);
                    setNewClassStreams(c.streamsCount);
                    setNewClassStudentsNum(c.totalStudents);
                  }}
                  className="w-full flex justify-center items-center gap-1.5 py-2 bg-white group-hover:bg-indigo-50 text-slate-600 group-hover:text-indigo-700 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] group-hover:border-indigo-200 font-bold rounded-xl text-[16px] transition-colors cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Modify Block
                </button>
              </div>
              
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredClasses.length === 0 && (
         <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl flex items-center justify-center py-20">
           <div className="text-center space-y-3">
             <Grid className="w-12 h-12 text-slate-300 mx-auto stroke-[1.5]" />
             <h3 className="text-slate-800 font-bold text-2xl">No Results Found</h3>
             <p className="text-slate-500 text-lg max-w-sm">There are no classroom divisions matching "{searchQuery}". Try a different filter.</p>
           </div>
         </div>
      )}

      {/* EDIT/ADD CLASS MODAL */}
      <AnimatePresence>
        {(editingClass || showAddClassModal) && (
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
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl p-1.5 max-w-sm w-full shadow-2xl overflow-hidden relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2 tabular-nums uppercase">
                  {editingClass ? 'Modify Class Block' : 'Initialize New Class'}
                </h3>
                <button 
                  onClick={() => {
                    setEditingClass(null);
                    setShowAddClassModal(false);
                  }} 
                  className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Academic Level</label>
                  {editingClass ? (
                    <div className="w-full px-2 py-2.5 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl text-slate-800 font-bold text-lg">
                      {editingClass.form} Group
                    </div>
                  ) : (
                    <select 
                      value={newClassForm}
                      onChange={e => setNewClassForm(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-shadow"
                    >
                      {dynamicLevels.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Faculty Lead / Teacher</label>
                  <input 
                    type="text" 
                    value={newClassTeacher}
                    onChange={e => setNewClassTeacher(e.target.value)}
                    placeholder="e.g. Mrs. Chepkoech"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Active Streams</label>
                    <input 
                      type="number" 
                      value={newClassStreams}
                      onChange={e => setNewClassStreams(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Total Roster</label>
                    <input 
                      type="number" 
                      value={newClassStudentsNum}
                      onChange={e => setNewClassStudentsNum(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const newEntry = {
                      form: editingClass ? editingClass.form : newClassForm,
                      streamsCount: newClassStreams,
                      totalStudents: newClassStudentsNum,
                      classTeacher: newClassTeacher
                    };
                    if (editingClass) {
                      setClassesList(prev => prev.map(c => c.form === editingClass.form ? newEntry : c));
                    } else {
                      if (classesList.find(c => c.form === newClassForm)) {
                        alert('Academic level configuration already exists!');
                        return;
                      }
                      setClassesList(prev => [...prev, newEntry]);
                    }
                    setEditingClass(null);
                    setShowAddClassModal(false);
                  }}
                  className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-[13.5px] transition-all shadow-md shadow-indigo-600/20"
                >
                  {editingClass ? 'Sync Configuration' : 'Create Class Block'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
