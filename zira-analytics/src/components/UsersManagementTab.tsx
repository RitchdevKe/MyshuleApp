import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  UserPlus, 
  AlertCircle,
  Clock,
  Briefcase,
  GraduationCap,
  ShieldAlert,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { Student } from '../types.ts';

export interface SchoolUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedDate: string;
  assignedDetail?: string; // Subjects specialized, or student admission code for parents
  status: 'active' | 'inactive';
}

interface UsersManagementTabProps {
  users: SchoolUser[];
  onAddUser: (user: SchoolUser) => void;
  students: Student[];
}

export function UsersManagementTab({ users, onAddUser, students }: UsersManagementTabProps) {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  
  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<string>('Teacher');
  const [assignedDetail, setAssignedDetail] = useState('');
  const [parentChildId, setParentChildId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenModal = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('Teacher');
    setAssignedDetail('');
    setParentChildId(students[0]?.id || '');
    setErrorMsg('');
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Name and email parameters are strictly required.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMsg('A school user account with this email already exists.');
      return;
    }

    // Determine details
    let detail = assignedDetail;
    if (role === 'Parent / Guardian') {
      const selectedStudent = students.find(s => s.id === parentChildId);
      detail = selectedStudent ? `Parent of ${selectedStudent.name} (${selectedStudent.admissionNo})` : 'Parent';
    } else if (role === 'Teacher' && !detail) {
      detail = 'Language/Sciences';
    }

    const newUser: SchoolUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+254 ' + Math.floor(700000000 + Math.random() * 99999999),
      role,
      joinedDate: new Date().toISOString().substring(0, 10),
      assignedDetail: detail,
      status: 'active'
    };

    onAddUser(newUser);
    setIsOpen(false);
  };

  const filtered = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          user.phone.includes(search);
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'School Admin': return 'bg-indigo-50 border border-indigo-150 text-indigo-700';
      case 'Head Teacher': return 'bg-purple-50 border border-purple-150 text-purple-700';
      case 'Accountant': return 'bg-emerald-50 border border-emerald-150 text-emerald-700';
      case 'Teacher': return 'bg-amber-50 border border-amber-100 text-amber-700';
      default: return 'bg-rose-50 border border-rose-100 text-rose-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans text-lg text-slate-700">
      
      {/* Title Header Section */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-1.5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <span className="text-[16px] text-[var(--color-secondary)] font-bold uppercase tracking-wide block">
            School Access Control
          </span>
          <h2 className="text-3xl font-bold text-slate-900">
            User Management
          </h2>
          <p className="text-slate-500 font-medium max-w-xl">
            Manage school administrators and staff accounts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenModal}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 outline-none text-white text-[17px] font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition cursor-pointer shrink-0 border-none"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent'].map((roleType) => {
          const count = users.filter(u => u.role === roleType).length;
          return (
            <div key={roleType} className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-2 rounded-2xl shadow-sm text-center">
              <span className="text-slate-400 text-[16px] font-bold uppercase tracking-wider block">{roleType}s</span>
              <div className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Filter and search controllers */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-2 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search staff names, emails, phones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-lg text-slate-400 flex items-center gap-1 shrink-0 font-bold uppercase tracking-wider text-[16px]">
            Filter :
          </span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-1.5 py-1.5 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-755 text-lg rounded-xl font-semibold outline-none cursor-pointer"
          >
            <option value="All">All Portal Users</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Parent / Guardian">Parent / Guardian</option>
            <option value="Student">Student</option>
            <option value="Librarian">Librarian</option>
            <option value="Finance Officer">Finance Officer</option>
            <option value="Teacher">Teacher</option>
            <option value="School Owner">School Owner</option>
          </select>
        </div>
      </div>

      {/* Users Registry List Table */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-250 text-[15px] uppercase tracking-wider text-slate-500 tabular-nums h-11">
                <th className="py-2 px-6 font-semibold">User Profile</th>
                <th className="py-2 px-3 font-semibold">Credentials Link</th>
                <th className="py-2 px-3 font-semibold">User Role Level</th>
                <th className="py-2 px-3 font-semibold">Assigned Specialty</th>
                <th className="py-2 px-3 font-semibold">Joined Date</th>
                <th className="py-2 px-6 font-semibold text-right">Access Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-lg text-slate-700 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 font-bold text-lg bg-white">
                    No school user accounts matches selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center font-bold font-sans text-lg">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{user.name}</p>
                          <p className="text-[16px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                            <Phone className="w-3 h-3 text-slate-400" /> {user.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 tabular-nums text-indigo-600 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{user.email}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[15px] font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {user.assignedDetail ? (
                        <div className="flex items-center gap-1.5">
                          {user.role === 'Parent / Guardian' ? (
                            <GraduationCap className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          ) : (
                            <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{user.assignedDetail}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None configured</span>
                      )}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-medium text-slate-450">{user.joinedDate}</td>
                    <td className="py-3 px-6 text-right">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[15px] uppercase font-bold tracking-wider rounded-md">
                        ACTIVE ONLINE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER DIALOG MODAL FALLBACK */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl shadow-2xl overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-secondary)]" />
                <h3 className="font-bold text-slate-900 uppercase">Onboard New Team Member</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-lg font-semibold">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">User Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Mercy Chepkoech"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 select-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Username / Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. mercy@karegasec.co.ke"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl px-1.5 py-2 tabular-nums text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +254 712 345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl px-1.5 py-2 tabular-nums text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Account Role Level</label>
                    <select
                      value={role}
                      onChange={(e: any) => setRole(e.target.value)}
                      className="w-full bg-slate-55 border border-slate-205 rounded-xl px-3 py-1.5 text-slate-800 font-semibold cursor-pointer"
                    >
                      <option value="HR Manager">HR Manager</option>
                      <option value="Parent / Guardian">Parent / Guardian</option>
                      <option value="Student">Student</option>
                      <option value="Librarian">Librarian</option>
                      <option value="Finance Officer">Finance Officer</option>
                      <option value="Teacher">Teacher</option>
                      <option value="School Owner">School Owner</option>
                    </select>
                  </div>

                  <div>
                    {role === 'Parent / Guardian' ? (
                      <>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Link Child Student</label>
                        <select
                          value={parentChildId}
                          onChange={(e) => setParentChildId(e.target.value)}
                          className="w-full bg-slate-55 border border-slate-205 rounded-xl px-3 py-1.5 text-slate-800 font-semibold cursor-pointer"
                        >
                          {students.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <label className="block text-[16px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Role Details</label>
                        <input
                          type="text"
                          placeholder="e.g. Mathematics/Physics"
                          value={assignedDetail}
                          onChange={(e) => setAssignedDetail(e.target.value)}
                          className="w-full bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-xl px-1.5 py-2 text-slate-800"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Banner Card */}
              <div className="p-1.5 bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 rounded-2xl flex items-start gap-1 text-[16px] font-medium leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Onboarding this user grants system access rights securely. The default sandbox master password is: <span className="font-bold underline text-slate-900">843820</span>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl cursor-pointer font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] rounded-xl font-bold cursor-pointer transition shadow-md shadow-[var(--color-secondary)]/15"
                >
                  Onboard User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
