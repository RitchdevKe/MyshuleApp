"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Search,
  FileText,
  Activity,
  User,
  Filter,
  Eye,
  X,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  History,
  Lock,
} from "lucide-react";
import type {
  ComplianceReportData,
  DisciplinaryIncidentItem,
  AuditLogItem,
} from "./actions";

interface ComplianceClientProps {
  initialData: ComplianceReportData;
}

export default function ComplianceClient({ initialData }: ComplianceClientProps) {
  const [data] = useState<ComplianceReportData>(initialData);
  const [activeTab, setActiveTab] = useState<"overview" | "disciplinary" | "audit" | "regulatory">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [selectedIncident, setSelectedIncident] = useState<DisciplinaryIncidentItem | null>(null);
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLogItem | null>(null);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return data.incidents.filter((incident) => {
      const matchesSearch =
        incident.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || incident.status.toUpperCase() === statusFilter.toUpperCase();

      const matchesSeverity =
        severityFilter === "ALL" || incident.severity.toUpperCase() === severityFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [data.incidents, searchTerm, statusFilter, severityFilter]);

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return data.auditLogs.filter((log) => {
      return (
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.ipAddress && log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [data.auditLogs, searchTerm]);

  // Export Data as CSV
  const handleExportData = () => {
    const today = new Date().toISOString().split("T")[0];

    // Build Disciplinary Incidents CSV
    const incidentHeaders = [
      "Record Type",
      "ID",
      "Student Name",
      "Admission No",
      "Incident Date",
      "Severity",
      "Status",
      "Description",
      "Action Taken",
      "Reported By",
      "Reporter Role",
    ];

    const incidentRows = data.incidents.map((inc) => [
      "DISCIPLINARY_INCIDENT",
      `"${inc.id}"`,
      `"${inc.studentName.replace(/"/g, '""')}"`,
      `"${inc.admissionNumber}"`,
      `"${inc.incidentDate.split("T")[0]}"`,
      `"${inc.severity}"`,
      `"${inc.status}"`,
      `"${inc.description.replace(/"/g, '""')}"`,
      `"${(inc.actionTaken || "").replace(/"/g, '""')}"`,
      `"${inc.reporterName.replace(/"/g, '""')}"`,
      `"${inc.reporterRole.replace(/"/g, '""')}"`,
    ]);

    // Build Audit Logs CSV
    const auditHeaders = [
      "Record Type",
      "Log ID",
      "Action",
      "Entity Name",
      "User / Operator",
      "User Email",
      "IP Address",
      "Timestamp",
    ];

    const auditRows = data.auditLogs.map((log) => [
      "AUDIT_LOG",
      `"${log.id}"`,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.entityName.replace(/"/g, '""')}"`,
      `"${log.userName.replace(/"/g, '""')}"`,
      `"${log.userEmail}"`,
      `"${log.ipAddress || "N/A"}"`,
      `"${log.createdAt}"`,
    ]);

    // Combine into full report CSV
    const csvContent = [
      `"COMPLIANCE & AUDIT REPORT - GENERATED ON ${today}"`,
      `"Overall Compliance Score: ${data.summary.overallComplianceScore}%"`,
      `"Total Disciplinary Incidents: ${data.summary.totalIncidents} (Open: ${data.summary.openIncidents}, Resolved: ${data.summary.resolvedIncidents})"`,
      `"Total System Audit Logs: ${data.summary.totalAuditLogs}"`,
      "",
      "--- DISCIPLINARY INCIDENTS ---",
      incidentHeaders.join(","),
      ...incidentRows.map((r) => r.join(",")),
      "",
      "--- SYSTEM AUDIT TRAIL ---",
      auditHeaders.join(","),
      ...auditRows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `compliance_report_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "SEVERE":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "MODERATE":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "MINOR":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "RESOLVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "OPEN":
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getActionBadgeClass = (action: string) => {
    const upper = action.toUpperCase();
    if (upper.includes("DELETE") || upper.includes("REMOVE") || upper.includes("FAIL")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (upper.includes("CREATE") || upper.includes("INSERT") || upper.includes("REGISTER")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (upper.includes("UPDATE") || upper.includes("EDIT") || upper.includes("MODIFY")) {
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
    if (upper.includes("LOGIN") || upper.includes("AUTH")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary-100 text-primary-900 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">Compliance & Regulatory Safety</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                Audit trails, student disciplinary metrics, safety protocols, and statutory oversight.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Export Data */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportData}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm active:scale-[0.98] w-full sm:w-auto"
            title="Export full compliance & audit data as CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Overall Compliance Score */}
        <div className="bg-white/80 backdrop-blur-xl border border-emerald-200/70 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Regulatory Health
            </span>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.overallComplianceScore}%
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Meets Institutional Standards</span>
          </div>
        </div>

        {/* Disciplinary Incidents */}
        <div className="bg-white/80 backdrop-blur-xl border border-indigo-200/70 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Student Cases
            </span>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.totalIncidents}
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>{data.summary.openIncidents} Open</span>
            <span className="text-emerald-600 font-bold">{data.summary.resolutionRate}% Resolved</span>
          </div>
        </div>

        {/* Pending Actions / High Severity */}
        <div className="bg-white/80 backdrop-blur-xl border border-amber-200/70 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Action Required
            </span>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.openIncidents}
          </div>
          <p className="text-xs font-bold text-amber-600">
            {data.summary.severeSeverityCount} Severe cases recorded
          </p>
        </div>

        {/* Audit Log Activity */}
        <div className="bg-white/80 backdrop-blur-xl border border-blue-200/70 p-5 rounded-2xl shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              System Audit
            </span>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">
            {data.summary.totalAuditLogs}
          </div>
          <p className="text-xs font-bold text-blue-600">
            {data.summary.uniqueActiveUsers} Unique active operators
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "overview"
              ? "bg-primary-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Executive Overview
        </button>
        <button
          onClick={() => setActiveTab("disciplinary")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "disciplinary"
              ? "bg-primary-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Disciplinary Incidents ({data.incidents.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "audit"
              ? "bg-primary-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          System Audit Trail ({data.auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("regulatory")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "regulatory"
              ? "bg-primary-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          Statutory Standards
        </button>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Severity Distribution */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Incident Severity Breakdown
              </h3>
              {data.summary.totalIncidents === 0 ? (
                <div className="py-8 text-center text-xs font-semibold text-slate-400">
                  No disciplinary incidents recorded.
                </div>
              ) : (
                <div className="space-y-4">
                  {data.severityDistribution.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-bold text-slate-700">{item.severity} Severity</span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium">{item.count} cases</span>
                          <span className="font-black text-slate-800">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.severity === "Severe"
                              ? "bg-rose-500"
                              : item.severity === "Moderate"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Audited Entities */}
            <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                Audit Logs By Module
              </h3>
              {data.topAuditEntities.length === 0 ? (
                <div className="py-8 text-center text-xs font-semibold text-slate-400">
                  No audit log entity statistics found.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.topAuditEntities.map((ent, i) => {
                    const maxCount = Math.max(...data.topAuditEntities.map((e) => e.count), 1);
                    const pct = Math.round((ent.count / maxCount) * 100);
                    return (
                      <div key={i} className="flex items-center justify-between">
                        <div className="w-32 truncate text-xs font-bold text-slate-700">
                          {ent.entity}
                        </div>
                        <div className="flex-1 mx-3 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-800 w-12 text-right">
                          {ent.count} ops
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Compliance Health Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-primary-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md">
                    Audit Status: Active
                  </span>
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h4 className="text-base font-black mb-1">Security & Policy Verification</h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  All logged security policies, session tokens, and operational incident logs are actively
                  synced with the school management compliance ledger.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-left">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Security Policies</div>
                  <div className="text-lg font-black text-white">{data.summary.securityPoliciesCount} Enforced</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Resolution SLA</div>
                  <div className="text-lg font-black text-emerald-400">{data.summary.resolutionRate}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Disciplinary Snapshot Table */}
          <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Recent Disciplinary Cases
                </h3>
              </div>
              <button
                onClick={() => setActiveTab("disciplinary")}
                className="text-xs font-bold text-primary-700 hover:text-primary-900 transition-colors"
              >
                View All Cases &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white">
                    <th className="py-3 px-5">Student</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Severity</th>
                    <th className="py-3 px-5">Description</th>
                    <th className="py-3 px-5">Reported By</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {data.incidents.slice(0, 5).map((inc) => (
                    <tr key={inc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-5 font-bold text-slate-800">
                        <div>{inc.studentName}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{inc.admissionNumber}</div>
                      </td>
                      <td className="py-3 px-5 text-slate-600">
                        {inc.incidentDate.split("T")[0]}
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getSeverityBadgeClass(
                            inc.severity
                          )}`}
                        >
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-slate-700 max-w-xs truncate" title={inc.description}>
                        {inc.description}
                      </td>
                      <td className="py-3 px-5 text-slate-600">
                        <div className="font-semibold">{inc.reporterName}</div>
                        <div className="text-[10px] text-slate-400">{inc.reporterRole}</div>
                      </td>
                      <td className="py-3 px-5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getStatusBadgeClass(
                            inc.status
                          )}`}
                        >
                          {inc.status === "RESOLVED" ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="p-1 text-slate-400 hover:text-primary-700 rounded transition-colors"
                          title="View Case Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {data.incidents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                        No disciplinary incidents recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCIPLINARY & SAFETY CASES */}
      {activeTab === "disciplinary" && (
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by student, ID, reporter, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500 uppercase">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="OPEN">Open Only</option>
                  <option value="RESOLVED">Resolved Only</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Severities</option>
                  <option value="MINOR">Minor</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>

              {(searchTerm || statusFilter !== "ALL" || severityFilter !== "ALL") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setSeverityFilter("ALL");
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 px-2 py-1 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Incidents Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Case ID & Student</th>
                  <th className="py-3.5 px-5">Incident Date</th>
                  <th className="py-3.5 px-5">Severity</th>
                  <th className="py-3.5 px-5">Description</th>
                  <th className="py-3.5 px-5">Reported By</th>
                  <th className="py-3.5 px-5">Action Taken</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-800 text-sm">{incident.studentName}</div>
                      <div className="text-[11px] font-medium text-slate-400">
                        Adm: {incident.admissionNumber} • ID: {incident.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">
                      {incident.incidentDate.split("T")[0]}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${getSeverityBadgeClass(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-700 max-w-xs truncate" title={incident.description}>
                      {incident.description}
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      <div className="font-semibold text-slate-800">{incident.reporterName}</div>
                      <div className="text-[10px] text-slate-400">{incident.reporterRole}</div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 max-w-xs truncate">
                      {incident.actionTaken ? (
                        <span className="text-slate-700 font-medium">{incident.actionTaken}</span>
                      ) : (
                        <span className="text-slate-400 italic">Pending formal action</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${getStatusBadgeClass(
                          incident.status
                        )}`}
                      >
                        {incident.status === "RESOLVED" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="p-1.5 text-slate-400 hover:text-primary-700 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
                        title="View Full Case"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                      No disciplinary incidents match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM AUDIT TRAIL */}
      {activeTab === "audit" && (
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit logs by action, entity, user, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900 font-medium"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              Showing {filteredAuditLogs.length} of {data.summary.totalAuditLogs} total logged events
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-100 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-5">Action</th>
                  <th className="py-3.5 px-5">Entity Name</th>
                  <th className="py-3.5 px-5">Operator / User</th>
                  <th className="py-3.5 px-5">IP Address</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 text-slate-600 font-mono text-[11px]">
                      <div className="font-bold text-slate-800">
                        {log.createdAt.split("T")[0]}
                      </div>
                      <div className="text-slate-400">
                        {log.createdAt.split("T")[1]?.slice(0, 8) || ""}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase border ${getActionBadgeClass(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-slate-700">
                      {log.entityName}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-800">{log.userName}</div>
                      <div className="text-[11px] text-slate-400">{log.userEmail}</div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {log.ipAddress || "Internal / System"}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Logged
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedAuditLog(log)}
                        className="p-1.5 text-slate-400 hover:text-primary-700 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
                        title="View Full Audit Log"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAuditLogs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No audit log events match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: STATUTORY STANDARDS & INSPECTION LOGS */}
      {activeTab === "regulatory" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  Statutory & Ministry Compliance Checklist
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Verified against Ministry of Education, Fire & Safety, and Data Protection guidelines.
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                All Mandates Verified
              </div>
            </div>

            <div className="space-y-4">
              {data.regulatoryChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {check.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-800">{check.title}</h4>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Regulating Authority: <span className="font-semibold text-slate-700">{check.authority}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right text-[11px] text-slate-500">
                      <div className="font-medium">Last Inspection:</div>
                      <div className="font-bold text-slate-700">{check.lastChecked}</div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black uppercase border ${
                        check.status === "Compliant"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}
                    >
                      {check.status === "Compliant" ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {check.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISCIPLINARY INCIDENT DETAILS */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Disciplinary Case Dossier</h3>
                  <p className="text-xs text-slate-400">Case ID: {selectedIncident.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase text-[10px] mb-0.5">Student</div>
                <div className="font-bold text-slate-800 text-sm">{selectedIncident.studentName}</div>
                <div className="text-slate-500 mt-0.5">Adm No: {selectedIncident.admissionNumber}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase text-[10px] mb-0.5">Reported By</div>
                <div className="font-bold text-slate-800 text-sm">{selectedIncident.reporterName}</div>
                <div className="text-slate-500 mt-0.5">{selectedIncident.reporterRole}</div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase text-[10px] mb-0.5">Severity</div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase border mt-1 ${getSeverityBadgeClass(
                    selectedIncident.severity
                  )}`}
                >
                  {selectedIncident.severity}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-slate-400 font-bold uppercase text-[10px] mb-0.5">Current Status</div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase border mt-1 ${getStatusBadgeClass(
                    selectedIncident.status
                  )}`}
                >
                  {selectedIncident.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Incident Description
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed font-medium">
                  {selectedIncident.description}
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                  Corrective Action / Resolution
                </h4>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-800 leading-relaxed font-medium">
                  {selectedIncident.actionTaken || "No corrective action recorded yet. Case is pending review."}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedIncident(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT LOG DETAILS */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Audit Trail Entry</h3>
                  <p className="text-xs text-slate-400">Log ID: {selectedAuditLog.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Action Executed</div>
                  <div className="font-black text-slate-800 text-sm mt-0.5">{selectedAuditLog.action}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Target Entity</div>
                  <div className="font-black text-slate-800 text-sm mt-0.5">{selectedAuditLog.entityName}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Operator / User</div>
                <div className="font-bold text-slate-800">{selectedAuditLog.userName}</div>
                <div className="text-slate-500 font-mono text-[11px]">{selectedAuditLog.userEmail}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">IP Address</div>
                  <div className="font-mono text-slate-800 text-xs mt-0.5">
                    {selectedAuditLog.ipAddress || "Internal"}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Timestamp</div>
                  <div className="font-mono text-slate-800 text-xs mt-0.5">
                    {selectedAuditLog.createdAt.replace("T", " ").slice(0, 19)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
