"use client";

import React, { useState, useTransition } from "react";
import { Search, Filter, Plus, Users, BookOpen, Layers, CheckCircle2, MoreHorizontal, Sparkles, Edit, Trash2 } from "lucide-react";
import { createStream, updateStream, deleteStream, createClass, updateClass, deleteClass } from "@/app/actions/classes";

type Branch = {
  id: string;
  name: string;
};

type Stream = {
  id: string;
  name: string;
  capacity: number;
  classId: string;
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
  classes: Class[];
  branches: Branch[];
};

export default function ClassesStreamsClient({ classes, branches }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [streamModalOpen, setStreamModalOpen] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamName, setStreamName] = useState("");
  const [streamClassId, setStreamClassId] = useState("");
  const [streamCapacity, setStreamCapacity] = useState<number | "">("");

  // Class Modal states
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editClassId, setEditClassId] = useState<string | null>(null);
  const [className, setClassName] = useState("");
  const [classBranchId, setClassBranchId] = useState("");

  // Menu state for dropdown
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Flatten data to match the UI row format
  const data = classes.flatMap(c => {
    if (!c.streams || c.streams.length === 0) {
      return [{
        id: `class-${c.id}`,
        classId: c.id,
        grade: c.name,
        streamId: "",
        stream: "Unassigned",
        capacity: 0,
        enrolled: c._count?.enrollments || 0,
        teacher: "Unassigned", // TODO: pull real teacher if exists
        status: "Draft",
      }];
    }
    return c.streams.map(s => ({
      id: `stream-${s.id}`,
      classId: c.id,
      streamId: s.id,
      grade: c.name,
      stream: s.name,
      capacity: s.capacity,
      enrolled: s._count?.enrollments || 0,
      teacher: "Unassigned",
      status: (s._count?.enrollments || 0) > s.capacity ? "Over-enrolled" : "Active"
    }));
  });

  const filteredData = data.filter(item => 
    item.grade.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.stream.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + (c._count?.enrollments || 0), 0);
  const activeStreams = classes.reduce((sum, c) => sum + (c.streams?.length || 0), 0);
  const avgClassSize = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;

  const handleAddStream = () => {
    setStreamId(null);
    setStreamName("");
    setStreamClassId(classes[0]?.id || "");
    setStreamCapacity(40);
    setStreamModalOpen(true);
  };

  const handleEditStream = (item: { streamId: string | null; stream: string; classId: string; capacity: number; grade: string; }) => {
    if (!item.streamId) return; // Cannot edit "Unassigned" pseudo-stream
    setStreamId(item.streamId);
    setStreamName(item.stream);
    setStreamClassId(item.classId);
    setStreamCapacity(item.capacity);
    setStreamModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteStream = (streamId: string) => {
    if (confirm("Are you sure you want to delete this stream?")) {
      startTransition(async () => {
        await deleteStream(streamId);
      });
    }
    setOpenMenuId(null);
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

  const handleAddClass = () => {
    setEditClassId(null);
    setClassName("");
    setClassBranchId(branches[0]?.id || "");
    setClassModalOpen(true);
  };

  const handleEditClass = (item: { classId: string; grade: string; }) => {
    setEditClassId(item.classId);
    setClassName(item.grade);
    const cls = classes.find(c => c.id === item.classId);
    setClassBranchId(cls?.branchId || branches[0]?.id || "");
    setClassModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteClass = (id: string) => {
    if (confirm("Are you sure you want to delete this class? All associated streams will be deleted.")) {
      startTransition(async () => {
        await deleteClass(id);
      });
    }
    setOpenMenuId(null);
  };

  const handleSaveClass = () => {
    startTransition(async () => {
      if (editClassId) {
        await updateClass(editClassId, { name: className, branchId: classBranchId });
      } else {
        await createClass({ name: className, branchId: classBranchId });
      }
      setClassModalOpen(false);
    });
  };

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Classes",    value: totalClasses.toString(),  icon: Layers,        color: "from-primary-600 to-primary-800" },
          { label: "Total Students",   value: totalStudents.toString(), icon: Users,         color: "from-emerald-500 to-teal-600" },
          { label: "Avg Class Size",   value: avgClassSize.toString(),  icon: BookOpen,      color: "from-blue-500 to-indigo-600" },
          { label: "Active Streams",   value: activeStreams.toString(),  icon: CheckCircle2,  color: "from-rose-500 to-pink-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search classes, streams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button 
              onClick={handleAddClass}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Add Class
            </button>
            <button 
              onClick={handleAddStream}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Stream
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((row) => {
              const capacityRatio = row.capacity > 0 ? row.enrolled / row.capacity : 0;
              const isFull = capacityRatio >= 1 && row.capacity > 0;
              const isWarning = capacityRatio >= 0.9 && !isFull;
              const isOverEnrolled = row.status === 'Over-enrolled' || capacityRatio > 1;
              
              let statusBg = "bg-emerald-50 text-emerald-700 border-emerald-100";
              let statusDot = "bg-emerald-500";
              
              if (isOverEnrolled) {
                statusBg = "bg-rose-50 text-rose-700 border-rose-100";
                statusDot = "bg-rose-500";
              } else if (isFull || isWarning) {
                statusBg = "bg-amber-50 text-amber-700 border-amber-100";
                statusDot = "bg-amber-500";
              } else if (row.status === 'Draft' || row.capacity === 0) {
                statusBg = "bg-slate-50 text-slate-600 border-slate-200";
                statusDot = "bg-slate-400";
              }
              
              return (
                <div key={row.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col relative">
                  
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-50 flex justify-between items-start bg-gradient-to-br from-slate-50 to-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-800 text-lg">{row.grade}</h3>
                        {/* Live Beacon - Simulated class in session */}
                        {row.status === 'Active' && row.capacity > 0 && (
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 font-bold text-xs flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                        Stream: <span className="font-black text-primary-700">{row.stream}</span>
                      </p>
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors focus:outline-none"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      
                      {openMenuId === row.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)}></div>
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20">
                            {row.streamId && (
                              <>
                                <button 
                                  onClick={() => handleEditStream(row)}
                                  className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4 text-slate-400" /> Edit Stream
                                </button>
                                <button 
                                  onClick={() => handleDeleteStream(row.streamId!)}
                                  className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-b border-slate-50 pb-2 mb-1"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-400" /> Delete Stream
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => handleEditClass(row)}
                              className="w-full text-left px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4 text-slate-400" /> Edit Class
                            </button>
                            <button 
                              onClick={() => handleDeleteClass(row.classId)}
                              className="w-full text-left px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4 text-rose-400" /> Delete Class
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Class Teacher</p>
                        <p className="font-bold text-slate-800 text-sm">{row.teacher}</p>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-2">
                      <div className="flex justify-between items-end mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Enrollment</p>
                        <p className="text-xs font-black text-slate-600">
                          <span className={isOverEnrolled ? "text-rose-600" : isFull ? "text-amber-600" : ""}>{row.enrolled}</span> 
                          <span className="text-slate-400 mx-1">/</span> 
                          {row.capacity || "N/A"}
                        </p>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full ${statusDot} transition-all duration-500`}
                          style={{ width: `${Math.min((row.capacity > 0 ? (row.enrolled / row.capacity) : 0) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center mt-auto">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${statusBg}`}>
                      {row.capacity === 0 ? "Draft" : row.status}
                    </span>
                    <button className="text-[10px] font-black text-primary-600 hover:text-secondary-500 uppercase tracking-wider transition-colors">
                      View Roster
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Sparkles className="w-8 h-8 mb-3 opacity-20" />
              <p className="font-bold text-lg text-slate-500">No streams found</p>
              <p className="text-sm font-medium mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 mt-auto">
          <span className="font-bold">Showing <span className="text-primary-900">{filteredData.length}</span> streams</span>
        </div>
      </div>

      {/* Class Modal */}
      {classModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">{editClassId ? 'Edit Class' : 'Add Class'}</h3>
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
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveClass}
                disabled={isPending || !className || !classBranchId}
                className="px-4 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isPending && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
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
                  disabled={!!streamId} // Maybe don't allow changing class on edit for now, or allow it
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
                disabled={isPending}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveStream}
                disabled={isPending || !streamName || !streamClassId || streamCapacity === ""}
                className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isPending && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                {isPending ? 'Saving...' : 'Save Stream'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
