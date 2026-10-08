"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  Printer,
  Filter,
  Search,
  Wrench,
  Bus,
  Truck,
  Clock,
  Target,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Fuel,
  User,
  Building2,
  Layers,
  FileSpreadsheet,
  ShieldCheck,
  RefreshCw,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import {
  OperationalData,
  OperationalFilterOptions,
  MaintenanceRecordItem,
  TransportRouteItem,
  VehicleItem,
  getOperationalReportData,
} from "./actions";

interface OperationsClientProps {
  initialData: OperationalData;
  filterOptions: OperationalFilterOptions;
  initialBranchId?: string;
}

export default function OperationsClient({
  initialData,
  filterOptions,
  initialBranchId,
}: OperationsClientProps) {
  const [data, setData] = useState<OperationalData>(initialData);
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranchId || "");
  const [selectedMaintStatus, setSelectedMaintStatus] = useState<string>("ALL");
  const [selectedMaintType, setSelectedMaintType] = useState<string>("ALL");
  const [selectedVehicleStatus, setSelectedVehicleStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "maintenance" | "transport" | "fleet" | "admissions">("all");
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // Apply filters
  const handleFilterChange = (
    branchId: string,
    maintStatus: string,
    maintType: string,
    vehStatus: string
  ) => {
    startTransition(async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        if (branchId) {
          params.set("branchId", branchId);
        } else {
          params.delete("branchId");
        }
        router.replace(`?${params.toString()}`, { scroll: false });

        const updated = await getOperationalReportData({
          branchId: branchId || undefined,
          maintenanceStatus: maintStatus,
          maintenanceType: maintType,
          vehicleStatus: vehStatus,
        });
        setData(updated);
      } catch (error) {
        console.error("Failed to filter operational data:", error);
      }
    });
  };

  // CSV Export functions
  const downloadCSV = (filename: string, rows: string[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows
        .map((row) =>
          row
            .map((cell) => {
              const str = cell ?? "";
              if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(",")
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllData = () => {
    const rows: string[][] = [
      ["OPERATIONAL REPORT - EXPORT SUMMARY"],
      ["Generated Date", new Date().toLocaleString()],
      [],
      ["--- FLEET & TRANSPORT SUMMARY ---"],
      ["Total Vehicles", data.metrics.totalVehicles.toString()],
      ["Active Vehicles", data.metrics.activeVehicles.toString()],
      ["Vehicles in Maintenance", data.metrics.vehiclesInMaintenance.toString()],
      ["Fleet Capacity (Seats)", data.metrics.fleetTotalCapacity.toString()],
      ["Total Routes", data.metrics.totalRoutes.toString()],
      ["Active Routes", data.metrics.activeRoutesCount.toString()],
      ["Students Transported", data.metrics.totalStudentsTransported.toString()],
      ["Average Route Utilization", `${data.metrics.avgRouteUtilization}%`],
      [],
      ["--- MAINTENANCE SUMMARY ---"],
      ["Total Maintenance Tasks", data.metrics.totalMaintenanceTasks.toString()],
      ["Pending Maintenance Tasks", data.metrics.pendingMaintenanceTasksCount.toString()],
      ["Completed Maintenance Tasks", data.metrics.completedMaintenanceTasksCount.toString()],
      ["Total Maintenance Spend (KSh)", data.metrics.totalMaintenanceCost.toString()],
      ["Preventive Spend (KSh)", data.metrics.preventiveCost.toString()],
      ["Corrective Spend (KSh)", data.metrics.correctiveCost.toString()],
      [],
      ["--- PENDING MAINTENANCE TASKS ---"],
      ["ID", "Asset Name", "Asset Tag", "Category", "Type", "Description", "Cost (KSh)", "Date", "Status", "Performed By", "Facility"],
      ...data.pendingMaintenanceTasks.map((m) => [
        m.id,
        m.assetName,
        m.assetTag,
        m.category,
        m.type,
        m.description,
        m.cost.toString(),
        m.date,
        m.status,
        m.performedBy || "N/A",
        m.facilityName || "Main Campus",
      ]),
      [],
      ["--- ACTIVE TRANSPORT ROUTES ---"],
      ["Route Name", "Vehicle Plate", "Driver Name", "Driver ID", "Cost Per Term (KSh)", "Enrolled Students", "Capacity", "Utilization %", "Status"],
      ...data.allRoutes.map((r) => [
        r.routeName,
        r.vehiclePlate || "N/A",
        r.driverName || "Unassigned",
        r.driverEmployeeNo || "N/A",
        (r.costPerTerm || 0).toString(),
        r.studentCount.toString(),
        r.capacity.toString(),
        `${r.utilizationPercent}%`,
        r.status,
      ]),
      [],
      ["--- VEHICLES & FLEET ---"],
      ["Reg Number", "Make & Model", "Capacity", "Status", "Driver", "Total Trips", "Fuel Cost (KSh)", "Fuel Liters"],
      ...data.vehicles.map((v) => [
        v.registrationNumber,
        `${v.make || ""} ${v.model || ""}`.trim() || "N/A",
        v.capacity.toString(),
        v.status,
        v.driverName || "Unassigned",
        v.tripsCount.toString(),
        v.totalFuelCost.toString(),
        v.totalFuelLiters.toString(),
      ]),
    ];

    downloadCSV("operations_full_report", rows);
  };

  const exportMaintenanceCSV = () => {
    const rows: string[][] = [
      ["Maintenance Task ID", "Asset Name", "Asset Tag", "Category", "Type", "Description", "Cost (KSh)", "Date", "Status", "Assigned / Performed By", "Facility"],
      ...data.allMaintenanceRecords.map((m) => [
        m.id,
        m.assetName,
        m.assetTag,
        m.category,
        m.type,
        m.description,
        m.cost.toString(),
        m.date,
        m.status,
        m.performedBy || "N/A",
        m.facilityName || "Main Campus",
      ]),
    ];
    downloadCSV("maintenance_tasks_report", rows);
  };

  const exportRoutesCSV = () => {
    const rows: string[][] = [
      ["Route Name", "Vehicle Plate", "Assigned Driver", "Driver Employee No", "Cost Per Term (KSh)", "Enrolled Students", "Capacity", "Utilization Rate (%)", "Status"],
      ...data.allRoutes.map((r) => [
        r.routeName,
        r.vehiclePlate || "N/A",
        r.driverName || "Unassigned",
        r.driverEmployeeNo || "N/A",
        (r.costPerTerm || 0).toString(),
        r.studentCount.toString(),
        r.capacity.toString(),
        `${r.utilizationPercent}%`,
        r.status,
      ]),
    ];
    downloadCSV("transport_routes_report", rows);
  };

  const exportVehiclesCSV = () => {
    const rows: string[][] = [
      ["Registration Number", "Make & Model", "Capacity", "Status", "Assigned Driver", "Driver ID", "Trips Logged", "Fuel Records", "Total Fuel Spend (KSh)", "Total Fuel (L)"],
      ...data.vehicles.map((v) => [
        v.registrationNumber,
        `${v.make || ""} ${v.model || ""}`.trim() || "N/A",
        v.capacity.toString(),
        v.status,
        v.driverName || "Unassigned",
        v.driverEmployeeNo || "N/A",
        v.tripsCount.toString(),
        v.fuelRecordsCount.toString(),
        v.totalFuelCost.toString(),
        v.totalFuelLiters.toString(),
      ]),
    ];
    downloadCSV("fleet_vehicles_report", rows);
  };

  // Filtered lists based on search
  const filteredPendingMaintenance = data.pendingMaintenanceTasks.filter(
    (m) =>
      !searchTerm ||
      m.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.performedBy && m.performedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAllMaintenance = data.allMaintenanceRecords.filter(
    (m) =>
      !searchTerm ||
      m.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assetTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.performedBy && m.performedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRoutes = data.allRoutes.filter(
    (r) =>
      !searchTerm ||
      r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.vehiclePlate && r.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.driverName && r.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVehicles = data.vehicles.filter(
    (v) =>
      !searchTerm ||
      v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.make && v.make.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.model && v.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.driverName && v.driverName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Operations & Facilities Intelligence</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Data
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time management for fleet transport, pending maintenance tasks, and administrative workflows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Export Data Button */}
          <div className="relative group">
            <button
              onClick={exportAllData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm active:scale-95"
              title="Download operational report in CSV format"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Data</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            <div className="absolute right-0 mt-1 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-30 min-w-[210px] text-xs font-bold text-slate-700 animate-in fade-in slide-in-from-top-1">
              <button
                onClick={exportAllData}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-colors flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-primary-600" /> Export All Operations (CSV)
              </button>
              <button
                onClick={exportMaintenanceCSV}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-colors flex items-center gap-2"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-500" /> Export Maintenance Tasks
              </button>
              <button
                onClick={exportRoutesCSV}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-colors flex items-center gap-2"
              >
                <Bus className="w-3.5 h-3.5 text-blue-500" /> Export Transport Routes
              </button>
              <button
                onClick={exportVehiclesCSV}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-900 transition-colors flex items-center gap-2"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-500" /> Export Fleet Vehicles
              </button>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search maintenance, routes, drivers, buses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {filterOptions.branches.length > 0 && (
            <select
              value={selectedBranch}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedBranch(val);
                handleFilterChange(val, selectedMaintStatus, selectedMaintType, selectedVehicleStatus);
              }}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Campus: All Campuses</option>
              {filterOptions.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedMaintStatus}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMaintStatus(val);
              handleFilterChange(selectedBranch, val, selectedMaintType, selectedVehicleStatus);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">Maintenance: All Statuses</option>
            <option value="SCHEDULED">Maintenance: Scheduled</option>
            <option value="IN_PROGRESS">Maintenance: In Progress</option>
            <option value="COMPLETED">Maintenance: Completed</option>
          </select>

          <select
            value={selectedMaintType}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedMaintType(val);
              handleFilterChange(selectedBranch, selectedMaintStatus, val, selectedVehicleStatus);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">Type: All Types</option>
            <option value="PREVENTIVE">Type: Preventive</option>
            <option value="CORRECTIVE">Type: Corrective</option>
          </select>

          <select
            value={selectedVehicleStatus}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedVehicleStatus(val);
              handleFilterChange(selectedBranch, selectedMaintStatus, selectedMaintType, val);
            }}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">Fleet: All Vehicles</option>
            <option value="ACTIVE">Fleet: Active</option>
            <option value="MAINTENANCE">Fleet: In Maintenance</option>
            <option value="INACTIVE">Fleet: Inactive</option>
          </select>

          {isPending && (
            <div className="flex items-center gap-1 text-xs font-bold text-primary-600 px-2 py-1 bg-primary-50 rounded-lg">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Updating...
            </div>
          )}
        </div>
      </div>

      {/* KPI Metrics Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Active Transport Routes */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Active Routes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {data.metrics.activeRoutesCount}{" "}
              <span className="text-xs font-bold text-slate-400">/ {data.metrics.totalRoutes}</span>
            </div>
            <div className="text-[11px] font-bold text-blue-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              {data.metrics.totalStudentsTransported} Passengers
            </div>
          </div>
        </div>

        {/* Card 2: Fleet Vehicles */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Fleet Vehicles</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {data.metrics.activeVehicles}{" "}
              <span className="text-xs font-bold text-slate-400">/ {data.metrics.totalVehicles} Active</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {data.metrics.fleetTotalCapacity} Total Seats
            </div>
          </div>
        </div>

        {/* Card 3: Pending Maintenance Tasks */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pending Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">
              {data.metrics.pendingMaintenanceTasksCount}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" />
              {data.metrics.openWorkOrdersCount} Open Work Orders
            </div>
          </div>
        </div>

        {/* Card 4: Maintenance Spend */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Maintenance Spend</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-slate-800">
              KSh {data.metrics.totalMaintenanceCost.toLocaleString()}
            </div>
            <div className="text-[11px] font-bold text-indigo-600 mt-1">
              Prev: KSh {data.metrics.preventiveCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Card 5: Fleet Utilization */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Transport Util</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              {data.metrics.avgRouteUtilization}%
            </div>
            <div className="text-[11px] font-bold text-purple-600 mt-1">
              Capacity: {data.metrics.totalStudentsTransported}/{data.metrics.fleetTotalCapacity}
            </div>
          </div>
        </div>

        {/* Card 6: SLA Compliance */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">SLA Compliance</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-teal-600">
              {data.metrics.slaComplianceRate}%
            </div>
            <div className="text-[11px] font-bold text-teal-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-teal-500" /> Operations Optimal
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 bg-slate-100/80 p-1.5 rounded-2xl overflow-x-auto border border-slate-200/60 shadow-inner">
        {[
          { id: "all", label: "Overview & All Tasks", count: null },
          { id: "maintenance", label: "Pending Maintenance", count: data.metrics.pendingMaintenanceTasksCount },
          { id: "transport", label: "Active Transport Routes", count: data.metrics.activeRoutesCount },
          { id: "fleet", label: "Fleet & Vehicles", count: data.metrics.totalVehicles },
          { id: "admissions", label: "Admissions & Admin KPIs", count: null },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? "bg-white text-primary-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? "bg-primary-900 text-white" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PENDING MAINTENANCE TASKS */}
      {(activeTab === "all" || activeTab === "maintenance") && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden space-y-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">
                  Pending Maintenance Tasks &amp; Work Orders
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                  {filteredPendingMaintenance.length} Pending
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Scheduled and in-progress maintenance across vehicles, equipment, and campus facilities.
              </p>
            </div>

            <button
              onClick={exportMaintenanceCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Asset / Equipment</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Task Description</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Facility / Location</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Estimated Cost</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Assigned Provider</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPendingMaintenance.map((m) => {
                  const isScheduled = m.status === "SCHEDULED";
                  const isPreventive = m.type === "PREVENTIVE";

                  return (
                    <tr key={m.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800 text-sm">{m.assetName}</div>
                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-mono">
                            {m.assetTag}
                          </span>
                          <span>• {m.category}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                            isPreventive
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {m.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <p className="text-xs font-semibold text-slate-700 line-clamp-2">{m.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {m.facilityName || "Main Campus"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {m.date}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-black text-slate-800 font-mono">
                          KSh {m.cost.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {m.performedBy || "Internal Facilities Team"}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isScheduled
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isScheduled ? "bg-amber-500" : "bg-indigo-500 animate-pulse"
                            }`}
                          ></span>
                          {m.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredPendingMaintenance.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-bold text-sm text-slate-700">No pending maintenance tasks found.</p>
                      <p className="text-xs text-slate-400 mt-1">All scheduled and active work orders are up to date.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE TRANSPORT ROUTES */}
      {(activeTab === "all" || activeTab === "transport") && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden space-y-0">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Bus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">
                  Active Transport Routes &amp; Fleet Assignments
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
                  {data.metrics.activeRoutesCount} Active Routes
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Student bus routes, assigned drivers, passenger capacity, and vehicle utilization rates.
              </p>
            </div>

            <button
              onClick={exportRoutesCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200/80">
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Route Details</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Assigned Bus</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Assigned Driver</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Cost / Term</th>
                  <th className="px-4 py-3.5 text-[11px] font-black uppercase tracking-wider">Enrolled Students</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider min-w-[200px]">Capacity Utilization</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoutes.map((r) => {
                  const isActive = r.status === "ACTIVE";
                  const util = r.utilizationPercent;
                  const utilColor =
                    util >= 95
                      ? "bg-indigo-500 text-indigo-700"
                      : util >= 75
                      ? "bg-emerald-500 text-emerald-700"
                      : util >= 50
                      ? "bg-amber-500 text-amber-700"
                      : "bg-rose-500 text-rose-700";

                  return (
                    <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800 text-sm">{r.routeName}</div>
                        <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          {r.tripsCount} Recorded Trips
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                            <Bus className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-800 font-mono">{r.vehiclePlate}</div>
                            <div className="text-[10px] font-bold text-slate-400">{r.capacity} Seats</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.driverName || "Unassigned"}</span>
                        </div>
                        {r.driverEmployeeNo && (
                          <div className="text-[10px] font-semibold text-slate-400 ml-5 font-mono">
                            {r.driverEmployeeNo}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-black text-slate-800 font-mono">
                          {r.costPerTerm ? `KSh ${r.costPerTerm.toLocaleString()}` : "N/A"}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400">per student / term</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs font-black text-slate-800">
                          {r.studentCount} <span className="text-[11px] font-normal text-slate-500">/ {r.capacity}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-600">{util}%</span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {r.capacity - r.studentCount > 0
                                ? `${r.capacity - r.studentCount} seats open`
                                : "At Capacity"}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all ${utilColor.split(" ")[0]}`}
                              style={{ width: `${Math.min(util, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></span>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredRoutes.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <Bus className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="font-bold text-sm text-slate-700">No transport routes found.</p>
                      <p className="text-xs text-slate-400 mt-1">Adjust search filter to view routes.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FLEET & VEHICLES OVERVIEW */}
      {(activeTab === "all" || activeTab === "fleet") && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider">
                  School Fleet &amp; Vehicle Status
                </h3>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Vehicle registration, maintenance statuses, fuel consumption metrics, and assigned operators.
              </p>
            </div>

            <button
              onClick={exportVehiclesCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((v) => {
              const isVehActive = v.status === "ACTIVE";
              const isVehMaint = v.status === "MAINTENANCE";

              return (
                <div
                  key={v.id}
                  className="border border-slate-200/80 rounded-2xl p-5 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between bg-white"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                          <Bus className="w-5 h-5 text-primary-700" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 font-mono text-base">{v.registrationNumber}</div>
                          <div className="text-xs font-semibold text-slate-500">
                            {v.make} {v.model}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isVehActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : isVehMaint
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isVehActive ? "bg-emerald-500" : isVehMaint ? "bg-amber-500" : "bg-slate-400"
                          }`}
                        ></span>
                        {v.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Passenger Capacity</div>
                        <div className="font-black text-slate-800 text-sm mt-0.5">{v.capacity} Seats</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Driver</div>
                        <div className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                          {v.driverName || "Unassigned"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1 text-slate-500 font-semibold">
                      <Fuel className="w-3.5 h-3.5 text-amber-500" />
                      <span>{v.totalFuelLiters} L Fuel</span>
                    </div>
                    <div className="font-black text-slate-800 font-mono">
                      KSh {v.totalFuelCost.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: ADMISSIONS FUNNEL & ADMINISTRATIVE KPIS */}
      {(activeTab === "all" || activeTab === "admissions") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admissions Funnel */}
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" /> Admissions Funnel (Term 1, 2026)
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                  Term Flow
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-6">
                Tracking prospective student journey from inquiry to confirmed enrollment.
              </p>

              <div className="space-y-4">
                {data.admissionsFunnel.map((stage, i) => (
                  <div key={i} className="flex flex-col relative">
                    {i > 0 && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-full z-10 shadow-sm text-[10px] font-bold text-slate-500">
                        <ArrowRight className="w-3 h-3 text-emerald-500" /> {stage.conversion}% conversion
                      </div>
                    )}

                    <div className="flex items-center gap-4 w-full">
                      <div className="w-36 text-right">
                        <div className="text-xs font-bold text-slate-600 truncate">{stage.stage}</div>
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full h-8 flex items-center relative overflow-hidden group">
                        <div
                          className={`h-full transition-all flex items-center justify-end pr-4 ${
                            i === 0
                              ? "bg-indigo-200"
                              : i === 1
                              ? "bg-indigo-300"
                              : i === 2
                              ? "bg-indigo-400"
                              : i === 3
                              ? "bg-indigo-500"
                              : "bg-indigo-600 text-white"
                          }`}
                          style={{
                            width: `${(stage.count / data.admissionsFunnel[0].count) * 100}%`,
                          }}
                        >
                          <span className={`text-xs font-black ${i === 4 ? "text-white" : "text-indigo-900"}`}>
                            {stage.count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Overall Conversion Rate
                </div>
                <div className="text-2xl font-black text-indigo-700">30.4%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Cost per Acquisition (Est)
                </div>
                <div className="text-xl font-black text-slate-800">KSh 4,200</div>
              </div>
            </div>
          </div>

          {/* Admin Processing Times & KPIs */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> Administrative Processing KPIs
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">
                    Average time taken vs internal service level agreements (SLAs).
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3">
                {data.adminKPIs.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-sm text-slate-800">{task.task}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Target className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Target: {task.target}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div
                        className={`font-black text-base ${
                          task.status === "optimal" ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {task.avgTime}
                      </div>
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          task.status === "optimal" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl text-center shadow-sm">
                <div className="text-3xl font-black text-emerald-700 mb-1">{data.metrics.slaComplianceRate}%</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Overall SLA Compliance
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl text-center shadow-sm">
                <div className="text-3xl font-black text-blue-700 mb-1">1,240</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-blue-800">
                  Tickets Resolved (MTD)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
