"use client";

import React, { useState, useTransition, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Users,
  UserCheck,
  GraduationCap,
  Briefcase,
  Activity,
  Filter,
  Download,
  Printer,
  Search,
  School,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building,
  ChevronRight,
  TrendingUp,
  PieChart,
  UserX,
  HelpCircle,
} from "lucide-react";
import {
  StudentsStaffReportData,
  StudentsStaffFilterOptions,
} from "./actions";

interface StudentsStaffClientProps {
  initialData: StudentsStaffReportData;
  filterOptions: StudentsStaffFilterOptions;
}

export default function StudentsStaffClient({
  initialData,
  filterOptions,
}: StudentsStaffClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialBranchId = searchParams.get("branchId") || "all";
  const initialStatus = searchParams.get("status") || "all";

  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranchId);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const data = initialData;
  const [activeTab, setActiveTab] = useState<"overview" | "departments" | "classes" | "directory">("overview");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  // Handle filter changes (Branch, Status)
  const handleFilterChange = (branchId: string, status: string) => {
    setSelectedBranch(branchId);
    setSelectedStatus(status);

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (branchId !== "all") {
        params.set("branchId", branchId);
      } else {
        params.delete("branchId");
      }
      if (status !== "all") {
        params.set("status", status);
      } else {
        params.delete("status");
      }
      router.push(`${pathname}?${params.toString()}`);
      router.refresh();
    });
  };

  const handleResetFilters = () => {
    handleFilterChange("all", "all");
    setSearchQuery("");
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    const lines: string[] = [];
    lines.push("STUDENTS & STAFF OPERATIONAL REPORT");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push(`Branch Filter: ${selectedBranch === "all" ? "All Campuses" : selectedBranch}`);
    lines.push("");

    // Summary
    lines.push("SUMMARY METRICS");
    lines.push(`Total Students,${data.summary.totalStudents}`);
    lines.push(`Active Students,${data.summary.activeStudents}`);
    lines.push(`Total Staff,${data.summary.totalStaff}`);
    lines.push(`Active Staff,${data.summary.activeStaff}`);
    lines.push(`Teaching Staff,${data.summary.teachingStaff}`);
    lines.push(`Non-Teaching Staff,${data.summary.nonTeachingStaff}`);
    lines.push(`Student-to-Teacher Ratio,${data.summary.studentTeacherRatio}:1`);
    lines.push(`Student-to-Staff Ratio,${data.summary.studentStaffRatio}:1`);
    lines.push(`Gender Parity Index (F/M),${data.summary.genderParityIndex}`);
    lines.push(`Total Capacity Utilization,${data.summary.capacityUtilization}%`);
    lines.push("");

    // Department Breakdown
    lines.push("STAFF BY DEPARTMENT");
    lines.push("Department,Headcount,Percentage,Active,On Leave");
    data.staffByDepartment.forEach((d) => {
      lines.push(`"${d.department}",${d.count},${d.percent}%,${d.activeCount},${d.onLeaveCount}`);
    });
    lines.push("");

    // Section Breakdown
    lines.push("ENROLLMENT BY SECTION");
    lines.push("Section Name,Enrolled,Share,Classes,Streams,Capacity,Utilization,Boys,Girls");
    data.studentsBySection.forEach((s) => {
      lines.push(
        `"${s.name}",${s.count},${s.percent}%,${s.classCount},${s.streamCount},${s.capacity},${s.utilization}%,${s.boys},${s.girls}`
      );
    });
    lines.push("");

    // Staff Directory
    lines.push("STAFF DIRECTORY");
    lines.push("Employee No,Full Name,Job Title,Department,Role,Status,Branch,Hire Date,Assigned Classes");
    data.staffList.forEach((st) => {
      lines.push(
        `"${st.employeeNumber}","${st.fullName}","${st.jobTitle}","${st.department}","${st.roleName}","${st.status}","${st.branchName}","${st.hireDate}",${st.assignedClassesCount}`
      );
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `students_staff_report_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  // Filtered staff list for directory table
  const filteredStaffList = useMemo(() => {
    if (!searchQuery.trim()) return data.staffList;
    const q = searchQuery.toLowerCase();
    return data.staffList.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.employeeNumber.toLowerCase().includes(q) ||
        s.jobTitle.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.roleName.toLowerCase().includes(q) ||
        s.branchName.toLowerCase().includes(q)
    );
  }, [data.staffList, searchQuery]);

  // Filtered class breakdown
  const filteredClassBreakdown = useMemo(() => {
    if (!searchQuery.trim()) return data.classBreakdown;
    const q = searchQuery.toLowerCase();
    return data.classBreakdown.filter(
      (c) =>
        c.className.toLowerCase().includes(q) ||
        c.branchName.toLowerCase().includes(q) ||
        c.streams.some((st) => st.name.toLowerCase().includes(q) || st.classTeacherName.toLowerCase().includes(q))
    );
  }, [data.classBreakdown, searchQuery]);

  return (
    <div className="p-6 space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
              Operational Intelligence
            </span>
            {isPending && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 animate-pulse">
                <RotateCcw className="w-3 h-3 animate-spin" /> Updating metrics...
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Students & Staff Demographics
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-0.5">
            Real-time population distribution, student-teacher staffing ratios, and departmental capacity.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
            title="Print Report"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-xs hover:bg-primary-800 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider">
            <Filter className="w-4 h-4 text-primary-600" /> Filter By:
          </div>

          {/* Branch / Campus Selector */}
          <div className="relative">
            <select
              value={selectedBranch}
              onChange={(e) => handleFilterChange(e.target.value, selectedStatus)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3.5 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">Campus: All Campuses ({filterOptions.branches.length})</option>
              {filterOptions.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  Campus: {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Status Selector */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange(selectedBranch, e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3.5 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            >
              <option value="all">Student Status: All</option>
              <option value="ACTIVE">Status: Active Only</option>
              <option value="SUSPENDED">Status: Suspended</option>
              <option value="TRANSFERRED">Status: Transferred</option>
              <option value="ALUMNI">Status: Alumni</option>
            </select>
          </div>

          {(selectedBranch !== "all" || selectedStatus !== "all") && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Selected Filter Summary Badge */}
        <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
          <span>Active Scope:</span>
          <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-black">
            {selectedBranch === "all"
              ? "All Campuses"
              : filterOptions.branches.find((b) => b.id === selectedBranch)?.name || "Selected Campus"}
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white/90 backdrop-blur-xl border border-indigo-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GraduationCap className="w-16 h-16 text-indigo-900" />
          </div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800">
              Total Enrolled Students
            </h3>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.totalStudents.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {data.summary.activeStudents} Active
            </span>
            <span>
              {data.genderDistribution.students.male} Boys · {data.genderDistribution.students.female} Girls
            </span>
          </div>
        </div>

        {/* Total Staff */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-16 h-16 text-emerald-900" />
          </div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">
              Total Staff Employed
            </h3>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.totalStaff.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
            <span className="text-emerald-700 font-bold">
              {data.summary.teachingStaff} Teaching Staff
            </span>
            <span>{data.summary.nonTeachingStaff} Support/Admin</span>
          </div>
        </div>

        {/* Student-to-Teacher Ratio */}
        <div className="bg-white/90 backdrop-blur-xl border border-amber-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-amber-900" />
          </div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-800">
              Student-Teacher Ratio
            </h3>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.studentTeacherRatio} : 1
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold mt-2 pt-2 border-t border-slate-100">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                data.summary.ratioBenchmark.status === "optimal"
                  ? "bg-emerald-100 text-emerald-800"
                  : data.summary.ratioBenchmark.status === "warning"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {data.summary.ratioBenchmark.status}
            </span>
            <span className="text-slate-500 truncate text-[11px]">
              {data.summary.ratioBenchmark.text}
            </span>
          </div>
        </div>

        {/* Student-to-Staff & Capacity */}
        <div className="bg-white/90 backdrop-blur-xl border border-blue-100 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-16 h-16 text-blue-900" />
          </div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <School className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-800">
              Capacity Utilization
            </h3>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.capacityUtilization}%
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-700">
              {data.summary.totalClasses} Classes · {data.summary.totalStreams} Streams
            </span>
            <span>Total Staff: {data.summary.studentStaffRatio}:1</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === "overview"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <PieChart className="w-4 h-4" /> Demographics & Department Staffing
        </button>

        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === "departments"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Staff by Role & Category
        </button>

        <button
          onClick={() => setActiveTab("classes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === "classes"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" /> Sections & Class Capacity
        </button>

        <button
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            activeTab === "directory"
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" /> Staff Roster Directory ({data.staffList.length})
        </button>
      </div>

      {/* Tab 1: Overview & Demographics */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staff Department Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary-600" /> Staffing by Department
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribution across academic, leadership, support, transport, and catering teams.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Total: {data.summary.totalStaff} staff
              </span>
            </div>

            <div className="space-y-5">
              {data.staffByDepartment.map((dept, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        {dept.department}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {dept.activeCount} active
                          {dept.onLeaveCount > 0 && ` · ${dept.onLeaveCount} on leave`}
                        </span>
                      </div>
                      {dept.roles.length > 0 && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {dept.roles.slice(0, 3).map((r) => `${r.name} (${r.count})`).join(", ")}
                          {dept.roles.length > 3 && ` +${dept.roles.length - 3} more`}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-xs font-bold text-slate-500">{dept.count} members</div>
                      <div className="font-black text-sm text-slate-800 w-12 text-right">
                        {dept.percent}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        dept.departmentKey === "ACADEMICS"
                          ? "bg-indigo-600"
                          : dept.departmentKey === "ADMINISTRATION"
                          ? "bg-emerald-600"
                          : dept.departmentKey === "SUPPORT"
                          ? "bg-amber-500"
                          : dept.departmentKey === "TRANSPORT"
                          ? "bg-blue-500"
                          : "bg-teal-500"
                      }`}
                      style={{ width: `${Math.max(dept.percent, dept.count > 0 ? 3 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {data.staffByDepartment.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No staff records found for the selected campus.
                </div>
              )}
            </div>
          </div>

          {/* Student Gender Distribution & Section Breakdown */}
          <div className="space-y-6">
            {/* Student Gender Distribution */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Student Gender Balance
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gender parity index (GPI):{" "}
                    <span className="font-bold text-slate-700">{data.summary.genderParityIndex}</span>{" "}
                    (Target 1.00)
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {data.summary.totalStudents} Enrolled
                </span>
              </div>

              <div className="flex h-12 rounded-xl overflow-hidden mb-3 border border-slate-100 shadow-inner">
                <div
                  className="bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center text-white font-black text-xs transition-all"
                  style={{
                    width: `${
                      data.summary.totalStudents > 0
                        ? data.genderDistribution.students.malePercent
                        : 50
                    }%`,
                  }}
                  title={`Boys: ${data.genderDistribution.students.male} (${data.genderDistribution.students.malePercent}%)`}
                >
                  Boys ({data.genderDistribution.students.malePercent}%)
                </div>
                <div
                  className="bg-rose-400 hover:bg-rose-500 flex items-center justify-center text-white font-black text-xs transition-all"
                  style={{
                    width: `${
                      data.summary.totalStudents > 0
                        ? data.genderDistribution.students.femalePercent
                        : 50
                    }%`,
                  }}
                  title={`Girls: ${data.genderDistribution.students.female} (${data.genderDistribution.students.femalePercent}%)`}
                >
                  Girls ({data.genderDistribution.students.femalePercent}%)
                </div>
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-600 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  {data.genderDistribution.students.male.toLocaleString()} Boys
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  {data.genderDistribution.students.female.toLocaleString()} Girls
                </span>
              </div>
            </div>

            {/* Enrollment by Section / Level */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Enrollment by School Section
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Student distribution across academic stages.
                  </p>
                </div>
              </div>

              {data.studentsBySection.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {data.studentsBySection.map((sec, i) => (
                    <div
                      key={i}
                      className="bg-slate-50/80 border border-slate-200/60 p-3.5 rounded-xl hover:border-indigo-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 line-clamp-1">
                          {sec.name}
                        </div>
                        <div className="text-2xl font-black text-slate-800 mt-1">
                          {sec.count.toLocaleString()}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>{sec.classCount} classes</span>
                        <span className="text-indigo-600">{sec.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No classes or section data available for this campus.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Staff by Role & Category */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" /> Staff Distribution by Role & Designation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Detailed headcount across all academic, administrative, and support job roles.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.staffByRole.map((role, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50/80 border border-slate-200/70 p-4 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{role.roleName}</div>
                      <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{role.department}</div>
                    </div>
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {role.percent}%
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-800">{role.count}</span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {role.activeCount} Active
                    </span>
                  </div>
                </div>
              ))}

              {data.staffByRole.length === 0 && (
                <div className="col-span-full p-8 text-center text-slate-400 text-sm">
                  No staff roles found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sections & Class Capacity */}
      {activeTab === "classes" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" /> Class Capacity & Enrollment Ratios
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Class sizes, stream allocations, class teachers, and seat utilization rates.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search classes or teachers..."
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Class Name</th>
                    <th className="py-3.5 px-5">Campus</th>
                    <th className="py-3.5 px-5 text-center">Streams</th>
                    <th className="py-3.5 px-5 text-center">Boys / Girls</th>
                    <th className="py-3.5 px-5 text-center">Enrolled / Capacity</th>
                    <th className="py-3.5 px-5 text-right">Capacity Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredClassBreakdown.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-800">
                        {cls.className}
                        {cls.streams.length > 0 && (
                          <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                            Streams: {cls.streams.map((s) => s.name).join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-600 font-medium">
                        {cls.branchName}
                      </td>
                      <td className="py-3.5 px-5 text-center font-bold text-slate-700">
                        {cls.streamCount}
                      </td>
                      <td className="py-3.5 px-5 text-center text-xs font-bold text-slate-600">
                        <span className="text-indigo-600">{cls.boys} B</span> ·{" "}
                        <span className="text-rose-500">{cls.girls} G</span>
                      </td>
                      <td className="py-3.5 px-5 text-center font-bold text-slate-800">
                        {cls.enrolled} / {cls.capacity}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            className={`text-xs font-black ${
                              cls.utilization > 90
                                ? "text-rose-600"
                                : cls.utilization > 70
                                ? "text-emerald-600"
                                : "text-slate-600"
                            }`}
                          >
                            {cls.utilization}%
                          </span>
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                cls.utilization > 90
                                  ? "bg-rose-500"
                                  : cls.utilization > 70
                                  ? "bg-emerald-500"
                                  : "bg-indigo-500"
                              }`}
                              style={{ width: `${cls.utilization}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredClassBreakdown.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                        No classes found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Staff Directory */}
      {activeTab === "directory" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" /> Operational Staff Directory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff member profiles, assignments, and campus allocations.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, employee #, role..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Staff Member</th>
                  <th className="py-3.5 px-5">Job Title & Role</th>
                  <th className="py-3.5 px-5">Department</th>
                  <th className="py-3.5 px-5">Campus</th>
                  <th className="py-3.5 px-5 text-center">Class Allocations</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStaffList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-800">{st.fullName}</div>
                      <div className="text-xs text-slate-400 font-medium">{st.employeeNumber}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-700 text-xs">{st.jobTitle}</div>
                      <div className="text-[11px] text-slate-400">{st.roleName}</div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
                        {st.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-slate-600 font-medium">{st.branchName}</td>
                    <td className="py-3.5 px-5 text-center font-bold text-slate-700">
                      {st.assignedClassesCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {st.assignedClassesCount} classes
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-normal">None</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full ${
                          st.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : st.status === "ON_LEAVE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {st.status === "ACTIVE" && <CheckCircle2 className="w-3 h-3" />}
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredStaffList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-sm">
                      No staff members found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
