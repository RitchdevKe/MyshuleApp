"use client";

import React, { useState } from "react";
import { Key, Search, Filter, UserPlus, CheckCircle2, Clock, AlertCircle, RefreshCcw, X } from "lucide-react";
import { allocateStudent, vacateAllocation } from "./actions";

type Allocation = any;
type Student = any;
type Hostel = any;

interface AllocationClientProps {
  allocations: Allocation[];
  students: Student[];
  hostels: Hostel[];
}

export default function AllocationClient({ allocations, students, hostels }: AllocationClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredAllocations = allocations.filter(alloc => {
    const matchesSearch = alloc.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alloc.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alloc.room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || alloc.status === (statusFilter === "Checked In" ? "ACTIVE" : statusFilter.toUpperCase());
    return matchesSearch && matchesStatus;
  });

  const selectedHostelData = hostels.find(h => h.id === selectedHostel);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedHostel || !selectedRoom) {
      setError("Please fill all fields");
      return;
    }
    
    setIsLoading(true);
    setError("");
    try {
      await allocateStudent({
        studentId: selectedStudent,
        hostelId: selectedHostel,
        roomId: selectedRoom
      });
      setIsModalOpen(false);
      setSelectedStudent("");
      setSelectedHostel("");
      setSelectedRoom("");
    } catch (err: any) {
      setError(err.message || "Failed to allocate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVacate = async (id: string) => {
    if (confirm("Are you sure you want to vacate this allocation?")) {
      await vacateAllocation(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <Key className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Student Allocation</h2>
                 <p className="text-sm font-medium text-slate-500">Assign students to rooms and track check-in status.</p>
              </div>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <UserPlus className="w-4 h-4" />
              Allocate Student
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Student Name or Room..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option>All Statuses</option>
                 <option>Checked In</option>
                 <option>Vacated</option>
              </select>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Room</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Date</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredAllocations.map((alloc) => (
                   <tr key={alloc.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{alloc.student.firstName} {alloc.student.lastName}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{alloc.student.admissionNumber}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{alloc.room.roomNumber}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{alloc.hostel.name}</p>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            alloc.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {alloc.status === 'ACTIVE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {alloc.status === 'VACATED' && <AlertCircle className="w-3.5 h-3.5" />}
                            {alloc.status === 'ACTIVE' ? 'Checked In' : 'Vacated'}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 ml-1 mt-0.5">{new Date(alloc.dateAllocated).toLocaleDateString()}</span>
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        {alloc.status === "ACTIVE" && (
                          <button 
                            onClick={() => handleVacate(alloc.id)}
                            title="Vacate Room"
                            className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-colors inline-flex"
                          >
                             <RefreshCcw className="w-5 h-5" />
                          </button>
                        )}
                     </td>
                   </tr>
                 ))}
                 {filteredAllocations.length === 0 && (
                   <tr>
                     <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">No allocations found.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Allocate Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAllocate} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student</label>
                <select 
                  value={selectedStudent} 
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select Student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hostel</label>
                <select 
                  value={selectedHostel} 
                  onChange={e => {
                    setSelectedHostel(e.target.value);
                    setSelectedRoom("");
                  }}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select Hostel...</option>
                  {hostels.map(h => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              {selectedHostel && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Room</label>
                  <select 
                    value={selectedRoom} 
                    onChange={e => setSelectedRoom(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="">Select Room...</option>
                    {selectedHostelData?.rooms.map((r: any) => (
                      <option key={r.id} value={r.id}>{r.roomNumber} ({r.capacity} beds, {r.status})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? 'Allocating...' : 'Allocate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
