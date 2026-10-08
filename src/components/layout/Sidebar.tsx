"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, UserPlus, GraduationCap, Wallet, 
  Users, Building2, MessageSquare, BarChart3, Shield, Settings,
  ChevronDown, Layers, LogOut
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSchoolLevel } from "@/contexts/SchoolLevelContext";

const LEVEL_COLORS: Record<string, string> = {
  "All":         "bg-secondary-500/20 text-secondary-300 border-secondary-500/30",
  "Pre-Primary": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Primary":     "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Junior":      "bg-sky-500/20 text-sky-300 border-sky-500/30",
  "Senior":      "bg-violet-500/20 text-violet-300 border-violet-500/30",
};
const LEVEL_DOT: Record<string, string> = {
  "All":         "bg-secondary-400",
  "Pre-Primary": "bg-emerald-400",
  "Primary":     "bg-amber-400",
  "Junior":      "bg-sky-400",
  "Senior":      "bg-violet-400",
};

const Sidebar = ({ 
  tenantName, 
  logoUrl, 
  role,
  userName,
  userEmail
}: { 
  tenantName?: string, 
  logoUrl?: string, 
  role?: string,
  userName?: string,
  userEmail?: string 
}) => {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const { schoolLevel, setSchoolLevel } = useSchoolLevel();
  
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Automatically expand if a child is active
  useEffect(() => {
    if (pathname === "/dashboard" || pathname.match(/^\/dashboard\/(analytics|activities|calendar|ai-insights)/)) {
      setExpandedMenu("Dashboard");
    } else if (pathname.startsWith("/dashboard/registration")) {
      setExpandedMenu("Registration");
    } else if (pathname.startsWith("/dashboard/academics")) {
      setExpandedMenu("Academics");
    } else if (pathname.startsWith("/dashboard/student-life")) {
      setExpandedMenu("Student Life");
    } else if (pathname.startsWith("/dashboard/finance")) {
      setExpandedMenu("Finance");
    } else if (pathname.startsWith("/dashboard/human-resources")) {
      setExpandedMenu("HR & Payroll");
    } else if (pathname.startsWith("/dashboard/operations")) {
      setExpandedMenu("Operations");
    } else if (pathname.startsWith("/dashboard/communication")) {
      setExpandedMenu("Communication");
    } else if (pathname.startsWith("/dashboard/reports")) {
      setExpandedMenu("Reports");
    } else if (pathname.startsWith("/dashboard/administration")) {
      setExpandedMenu("Administration");
    } else if (pathname.startsWith("/dashboard/settings")) {
      setExpandedMenu("Settings");
    }
  }, [pathname]);

  const toggleExpand = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  const getNavigationForRole = (roleStr: string) => {
    const rawNavigation = [
      { 
        name: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        subItems: [
          { name: "Overview", href: "/dashboard" },
          { name: "Quick Search", href: "/dashboard/quick-search" },
          { name: "Timetable", href: "/dashboard/timetable" },
          { name: "Calendar", href: "/dashboard/calendar" },
          { name: "AI Insights", href: "/dashboard/ai-insights" },
        ]
      },
    { 
      name: "Registration",
      icon: UserPlus,
      href: "/dashboard/registration",
      subItems: [
        { name: "Admissions", href: "/dashboard/registration/admissions" },
        { name: "Parents", href: "/dashboard/registration/parents" },
        { name: "School Structure", href: "/dashboard/registration/school-structure" },
      ]
    },
    { 
      name: "Academics", 
      icon: GraduationCap,
      href: "/dashboard/academics",
      subItems: [
        { name: "Curriculum", href: "/dashboard/academics/curriculum" },
        { name: "Teaching", href: "/dashboard/academics/teaching" },
        { name: "Assessment", href: "/dashboard/academics/assessment" },
        { name: "Scheduling", href: "/dashboard/academics/scheduling" },
        { name: "Resources", href: "/dashboard/academics/resources" },
      ]
    },
    { 
      name: "Student Life", 
      icon: Users,
      href: "/dashboard/student-life",
      subItems: [
        { name: "Attendance", href: "/dashboard/student-life/attendance" },
        { name: "Discipline & Welfare", href: "/dashboard/student-life/discipline-welfare" },
        { name: "Clubs & Activities", href: "/dashboard/student-life/activities" },
        { name: "Student Leadership", href: "/dashboard/student-life/leadership" },
        { name: "Student Engagement", href: "/dashboard/student-life/engagement" },
      ]
    },
    { 
      name: "Finance", 
      icon: Wallet,
      href: "/dashboard/finance",
      subItems: [
        { name: "Finance Overview", href: "/dashboard/finance/overview" },
        { name: "Fees & Billing", href: "/dashboard/finance/fees-billing" },
        { name: "Collections", href: "/dashboard/finance/collections" },
        { name: "Accounting", href: "/dashboard/finance/accounting" },
        { name: "Banking & Cash", href: "/dashboard/finance/banking-cash" },
        { name: "Budget & Planning", href: "/dashboard/finance/budget-planning" },
        { name: "Financial Reports", href: "/dashboard/finance/financial-reports" },
      ]
    },
    { 
      name: "HR & Payroll", 
      icon: Users,
      href: "/dashboard/human-resources",
      subItems: [
        { name: "Recruitment", href: "/dashboard/human-resources/recruitment" },
        { name: "Employees", href: "/dashboard/human-resources/employees" },
        { name: "Attendance & Leave", href: "/dashboard/human-resources/attendance-leave" },
        { name: "Payroll", href: "/dashboard/human-resources/payroll" },
        { name: "Performance", href: "/dashboard/human-resources/performance" },
        { name: "Training & Dev.", href: "/dashboard/human-resources/training" },
        { name: "Welfare", href: "/dashboard/human-resources/welfare" },
        { name: "HR Reports", href: "/dashboard/human-resources/reports" },
      ]
    },
    { 
      name: "Operations", 
      icon: Building2,
      href: "/dashboard/operations",
      subItems: [
        { name: "Procurement", href: "/dashboard/operations/procurement" },
        { name: "Inventory & Stores", href: "/dashboard/operations/inventory" },
        { name: "Assets & Facilities", href: "/dashboard/operations/assets" },
        { name: "Transport", href: "/dashboard/operations/transport" },
        { name: "Library", href: "/dashboard/operations/library" },
        { name: "Hostel & Boarding", href: "/dashboard/operations/hostel" },
        { name: "Health & Welfare", href: "/dashboard/operations/health" },
        { name: "Food & Catering", href: "/dashboard/operations/catering" },
      ]
    },
    { 
      name: "Communication", 
      icon: MessageSquare,
      href: "/dashboard/communication",
      subItems: [
        { name: "Hub & Messages", href: "/dashboard/communication/hub" },
      ]
    },
    { 
      name: "Administration", 
      icon: Shield,
      href: "/dashboard/administration",
      subItems: [
        { name: "Users & Access", href: "/dashboard/administration/users" },
        { name: "Roles & Permissions", href: "/dashboard/administration/roles" },
        { name: "Subscription & Billing", href: "/dashboard/administration/billing" },
        { name: "Security & Compliance", href: "/dashboard/administration/security" },
        { name: "AI Configuration", href: "/dashboard/administration/ai-settings" },
        { name: "System Management", href: "/dashboard/administration/system" },
      ]
    },
    { 
      name: "Reports", 
      icon: BarChart3,
      href: "/dashboard/reports",
      subItems: [
        { name: "Academic Reports", href: "/dashboard/reports/academic" },
        { name: "Financial Reports", href: "/dashboard/reports/financial" },
        { name: "Operational Reports", href: "/dashboard/reports/operational" },
        { name: "Custom Reports", href: "/dashboard/reports/custom" },
        { name: "AI Analytics", href: "/dashboard/reports/ai" },
      ]
    },
    { 
      name: "Settings", 
      icon: Settings,
      href: "/dashboard/settings",
      subItems: [
        { name: "School", href: "/dashboard/settings/school" },
        { name: "Academic", href: "/dashboard/settings/academic" },
        { name: "Finance", href: "/dashboard/settings/finance" },
        { name: "Communication", href: "/dashboard/settings/communication" },
        { name: "Integrations", href: "/dashboard/settings/integrations" },
      ]
    },
  ];

    const safeRole = (roleStr || "").toUpperCase();

    if (safeRole === "PARENT") {
      return rawNavigation.filter(item => 
        ["Dashboard", "Finance", "Communication", "Student Life", "Settings"].includes(item.name)
      ).map(item => {
        if (item.name === "Settings") {
          return { ...item, subItems: [{ name: "My Profile", href: "/dashboard/settings/school" }] };
        }
        return item;
      });
    }

    if (safeRole === "TEACHER") {
      return rawNavigation.filter(item => 
        ["Dashboard", "Academics", "Student Life", "Communication", "Reports", "Settings"].includes(item.name)
      ).map(item => {
        if (item.name === "Settings") {
          return { ...item, subItems: [{ name: "My Profile", href: "/dashboard/settings/school" }] };
        }
        return item;
      });
    }

    return rawNavigation; // Admins get everything
  };

  const navigation = getNavigationForRole(role || "SUPER_ADMIN");

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-primary-950/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed lg:static top-16 left-0 lg:left-auto lg:top-auto flex h-[calc(100vh-64px)] flex-col bg-primary-900 border-2 border-secondary-500 rounded-r-2xl lg:rounded-2xl text-white shadow-xl z-40 overflow-hidden shrink-0 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "w-56 translate-x-0 lg:mx-0 lg:border-l-2" : "w-56 -translate-x-full lg:w-0 lg:border-none lg:mx-0 lg:translate-x-0"
      }`}>
        <div className="w-56 flex flex-col h-full shrink-0">
          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1.5 px-3 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary-500 scrollbar-track-transparent">
        {navigation.map((item) => {
          const isMainActive = pathname === item.href || (item.subItems && pathname.startsWith(item.href) && item.name !== "Dashboard" || (item.name === "Dashboard" && (pathname === "/dashboard" || pathname.match(/^\/dashboard\/(analytics|activities|calendar|ai-insights)/))));
          const isExpanded = expandedMenu === item.name;
          const Icon = item.icon;

          return (
            <div key={item.name} className="flex flex-col shrink-0">
              <button
                onClick={() => toggleExpand(item.name)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] uppercase tracking-wider font-bold transition-colors duration-150 ${
                  isMainActive && !isExpanded
                    ? "bg-white text-primary-900 shadow-md"
                    : isExpanded
                    ? "bg-primary-800 text-white shadow-inner"
                    : "text-white/80 hover:bg-primary-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`shrink-0 w-4 h-4 ${isMainActive && !isExpanded ? "text-primary-900" : isExpanded ? "text-white" : "text-white/60"}`} />
                  <span className="truncate">{item.name}</span>
                </div>
                
                <ChevronDown className={`shrink-0 w-3 h-3 transition-transform ${isExpanded ? 'rotate-180 text-white' : isMainActive ? 'text-primary-900/50' : 'text-white/50'}`} />
              </button>

              {/* Sub items dropdown */}
              {item.subItems && isExpanded && (
                <div className="mt-1 flex flex-col gap-1 pl-9 pr-1 py-2 bg-primary-950/30 rounded-lg border-l-2 border-secondary-500/50">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      prefetch={true}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          closeSidebar();
                        }
                      }}
                      className={`block py-2 px-2 text-xs font-bold rounded-md transition-colors ${
                        (pathname === subItem.href || (pathname.startsWith(subItem.href + "/") && subItem.href !== "/dashboard"))
                          ? "text-secondary-500 bg-white/5"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Profile */}
      <div className="p-3 mb-2 shrink-0 border-t border-primary-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-secondary-500 shrink-0 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
              {userName ? userName.substring(0, 2) : (role ? role.substring(0, 2) : 'U')}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[12px] font-bold text-white leading-tight truncate">
                {userName || "Loading..."}
              </span>
              <span className="text-[10px] text-white/60 leading-tight truncate">
                {userEmail || "user@example.com"}
              </span>
            </div>
          </div>
          <button 
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' });
              } catch (e) {
                console.error(e);
              }
              window.location.href = '/login';
            }}
            title="Log Out"
            className="p-1.5 rounded-lg text-white/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      </div>
      </div>
      
    </>
  );
};

export default Sidebar;

