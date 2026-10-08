"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Filter,
  Clock,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Mail,
  MessageSquare,
  Smartphone,
  Bell,
  Shield,
  Megaphone,
  RefreshCw,
  Eye,
  X,
  Layers,
  Table as TableIcon,
  ListOrdered,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Send,
  FileSpreadsheet,
} from "lucide-react";
import { ActivityReportData, ActivityItem, ActivityChannel, ActivityStatus } from "./actions";

interface ActivityClientProps {
  initialData: ActivityReportData;
  searchParams?: {
    searchTerm?: string;
    channel?: string;
    status?: string;
    timeRange?: string;
  };
}

export default function ActivityClient({ initialData, searchParams }: ActivityClientProps) {
  const [data, setData] = useState<ActivityReportData>(initialData);
  const [searchTerm, setSearchTerm] = useState(searchParams?.searchTerm || "");
  const [selectedChannel, setSelectedChannel] = useState<string>(searchParams?.channel || "ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams?.status || "ALL");
  const [timeRange, setTimeRange] = useState<"ALL" | "TODAY" | "7DAYS" | "30DAYS">(
    (searchParams?.timeRange as any) || "ALL"
  );
  const [viewMode, setViewMode] = useState<"timeline" | "table">("timeline");
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return data.activities.filter((item) => {
      // Search term matching
      const matchesSearch =
        searchTerm === "" ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.channel.toLowerCase().includes(searchTerm.toLowerCase());

      // Channel matching
      const matchesChannel =
        selectedChannel === "ALL" || item.channel.toUpperCase() === selectedChannel.toUpperCase();

      // Status matching
      const matchesStatus =
        selectedStatus === "ALL" || item.status.toUpperCase() === selectedStatus.toUpperCase();

      // Time range matching
      if (!matchesSearch || !matchesChannel || !matchesStatus) return false;

      if (timeRange !== "ALL") {
        const itemDate = new Date(item.timestamp).getTime();
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (timeRange === "TODAY" && now - itemDate > oneDay) return false;
        if (timeRange === "7DAYS" && now - itemDate > 7 * oneDay) return false;
        if (timeRange === "30DAYS" && now - itemDate > 30 * oneDay) return false;
      }

      return true;
    });
  }, [data.activities, searchTerm, selectedChannel, selectedStatus, timeRange]);

  // Export Data to CSV
  const handleExportCSV = () => {
    if (filteredActivities.length === 0) {
      alert("No activities available to export.");
      return;
    }

    const headers = [
      "Activity ID",
      "Timestamp",
      "Type",
      "Channel",
      "Subject / Title",
      "Recipient / Entity",
      "User / Actor",
      "Status",
      "Message / Details",
      "Error Details",
    ];

    const csvRows = [headers.join(",")];

    filteredActivities.forEach((act) => {
      const row = [
        `"${act.id.replace(/"/g, '""')}"`,
        `"${new Date(act.timestamp).toLocaleString().replace(/"/g, '""')}"`,
        `"${act.type.replace(/"/g, '""')}"`,
        `"${act.channel.replace(/"/g, '""')}"`,
        `"${act.title.replace(/"/g, '""')}"`,
        `"${act.recipient.replace(/"/g, '""')}"`,
        `"${act.user.replace(/"/g, '""')}"`,
        `"${act.status.replace(/"/g, '""')}"`,
        `"${act.details.replace(/"/g, '""')}"`,
        `"${(act.providerError || "").replace(/"/g, '""')}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    link.setAttribute("href", url);
    link.setAttribute("download", `operational_activity_report_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported ${filteredActivities.length} activities to CSV`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Helper for Channel Icons & Colors
  const getChannelMeta = (channel: ActivityChannel) => {
    switch (channel) {
      case "SMS":
        return {
          icon: Smartphone,
          label: "SMS",
          badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          nodeBg: "bg-emerald-600 text-white",
        };
      case "EMAIL":
        return {
          icon: Mail,
          label: "Email",
          badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
          nodeBg: "bg-indigo-600 text-white",
        };
      case "PUSH_NOTIFICATION":
        return {
          icon: Bell,
          label: "Push Notification",
          badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
          nodeBg: "bg-purple-600 text-white",
        };
      case "ANNOUNCEMENT":
        return {
          icon: Megaphone,
          label: "Announcement",
          badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
          nodeBg: "bg-rose-600 text-white",
        };
      case "SYSTEM":
      default:
        return {
          icon: Shield,
          label: "System Audit",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
          nodeBg: "bg-amber-600 text-white",
        };
    }
  };

  // Helper for Status Badges
  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case "DELIVERED":
      case "SUCCESS":
      case "PUBLISHED":
        return {
          icon: CheckCircle2,
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
          label: status === "DELIVERED" ? "Delivered" : status === "PUBLISHED" ? "Published" : "Success",
        };
      case "FAILED":
        return {
          icon: XCircle,
          className: "bg-rose-50 text-rose-700 border-rose-200",
          label: "Failed",
        };
      case "SENT":
      case "PENDING":
      default:
        return {
          icon: Clock,
          className: "bg-blue-50 text-blue-700 border-blue-200",
          label: status === "SENT" ? "Sent" : "Pending",
        };
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedChannel("ALL");
    setSelectedStatus("ALL");
    setTimeRange("ALL");
  };

  const isFiltered =
    searchTerm !== "" || selectedChannel !== "ALL" || selectedStatus !== "ALL" || timeRange !== "ALL";

  return (
    <div className="p-6 space-y-6">
      {/* Toast Export Notice */}
      {exportNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-900 text-white rounded-2xl shadow-xl border border-emerald-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-bold">{exportNotice}</span>
          <button
            onClick={() => setExportNotice(null)}
            className="p-1 hover:bg-emerald-800 rounded-lg transition-colors ml-2"
          >
            <X className="w-4 h-4 text-emerald-200" />
          </button>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Operational Activity & Communications
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider bg-primary-100 text-primary-800 rounded-full">
              Live Feed
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time audit log of SMS, email notifications, system events, and broadcast announcements.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "timeline"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ListOrdered className="w-3.5 h-3.5" /> Timeline
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          {/* Export Data Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 active:scale-95 transition-all shadow-md shadow-primary-900/10 flex-1 md:flex-none cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Activities */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Total Events</span>
            <Activity className="w-4 h-4 text-primary-500" />
          </div>
          <div className="text-2xl font-black text-slate-800">{data.stats.totalActivities}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Logged records</div>
        </div>

        {/* SMS Messages */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">SMS Dispatched</span>
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{data.stats.totalSMS}</div>
          <div className="text-xs font-bold text-emerald-600/80 mt-1">SMS Notifications</div>
        </div>

        {/* Emails Sent */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-indigo-600 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Emails Sent</span>
            <Mail className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{data.stats.totalEmails}</div>
          <div className="text-xs font-bold text-indigo-600/80 mt-1">Email Outbox</div>
        </div>

        {/* Delivery Rate */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Delivery Rate</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-teal-700">{data.stats.deliveryRate}%</div>
          <div className="text-xs font-bold text-teal-600/80 mt-1">{data.stats.deliveredCount} delivered</div>
        </div>

        {/* Failed Alerts */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-rose-600 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Failed / Issues</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-rose-700">{data.stats.failedCount}</div>
          <div className="text-xs font-bold text-rose-600/80 mt-1">Delivery errors</div>
        </div>

        {/* System & Audit */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider">Audit / System</span>
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-amber-700">{data.stats.systemEventsCount}</div>
          <div className="text-xs font-bold text-amber-600/80 mt-1">Security & backups</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, recipient, user, action, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 w-full lg:w-auto overflow-x-auto">
            {(
              [
                { id: "ALL", label: "All Time" },
                { id: "TODAY", label: "Today" },
                { id: "7DAYS", label: "7 Days" },
                { id: "30DAYS", label: "30 Days" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  timeRange === t.id
                    ? "bg-white text-primary-900 shadow-sm border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Channel Selector */}
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full lg:w-44 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-900"
          >
            <option value="ALL">All Channels</option>
            <option value="SMS">SMS Gateway</option>
            <option value="EMAIL">Email Dispatch</option>
            <option value="PUSH_NOTIFICATION">Push Notifications</option>
            <option value="SYSTEM">System & Audit</option>
            <option value="ANNOUNCEMENT">Announcements</option>
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full lg:w-40 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="DELIVERED">Delivered</option>
            <option value="SENT">Sent</option>
            <option value="SUCCESS">Success</option>
            <option value="PUBLISHED">Published</option>
            <option value="FAILED">Failed</option>
          </select>

          {isFiltered && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results count indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-1 border-t border-slate-100">
          <div>
            Showing <span className="text-slate-800 font-extrabold">{filteredActivities.length}</span> of{" "}
            {data.activities.length} activities
          </div>
          {isFiltered && <div className="text-primary-700">Filters active</div>}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "timeline" ? (
        /* ================= TIMELINE VIEW ================= */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-700">No activities match your filters</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching with different keywords or reset your channel and date filters.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-900 text-white text-xs font-bold rounded-xl hover:bg-primary-800 transition-all shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-6 pb-2">
              {filteredActivities.map((activity) => {
                const channelMeta = getChannelMeta(activity.channel);
                const statusMeta = getStatusBadge(activity.status);
                const ChannelIcon = channelMeta.icon;
                const StatusIcon = statusMeta.icon;
                const dateObj = new Date(activity.timestamp);
                const formattedTime = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const formattedDate = dateObj.toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div key={activity.id} className="relative pl-8 group">
                    {/* Timeline Node Icon */}
                    <div
                      className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${channelMeta.nodeBg} shadow-sm group-hover:scale-110 transition-transform`}
                    >
                      <ChannelIcon className="w-3.5 h-3.5" />
                    </div>

                    {/* Event Card */}
                    <div className="bg-slate-50/70 border border-slate-200/70 hover:border-primary-300 hover:bg-white rounded-2xl p-4 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/50">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Channel Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold border ${channelMeta.badgeBg}`}
                          >
                            <ChannelIcon className="w-3 h-3" />
                            {channelMeta.label}
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusMeta.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusMeta.label}
                          </span>

                          {/* ID code */}
                          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            {activity.id}
                          </span>
                        </div>

                        {/* Timestamp & User */}
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {formattedDate} at {formattedTime}
                          </span>
                        </div>
                      </div>

                      {/* Main Title & Action */}
                      <div className="space-y-1.5">
                        <h4 className="text-base font-black text-slate-800">{activity.title}</h4>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">{activity.details}</p>
                      </div>

                      {/* Provider Error Alert if Failed */}
                      {activity.providerError && (
                        <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs font-bold text-rose-700">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                          <div>
                            <span className="font-extrabold">Delivery Exception: </span>
                            {activity.providerError}
                          </div>
                        </div>
                      )}

                      {/* Footer Info & Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-200/50 text-xs">
                        <div className="flex items-center gap-4 flex-wrap text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-400 uppercase text-[10px]">Target:</span>
                            <span className="font-bold text-slate-700">{activity.recipient}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-400 uppercase text-[10px]">Actor:</span>
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" /> {activity.user}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedActivity(activity)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-sm transition-colors text-xs self-end sm:self-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-400" /> Inspect
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider">
                  <th className="py-3.5 px-4">Event ID</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Channel / Type</th>
                  <th className="py-3.5 px-4">Subject / Title</th>
                  <th className="py-3.5 px-4">Recipient / Target</th>
                  <th className="py-3.5 px-4">Actor / Origin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No activity logs match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => {
                    const channelMeta = getChannelMeta(act.channel);
                    const statusMeta = getStatusBadge(act.status);
                    const ChannelIcon = channelMeta.icon;
                    const StatusIcon = statusMeta.icon;
                    const dateObj = new Date(act.timestamp);

                    return (
                      <tr key={act.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-black text-slate-800 whitespace-nowrap">{act.id}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                          {dateObj.toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                          <span className="text-slate-400 font-normal">
                            {dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${channelMeta.badgeBg}`}
                          >
                            <ChannelIcon className="w-3 h-3" />
                            {channelMeta.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 max-w-xs truncate">{act.title}</td>
                        <td className="py-3.5 px-4 max-w-[200px] truncate text-slate-600">{act.recipient}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">{act.user}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${statusMeta.className}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedActivity(act)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 shadow-sm transition-colors text-xs cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Activity Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                {(() => {
                  const meta = getChannelMeta(selectedActivity.channel);
                  const Icon = meta.icon;
                  return (
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${meta.nodeBg} shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="text-lg font-black text-slate-800">{selectedActivity.title}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {selectedActivity.id} • {selectedActivity.channel} Event
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              {/* Status and timestamp bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status</div>
                  {(() => {
                    const statusMeta = getStatusBadge(selectedActivity.status);
                    return (
                      <span
                        className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    );
                  })()}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Timestamp</div>
                  <div className="font-bold text-slate-800 text-xs mt-1">
                    {new Date(selectedActivity.timestamp).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Actor / Origin</div>
                  <div className="font-bold text-slate-800 text-xs mt-1 truncate">{selectedActivity.user}</div>
                </div>
              </div>

              {/* Recipient Details */}
              <div>
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Recipient / Entity
                </h5>
                <div className="p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 text-xs">
                  {selectedActivity.recipient}
                </div>
              </div>

              {/* Message Payload / Details */}
              <div>
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Message Payload / Activity Content
                </h5>
                <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono leading-relaxed break-words whitespace-pre-wrap">
                  {selectedActivity.details}
                </div>
              </div>

              {/* Provider Error if any */}
              {selectedActivity.providerError && (
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-rose-500 mb-1.5">
                    Gateway Error Diagnostics
                  </h5>
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-medium text-rose-800">
                    {selectedActivity.providerError}
                  </div>
                </div>
              )}

              {/* Additional Metadata */}
              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Event Metadata
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(selectedActivity.metadata).map(([key, val]) => (
                      <div key={key} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl">
                        <span className="font-black text-slate-400 uppercase text-[10px] block">{key}</span>
                        <span className="font-bold text-slate-700">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-5 py-2 bg-slate-800 text-white rounded-xl font-bold text-xs hover:bg-slate-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
