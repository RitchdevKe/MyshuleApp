'use client';

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Filter, MoreVertical, LayoutGrid, List,
  GraduationCap, MapPin, Phone, User, Calendar, Settings, AlertTriangle, Shield, CheckCircle2,
  ChevronLeft, ChevronRight, Download, Upload, X
} from "lucide-react";
import { getStudentsDirectory, createStudent, updateStudent, deleteStudent } from "@/app/actions/students";

type UserRole = "admin" | "secretary" | "teacher";

interface Student {
  id: string;
  name: string;
  initials: string;
  grade: string;
  stream: string;
  branch: string;
  status: "Active" | "Suspended" | "Warning" | "Alumni" | "Transferred";
  attendance: number;
  phone: string;
  parent: string;
  joined: string;
  dob?: string;
  gender?: string;
  nemisNo?: string;
}

const statusConfig = {
  Active:    { dot: "bg-emerald-500", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  Suspended: { dot: "bg-rose-500",    bg: "bg-rose-100",    text: "text-rose-700",    border: "border-rose-200" },
  Warning:   { dot: "bg-amber-500",   bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-200" },
  Alumni:    { dot: "bg-slate-500",   bg: "bg-slate-100",   text: "text-slate-700",   border: "border-slate-200" },
  Transferred: { dot: "bg-indigo-500",bg: "bg-indigo-100",  text: "text-indigo-700",  border: "border-indigo-200" },
};

const avatarColors = [
  "from-primary-700 to-primary-900",
  "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",
];

export default function DirectoryPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [grade,    setGrade]    = useState("All Grades");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [loading, setLoading] = useState(true);

  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});

  useEffect(() => {
    getStudentsDirectory().then(res => {
      if (res.success) {
        const formatted = res.data.map((s: any) => {
          const enrollment = s.enrollments?.[0];
          const parentRel = s.parents?.[0]?.parent;
          
          let st = "Active";
          if (s.status === "ACTIVE") st = "Active";
          if (s.status === "SUSPENDED") st = "Suspended";
          if (s.status === "ALUMNI") st = "Alumni";
          if (s.status === "TRANSFERRED") st = "Transferred";

          return {
            id: s.admissionNumber || s.id,
            name: `${s.firstName} ${s.lastName}`,
            initials: `${s.firstName?.[0] || ""}${s.lastName?.[0] || ""}`.toUpperCase(),
            grade: enrollment?.class?.name || "Unassigned",
            stream: enrollment?.stream?.name || "Unassigned",
            branch: "Main Campus",
            status: st as any,
            attendance: 100,
            phone: parentRel?.phonePrimary || "N/A",
            parent: parentRel ? `${parentRel.firstName} ${parentRel.lastName}` : "N/A",
            joined: s.enrollmentDate ? new Date(s.enrollmentDate).toLocaleDateString() : "Unknown",
            dob: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : undefined,
            gender: s.gender === "MALE" ? "Male" : "Female",
            nemisNo: s.admissionNumber
          };
        });
        setStudents(formatted);
      }
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      const res = await deleteStudent(id);
      if (res.success) {
        setStudents(prev => prev.filter(s => s.id !== id));
      } else {
        alert("Failed to delete student: " + res.error);
      }
    }
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentStudent({
      status: "Active",
      grade: "Grade 1",
      stream: "East",
      joined: new Date().toLocaleDateString()
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setModalMode("edit");
    setCurrentStudent(s);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "add") {
      const res = await createStudent(currentStudent);
      if (res.success) {
        const s = res.data;
        const newStudent: Student = {
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
          initials: (s.firstName[0] || 'U') + (s.lastName?.[0] || ''),
          grade: currentStudent.grade || "Grade 1",
          stream: currentStudent.stream || "East",
          branch: "Main Campus",
          status: s.status === 'ACTIVE' ? "Active" : s.status === 'SUSPENDED' ? "Suspended" : "Alumni",
          attendance: 100,
          phone: currentStudent.phone || "N/A",
          parent: currentStudent.parent || "N/A",
          joined: new Date().toLocaleDateString(),
        };
        setStudents(prev => [newStudent, ...prev]);
      } else {
        alert("Failed to create student: " + res.error);
      }
    } else {
      if (currentStudent.id) {
        const res = await updateStudent(currentStudent.id, currentStudent);
        if (res.success) {
          setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, ...currentStudent } as Student : s));
        } else {
          alert("Failed to update student: " + res.error);
        }
      }
    }
    setIsModalOpen(false);
  };

  const filtered = students.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "All" || s.status === status;
    const matchGrade  = grade === "All Grades" || s.grade === grade;
    return matchSearch && matchStatus && matchGrade;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs">
        <Shield className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
        <span className="font-bold text-amber-700">Demo: Viewing as</span>
        {(["admin", "secretary", "teacher"] as UserRole[]).map(r => (
          <button
            key={r}
            onClick={() => setCurrentRole(r)}
            className={`px-2.5 py-1 rounded-lg font-black text-[11px] capitalize transition-colors ${
              currentRole === r ? "bg-amber-500 text-white" : "bg-white text-amber-700 border border-amber-200 hover:bg-amber-100"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-white/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or Adm No..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-72 transition-all"
              />
            </div>

            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow text-primary-700" : "text-slate-400 hover:text-slate-600"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow text-primary-700" : "text-slate-400 hover:text-slate-600"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === "admin" && (
              <button 
                onClick={openAddModal}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            )}
            <select
              value={grade}
              onChange={e => setGrade(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="All Grades">All Grades</option>
              <option value="Pre-Primary">Pre-Primary</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
            </select>

            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm font-bold">Loading...</div>
        ) : viewMode === "list" ? (
          <div className="overflow-x-auto min-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-12">No.</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade & Stream</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent / Contact</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s, i) => {
                  const cfg = statusConfig[s.status] || statusConfig['Active'];
                  const avatarGrad = avatarColors[i % avatarColors.length];
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-black text-slate-500">{s.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-sm bg-gradient-to-br ${avatarGrad} flex-shrink-0`}>
                            {s.initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{s.name}</p>
                            <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-bold text-slate-400">View Profile</span>
                              <ChevronRight className="w-3 h-3 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                            <GraduationCap className="w-3 h-3 text-slate-400" />
                            {s.grade}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">{s.stream}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-700">{s.parent}</p>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" /> {s.phone}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-slate-600">{s.joined}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wide ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {currentRole === "admin" && (
                            <>
                              <button onClick={() => openEditModal(s)} className="px-2 py-1 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded border border-amber-200 text-[10px] font-bold uppercase transition">
                                Edit
                              </button>
                              <button onClick={() => handleDelete(s.id)} className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded border border-red-200 text-[10px] font-bold uppercase transition">
                                Delete
                              </button>
                            </>
                          )}
                          {currentRole !== "admin" && (
                            <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                              <Settings className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-500 text-sm font-bold">
                      No students found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-h-[500px]">
            {filtered.map((s, i) => {
              const cfg = statusConfig[s.status] || statusConfig['Active'];
              const avatarGrad = avatarColors[i % avatarColors.length];
              return (
                <div key={s.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all flex flex-col overflow-hidden relative group">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-sm bg-gradient-to-br ${avatarGrad}`}>
                        {s.initials}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} title={s.status} />
                        {currentRole === "admin" ? (
                          <div className="flex flex-col gap-1 z-10">
                            <button onClick={() => openEditModal(s)} className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-200 hover:bg-amber-100">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(s.id)} className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100">
                              Del
                            </button>
                          </div>
                        ) : (
                          <button className="text-slate-400 hover:text-slate-600 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-black text-primary-500 tracking-wider mb-0.5">{s.id}</p>
                      <h3 className="font-bold text-slate-900 leading-tight">{s.name}</h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{s.grade}</span> &bull; {s.stream}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{s.parent}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{s.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {modalMode === "add" ? "Add New Student" : "Edit Student"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1">
              <form id="student-form" onSubmit={handleSaveModal} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Student Name</label>
                    <input 
                      required
                      type="text" 
                      value={currentStudent.name || ""} 
                      onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  
                  {modalMode === "add" && (
                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Admission No</label>
                      <input 
                        type="text" 
                        value={currentStudent.id || ""} 
                        onChange={e => setCurrentStudent({...currentStudent, id: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Leave blank to auto-generate"
                      />
                    </div>
                  )}

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Grade</label>
                    <select
                      value={currentStudent.grade || "Grade 1"}
                      onChange={e => setCurrentStudent({...currentStudent, grade: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Pre-Primary">Pre-Primary</option>
                      <option value="Grade 1">Grade 1</option>
                      <option value="Grade 2">Grade 2</option>
                      <option value="Grade 3">Grade 3</option>
                      <option value="Grade 4">Grade 4</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Stream</label>
                    <input 
                      type="text" 
                      value={currentStudent.stream || ""} 
                      onChange={e => setCurrentStudent({...currentStudent, stream: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. East"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Status</label>
                    <select
                      value={currentStudent.status || "Active"}
                      onChange={e => setCurrentStudent({...currentStudent, status: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Warning">Warning</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Transferred">Transferred</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Joined Date</label>
                    <input 
                      type="text" 
                      value={currentStudent.joined || ""} 
                      onChange={e => setCurrentStudent({...currentStudent, joined: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. 8/12/2023"
                    />
                  </div>

                  <div className="col-span-2 space-y-1.5 pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Parent / Contact Info</h3>
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Parent Name</label>
                    <input 
                      type="text" 
                      value={currentStudent.parent || ""} 
                      onChange={e => setCurrentStudent({...currentStudent, parent: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. Jane Doe"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Phone</label>
                    <input 
                      type="text" 
                      value={currentStudent.phone || ""} 
                      onChange={e => setCurrentStudent({...currentStudent, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. +254 700 000 000"
                    />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="student-form"
                className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
              >
                {modalMode === "add" ? "Add Student" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
