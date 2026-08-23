import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Save, Circle, CheckCircle2, Check, Info, ChevronDown } from 'lucide-react';
import { RolePermissions } from '../types.ts';

interface RolePermissionsGridProps {
  initialPermissions?: RolePermissions;
  onSave?: (perms: { [role: string]: RolePermissions }) => void;
}

export const DEFAULT_ROLE_PERMISSIONS: { [role: string]: RolePermissions } = {
  'School Owner': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: true, Analytics: true, Settings: true, Communication: true, 'User Management': true, 'Audit & Logs': true, Billing: true },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: true, Documents: true, Promotion: true, Alumni: true },
    'ACADEMICS': { Classes: true, Subjects: true, Timetable: true, Curriculum: true },
    'EXAMINATIONS': { Assessments: true, Results: true, 'Exam Analytics': true },
    'FINANCE': { Payments: true, Receipts: true, Scholarships: true, 'Finance Setup': true },
    'FACILITIES': { 'Student Attendance': true, Library: true, Transport: true, Hostel: true, Inventory: true },
    'HR & STAFF': { 'Staff Directory': true, 'Staff Attendance': true, 'Leave Management': true, 'Payroll Processing': true, 'HR Documents': true, 'HR Reports': true, 'HR Settings': true }
  },
  'HR Manager': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: true, Analytics: true, Settings: false, Communication: true, 'User Management': true, 'Audit & Logs': true, Billing: false },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: true, Documents: true, Promotion: true, Alumni: true },
    'ACADEMICS': { Classes: true, Subjects: true, Timetable: true, Curriculum: true },
    'EXAMINATIONS': { Assessments: true, Results: true, 'Exam Analytics': true },
    'FINANCE': { Payments: false, Receipts: false, Scholarships: true, 'Finance Setup': false },
    'FACILITIES': { 'Student Attendance': true, Library: true, Transport: true, Hostel: true, Inventory: false },
    'HR & STAFF': { 'Staff Directory': true, 'Staff Attendance': true, 'Leave Management': true, 'Payroll Processing': true, 'HR Documents': true, 'HR Reports': true, 'HR Settings': true }
  },
  'Finance Officer': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: true, Analytics: false, Settings: false, Communication: true, 'User Management': false, 'Audit & Logs': false, Billing: true },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: false, Documents: false, Promotion: false, Alumni: false },
    'ACADEMICS': { Classes: false, Subjects: false, Timetable: false, Curriculum: false },
    'EXAMINATIONS': { Assessments: false, Results: false, 'Exam Analytics': false },
    'FINANCE': { Payments: true, Receipts: true, Scholarships: true, 'Finance Setup': true },
    'FACILITIES': { 'Student Attendance': false, Library: false, Transport: true, Hostel: false, Inventory: true },
    'HR & STAFF': { 'Staff Directory': false, 'Staff Attendance': false, 'Leave Management': false, 'Payroll Processing': true, 'HR Documents': false, 'HR Reports': false, 'HR Settings': false }
  },
  'Teacher': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: true, Analytics: false, Settings: false, Communication: true, 'User Management': false, 'Audit & Logs': false, Billing: false },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: false, Documents: true, Promotion: false, Alumni: false },
    'ACADEMICS': { Classes: true, Subjects: true, Timetable: true, Curriculum: false },
    'EXAMINATIONS': { Assessments: true, Results: true, 'Exam Analytics': true },
    'FINANCE': { Payments: false, Receipts: false, Scholarships: false, 'Finance Setup': false },
    'FACILITIES': { 'Student Attendance': true, Library: false, Transport: false, Hostel: false, Inventory: false },
    'HR & STAFF': { 'Staff Directory': false, 'Staff Attendance': false, 'Leave Management': false, 'Payroll Processing': false, 'HR Documents': false, 'HR Reports': false, 'HR Settings': false }
  },
  'Parent / Guardian': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: false, Analytics: false, Settings: false, Communication: true, 'User Management': false, 'Audit & Logs': false, Billing: false },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: false, Documents: false, Promotion: false, Alumni: false },
    'ACADEMICS': { Classes: false, Subjects: false, Timetable: true, Curriculum: false },
    'EXAMINATIONS': { Assessments: false, Results: true, 'Exam Analytics': false },
    'FINANCE': { Payments: true, Receipts: true, Scholarships: false, 'Finance Setup': false },
    'FACILITIES': { 'Student Attendance': false, Library: false, Transport: false, Hostel: false, Inventory: false },
    'HR & STAFF': { 'Staff Directory': false, 'Staff Attendance': false, 'Leave Management': false, 'Payroll Processing': false, 'HR Documents': false, 'HR Reports': false, 'HR Settings': false }
  },
  'Student': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: false, Analytics: false, Settings: false, Communication: true, 'User Management': false, 'Audit & Logs': false, Billing: false },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: false, Documents: false, Promotion: false, Alumni: false },
    'ACADEMICS': { Classes: false, Subjects: false, Timetable: true, Curriculum: false },
    'EXAMINATIONS': { Assessments: false, Results: true, 'Exam Analytics': false },
    'FINANCE': { Payments: false, Receipts: false, Scholarships: false, 'Finance Setup': false },
    'FACILITIES': { 'Student Attendance': false, Library: true, Transport: false, Hostel: false, Inventory: false },
    'HR & STAFF': { 'Staff Directory': false, 'Staff Attendance': false, 'Leave Management': false, 'Payroll Processing': false, 'HR Documents': false, 'HR Reports': false, 'HR Settings': false }
  },
  'Librarian': {
    'GENERAL & SYSTEM': { Dashboard: true, Calendar: true, Analytics: false, Settings: false, Communication: true, 'User Management': false, 'Audit & Logs': false, Billing: false },
    'STUDENT INFORMATION': { 'Student Profiles': true, Admissions: false, Documents: false, Promotion: false, Alumni: false },
    'ACADEMICS': { Classes: false, Subjects: false, Timetable: false, Curriculum: false },
    'EXAMINATIONS': { Assessments: false, Results: false, 'Exam Analytics': false },
    'FINANCE': { Payments: false, Receipts: false, Scholarships: false, 'Finance Setup': false },
    'FACILITIES': { 'Student Attendance': false, Library: true, Transport: false, Hostel: false, Inventory: true },
    'HR & STAFF': { 'Staff Directory': false, 'Staff Attendance': false, 'Leave Management': false, 'Payroll Processing': false, 'HR Documents': false, 'HR Reports': false, 'HR Settings': false }
  }
};

export function RolePermissionsGrid({ onSave }: RolePermissionsGridProps) {
  const rolesList = ['HR Manager', 'Parent / Guardian', 'Student', 'Librarian', 'Finance Officer', 'Teacher', 'School Owner'];
  const [selectedRole, setSelectedRole] = useState('HR Manager');
  const [allRolePerms, setAllRolePerms] = useState<{ [role: string]: RolePermissions }>(() => {
    // Load from localStorage or defaults
    const loaded = localStorage.getItem('school_role_permissions');
    return loaded ? JSON.parse(loaded) : DEFAULT_ROLE_PERMISSIONS;
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activePerms = allRolePerms[selectedRole] || DEFAULT_ROLE_PERMISSIONS[selectedRole];

  const handleToggle = (category: string, pageKey: string) => {
    setAllRolePerms(prev => {
      const currentRolePerms = { ...prev[selectedRole] };
      const currentCategoryPerms = { ...currentRolePerms[category] };
      currentCategoryPerms[pageKey] = !currentCategoryPerms[pageKey];
      currentRolePerms[category] = currentCategoryPerms;
      return {
        ...prev,
        [selectedRole]: currentRolePerms
      };
    });
  };

  const handleSelectAll = (category: string, select: boolean) => {
    setAllRolePerms(prev => {
      const currentRolePerms = { ...prev[selectedRole] };
      const currentCategoryPerms = { ...currentRolePerms[category] };
      Object.keys(currentCategoryPerms).forEach(k => {
        currentCategoryPerms[k] = select;
      });
      currentRolePerms[category] = currentCategoryPerms;
      return {
        ...prev,
        [selectedRole]: currentRolePerms
      };
    });
  };

  const getRoleDescription = (role: string) => {
    switch(role) {
      case 'HR Manager': return 'Manages Staff Recruitment and Payroll';
      case 'Finance Officer': return 'Access to finance, payroll, and billing modules';
      case 'Librarian': return 'Access to library management';
      case 'Teacher': return 'Access to teaching-related modules';
      case 'School Owner': return 'Full access to all modules and settings';
      default: return 'Role specific access';
    }
  };

  const handleGlobalSelectAll = () => {
    setAllRolePerms(prev => {
      const currentRolePerms = { ...prev[selectedRole] };
      Object.keys(currentRolePerms).forEach(category => {
        const currentCategoryPerms = { ...currentRolePerms[category] };
        Object.keys(currentCategoryPerms).forEach(k => {
          currentCategoryPerms[k] = true;
        });
        currentRolePerms[category] = currentCategoryPerms;
      });
      return {
        ...prev,
        [selectedRole]: currentRolePerms
      };
    });
  };

  const handleSaveAll = () => {
    setSaving(true);
    localStorage.setItem('school_role_permissions', JSON.stringify(allRolePerms));
    if (onSave) onSave(allRolePerms);

    setTimeout(() => {
      setSaving(false);
      setSavedSuccessMsg(true);
      setTimeout(() => {
        setSavedSuccessMsg(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-lg text-slate-700 bg-slate-50/50 p-6 rounded-3xl min-h-screen">
      
      {/* Configuration Header controls */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl tracking-tight font-bold text-slate-800">Permissions & Roles</h2>
        <p className="text-slate-500 font-medium">Configure access levels and permissions for school roles and individual users.</p>
      </div>

      <div className="flex border-b border-slate-200 w-fit gap-8 mt-6">
        <button className="pb-3 border-b-2 border-orange-500 font-bold text-slate-800 bg-transparent text-[18px]">By Role</button>
        <button className="pb-3 border-b-2 border-transparent text-slate-400 font-bold bg-transparent text-[18px]">By User</button>
      </div>

      <div className="mt-8 flex justify-between items-start">
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-slate-200 p-2.5 px-3.5 rounded-2xl flex items-center justify-between w-72 shadow-sm cursor-pointer select-none transition hover:border-slate-300"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-slate-800 text-[19px]">{selectedRole}</span>
                  <span className="bg-slate-100 text-slate-500 text-[14px] px-1.5 py-0.5 rounded-md font-bold uppercase">System</span>
              </div>
              <p className="text-[16px] text-slate-500 font-medium">{getRoleDescription(selectedRole)}</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-16 left-0 w-72 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-xl z-50 overflow-hidden py-2 font-medium">
              {rolesList.map(r => (
                <div 
                  key={r} 
                  onClick={() => { setSelectedRole(r); setIsDropdownOpen(false); }}
                  className={`px-4 py-2.5 text-lg cursor-pointer transition flex items-center justify-between ${selectedRole === r ? 'bg-orange-50 text-orange-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  {r}
                  {selectedRole === r && <Check className="w-4 h-4" />}
                </div>
              ))}
            </div>
          )}
          
          <button className="ml-2 px-4 py-2 bg-white border border-orange-200 text-orange-500 font-bold text-lg flex items-center justify-center gap-1.5 rounded-xl hover:bg-orange-50 transition cursor-pointer">
            <span className="text-orange-500 text-2xl leading-none">+</span> Create Role
          </button>
        </div>

        <div className="flex items-center gap-4 shrink-0 relative">
          {savedSuccessMsg && (
            <div className="absolute -bottom-10 right-0 bg-white shadow-lg border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in whitespace-nowrap z-50">
              <span className="text-slate-600 font-medium text-lg">Permissions saved</span>
              <div className="flex items-center gap-1 text-blue-600 font-bold text-lg bg-blue-50 px-2 py-0.5 rounded-md">
                <Check className="w-3.5 h-3.5" /> Successfully
              </div>
            </div>
          )}
          
          <button 
            onClick={handleGlobalSelectAll}
            className="flex items-center gap-2 font-bold text-[17px] text-slate-500 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] px-2 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-400" /> Select All 
          </button>
          
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 border-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Permissions Main grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {Object.keys(activePerms).map(categoryKey => {
          const categoryPerms = activePerms[categoryKey] || {};
          const keys = Object.keys(categoryPerms);
          const allSelected = keys.every(k => categoryPerms[k]);
          
          return (
            <div key={categoryKey} className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A]/80 rounded-[1.5rem] p-1.5 shadow-sm space-y-1">
              <div>
                <div className="flex items-center justify-between pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-orange-300"></span>
                    <span className="font-bold text-slate-700 tracking-wider text-[16px] uppercase">{categoryKey}</span>
                  </div>
                </div>

                {/* Sub items check-boxes list */}
                <div className="space-y-[1px]">
                  {keys.map(pageKey => {
                    const checked = categoryPerms[pageKey];
                    return (
                      <div 
                        key={pageKey} 
                        onClick={() => handleToggle(categoryKey, pageKey)}
                        className="flex items-center gap-3 py-1.5 px-0 hover:bg-slate-50 transition cursor-pointer select-none rounded group"
                      >
                        {checked ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-orange-500 shrink-0" />
                        ) : (
                          <Circle className="w-4.5 h-4.5 text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors" />
                        )}
                        <span className={`text-[17px] ${checked ? 'text-slate-700 font-semibold' : 'text-slate-500 font-medium'}`}>
                          {pageKey}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
