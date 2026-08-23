"use client";

import React, { useState, useTransition } from "react";
import { Users, Plus, Building, Trash2, ChevronRight, Layers } from "lucide-react";
import { createClass, deleteClass, createStream, deleteStream } from "@/app/actions/classes";

export default function ClassesClient({ classes, branches }: { classes: any[], branches: any[] }) {
  const [showClassModal, setShowClassModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{ id: string, type: 'class' | 'stream' } | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [className, setClassName] = useState("");
  const [branchId, setBranchId] = useState("");
  
  const [streamName, setStreamName] = useState("");
  const [capacity, setCapacity] = useState(40);
  const [isPending, startTransition] = useTransition();

  const handleAddClass = () => {
    if (!className || !branchId) return;
    startTransition(async () => {
      await createClass({ name: className, branchId });
      setShowClassModal(false);
      setClassName("");
    });
  };

  const handleAddStream = () => {
    if (!streamName || !selectedClassId) return;
    startTransition(async () => {
      await createStream({ name: streamName, classId: selectedClassId, capacity });
      setShowStreamModal(false);
      setStreamName("");
    });
  };

  const confirmDelete = (id: string, type: 'class' | 'stream') => {
    setDeleteItem({ id, type });
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    startTransition(async () => {
      if (deleteItem.type === 'class') {
        await deleteClass(deleteItem.id);
      } else {
        await deleteStream(deleteItem.id);
      }
      setShowDeleteModal(false);
      setDeleteItem(null);
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Classes & Streams</h3>
            <p className="text-sm font-medium text-slate-500">Manage school hierarchy, class levels, and specific student streams.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowClassModal(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Class Level
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-black text-slate-800">{cls.name}</h4>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                  <Building className="w-3 h-3" /> {cls.branch?.name || "No Branch"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setSelectedClassId(cls.id); setShowStreamModal(true); }}
                  className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                  + Add Stream
                </button>
                <button 
                  onClick={() => confirmDelete(cls.id, 'class')}
                  className="text-slate-400 hover:text-red-500 p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-5">
              {cls.streams.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-400 font-medium border-2 border-dashed border-slate-100 rounded-2xl">
                  No streams created yet
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cls.streams.map((stream: any) => (
                    <div key={stream.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{stream.name}</p>
                          <p className="text-xs font-medium text-slate-500">Cap: {stream.capacity}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => confirmDelete(stream.id, 'stream')}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showClassModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add Class Level</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Class Name</label>
                <input 
                  type="text" 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. Grade 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assign to Branch</label>
                <select 
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                >
                  <option value="">Select Branch...</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.levelType})</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowClassModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleAddClass} disabled={isPending || !className || !branchId} className="px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm disabled:opacity-50">
                {isPending ? "Adding..." : "Add Class"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showStreamModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add Stream</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Stream Name</label>
                <input 
                  type="text" 
                  value={streamName}
                  onChange={(e) => setStreamName(e.target.value)}
                  placeholder="e.g. East, Red, A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Student Capacity</label>
                <input 
                  type="number" 
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowStreamModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleAddStream} disabled={isPending || !streamName} className="px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm disabled:opacity-50">
                {isPending ? "Adding..." : "Add Stream"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 p-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">Confirm Deletion</h3>
            <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete this {deleteItem?.type}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleDelete} disabled={isPending} className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-sm disabled:opacity-50">
                {isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
