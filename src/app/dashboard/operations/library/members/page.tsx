"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Users, Search, Filter, UserPlus, ShieldCheck, AlertCircle, BookOpen, CreditCard, Trash2, X, Loader2 } from "lucide-react";
import { getLibraryMembers, getStudentsForLibrary, addLibraryMember, removeLibraryMember } from "./actions";

type Member = {
  id: string;
  status: string;
  student: {
    firstName: string;
    lastName: string;
    admissionNumber: string;
    enrollments: {
      class: {
        name: string;
      };
    }[];
  };
  circulations: {
    status: string;
    dueDate: Date;
  }[];
};

type StudentOption = {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [membersData, studentsData] = await Promise.all([
        getLibraryMembers(),
        getStudentsForLibrary()
      ]);
      setMembers(membersData as unknown as Member[]);
      setStudents(studentsData as unknown as StudentOption[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await addLibraryMember(selectedStudent);
      setIsModalOpen(false);
      setSelectedStudent("");
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeLibraryMember(id);
      await fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredMembers = members.filter((member) => {
    const student = member.student;
    const name = `${student.firstName} ${student.lastName}`.toLowerCase();
    const id = student.admissionNumber.toLowerCase();
    const q = searchQuery.toLowerCase();
    return name.includes(q) || id.includes(q);
  });

  const totalMembers = members.length;
  const totalBorrowed = members.reduce((acc, m) => acc + m.circulations.filter((c) => c.status === 'ISSUED').length, 0);
  const totalOverdue = members.reduce((acc, m) => acc + m.circulations.filter((c) => c.status === 'OVERDUE' || (c.status === 'ISSUED' && new Date(c.dueDate) < new Date())).length, 0);

  return (
    <div className="space-y-6">
      {/* Top Cards for Real Aggregated Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Members</p>
            <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : totalMembers}</h3>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Loans</p>
            <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : totalBorrowed}</h3>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Overdue Items</p>
            <h3 className="text-3xl font-black text-slate-800">{loading ? '-' : totalOverdue}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl hidden md:block">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Library Members</h2>
                 <p className="text-sm font-medium text-slate-500">Manage student and staff library access, limits, and fines.</p>
              </div>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <UserPlus className="w-4 h-4" />
              Register Member
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Name or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Group</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Active Loans</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fines & Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {loading ? (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500">
                       <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                       Loading members...
                     </td>
                   </tr>
                 ) : filteredMembers.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500">
                       No members found.
                     </td>
                   </tr>
                 ) : (
                    filteredMembers.map((member) => {
                     const student = member.student;
                     const name = `${student.firstName} ${student.lastName}`;
                     const borrowed = member.circulations.filter((c) => c.status === 'ISSUED').length;
                     const overdue = member.circulations.filter((c) => c.status === 'OVERDUE' || (c.status === 'ISSUED' && new Date(c.dueDate) < new Date())).length;
                     const group = student.enrollments?.[0]?.class?.name || "Unassigned";

                     return (
                       <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="py-4 px-6">
                            <span className="font-bold text-slate-800 text-sm">{name}</span>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{student.admissionNumber}</span>
                            </div>
                         </td>
                         <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md mb-1 bg-blue-50 text-blue-700">
                               Student
                            </span>
                            <p className="text-xs font-medium text-slate-500">{group}</p>
                         </td>
                         <td className="py-4 px-6 text-center">
                            <div className="flex justify-center items-center gap-4">
                               <div className="text-center">
                                  <span className="block text-lg font-black text-slate-800">{borrowed}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Borrowed</span>
                               </div>
                               {overdue > 0 && (
                                  <div className="text-center">
                                     <span className="block text-lg font-black text-rose-600">{overdue}</span>
                                     <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Overdue</span>
                                  </div>
                               )}
                            </div>
                         </td>
                         <td className="py-4 px-6">
                           <div className="flex flex-col items-start gap-1">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                                member.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                {member.status === 'ACTIVE' && <ShieldCheck className="w-3.5 h-3.5" />}
                                {member.status !== 'ACTIVE' && <AlertCircle className="w-3.5 h-3.5" />}
                                {member.status === 'ACTIVE' ? 'Active' : 'Suspended'}
                              </span>
                              {overdue > 0 && (
                                 <span className="text-[10px] font-bold text-rose-600 ml-1 flex items-center gap-1 mt-1">
                                    <CreditCard className="w-3 h-3" /> Fines: Pending
                                 </span>
                              )}
                           </div>
                         </td>
                         <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5" /> View Loans
                               </button>
                               <button 
                                 onClick={() => handleRemove(member.id)}
                                 className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-rose-100 flex items-center gap-1"
                               >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                               </button>
                            </div>
                         </td>
                       </tr>
                     );
                   })
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">Register Library Member</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select Student
                </label>
                <select 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                >
                  <option value="" disabled>Choose a student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} ({student.admissionNumber})
                    </option>
                  ))}
                </select>
                {students.length === 0 && (
                  <p className="text-xs text-rose-500 mt-2">All students are already library members.</p>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStudent || isSubmitting}
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-primary-900/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
