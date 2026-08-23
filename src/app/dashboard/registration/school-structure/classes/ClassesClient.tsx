"use client";

import React, { useState, useTransition } from "react";
import { Plus, Users, Library, Activity, BookOpen, AlertCircle, Building2, TrendingUp, Settings2, Edit, Trash2 } from "lucide-react";
import { createClass, updateClass, deleteClass, createStream, updateStream, deleteStream } from "@/app/actions/classes";

type Branch = {
  id: string;
  name: string;
};

type Stream = {
  id: string;
  name: string;
  capacity: number;
  _count?: { enrollments: number };
};

type Class = {
  id: string;
  name: string;
  branchId: string;
  streams: Stream[];
  _count?: { enrollments: number };
};

type Props = {
  branches: Branch[];
  classes: Class[];
};

export default function ClassesClient({ branches, classes }: Props) {
  const [activeBranch, setActiveBranch] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Dialog states
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [streamModalOpen, setStreamModalOpen] = useState(false);

  // Form states for class
  const [classId, setClassId] = useState<string | null>(null);
  const [className, setClassName] = useState("");
  const [classBranchId, setClassBranchId] = useState("");

  // Form states for stream
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamName, setStreamName] = useState("");
  const [streamClassId, setStreamClassId] = useState("");
  const [streamCapacity, setStreamCapacity] = useState<number | "">("");

  // Map classes to branches for UI
  const branchesData = branches.map(b => {
    const branchClasses = classes.filter(c => c.branchId === b.id);
    let totalCap = 0;
    let totalCount = 0;

    const classesData = branchClasses.map(c => {
      const streams = c.streams || [];
      const classCap = streams.reduce((acc, s) => acc + s.capacity, 0);
      const classCount = c._count?.enrollments || 0;
      
      totalCap += classCap;
      totalCount += classCount;
      return {
        id: c.id,
        name: c.name,
        streams,
        count: classCount,
        cap: classCap,
      };
    });

    const utilization = totalCap === 0 ? 0 : Math.round((totalCount / totalCap) * 100);

    return {
      id: b.id,
      name: b.name,
      capacity: totalCap.toString(),
      total: totalCap.toString(),
      utilization,
      classes: classesData
    };
  });

  const filteredBranches = activeBranch === "all" ? branchesData : branchesData.filter(b => b.id === activeBranch);

  const openAddClass = () => {
    setClassId(null);
    setClassName("");
    setClassBranchId(branches[0]?.id || "");
    setClassModalOpen(true);
  };

  const openEditClass = (c: any, branchId: string) => {
    setClassId(c.id);
    setClassName(c.name);
    setClassBranchId(branchId);
    setClassModalOpen(true);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      startTransition(async () => {
        await deleteClass(id);
      });
    }
  };

  const handleSaveClass = () => {
    startTransition(async () => {
      if (classId) {
        await updateClass(classId, { name: className, branchId: classBranchId });
      } else {
        await createClass({ name: className, branchId: classBranchId });
      }
      setClassModalOpen(false);
    });
  };

  const openAddStream = () => {
    setStreamId(null);
    setStreamName("");
    setStreamClassId(classes[0]?.id || "");
    setStreamCapacity(40);
    setStreamModalOpen(true);
  };

  const openEditStream = (s: Stream, classId: string) => {
    setStreamId(s.id);
    setStreamName(s.name);
    setStreamClassId(classId);
    setStreamCapacity(s.capacity);
    setStreamModalOpen(true);
  };

  const handleDeleteStream = (id: string) => {
    if (confirm("Are you sure you want to delete this stream?")) {
      startTransition(async () => {
        await deleteStream(id);
      });
    }
  };

  const handleSaveStream = () => {
    startTransition(async () => {
      if (streamId) {
        await updateStream(streamId, { name: streamName, classId: streamClassId, capacity: Number(streamCapacity) });
      } else {
        await createStream({ name: streamName, classId: streamClassId, capacity: Number(streamCapacity) });
      }
      setStreamModalOpen(false);
    });
  };

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setActiveBranch("all")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeBranch === "all" ? "bg-primary-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All Campuses
          </button>
          {branches.map(b => (
            <button 
              key={b.id}
              onClick={() => setActiveBranch(b.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${activeBranch === b.id ? "bg-primary-900 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {b.name}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button onClick={openAddStream} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
            <Settings2 className="w-4 h-4" /> Manage Streams
          </button>
          <button onClick={openAddClass} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
            <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>
      </div>
      
      {filteredBranches.map((branch) => (
        <div key={branch.id} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col relative">
          
          {/* Branch Header */}
          <div className="p-6 border-b border-slate-100 bg-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">{branch.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">Capacity: {branch.capacity}</span>
                  <span className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-lg border ${branch.utilization > 80 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                    <Activity className="w-3 h-3" /> {branch.utilization}% Utilisation
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-slate-500 text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> {branch.classes.length} Classes
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300"></div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" /> {branch.classes.reduce((a,c) => a + c.streams.length, 0)} Streams
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="p-6 bg-slate-50/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {branch.classes.map((cls) => {
                const percent = cls.cap === 0 ? 0 : Math.round((cls.count / cls.cap) * 100);
                const isOvercap = percent > 100;
                const isUndercap = percent > 0 && percent < 50;

                return (
                  <div key={cls.id} className={`p-5 rounded-2xl border ${isOvercap ? 'border-rose-300 bg-rose-50/50' : isUndercap ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 bg-white/80'} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative group cursor-pointer`}>
                    
                    {isOvercap && (
                      <div className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                        <AlertCircle className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isUndercap && (
                      <div className="absolute -top-2.5 -right-2.5 bg-amber-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                        <TrendingUp className="w-3.5 h-3.5 transform rotate-180" />
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${isOvercap ? 'bg-rose-100 text-rose-600' : isUndercap ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                          <Library className="w-4 h-4" />
                        </div>
                        {cls.name}
                      </h3>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); openEditClass(cls, branch.id); }} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls.id); }} className="p-1 hover:bg-rose-200 rounded text-rose-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {cls.streams.map(stream => (
                        <div key={stream.id} className="flex items-center gap-1 px-2 py-1 bg-white text-slate-600 rounded-lg border border-slate-200 text-[10px] font-black uppercase tracking-wider shadow-sm group/stream relative">
                          <span>{stream.name}</span>
                          <span className="text-slate-400">({stream.capacity})</span>
                          <div className="hidden group-hover/stream:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-slate-200 rounded-lg p-1 z-10 gap-1">
                            <button onClick={(e) => { e.stopPropagation(); openEditStream(stream, cls.id); }} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteStream(stream.id); }} className="p-1 hover:bg-rose-100 rounded text-rose-600">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                        <span>Enrolment</span>
                        <span className={isOvercap ? 'text-rose-600 font-black' : isUndercap ? 'text-amber-600 font-black' : 'text-emerald-600 font-black'}>{cls.count} / {cls.cap}</span>
                      </div>
                      <div className="h-2 bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all ${isOvercap ? 'bg-rose-500' : isUndercap ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      
      {/* Class Modal */}
      {classModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">{classId ? 'Edit Class' : 'Add Class'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Campus / Branch</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={classBranchId}
                  onChange={e => setClassBranchId(e.target.value)}
                >
                  <option value="" disabled>Select Branch</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Class Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Grade 1"
                  value={className}
                  onChange={e => setClassName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setClassModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveClass}
                disabled={isPending || !className || !classBranchId}
                className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md disabled:opacity-50 transition-all"
              >
                {isPending ? 'Saving...' : 'Save Class'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stream Modal */}
      {streamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">{streamId ? 'Edit Stream' : 'Add Stream'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Class</label>
                <select 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={streamClassId}
                  onChange={e => setStreamClassId(e.target.value)}
                >
                  <option value="" disabled>Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Stream Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. North"
                  value={streamName}
                  onChange={e => setStreamName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Capacity</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. 40"
                  value={streamCapacity}
                  onChange={e => setStreamCapacity(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setStreamModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStream}
                disabled={isPending || !streamName || !streamClassId || streamCapacity === ""}
                className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md disabled:opacity-50 transition-all"
              >
                {isPending ? 'Saving...' : 'Save Stream'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
