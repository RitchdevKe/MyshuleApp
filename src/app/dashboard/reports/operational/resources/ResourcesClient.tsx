"use client";

import React, { useState, useTransition } from "react";
import {
  Building2,
  Bus,
  BookOpen,
  Box,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Bed,
  Sparkles,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  Download,
  ShieldAlert,
  MapPin,
  UserCheck,
  Fuel,
  Users,
} from "lucide-react";
import { getOperationalResourcesData, OperationalResourcesData } from "./actions";

import { useSearchParams } from "next/navigation";

interface ResourcesClientProps {
  initialData: OperationalResourcesData;
}

export default function ResourcesClient({ initialData }: ResourcesClientProps) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<OperationalResourcesData>(initialData);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"all" | "facilities" | "assets" | "library" | "transport" | "hostels">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const params = Object.fromEntries(searchParams.entries());
        const fresh = await getOperationalResourcesData(params);
        setData(fresh);
      } catch (err) {
        console.error("Failed to refresh resources data:", err);
      }
    });
  };

  const handleExportCSV = () => {
    const lines: string[] = [];
    const timestamp = new Date().toISOString().split("T")[0];

    lines.push(`"OPERATIONAL RESOURCES & UTILIZATION REPORT"`);
    lines.push(`"Generated At:","${new Date().toLocaleString()}"`);
    lines.push("");

    // 1. Facilities
    lines.push(`"--- FACILITIES SUMMARY ---"`);
    lines.push(`"Total Facilities","${data.facilities.total}","Active","${data.facilities.active}","Maintenance","${data.facilities.inMaintenance}","Total Capacity","${data.facilities.totalCapacity}"`);
    lines.push(`"Facility Name","Type","Capacity","Location","Status","Assets Count"`);
    data.facilities.list.forEach((f) => {
      lines.push(
        `"${f.name.replace(/"/g, '""')}","${f.type}","${f.capacity}","${f.location.replace(/"/g, '""')}","${f.status}","${f.assetCount}"`
      );
    });
    lines.push("");

    // 2. Assets
    lines.push(`"--- PHYSICAL ASSETS SUMMARY ---"`);
    lines.push(
      `"Total Assets","${data.assets.total}","Active","${data.assets.active}","In Maintenance","${data.assets.inMaintenance}","Total Value","KES ${data.assets.totalCost.toLocaleString()}"`
    );
    lines.push(`"Asset Tag","Name","Category","Condition","Status","Purchase Cost","Facility"`);
    data.assets.list.forEach((a) => {
      lines.push(
        `"${a.assetTag}","${a.name.replace(/"/g, '""')}","${a.category}","${a.condition}","${a.status}","${a.purchaseCost}","${a.facilityName.replace(/"/g, '""')}"`
      );
    });
    lines.push("");

    // 3. Library
    lines.push(`"--- LIBRARY BOOK HOLDINGS ---"`);
    lines.push(
      `"Total Titles","${data.library.totalTitles}","Total Copies","${data.library.totalCopies}","Active Loans","${data.library.activeLoans}","Overdue","${data.library.overdueLoans}","Utilization Rate","${data.library.utilizationRate}%"`
    );
    lines.push(`"Title","Author","Category","Total Copies","Status","Active Loans"`);
    data.library.list.forEach((b) => {
      lines.push(
        `"${b.title.replace(/"/g, '""')}","${b.author.replace(/"/g, '""')}","${b.category}","${b.copies}","${b.status}","${b.activeLoansCount}"`
      );
    });
    lines.push("");

    // 4. Transport
    lines.push(`"--- TRANSPORT FLEET & ROUTES ---"`);
    lines.push(
      `"Total Routes","${data.transport.totalRoutes}","Total Vehicles","${data.transport.totalVehicles}","Total Capacity","${data.transport.totalCapacity}","Enrolled Students","${data.transport.totalEnrolled}","Utilization Rate","${data.transport.utilizationRate}%"`
    );
    lines.push(`"Route Name","Vehicle Plate","Assigned Driver","Enrolled Students","Cost Per Term"`);
    data.transport.list.forEach((t) => {
      lines.push(
        `"${t.routeName.replace(/"/g, '""')}","${t.vehiclePlate}","${t.driverName.replace(/"/g, '""')}","${t.enrolledCount}","${t.costPerTerm}"`
      );
    });
    lines.push("");

    // 5. Hostels
    lines.push(`"--- HOSTEL & DORMITORY BOARDING ---"`);
    lines.push(
      `"Total Hostels","${data.hostels.totalHostels}","Total Rooms","${data.hostels.totalRooms}","Total Beds","${data.hostels.totalBeds}","Occupied Beds","${data.hostels.occupiedBeds}","Occupancy Rate","${data.hostels.occupancyRate}%"`
    );
    lines.push(`"Hostel Name","Type","Capacity","Rooms Count","Occupied Beds","Status"`);
    data.hostels.list.forEach((h) => {
      lines.push(
        `"${h.name.replace(/"/g, '""')}","${h.type}","${h.capacity}","${h.roomCount}","${h.occupied}","${h.status}"`
      );
    });

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute("download", `operational_resources_report_${timestamp}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered lists based on search and status
  const searchLower = searchTerm.toLowerCase();

  const filteredFacilities = data.facilities.list.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchLower) ||
      f.type.toLowerCase().includes(searchLower) ||
      f.location.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || f.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAssets = data.assets.list.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchLower) ||
      a.assetTag.toLowerCase().includes(searchLower) ||
      a.category.toLowerCase().includes(searchLower) ||
      a.facilityName.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || a.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBooks = data.library.list.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchLower) ||
      b.author.toLowerCase().includes(searchLower) ||
      b.category.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || b.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredRoutes = data.transport.list.filter((r) => {
    return (
      r.routeName.toLowerCase().includes(searchLower) ||
      r.vehiclePlate.toLowerCase().includes(searchLower) ||
      r.driverName.toLowerCase().includes(searchLower)
    );
  });

  const filteredHostels = data.hostels.list.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(searchLower) || h.type.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || h.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Resource Utilization & Assets</h2>
            <span className="bg-primary-50 text-primary-700 border border-primary-200 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              Live Operations
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Monitor school facilities, physical asset health, library circulation, transport fleet, and boarding occupancy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60"
            title="Refresh latest data"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-primary-600" : "text-slate-500"}`} />
            <span>{isPending ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm print:hidden"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-xs hover:bg-primary-800 transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4 text-secondary-400" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Facilities */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {data.facilities.active} Active
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800">{data.facilities.total}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">Facilities & Rooms</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Capacity: <strong className="text-slate-700">{data.facilities.totalCapacity.toLocaleString()}</strong></span>
            {data.facilities.inMaintenance > 0 && (
              <span className="text-amber-600 font-bold">{data.facilities.inMaintenance} Maint.</span>
            )}
          </div>
        </div>

        {/* 2. Physical Assets */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Box className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {data.assets.byCondition.good} Good
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800">{data.assets.total}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">Physical Assets</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Val: <strong className="text-slate-700">KES {data.assets.totalCost.toLocaleString()}</strong></span>
            {data.assets.inMaintenance > 0 && (
              <span className="text-amber-600 font-bold">{data.assets.inMaintenance} Maint.</span>
            )}
          </div>
        </div>

        {/* 3. Library Holdings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              {data.library.utilizationRate}% Borrowed
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800">{data.library.totalCopies.toLocaleString()}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">Library Copies ({data.library.totalTitles} Titles)</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Active Loans: <strong className="text-slate-700">{data.library.activeLoans}</strong></span>
            {data.library.overdueLoans > 0 && (
              <span className="text-rose-600 font-bold">{data.library.overdueLoans} Overdue</span>
            )}
          </div>
        </div>

        {/* 4. Transport Fleet */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
              {data.transport.utilizationRate}% Capacity
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800">{data.transport.totalRoutes}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">Active Routes ({data.transport.totalVehicles} Buses)</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Enrolled: <strong className="text-slate-700">{data.transport.totalEnrolled}</strong></span>
            <span>Cap: <strong className="text-slate-700">{data.transport.totalCapacity}</strong></span>
          </div>
        </div>

        {/* 5. Hostel Boarding */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
              <Bed className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
              {data.hostels.occupancyRate}% Occupied
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800">{data.hostels.totalBeds}</div>
          <div className="text-xs font-bold text-slate-500 mt-0.5">Total Boarding Beds</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Occupied: <strong className="text-emerald-600">{data.hostels.occupiedBeds}</strong></span>
            <span>Free: <strong className="text-slate-700">{data.hostels.availableBeds}</strong></span>
          </div>
        </div>
      </div>

      {/* Resource Module Sub-Nav */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          {[
            { id: "all", label: "Overview", icon: Layers },
            { id: "facilities", label: `Facilities (${data.facilities.total})`, icon: Building2 },
            { id: "assets", label: `Assets (${data.assets.total})`, icon: Box },
            { id: "library", label: `Library (${data.library.totalTitles})`, icon: BookOpen },
            { id: "transport", label: `Transport (${data.transport.totalRoutes})`, icon: Bus },
            { id: "hostels", label: `Hostels (${data.hostels.totalHostels})`, icon: Bed },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-secondary-400" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Filter and Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active / Available</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* TAB 1: ALL / OVERVIEW */}
      {(activeTab === "all" || activeTab === "facilities") && (
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Facilities Occupancy & Status
              </h3>
              <button
                onClick={() => setActiveTab("facilities")}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                View all ({data.facilities.total}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFacilities.slice(0, activeTab === "all" ? 6 : undefined).map((fac) => {
              const statusUpper = fac.status.toUpperCase();
              const isMaintenance = statusUpper === "MAINTENANCE";
              const isInactive = statusUpper === "INACTIVE";

              return (
                <div
                  key={fac.id}
                  className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isMaintenance
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : isInactive
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {fac.status}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-800 text-base">{fac.name}</h4>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {fac.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {fac.location}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Seating Capacity:</span>
                      <span className="font-black text-slate-800">
                        {fac.capacity > 0 ? `${fac.capacity} Persons` : "Unspecified"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Assigned Assets:</span>
                      <span className="font-black text-blue-600">{fac.assetCount} items</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredFacilities.length === 0 && (
              <div className="col-span-full bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-sm">No facilities found matching your criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing search filters or add new facilities in Operations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TRANSPORT FLEET OVERVIEW */}
      {(activeTab === "all" || activeTab === "transport") && (
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-500" /> Transport Fleet & Route Capacity
              </h3>
              <button
                onClick={() => setActiveTab("transport")}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                View all ({data.transport.totalRoutes}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Transport Route Enrollments</h4>
                <p className="text-xs text-slate-500 mt-0.5">Route loads, assigned drivers, and vehicle registration plates.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                <span>Total Enrolled: <strong className="text-slate-800">{data.transport.totalEnrolled} students</strong></span>
                <span>Fleet Util: <strong className="text-amber-600">{data.transport.utilizationRate}%</strong></span>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRoutes.slice(0, activeTab === "all" ? 6 : undefined).map((route) => {
                  const estimatedCapacity = 45;
                  const utilPercent = Math.min(100, Math.round((route.enrolledCount / estimatedCapacity) * 100));

                  return (
                    <div key={route.id} className="border border-slate-200/80 rounded-xl p-4 bg-white hover:border-slate-300 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-black text-slate-800 text-sm flex items-center gap-2">
                            <Bus className="w-4 h-4 text-amber-500" />
                            {route.routeName}
                          </div>
                          <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                            Plate: <span className="text-slate-700">{route.vehiclePlate}</span> • Driver:{" "}
                            <span className="text-slate-700">{route.driverName}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-black text-sm ${
                              utilPercent > 90 ? "text-indigo-600" : utilPercent > 50 ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            {route.enrolledCount} Enrolled
                          </div>
                          {route.costPerTerm > 0 && (
                            <div className="text-[10px] font-bold text-slate-400">
                              KES {route.costPerTerm.toLocaleString()}/term
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-2 mt-3">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            utilPercent >= 90
                              ? "bg-indigo-500"
                              : utilPercent >= 50
                              ? "bg-emerald-500"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${Math.max(5, utilPercent)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                {filteredRoutes.length === 0 && (
                  <div className="col-span-full p-8 text-center text-slate-400 text-xs font-bold">
                    No transport routes found matching search.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: HOSTEL BOARDING */}
      {(activeTab === "all" || activeTab === "hostels") && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white overflow-hidden relative shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Building2 className="w-64 h-64" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="text-lg font-black text-white uppercase tracking-wider">
                      Hostel &amp; Dormitory Boarding Intelligence
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-slate-400 mt-1">
                    Live bed occupancy and room allocation tracker across boarding houses.
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap w-full md:w-auto">
                  <div className="bg-slate-800/90 px-4 py-3 rounded-2xl border border-slate-700 flex-1 md:flex-none min-w-[110px]">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Total Beds</div>
                    <div className="text-2xl font-black text-white">{data.hostels.totalBeds}</div>
                  </div>
                  <div className="bg-slate-800/90 px-4 py-3 rounded-2xl border border-slate-700 flex-1 md:flex-none min-w-[110px]">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Occupied</div>
                    <div className="text-2xl font-black text-emerald-400">
                      {data.hostels.occupiedBeds}{" "}
                      <span className="text-xs text-slate-400 font-medium">({data.hostels.occupancyRate}%)</span>
                    </div>
                  </div>
                  <div className="bg-slate-800/90 px-4 py-3 rounded-2xl border border-slate-700 flex-1 md:flex-none min-w-[110px]">
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Available</div>
                    <div className="text-2xl font-black text-amber-400">{data.hostels.availableBeds}</div>
                  </div>
                </div>
              </div>

              {/* Hostels breakdown list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {filteredHostels.map((hostel) => {
                  const occPercent =
                    hostel.capacity > 0 ? Math.min(100, Math.round((hostel.occupied / hostel.capacity) * 100)) : 0;
                  return (
                    <div key={hostel.id} className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-black text-white">{hostel.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-700/60 px-2 py-0.5 rounded">
                            {hostel.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mb-3">
                          {hostel.roomCount} Rooms • {hostel.occupied} / {hostel.capacity} Beds
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-400">Occupancy</span>
                          <span className={occPercent >= 90 ? "text-rose-400" : "text-emerald-400"}>
                            {occPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${occPercent >= 90 ? "bg-rose-400" : "bg-emerald-400"}`}
                            style={{ width: `${Math.max(5, occPercent)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredHostels.length === 0 && (
                  <div className="col-span-full py-4 text-center text-slate-400 text-xs font-bold">
                    No hostels recorded in this school tenant.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PHYSICAL ASSETS */}
      {(activeTab === "all" || activeTab === "assets") && (
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Box className="w-5 h-5 text-emerald-600" /> Physical Assets & Equipment Register
              </h3>
              <button
                onClick={() => setActiveTab("assets")}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                View all ({data.assets.total}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Condition Health Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Good Condition</div>
              <div className="text-xl font-black text-emerald-700 mt-1">{data.assets.byCondition.good}</div>
              <div className="text-[10px] font-medium text-emerald-600 mt-0.5">Fully operational</div>
            </div>
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-800">Fair Condition</div>
              <div className="text-xl font-black text-blue-700 mt-1">{data.assets.byCondition.fair}</div>
              <div className="text-[10px] font-medium text-blue-600 mt-0.5">Minor wear</div>
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">Poor Condition</div>
              <div className="text-xl font-black text-amber-700 mt-1">{data.assets.byCondition.poor}</div>
              <div className="text-[10px] font-medium text-amber-600 mt-0.5">Needs servicing</div>
            </div>
            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-800">Critical / Repair</div>
              <div className="text-xl font-black text-rose-700 mt-1">{data.assets.byCondition.critical}</div>
              <div className="text-[10px] font-medium text-rose-600 mt-0.5">Requires replacement</div>
            </div>
          </div>

          {/* Asset List Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Asset Inventory Summary ({filteredAssets.length} items)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider border-b border-slate-100">
                    <th className="px-4 py-3">Asset Tag</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Facility</th>
                    <th className="px-4 py-3">Condition</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Cost (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredAssets.slice(0, activeTab === "all" ? 8 : undefined).map((asset) => {
                    const cond = (asset.condition || "GOOD").toUpperCase();
                    const statusUpper = (asset.status || "ACTIVE").toUpperCase();

                    return (
                      <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{asset.assetTag}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{asset.name}</td>
                        <td className="px-4 py-3">{asset.category}</td>
                        <td className="px-4 py-3 text-slate-600">{asset.facilityName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              cond === "GOOD"
                                ? "bg-emerald-100 text-emerald-800"
                                : cond === "FAIR"
                                ? "bg-blue-100 text-blue-800"
                                : cond === "POOR"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {asset.condition}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              statusUpper === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : statusUpper === "MAINTENANCE"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {asset.purchaseCost > 0 ? asset.purchaseCost.toLocaleString() : "-"}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredAssets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400 font-bold">
                        No physical assets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIBRARY HOLDINGS */}
      {(activeTab === "all" || activeTab === "library") && (
        <div className="space-y-6">
          {activeTab === "all" && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Library Book Collections & Circulation
              </h3>
              <button
                onClick={() => setActiveTab("library")}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                View all ({data.library.totalTitles}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Library Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Book Titles</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{data.library.totalTitles}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Physical Copies</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">{data.library.totalCopies}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Currently Issued</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{data.library.activeLoans}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Overdue Books</div>
              <div className="text-2xl font-black text-rose-600 mt-1">{data.library.overdueLoans}</div>
            </div>
          </div>

          {/* Books List Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Book Catalog ({filteredBooks.length} titles)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider border-b border-slate-100">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Author</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-center">Copies</th>
                    <th className="px-4 py-3 text-center">Active Loans</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredBooks.slice(0, activeTab === "all" ? 8 : undefined).map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">{book.title}</td>
                      <td className="px-4 py-3 text-slate-600">{book.author}</td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                          {book.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-slate-900">{book.copies}</td>
                      <td className="px-4 py-3 text-center font-bold text-indigo-600">{book.activeLoansCount}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            book.status === "AVAILABLE"
                              ? "bg-emerald-100 text-emerald-800"
                              : book.status === "BORROWED"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredBooks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-bold">
                        No library books found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
