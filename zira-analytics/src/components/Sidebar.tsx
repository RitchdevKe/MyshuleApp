import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  Bell,
  Users,
  GraduationCap,
  CreditCard,
  Briefcase,
  Truck,
  Bus,
  Shield,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  Sliders,
  TrendingUp,
  Calculator,
  ShoppingCart,
  BookOpen
} from 'lucide-react';
import { TabId } from '../App.tsx';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  teacherInfo: { name: string; email: string; role: string };
  onLogout: () => void;
  activeSchoolId: string;
  activeSchoolName: string;
  onReturnToAdmin: () => void;
}

interface SidebarSubItem {
  id: TabId;
  label: string;
  roles?: string[];
}

interface SidebarGroup {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  subItems: SidebarSubItem[];
  roles: string[];
}

export function Sidebar({ 
  activeTab, 
  onTabChange, 
  teacherInfo, 
  onLogout,
  activeSchoolId,
  activeSchoolName,
  onReturnToAdmin
}: SidebarProps) {
  const isSuperAdminUser = teacherInfo.role === 'Super Admin';
  const isCurrentlyInSchoolView = activeSchoolId !== 'super';

  const menuGroups: SidebarGroup[] = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      subItems: [
        { id: 'overview', label: 'Overview', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent'] },
        { id: 'quick_search', label: 'Quick Search', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent'] },
        { id: 'attendance', label: 'Attendance Register', roles: ['School Admin', 'Head Teacher', 'Teacher'] },
        { id: 'timetable', label: 'Timetable', roles: ['School Admin', 'Head Teacher', 'Teacher', 'Parent'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent']
    },
    {
      key: 'reception',
      label: 'Reception',
      icon: Users,
      subItems: [
        { id: 'receptionist', label: 'Reception Console', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent', 'Receptionist'] },
        { id: 'work_diaries', label: 'Work Diaries', roles: ['School Admin', 'Head Teacher', 'Teacher', 'Receptionist'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent', 'Receptionist']
    },
    {
      key: 'onboarding',
      label: 'Onboarding',
      icon: Users,
      subItems: [
        { id: 'students_data_hub', label: 'Students Data Hub', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher'] },
        { id: 'system_users_onboarding', label: 'System Users', roles: ['School Admin', 'Head Teacher'] },
        { id: 'report_forms', label: 'Report Forms', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher']
    },
    {
      key: 'academics',
      label: 'Academics & Learning',
      icon: GraduationCap,
      subItems: [
        { id: 'academic', label: 'Academic Hub', roles: ['School Admin', 'Head Teacher', 'Teacher'] },
        { id: 'lms', label: 'E-Learning', roles: ['School Admin', 'Head Teacher', 'Teacher', 'Parent'] },
        { id: 'teacher_portal', label: 'My Teacher Workspace', roles: ['Teacher'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Teacher', 'Parent']
    },
    {
      key: 'operations',
      label: 'Operations',
      icon: Sliders,
      subItems: [
        { id: 'notifications', label: 'Notifications Hub', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent'] },
        { id: 'sms', label: 'Communication Hub', roles: ['School Admin', 'Head Teacher', 'Accountant'] },
        { id: 'ptc', label: 'PTC Bookings', roles: ['School Admin', 'Head Teacher', 'Teacher', 'Parent'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent']
    },
    {
      key: 'finance',
      label: 'Payments',
      icon: CreditCard,
      subItems: [
        { id: 'finance_dash', label: 'Finance Dashboard', roles: ['School Admin', 'Accountant'] },
        { id: 'finance', label: 'Transactions Ledger', roles: ['School Admin', 'Accountant'] },
        { id: 'invoices', label: 'Invoices & Billing', roles: ['School Admin', 'Accountant'] },
        { id: 'fee_structure', label: 'Fee Structures', roles: ['School Admin', 'Accountant'] }
      ],
      roles: ['School Admin', 'Accountant', 'Head Teacher', 'Parent']
    },
    {
      key: 'accounting',
      label: 'Accounting',
      icon: Calculator,
      subItems: [
        { id: 'accounting_dash', label: 'Overview', roles: ['School Admin', 'Accountant'] },
        { id: 'general_ledger', label: 'General Ledger', roles: ['School Admin', 'Accountant'] },
        { id: 'accounts_payable', label: 'Accounts Payable', roles: ['School Admin', 'Accountant'] },
        { id: 'accounts_receivable', label: 'Accounts Receivable', roles: ['School Admin', 'Accountant'] }
      ],
      roles: ['School Admin', 'Accountant']
    },
    {
      key: 'library',
      label: 'Library & Literature',
      icon: BookOpen,
      subItems: [
        { id: 'library', label: 'Library Console', roles: ['School Admin', 'Head Teacher', 'Teacher', 'Librarian', 'School Owner'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Teacher', 'Librarian', 'School Owner']
    },
    {
      key: 'hr',
      label: 'HR & Payroll',
      icon: Briefcase,
      subItems: [
        { id: 'users', label: 'Staff Registry', roles: ['School Admin', 'Head Teacher'] },
        { id: 'leave_management', label: 'Leave Requests', roles: ['School Admin', 'Head Teacher'] },
        { id: 'payroll', label: 'Payroll Processing', roles: ['School Admin', 'Head Teacher'] }
      ],
      roles: ['School Admin', 'Head Teacher']
    },
    {
      key: 'procurement',
      label: 'Procurement',
      icon: ShoppingCart,
      subItems: [
        { id: 'procurement', label: 'Purchase Orders', roles: ['School Admin', 'Accountant'] },
        { id: 'supplier_management', label: 'Supplier Management', roles: ['School Admin', 'Accountant'] },
        { id: 'vendor_management', label: 'Vendor Management', roles: ['School Admin', 'Accountant'] },
        { id: 'inventory', label: 'Assets Inventory', roles: ['School Admin', 'Head Teacher', 'Accountant'] },
        { id: 'canteen', label: 'Canteen (POS)', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Parent'] },
        { id: 'health', label: 'Health Clinic (POS)', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Parent'] }
      ],
      roles: ['School Admin', 'Accountant', 'Head Teacher', 'Parent']
    },
    {
      key: 'logistics',
      label: 'Transport',
      icon: Bus,
      subItems: [
        { id: 'transport_routes', label: 'Transport & Fleet', roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher', 'Parent'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Accountant', 'Parent', 'Teacher']
    },
    {
      key: 'reports_analytics',
      label: 'Reports & Analytics',
      icon: TrendingUp,
      subItems: [
        { id: 'reports', label: 'Reports', roles: ['School Admin', 'Head Teacher', 'Accountant'] },
        { id: 'academic', label: 'Analytics', roles: ['School Admin', 'Head Teacher', 'Teacher'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'Accountant', 'Teacher']
    },
    {
      key: 'systemAdmin',
      label: 'Settings',
      icon: Shield,
      subItems: [
        { id: 'user_management_module', label: 'User Management', roles: ['School Admin', 'Head Teacher', 'School Owner'] },
        { id: 'permissions_roles', label: 'Permissions & Roles', roles: ['School Admin', 'Head Teacher', 'School Owner'] },
        { id: 'settings', label: 'School Settings', roles: ['School Admin', 'Head Teacher'] },
        { id: 'admin_utilities', label: 'Admin Utilities', roles: ['School Admin'] }
      ],
      roles: ['School Admin', 'Head Teacher', 'School Owner']
    }
  ];

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    dashboard: true,
    reception: false,
    operations: false,
    onboarding: true,
    reports_analytics: false,
    academics: false,
    finance: false,
    library: false,
    hr: false,
    logistics: false,
    systemAdmin: false
  });

  useEffect(() => {
    const parentGroup = menuGroups.find(g => g.subItems.some(sub => sub.id === activeTab));
    if (parentGroup) {
      setOpenGroups(prev => ({ ...prev, [parentGroup.key]: true }));
    }
  }, [activeTab]);

  const toggleGroup = (key: string) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeRole = isSuperAdminUser && isCurrentlyInSchoolView ? 'School Admin' : teacherInfo.role;
  const filteredGroups = menuGroups.filter(g => g.roles.includes(activeRole));

  return (
    <aside className="w-full flex-shrink-0 flex flex-col h-full rounded-[1.75rem] border-[3px] shadow-xl overflow-hidden bg-[#3D1D3F] border-[#3D1D3F] text-white select-none relative">
      
      {/* Scrollable nav area */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 pt-3 pb-2"
        style={{ scrollbarColor: '#C20F47 #3D1D3F', scrollbarWidth: 'thin' }}
      >
        <div className="space-y-0.5">
          
          {/* Tenant impersonation banner */}
          {isSuperAdminUser && isCurrentlyInSchoolView && (
            <div className="mx-0.5 p-3 bg-purple-950/40 border border-purple-500/20 rounded-xl mb-3 flex flex-col gap-1.5 shadow">
              <div className="flex items-center gap-1.5 text-purple-300 font-medium text-[11px] uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                Active Tenant
              </div>
              <p className="text-white font-semibold text-xs truncate leading-snug">{activeSchoolName}</p>
              <button
                onClick={onReturnToAdmin}
                className="w-full mt-0.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium text-[11px] uppercase tracking-wide transition flex items-center justify-center gap-1 cursor-pointer border-none"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to SaaS Admin
              </button>
            </div>
          )}

          {/* Main navigation */}
          {isCurrentlyInSchoolView ? (
            <div className="space-y-0.5">
              {filteredGroups.map(group => {
                const isExpanded = !!openGroups[group.key];
                const IconComponent = group.icon;
                const hasActiveChild = group.subItems.some(s => s.id === activeTab);

                return (
                  <div key={group.key} className="flex flex-col">
                    {/* Group header button */}
                    <button
                      onClick={() => toggleGroup(group.key)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-[11.5px] font-medium cursor-pointer text-left border-none min-w-0 ${
                        hasActiveChild 
                          ? 'bg-white/10 text-white' 
                          : 'text-white/65 hover:bg-white/[0.06] hover:text-white/90'
                      }`}
                      title={group.label}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <IconComponent className={`w-3.5 h-3.5 shrink-0 ${hasActiveChild ? 'text-[#C20F47]' : 'text-white/50'}`} />
                        <span className="leading-snug truncate font-medium">{group.label}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-white/40 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-white/40 shrink-0" />
                      )}
                    </button>

                    {/* Sub items */}
                    {isExpanded && (
                      <div className="ml-5 mt-0.5 space-y-0.5 flex flex-col relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-px before:bg-white/10 min-w-0">
                        {group.subItems
                          .filter(sub => !sub.roles || sub.roles.includes(activeRole))
                          .map(sub => {
                            const isActive = activeTab === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => onTabChange(sub.id)}
                                className={`text-left px-3 py-1.5 text-[11px] transition-colors rounded-md cursor-pointer border-none leading-snug w-full block min-w-0 ${
                                  isActive
                                    ? 'text-white bg-[#C20F47] font-semibold'
                                    : 'text-white/55 hover:bg-white/[0.06] hover:text-white/85 font-normal'
                                }`}
                                title={sub.label}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => onTabChange('super_admin')}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition text-[11.5px] font-medium cursor-pointer border-none ${
                  activeTab === 'super_admin' ? 'bg-[#C20F47] text-white' : 'text-white/65 hover:bg-white/[0.06] hover:text-white/90'
                }`}
              >
                <Shield className="h-3.5 w-3.5 text-purple-300 shrink-0" />
                <span className="truncate">SaaS Control</span>
              </button>
              <button
                onClick={() => onTabChange('overview')}
                className="w-full flex items-center justify-start gap-2 px-2.5 py-2 rounded-lg text-white/65 hover:bg-white/[0.06] text-[11.5px] font-medium transition cursor-pointer border-none mt-1"
              >
                <span>🚀 Dry Run</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Footer: user identity + logout */}
      <div className="px-3 py-3 border-t border-white/10 bg-black/15 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Avatar circle */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 border border-white/20 bg-[#C20F47] text-white shadow-sm select-none">
            {teacherInfo.name.substring(0, 2).toUpperCase()}
          </div>
          
          {/* Name + role */}
          <div className="flex-1 overflow-hidden">
            <p className="text-[12px] font-semibold truncate text-white leading-tight">
              {teacherInfo.name}
            </p>
            <p className="text-[11px] text-white/50 truncate font-normal leading-snug mt-0.5">
              {activeRole}
            </p>
          </div>
          
          {/* Logout */}
          <button 
            onClick={onLogout}
            className="p-2 rounded-lg transition-colors cursor-pointer text-white/40 hover:text-rose-300 hover:bg-rose-500/10 border-none bg-transparent" 
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </aside>
  );
}
