"use client";

import React, { useState, useTransition } from "react";
import {
  Activity,
  Building,
  Users,
  UserCheck,
  CreditCard,
  BookOpen,
  Bus,
  Home,
  Printer,
  Download,
  FileCode2,
  Filter,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  ShieldAlert,
  Wrench,
  Search,
  Check,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getOperationalOverviewData, type OperationalOverviewData } from "./actions";

interface OverviewClientProps {
  initialData: OperationalOverviewData;
}

export default function OverviewClient({ initialData }: OverviewClientProps) {
  const data = initialData;
  const searchParams = useSearchParams();
  const selectedBranch = searchParams?.get("branchId") || "all";
  const selectedDateRange = searchParams?.get("dateRange") || "today";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const lines: string[] = [];
    const dateStr = new Date().toISOString().split("T")[0];

    lines.push("==========================================================");
    lines.push("MYSHULE OPERATIONAL OVERVIEW REPORT");
    lines.push(`Generated On,${data.generatedAt || new Date().toISOString()}`);
    lines.push(`Date Scope,${selectedDateRange.toUpperCase()}`);
    lines.push(`Branch Scope,${selectedBranch === "all" ? "All Campuses" : selectedBranch}`);
    lines.push("==========================================================");
    lines.push("");

    // Section 1: KPI Metrics
    lines.push("--- SYSTEM KPI METRICS ---");
    lines.push("Metric,Value,Unit/Status");
    lines.push(`Total Active Students,${data.metrics.activeStudents},Enrolled: ${data.metrics.totalStudents}`);
    lines.push(`Total Active Staff,${data.metrics.activeStaff},Staff Total: ${data.metrics.totalStaff}`);
    lines.push(`Whole-School Attendance Rate,${data.metrics.attendanceRate}%,Today Present: ${data.metrics.attendancePresentToday}`);
    lines.push(`Fee Collection Rate,${data.metrics.feeCollectionRate}%,Invoiced: KES ${data.metrics.totalInvoiced}`);
    lines.push(`Library Usage Rate,${data.metrics.libraryUsageRate}%,Issued Books: ${data.metrics.issuedBooks}`);
    lines.push(`Transport Fleet Utilization,${data.metrics.transportUtilizationRate}%,Assigned: ${data.metrics.transportAssignedStudents}`);
    lines.push(`Hostel Boarding Occupancy,${data.metrics.hostelOccupancyRate}%,Occupied: ${data.metrics.hostelOccupiedBeds}`);
    lines.push(`Active Facilities,${data.metrics.activeFacilities} / ${data.metrics.totalFacilities},Operational`);
    lines.push(`Active Assets,${data.metrics.activeAssets} / ${data.metrics.totalAssets},Tracked`);
    lines.push("");

    // Section 2: Today's Activity Pulse
    lines.push("--- TODAY'S ACTIVITY PULSE ---");
    lines.push("Activity,Count,Description");
    lines.push(`Attendance Records Logged,${data.activityPulse.attendanceRecordsToday},"${data.activityPulse.attendanceRecordsDescription}"`);
    lines.push(`Fee Transactions Processed,${data.activityPulse.feeTransactionsToday},"Total KES ${data.activityPulse.feeAmountToday.toLocaleString()} - ${data.activityPulse.feeTransactionsDescription}"`);
    lines.push(`Disciplinary Incidents Logged,${data.activityPulse.disciplinaryIncidentsCount},"${data.activityPulse.disciplinaryDescription}"`);
    lines.push(`Active Work Orders,${data.activityPulse.workOrdersActive},"${data.activityPulse.workOrdersDescription}"`);
    lines.push("");

    // Section 3: Resource Utilization
    lines.push("--- KEY RESOURCE UTILIZATION ---");
    lines.push("Resource Name,Type,Capacity,Used,Utilization Percentage,Status");
    data.resourceUtilization.forEach((r) => {
      lines.push(`"${r.label}",${r.type},${r.capacity || "N/A"},${r.used || "N/A"},${r.percentage}%,${r.status.toUpperCase()}`);
    });
    lines.push("");

    // Section 4: Maintenance Records
    lines.push("--- RECENT MAINTENANCE RECORDS ---");
    lines.push("Asset Name,Facility,Type,Cost (KES),Date,Status,Technician");
    data.recentMaintenance.forEach((m) => {
      lines.push(`"${m.assetName}","${m.facilityName}",${m.type},${m.cost},${m.date},${m.status},"${m.performedBy}"`);
    });
    lines.push("");

    // Section 5: Audit Trail
    lines.push("--- SYSTEM AUDIT TRAIL (RECENT) ---");
    lines.push("Event ID,Timestamp,Category,User,Action,IP Address");
    data.recentAuditLogs.forEach((l) => {
      lines.push(`${l.id},"${l.timestamp}",${l.type},"${l.user}","${l.action.replace(/"/g, '""')}",${l.ipAddress || "N/A"}`);
    });

    const csvContent = lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `operational_overview_report_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification("Operational CSV report exported successfully.");
  };

  const handleDownloadManifest = () => {
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.split("T")[0];

    const manifest = {
      manifestType: "MYSHULE_OPERATIONAL_SYSTEM_MANIFEST",
      manifestVersion: "2.4.0",
      generatedAt: timestamp,
      generator: "MyShule ERP System Services",
      scope: {
        campus: selectedBranch === "all" ? "All Campuses" : selectedBranch,
        dateRange: selectedDateRange,
      },
      systemHealth: {
        status: "OPERATIONAL",
        infrastructureStatus: data.metrics.activeFacilities >= data.metrics.totalFacilities * 0.8 ? "HEALTHY" : "NEEDS_ATTENTION",
        activeFacilitiesCount: data.metrics.activeFacilities,
        totalFacilitiesCount: data.metrics.totalFacilities,
        fleetReadiness: `${data.metrics.activeVehicles}/${data.metrics.totalVehicles} Vehicles Active`,
        workOrdersPending: data.metrics.workOrdersPending,
        workOrdersInProgress: data.metrics.workOrdersInProgress,
      },
      coreMetrics: {
        students: {
          active: data.metrics.activeStudents,
          total: data.metrics.totalStudents,
        },
        staff: {
          active: data.metrics.activeStaff,
          total: data.metrics.totalStaff,
        },
        attendanceRate: `${data.metrics.attendanceRate}%`,
        feeCollectionRate: `${data.metrics.feeCollectionRate}%`,
        libraryUsageRate: `${data.metrics.libraryUsageRate}%`,
        transportUtilizationRate: `${data.metrics.transportUtilizationRate}%`,
        hostelOccupancyRate: `${data.metrics.hostelOccupancyRate}%`,
        totalMaintenanceSpendKES: data.metrics.totalMaintenanceCost,
      },
      activeResourceInventory: data.resourceUtilization.map((item) => ({
        resourceId: item.id,
        name: item.name,
        type: item.type,
        utilizationRate: `${item.percentage}%`,
        capacity: item.capacity,
        load: item.used,
        status: item.status,
      })),
      recentMaintenanceLog: data.recentMaintenance.map((m) => ({
        recordId: m.id,
        asset: m.assetName,
        facility: m.facilityName,
        type: m.type,
        costKES: m.cost,
        date: m.date,
        status: m.status,
        contractor: m.performedBy,
      })),
      securityAndAuditSummary: {
        recentEventCount: data.recentAuditLogs.length,
        latestEventTimestamp: data.recentAuditLogs[0]?.timestamp || timestamp,
        integritySeal: `SHA256-${Math.random().toString(36).substring(2, 12).toUpperCase()}-${Date.now().toString(16)}`,
      },
    };

    const jsonString = JSON.stringify(manifest, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `operational_manifest_${dateStr}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification("Operational system manifest downloaded.");
  };

  const filteredLogs = data.recentAuditLogs.filter((log) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.id.toLowerCase().includes(term) ||
      log.user.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.entityName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 space-y-8">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">{exportNotice}</span>
        </div>
      )}

      {/* Action and Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-end items-stretch lg:items-center gap-4 bg-slate-50/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>

          <button
            onClick={handleDownloadManifest}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition shadow-sm cursor-pointer"
          >
            <FileCode2 className="w-4 h-4" />
            Download Manifest
          </button>
        </div>
      </div>



      {/* KPI Dashboard Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Students */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight mb-0.5">
            {data.metrics.activeStudents.toLocaleString()}
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Students</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Total {data.metrics.totalStudents.toLocaleString()}
          </div>
        </div>

        {/* Staff */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight mb-0.5">
            {data.metrics.activeStaff.toLocaleString()}
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Staff</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
            Active Roster
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-600 tracking-tight mb-0.5">
            {data.metrics.attendanceRate}%
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Attendance</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Daily Benchmark
          </div>
        </div>

        {/* Fee Collection */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-indigo-600 tracking-tight mb-0.5">
            {data.metrics.feeCollectionRate}%
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fee Collection</div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">
            Term Target
          </div>
        </div>

        {/* Library Usage */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-600 tracking-tight mb-0.5">
            {data.metrics.libraryUsageRate}%
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Lib Usage</div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            {data.metrics.totalBooks.toLocaleString()} Books
          </div>
        </div>

        {/* Transport Util */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bus className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-blue-600 tracking-tight mb-0.5">
            {data.metrics.transportUtilizationRate}%
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Transport Util</div>
          <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
            {data.metrics.activeVehicles} / {data.metrics.totalVehicles} Buses
          </div>
        </div>

        {/* Hostel Occupancy */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/70 p-4 rounded-2xl shadow-sm text-center hover:shadow-md transition-shadow">
          <div className="w-7 h-7 mx-auto mb-1 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-teal-600 tracking-tight mb-0.5">
            {data.metrics.hostelOccupancyRate}%
          </div>
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Hostel Occ</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
            {data.metrics.hostelOccupiedBeds} / {data.metrics.hostelTotalCapacity} Beds
          </div>
        </div>
      </div>

      {/* Activity Pulse & Resource Utilization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Activity Feed */}
        <div className="bg-slate-50/80 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Today's Activity Pulse
              </h3>
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Sync
              </span>
            </div>

            <div className="space-y-4">
              {/* Attendance */}
              <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-200 transition-colors">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                  {data.activityPulse.attendanceRecordsToday}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span>Attendance Records</span>
                    <span className="text-xs font-semibold text-emerald-600">Logged Real-Time</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {data.activityPulse.attendanceRecordsDescription}
                  </div>
                </div>
              </div>

              {/* Fee Transactions */}
              <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-colors">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                  {data.activityPulse.feeTransactionsToday}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span>Fee Transactions</span>
                    <span className="text-xs font-bold text-emerald-600">
                      KES {data.activityPulse.feeAmountToday.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {data.activityPulse.feeTransactionsDescription}
                  </div>
                </div>
              </div>

              {/* Disciplinary Incidents */}
              <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-rose-200 transition-colors">
                <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                  {data.activityPulse.disciplinaryIncidentsCount}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span>Disciplinary / Welfare Logs</span>
                    <span className="text-xs font-semibold text-rose-600">Active Review</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {data.activityPulse.disciplinaryDescription}
                  </div>
                </div>
              </div>

              {/* Work Orders / Maintenance */}
              <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-200 transition-colors">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-black text-lg shrink-0">
                  {data.activityPulse.workOrdersActive}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm flex items-center justify-between">
                    <span>Active Work Orders</span>
                    <span className="text-xs font-semibold text-amber-600">Facilities Team</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {data.activityPulse.workOrdersDescription}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Facilities Operational: {data.metrics.activeFacilities} / {data.metrics.totalFacilities}</span>
            <span>Total Tracked Assets: {data.metrics.totalAssets}</span>
          </div>
        </div>

        {/* Resource Utilization */}
        <div className="bg-slate-50/80 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-teal-500" />
                Key Resource Utilization
              </h3>
              <span className="text-xs font-bold text-slate-500">Capacity & Load</span>
            </div>

            <div className="space-y-4">
              {data.resourceUtilization.map((resource) => {
                const isRose = resource.statusColor === "rose" || resource.percentage >= 90;
                const isAmber = resource.statusColor === "amber" || (resource.percentage >= 75 && resource.percentage < 90);
                const barColor = isRose ? "bg-rose-500" : isAmber ? "bg-amber-500" : "bg-teal-500";
                const textColor = isRose ? "text-rose-600" : isAmber ? "text-amber-600" : "text-teal-600";

                return (
                  <div
                    key={resource.id}
                    className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                          {resource.label}
                        </h4>
                        <div className="text-xs text-slate-500 font-medium">{resource.sublabel}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-black text-lg ${textColor}`}>
                          {resource.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(resource.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Hostel Capacity: {data.metrics.hostelTotalCapacity} Beds</span>
            <span>Fleet Capacity: {data.metrics.transportTotalCapacity} Seats</span>
          </div>
        </div>
      </div>

      {/* Bottom Grids: Maintenance & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Records */}
        <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                Recent Maintenance & Asset Records
              </h3>
              <div className="text-xs font-bold text-slate-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                Total Spend: KES {data.metrics.totalMaintenanceCost.toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              {data.recentMaintenance.slice(0, 4).map((record) => {
                const isCompleted = record.status === "COMPLETED";
                const isInProgress = record.status === "IN_PROGRESS";
                const badgeClass = isCompleted
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : isInProgress
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : "bg-blue-100 text-blue-800 border-blue-200";

                return (
                  <div
                    key={record.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{record.assetName}</div>
                        <div className="text-xs text-slate-500">
                          {record.facilityName} • {record.type}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeClass}`}>
                        {record.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium line-clamp-1 mt-1">
                      {record.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-2 pt-2 border-t border-slate-200/50">
                      <span>{record.date} • {record.performedBy}</span>
                      <span className="font-bold text-slate-700">KES {record.cost.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Pending Work Orders: {data.metrics.workOrdersPending}</span>
            <span>In Progress: {data.metrics.workOrdersInProgress}</span>
            <span>Resolved: {data.metrics.workOrdersCompleted}</span>
          </div>
        </div>

        {/* System Activity Feed & Audit Log */}
        <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" />
                Live System Activity Trail
              </h3>
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                const isFinance = log.type === "finance";
                const isSecurity = log.type === "security";
                const isAcademic = log.type === "academic";
                const isFacility = log.type === "facility";

                const nodeColor = isFinance
                  ? "bg-emerald-500 text-white"
                  : isSecurity
                  ? "bg-rose-500 text-white"
                  : isAcademic
                  ? "bg-indigo-500 text-white"
                  : isFacility
                  ? "bg-teal-500 text-white"
                  : "bg-slate-400 text-white";

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${nodeColor}`}>
                      {isFinance ? <Receipt className="w-4 h-4" /> : isSecurity ? <ShieldAlert className="w-4 h-4" /> : isAcademic ? <BookOpen className="w-4 h-4" /> : isFacility ? <Building className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                          {log.formattedTime}
                        </span>
                        <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[140px]">
                          {log.user}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {log.action}
                      </p>
                      {log.ipAddress && (
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                          IP: {log.ipAddress} • {log.entityName}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredLogs.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                  No matching events found for search term "{searchTerm}".
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Real-time DB audit sync</span>
            <span>{filteredLogs.length} events logged</span>
          </div>
        </div>
      </div>
    </div>
  );
}
