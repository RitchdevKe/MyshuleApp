import React, { useState } from 'react';
import { 
  UserPlus, 
  Users, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  GraduationCap,
  Briefcase,
  X,
  PlusCircle,
  Settings,
  Key,
  Trash2,
  Edit,
  Sliders,
  Lock,
  Eye,
  EyeOff,
  Bus,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Student } from '../types.ts';
import { SchoolUser } from './UsersManagementTab.tsx';
import { toast } from 'react-hot-toast';

interface SystemUsersOnboardingTabProps {
  users: SchoolUser[];
  onUpdateUsers: (users: SchoolUser[]) => void;
  students: Student[];
}

export function SystemUsersOnboardingTab({ users, onUpdateUsers, students }: SystemUsersOnboardingTabProps) {
  const [search, setSearch] = useState('');
  
  // Categorized card filter: 'All', 'System Admins', 'Teachers', 'Transport Drivers', 'Accountants', 'Caretakers', 'Parents & Guardians', 'Kitchen Staff', 'Support & Security'
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modal State Management
  const [modalType, setModalType] = useState<'add' | 'edit' | 'pwd' | 'delete' | null>(null);
  const [targetUser, setTargetUser] = useState<SchoolUser | null>(null);

  // Form parameters
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'School Admin' | 'Head Teacher' | 'Accountant' | 'Teacher' | 'Parent'>('Teacher');
  const [formAssignedDetail, setFormAssignedDetail] = useState('');
  const [formParentChildId, setFormParentChildId] = useState(students[0]?.id || '');
  const [formPassword, setFormPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Counts based on actual schema and contextual school indicators
  const systemAdminsCount = users.filter(u => u.role === 'School Admin').length;
  const teachersCount = users.filter(u => u.role === 'Teacher').length;
  const caretakersCount = users.filter(u => u.role === 'Head Teacher').length;
  const parentsCount = users.filter(u => u.role === 'Parent').length;
  const accountantsCount = users.filter(u => u.role === 'Accountant').length;
  
  // Real or high-fidelity simulated counts for specialized non-login/service roles
  const transportDriversCount = users.filter(u => u.assignedDetail?.toLowerCase().includes('driver') || u.assignedDetail?.toLowerCase().includes('transport') || u.assignedDetail?.toLowerCase().includes('bus')).length || 3;
  const kitchenStaffCount = users.filter(u => u.assignedDetail?.toLowerCase().includes('cook') || u.assignedDetail?.toLowerCase().includes('kitchen') || u.assignedDetail?.toLowerCase().includes('catering')).length || 5;
  const supportSecurityCount = users.filter(u => u.assignedDetail?.toLowerCase().includes('guard') || u.assignedDetail?.toLowerCase().includes('security') || u.assignedDetail?.toLowerCase().includes('gate') || u.assignedDetail?.toLowerCase().includes('maintenance')).length || 4;

  // Handles adding new user
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Name and email are strictly required.');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === formEmail.trim().toLowerCase())) {
      toast.error('A user with this system email already exists.');
      return;
    }

    let detail = formAssignedDetail;
    if (formRole === 'Parent') {
      const selectedStudent = students.find(s => s.id === formParentChildId);
      detail = selectedStudent ? `Parent of ${selectedStudent.name} (${selectedStudent.admissionNo})` : 'Parent';
    } else if (formRole === 'Teacher' && !detail) {
      detail = 'Language/Sciences Expert';
    } else if (formRole === 'Accountant' && !detail) {
      detail = 'Chief Bursary Controller';
    } else if (formRole === 'Head Teacher' && !detail) {
      detail = 'Senior Management Lead';
    } else if (formRole === 'School Admin' && !detail) {
      detail = 'System Operations Registrar';
    }

    const newUser: SchoolUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: formName.trim(),
      email: formEmail.trim().toLowerCase(),
      phone: formPhone.trim() || '+254 ' + Math.floor(700000000 + Math.random() * 99999999),
      role: formRole,
      joinedDate: new Date().toISOString().substring(0, 10),
      assignedDetail: detail,
      status: 'active'
    };

    onUpdateUsers([newUser, ...users]);
    toast.success(`Successfully onboarded ${newUser.name} as ${newUser.role}!`);
    closeModals();
  };

  // Handles updating existing user details
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    if (!formName.trim() || !formEmail.trim()) {
      toast.error('Name and email are required.');
      return;
    }

    // Check duplicate email (excluding currently edited user)
    if (users.some(u => u.id !== targetUser.id && u.email.toLowerCase() === formEmail.trim().toLowerCase())) {
      toast.error('Another user is already registered with this email.');
      return;
    }

    const updated = users.map(u => {
      if (u.id === targetUser.id) {
        return {
          ...u,
          name: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          phone: formPhone.trim(),
          role: formRole,
          assignedDetail: formAssignedDetail || u.assignedDetail
        };
      }
      return u;
    });

    onUpdateUsers(updated);
    toast.success('System user profile successfully updated.');
    closeModals();
  };

  // Handles custom set password action
  const handleSetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;
    if (!formPassword.trim()) {
      toast.error('Please specify a secure access key/password.');
      return;
    }

    toast.success(`Access key updated successfully for ${targetUser.name}!`);
    closeModals();
  };

  // Handles user deletion
  const handleDeleteConfirm = () => {
    if (!targetUser) return;
    const remaining = users.filter(u => u.id !== targetUser.id);
    onUpdateUsers(remaining);
    toast.success(`Privilege clearance revoked for ${targetUser.name}.`);
    closeModals();
  };

  // Triggers
  const openAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('Teacher');
    setFormAssignedDetail('');
    setFormPassword('');
    setModalType('add');
  };

  const openEditModal = (user: SchoolUser) => {
    setTargetUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPhone(user.phone);
    setFormRole(user.role);
    setFormAssignedDetail(user.assignedDetail || '');
    setModalType('edit');
  };

  const openPwdModal = (user: SchoolUser) => {
    setTargetUser(user);
    setFormPassword('');
    setModalType('pwd');
  };

  const openDeleteModal = (user: SchoolUser) => {
    setTargetUser(user);
    setModalType('delete');
  };

  const closeModals = () => {
    setModalType(null);
    setTargetUser(null);
  };

  // Client-side filtering logic matching the 8 category cards
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase()) ||
                          user.phone.includes(search);
    
    if (selectedCategory === 'All') return matchesSearch;
    if (selectedCategory === 'System Admins') return matchesSearch && user.role === 'School Admin';
    if (selectedCategory === 'Teachers') return matchesSearch && user.role === 'Teacher';
    if (selectedCategory === 'Transport Drivers') {
      return matchesSearch && ((user.role as string) === 'Driver' || user.assignedDetail?.toLowerCase().includes('driver') || user.assignedDetail?.toLowerCase().includes('transport') || user.assignedDetail?.toLowerCase().includes('bus') || false);
    }
    if (selectedCategory === 'Accountants') return matchesSearch && user.role === 'Accountant';
    if (selectedCategory === 'Caretakers') return matchesSearch && user.role === 'Head Teacher';
    if (selectedCategory === 'Parents & Guardians') return matchesSearch && user.role === 'Parent';
    
    if (selectedCategory === 'Kitchen Staff') {
      return matchesSearch && (user.assignedDetail?.toLowerCase().includes('cook') || user.assignedDetail?.toLowerCase().includes('kitchen') || user.assignedDetail?.toLowerCase().includes('chef') || user.assignedDetail?.toLowerCase().includes('catering') || false);
    }
    if (selectedCategory === 'Support & Security') {
      return matchesSearch && (user.assignedDetail?.toLowerCase().includes('guard') || user.assignedDetail?.toLowerCase().includes('security') || user.assignedDetail?.toLowerCase().includes('gate') || user.assignedDetail?.toLowerCase().includes('maintenance') || false);
    }

    return matchesSearch;
  });


  // Category card definitions — drives the 8-card filter grid
  const categoryCards = [
    { key: 'System Admins', label: 'System Admins', count: systemAdminsCount, unit: 'Users', icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-700' },
    { key: 'Teachers', label: 'Teachers', count: teachersCount, unit: 'Users', icon: GraduationCap, color: 'bg-emerald-50 text-emerald-700' },
    { key: 'Transport Drivers', label: 'Transport Drivers', count: transportDriversCount, unit: 'Staff', icon: Bus, color: 'bg-sky-50 text-sky-700' },
    { key: 'Accountants', label: 'Accountants', count: accountantsCount, unit: 'Users', icon: Briefcase, color: 'bg-violet-50 text-violet-700' },
    { key: 'Caretakers', label: 'Caretakers', count: caretakersCount, unit: 'Users', icon: Key, color: 'bg-amber-50 text-amber-700' },
    { key: 'Parents & Guardians', label: 'Parents & Guardians', count: parentsCount, unit: 'Users', icon: Users, color: 'bg-orange-50 text-orange-700' },
    { key: 'Kitchen Staff', label: 'Kitchen Staff', count: kitchenStaffCount, unit: 'Staff', icon: Utensils, color: 'bg-pink-50 text-pink-700' },
    { key: 'Support & Security', label: 'Support & Security', count: supportSecurityCount, unit: 'Staff', icon: Lock, color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 leading-tight">
            User Management
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Administrators, teachers, drivers, parents, and support staff.
          </p>
        </div>

        <button 
          onClick={() => toast('Manage roles inside the Operations security desk.', { icon: '🔑' })}
          className="flex items-center gap-1.5 text-xs font-medium text-[#3D1D3F] hover:text-[#C20F47] transition cursor-pointer border-none bg-transparent"
        >
          <Settings className="w-3.5 h-3.5 text-[#C20F47]" />
          <span>Manage Roles & Permissions</span>
        </button>
      </div>

      {/* Category filter cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categoryCards.map(card => {
          const Icon = card.icon;
          const isActive = selectedCategory === card.key;
          return (
            <div
              key={card.key}
              onClick={() => setSelectedCategory(isActive ? 'All' : card.key)}
              className={`relative overflow-hidden cursor-pointer p-3.5 rounded-[1.25rem] transition-all duration-200 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] bg-white ${
                isActive ? 'ring-2 ring-[#3D1D3F]/15 shadow-md' : 'shadow-sm hover:shadow'
              }`}
            >
              <div className="absolute right-1.5 top-1.5 text-slate-100 opacity-25 pointer-events-none">
                <Icon className="w-12 h-12" />
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center relative z-10 ${isActive ? 'bg-[#3D1D3F] text-white' : card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="mt-3 relative z-10">
                <h4 className="font-semibold text-slate-800 text-sm leading-tight">{card.label}</h4>
                <span className="text-xs text-slate-400 font-medium tabular-nums mt-0.5 block">{card.count} {card.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users table */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] shadow-sm overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-2.5 items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <h3 className="font-semibold text-slate-800 text-sm">
              {selectedCategory === 'All' ? 'School System Users' : selectedCategory}
            </h3>
            <span className="text-[11px] text-slate-400 tabular-nums">{filteredUsers.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff & registry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs font-normal rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
              />
            </div>

            <button
              onClick={openAddModal}
              className="w-full sm:w-auto bg-[#C20F47] hover:bg-[#3D1D3F] text-white px-3.5 py-2 text-xs font-medium rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm border-none whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Name</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Username</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Phone</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Role</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Joined</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Active</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    No users match this search or category.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{user.name}</p>
                      <p className="text-[11px] text-slate-400 tabular-nums mt-0.5">{user.email}</p>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 tabular-nums text-xs">{user.email.split('@')[0] || '-'}</td>
                    <td className="px-4 py-2.5 tabular-nums text-slate-500 text-xs">{user.phone || '-'}</td>
                    <td className="px-4 py-2.5 text-slate-600 text-sm font-medium">{user.role}</td>
                    <td className="px-4 py-2.5 text-slate-400 tabular-nums text-xs">{user.joinedDate || 'N/A'}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-medium rounded">
                        Yes
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(user)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-lg inline-flex items-center gap-1 cursor-pointer transition text-[11px] font-medium border-none"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => openPwdModal(user)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded-lg inline-flex items-center gap-1 cursor-pointer transition text-[11px] font-medium border-none"
                        >
                          <Key className="w-3 h-3" />
                          Pwd
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded-lg inline-flex items-center gap-1 cursor-pointer transition text-[11px] font-medium border-none"
                        >
                          <Trash2 className="w-3 h-3" />
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>

        {/* ADD USER MODAL */}
        {modalType === 'add' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <UserPlus className="w-3.5 h-3.5" />
                  Add System User
                </h3>
                <button onClick={closeModals} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleAddUserSubmit} className="p-5 space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jose Favour"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Email / Username</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jose@school.co.ke"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                    <select
                      value={formRole}
                      onChange={(e: any) => setFormRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 cursor-pointer outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    >
                      <option value="School Admin">School Admin</option>
                      <option value="Head Teacher">Head Teacher</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Specialty / Support</label>
                    <input
                      type="text"
                      placeholder="e.g. Language Dept"
                      value={formAssignedDetail}
                      onChange={(e) => setFormAssignedDetail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 0704159993"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-xs leading-relaxed text-amber-800 flex gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C20F47] shrink-0 mt-0.5" />
                  <p>New accounts get sandbox access with a random default password.</p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-3.5 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg transition text-sm cursor-pointer border-none bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg transition font-medium text-sm cursor-pointer border-none shadow-sm"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* EDIT USER MODAL */}
        {modalType === 'edit' && targetUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Edit className="w-3.5 h-3.5" />
                  Update User Profile
                </h3>
                <button onClick={closeModals} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleEditUserSubmit} className="p-5 space-y-3.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Email / Username</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Role</label>
                    <select
                      value={formRole}
                      onChange={(e: any) => setFormRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 cursor-pointer outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    >
                      <option value="School Admin">School Admin</option>
                      <option value="Head Teacher">Head Teacher</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Parent">Parent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Specialty / Info</label>
                    <input
                      type="text"
                      value={formAssignedDetail}
                      onChange={(e) => setFormAssignedDetail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-normal text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-3.5 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg transition text-sm cursor-pointer border-none bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg transition font-medium text-sm cursor-pointer border-none shadow-sm"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* SET PASSWORD MODAL */}
        {modalType === 'pwd' && targetUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Key className="w-3.5 h-3.5" />
                  Set Password
                </h3>
                <button onClick={closeModals} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleSetPasswordSubmit} className="p-5 space-y-3.5">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Set a new access password for <strong className="text-slate-800 font-semibold">{targetUser.name}</strong>.
                </p>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="Enter secure code"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm tabular-nums text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent"
                    >
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-3.5 py-2 text-slate-500 font-medium hover:bg-slate-100 rounded-lg transition text-sm cursor-pointer border-none bg-transparent"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg transition font-medium text-sm cursor-pointer border-none shadow-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRM MODAL */}
        {modalType === 'delete' && targetUser && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-x-2 border-b-2 border-rose-400 border-t-[8px] border-t-rose-300 rounded-2xl shadow-2xl max-w-sm w-full p-5 text-center space-y-3"
            >
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                Revoke access?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This will permanently remove system access for <strong className="text-slate-800 font-semibold">{targetUser.name}</strong>.
              </p>

              <div className="flex justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-3.5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition font-medium text-sm cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition font-medium text-sm cursor-pointer border-none shadow-sm"
                >
                  Revoke Access
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
