"use client";

import React, { useState, useMemo } from "react";
import {
  PieChart,
  Download,
  Filter,
  Target,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Building2,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Info,
} from "lucide-react";
import { BudgetsReportData, DepartmentBudgetItem } from "./actions";

interface BudgetsClientProps {
  initialData: BudgetsReportData;
}

export default function BudgetsClient({ initialData }: BudgetsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBudgetFilter, setSelectedBudgetFilter] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"departments" | "scenarios" | "approvals" | "expenses">("departments");
  const [sortField, setSortField] = useState<keyof DepartmentBudgetItem>("variance");
  const [sortAsc, setSortAsc] = useState(false);
  const [copied, setCopied] = useState(false);

  // Formatting helpers
  const formatCurrency = (val: number) => {
    return `KSh ${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatMillions = (val: number) => {
    const inMillions = val / 1_000_000;
    return `KSh ${inMillions.toFixed(2)}M`;
  };

  // Filtered & Sorted Departments
  const filteredDepartments = useMemo(() => {
    return initialData.departments
      .filter((dept) => {
        const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "OVER" && dept.status === "Over Budget") ||
          (statusFilter === "UNDER" && dept.status === "Under Budget") ||
          (statusFilter === "ON_TRACK" && dept.status === "On Track");
        const matchesBudget =
          selectedBudgetFilter === "ALL" || dept.budgetId === selectedBudgetFilter;

        return matchesSearch && matchesStatus && matchesBudget;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === "number" && typeof valB === "number") {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [initialData.departments, searchTerm, statusFilter, selectedBudgetFilter, sortField, sortAsc]);

  // Totals for filtered view
  const currentTotalBudget = useMemo(
    () => filteredDepartments.reduce((acc, curr) => acc + curr.budget, 0),
    [filteredDepartments]
  );
  const currentTotalActual = useMemo(
    () => filteredDepartments.reduce((acc, curr) => acc + curr.actual, 0),
    [filteredDepartments]
  );
  const currentTotalVarianceAmount = currentTotalActual - currentTotalBudget;
  const currentTotalVariancePercent =
    currentTotalBudget > 0 ? (currentTotalVarianceAmount / currentTotalBudget) * 100 : 0;

  // Sorting handler
  const handleSort = (field: keyof DepartmentBudgetItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Department", "Budget Allocated (KSh)", "Actual Spend (KSh)", "Variance (KSh)", "Variance (%)", "Status", "Utilization (%)", "Budget Name"];
    const rows = filteredDepartments.map((d) => [
      `"${d.name.replace(/"/g, '""')}"`,
      d.budget,
      d.actual,
      d.varianceAmount,
      `${d.variance}%`,
      `"${d.status}"`,
      `${d.utilization}%`,
      `"${(d.budgetName || "Annual Budget").replace(/"/g, '""')}"`,
    ]);

    // Add summary row
    rows.push([]);
    rows.push([
      `"TOTAL / SUMMARY"`,
      currentTotalBudget,
      currentTotalActual,
      currentTotalVarianceAmount,
      `${currentTotalVariancePercent.toFixed(1)}%`,
      `"${currentTotalVarianceAmount > 0 ? "Overall Over Budget" : "Overall Under Budget"}"`,
      `${currentTotalBudget > 0 ? ((currentTotalActual / currentTotalBudget) * 100).toFixed(1) : "0"}%`,
      `""`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `budget_variance_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export / Print PDF
  const handlePrint = () => {
    window.print();
  };

  // Copy Executive Summary
  const handleCopySummary = () => {
    const summaryText = `--- FINANCIAL BUDGET VARIANCE REPORT ---
Total Allocated Budget: ${formatCurrency(initialData.summary.totalBudget)}
Total Actual Spend: ${formatCurrency(initialData.summary.totalActual)}
Net Variance: ${initialData.summary.totalVarianceAmount >= 0 ? "+" : ""}${formatCurrency(initialData.summary.totalVarianceAmount)} (${initialData.summary.totalVariancePercent}%)
Status: ${initialData.summary.totalVarianceAmount > 0 ? "Over Budget" : "Under Budget"}
Departments: ${initialData.departments.length} total (${initialData.summary.overBudgetCount} Over Budget, ${initialData.summary.underBudgetCount} Under Budget, ${initialData.summary.onTrackCount} On Track)
Scenarios Active: ${initialData.scenarios.length}
Pending Approvals: ${initialData.summary.pendingApprovalsCount}
Generated on: ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-8 print:p-0 print:space-y-4">
      {/* Header and Action Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-6 print:border-none">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-900 text-white flex items-center justify-center font-black">
              <PieChart className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Budget vs Actuals Analysis</h2>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time variance tracking, departmental expense utilization, and scenario modeling.
          </p>
        </div>

        {/* Global Export & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto print:hidden">
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
            title="Copy Executive Summary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy Summary"}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" /> Print / PDF
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-xs hover:bg-primary-800 transition-all shadow-md shadow-primary-900/10"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Budget Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Allocated Budget</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              FY 2026
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight mb-1" title={formatCurrency(initialData.summary.totalBudget)}>
            {formatMillions(initialData.summary.totalBudget)}
          </div>
          <p className="text-xs font-semibold text-slate-400">
            {initialData.departments.length} Departmental Budgets
          </p>
        </div>

        {/* Total Spend Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">Actual Spend (YTD)</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {initialData.summary.totalBudget > 0
                ? `${((initialData.summary.totalActual / initialData.summary.totalBudget) * 100).toFixed(1)}%`
                : "0%"}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight mb-1" title={formatCurrency(initialData.summary.totalActual)}>
            {formatMillions(initialData.summary.totalActual)}
          </div>
          <p className="text-xs font-semibold text-slate-400">
            Recorded Ledger Disbursements
          </p>
        </div>

        {/* Global Variance Card */}
        <div
          className={`bg-white/90 backdrop-blur-xl border p-5 rounded-2xl shadow-sm hover:shadow-md transition-all ${
            initialData.summary.totalVarianceAmount > 0
              ? "border-rose-200/80 bg-rose-50/20"
              : "border-emerald-200/80 bg-emerald-50/20"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  initialData.summary.totalVarianceAmount > 0
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {initialData.summary.totalVarianceAmount > 0 ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <TrendingUp className="w-4 h-4" />
                )}
              </div>
              <h3
                className={`text-[11px] font-black uppercase tracking-wider ${
                  initialData.summary.totalVarianceAmount > 0 ? "text-rose-700" : "text-emerald-700"
                }`}
              >
                Net Variance
              </h3>
            </div>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                initialData.summary.totalVarianceAmount > 0
                  ? "bg-rose-100 text-rose-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {initialData.summary.totalVarianceAmount > 0 ? "Over Budget" : "Under Budget"}
            </span>
          </div>
          <div
            className={`text-2xl font-black tracking-tight mb-1 ${
              initialData.summary.totalVarianceAmount > 0 ? "text-rose-700" : "text-emerald-700"
            }`}
          >
            {initialData.summary.totalVariancePercent > 0 ? "+" : ""}
            {initialData.summary.totalVariancePercent}%
          </div>
          <p
            className={`text-xs font-bold ${
              initialData.summary.totalVarianceAmount > 0 ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {initialData.summary.totalVarianceAmount > 0 ? "+" : ""}
            {formatMillions(initialData.summary.totalVarianceAmount)} Net Difference
          </p>
        </div>

        {/* Approvals & Scenarios Status Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                Governance & Scenarios
              </h3>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">
            {initialData.scenarios.length}{" "}
            <span className="text-xs font-semibold text-slate-400">Scenarios</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold mt-1">
            <span className="text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {initialData.summary.pendingApprovalsCount} Pending
            </span>
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {initialData.approvals.filter((a) => a.status === "APPROVED").length} Approved
            </span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 bg-slate-50/50 p-2 rounded-2xl print:hidden">
        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 py-2 px-4 text-sm font-bold rounded-xl transition-all ${
            activeTab === "departments"
              ? "bg-white text-primary-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Building2 className="w-4 h-4" /> Department Variance ({initialData.departments.length})
        </button>

        <button
          onClick={() => setActiveTab("scenarios")}
          className={`flex items-center gap-2 py-2 px-4 text-sm font-bold rounded-xl transition-all ${
            activeTab === "scenarios"
              ? "bg-white text-primary-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="w-4 h-4" /> Scenarios & Sensitivity ({initialData.scenarios.length})
        </button>

        <button
          onClick={() => setActiveTab("approvals")}
          className={`flex items-center gap-2 py-2 px-4 text-sm font-bold rounded-xl transition-all ${
            activeTab === "approvals"
              ? "bg-white text-primary-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Approvals Audit ({initialData.approvals.length})
        </button>

        {initialData.expenseCategories.length > 0 && (
          <button
            onClick={() => setActiveTab("expenses")}
            className={`flex items-center gap-2 py-2 px-4 text-sm font-bold rounded-xl transition-all ${
              activeTab === "expenses"
                ? "bg-white text-primary-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <PieChart className="w-4 h-4" /> Ledger Expense Mapping
          </button>
        )}
      </div>

      {/* TAB 1: Department Breakdown */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm print:hidden">
            <div className="flex flex-1 items-center gap-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search department by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-900"
              >
                <option value="ALL">All Statuses</option>
                <option value="OVER">Over Budget</option>
                <option value="ON_TRACK">On Track</option>
                <option value="UNDER">Under Budget</option>
              </select>

              {initialData.budgetsList.length > 1 && (
                <select
                  value={selectedBudgetFilter}
                  onChange={(e) => setSelectedBudgetFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="ALL">All Budgets</option>
                  {initialData.budgetsList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Departmental Allocations & Variance Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredDepartments.length} of {initialData.departments.length} departments
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80">
                    <th
                      onClick={() => handleSort("name")}
                      className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider cursor-pointer hover:text-primary-900 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        Department
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("budget")}
                      className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right cursor-pointer hover:text-primary-900 select-none"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        Budget (KSh)
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("actual")}
                      className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right cursor-pointer hover:text-primary-900 select-none"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        Actual Spend (KSh)
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("variance")}
                      className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right cursor-pointer hover:text-primary-900 select-none"
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        Variance (%)
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th
                      onClick={() => handleSort("utilization")}
                      className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider cursor-pointer hover:text-primary-900 select-none"
                    >
                      <div className="flex items-center gap-1.5">
                        Utilization
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDepartments.length > 0 ? (
                    filteredDepartments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-slate-800">{dept.name}</div>
                          {dept.budgetName && (
                            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">
                              {dept.budgetName}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">
                          {formatCurrency(dept.budget)}
                        </td>
                        <td className="py-4 px-6 text-sm font-black text-slate-800 text-right">
                          {formatCurrency(dept.actual)}
                        </td>
                        <td className="py-4 px-6 text-sm font-black text-right">
                          <div
                            className={
                              dept.variance > 0
                                ? "text-rose-600 flex items-center justify-end gap-1"
                                : dept.variance < 0
                                ? "text-emerald-600 flex items-center justify-end gap-1"
                                : "text-slate-600"
                            }
                          >
                            {dept.variance > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : null}
                            {dept.variance < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                            {dept.variance > 0 ? "+" : ""}
                            {dept.variance}%
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {dept.varianceAmount > 0 ? "+" : ""}
                            {formatCurrency(dept.varianceAmount)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                              dept.status === "Over Budget"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : dept.status === "Under Budget"
                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                : "bg-amber-100 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {dept.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 w-52">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-slate-600">
                              <span>{dept.utilization}%</span>
                              <span className="text-slate-400">
                                {dept.utilization > 100 ? "Over Limit" : "Allocated"}
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  dept.status === "Over Budget"
                                    ? "bg-rose-500"
                                    : dept.status === "Under Budget"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                                style={{ width: `${Math.min(dept.utilization, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-bold">No departments match your filter criteria.</p>
                        <p className="text-xs text-slate-400 mt-1">Try changing your search term or status filter.</p>
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Table Footer with Summary */}
                {filteredDepartments.length > 0 && (
                  <tfoot className="bg-slate-50 font-black text-sm text-slate-800 border-t-2 border-slate-200">
                    <tr>
                      <td className="py-4 px-6">Total / Global Summary</td>
                      <td className="py-4 px-6 text-right font-black">
                        {formatCurrency(currentTotalBudget)}
                      </td>
                      <td className="py-4 px-6 text-right font-black">
                        {formatCurrency(currentTotalActual)}
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-black ${
                          currentTotalVarianceAmount > 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {currentTotalVariancePercent > 0 ? "+" : ""}
                        {currentTotalVariancePercent.toFixed(1)}%
                        <div className="text-[10px] font-normal text-slate-400">
                          {currentTotalVarianceAmount > 0 ? "+" : ""}
                          {formatCurrency(currentTotalVarianceAmount)}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                            currentTotalVarianceAmount > 0
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {currentTotalVarianceAmount > 0 ? "Over Budget" : "Under Budget"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-slate-600">
                          {currentTotalBudget > 0
                            ? ((currentTotalActual / currentTotalBudget) * 100).toFixed(1)
                            : 0}
                          % Utilized
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Scenarios & Sensitivity Analysis */}
      {activeTab === "scenarios" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Budget Scenarios & Stress Tests</h3>
                <p className="text-xs text-slate-500">
                  Evaluate fiscal variations and adjusted projections compared against baseline approved allocations.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initialData.scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                      Scenario Simulation
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(scenario.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-slate-800 mb-1">{scenario.name}</h4>
                  <p className="text-xs text-slate-500 mb-6">{scenario.description}</p>

                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Base Allocation
                      </p>
                      <p className="text-lg font-black text-slate-700">
                        {formatCurrency(scenario.baseAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                        Adjusted Projection
                      </p>
                      <p
                        className={`text-lg font-black ${
                          scenario.varianceAmount > 0 ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        {formatCurrency(scenario.adjustedAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="text-xs font-semibold text-slate-500">
                    Expected Variance:
                  </div>
                  <div
                    className={`text-sm font-black ${
                      scenario.variancePercent > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {scenario.variancePercent > 0 ? "+" : ""}
                    {scenario.variancePercent}% ({scenario.varianceAmount > 0 ? "+" : ""}
                    {formatCurrency(scenario.varianceAmount)})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Approvals Audit Trail */}
      {activeTab === "approvals" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Budget Approvals & Authorization Trail</h3>
                <p className="text-xs text-slate-500">
                  Governance records of budget sign-offs, reallocations, and supplemental approval workflows.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80">
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider">
                      Budget & Request
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider">
                      Notes & Remarks
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialData.approvals.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-sm text-slate-800">
                        {app.budgetName}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-700">
                        {app.requestedBy}
                      </td>
                      <td className="py-4 px-6 text-sm font-medium text-slate-500">
                        {app.notes}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${
                            app.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : app.status === "REJECTED"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {app.status === "APPROVED" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : app.status === "REJECTED" ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs font-semibold text-slate-400 text-right">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Ledger Expense Mapping (if journal lines available) */}
      {activeTab === "expenses" && initialData.expenseCategories.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-800 mb-1">
              General Ledger Expense Account Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated debit and credit entries from posted journal transactions mapped against budget categories.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80">
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider">
                      Account Code & Name
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right">
                      Total Debits (KSh)
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right">
                      Total Credits (KSh)
                    </th>
                    <th className="py-3.5 px-6 text-xs font-black text-slate-600 uppercase tracking-wider text-right">
                      Net Expense (KSh)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialData.expenseCategories.map((ec) => (
                    <tr key={ec.accountCode} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-sm text-slate-800">
                        <span className="text-xs text-primary-700 mr-2 font-mono bg-primary-50 px-2 py-0.5 rounded">
                          {ec.accountCode}
                        </span>
                        {ec.accountName}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">
                        {formatCurrency(ec.totalDebit)}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">
                        {formatCurrency(ec.totalCredit)}
                      </td>
                      <td className="py-4 px-6 text-sm font-black text-slate-800 text-right">
                        {formatCurrency(ec.netExpense)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
