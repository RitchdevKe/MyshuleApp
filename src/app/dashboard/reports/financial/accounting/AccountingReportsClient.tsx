"use client";

import React, { useState, useMemo } from "react";
import {
  Calculator,
  Download,
  Filter,
  FileText,
  Search,
  Printer,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart3,
  Layers,
  Scale,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import type {
  AccountingReportData,
  AccountTypeCategory,
  LedgerEntryItem,
  ChartOfAccountItem,
} from "./actions";

interface AccountingReportsClientProps {
  initialData: AccountingReportData;
}

export default function AccountingReportsClient({ initialData }: AccountingReportsClientProps) {
  const [data, setData] = useState<AccountingReportData>(initialData);
  const [activeTab, setActiveTab] = useState<"ledger" | "chart" | "analytics" | "trial">("ledger");

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(val)
      .replace("KES", "KSh");
  };

  const formatCompactNumber = (val: number) => {
    if (Math.abs(val) >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(val) >= 1_000) {
      return `${(val / 1_000).toFixed(0)}K`;
    }
    return val.toLocaleString();
  };

  // Filtered Ledger entries
  const filteredEntries = useMemo(() => {
    return data.ledgerEntries.filter((entry) => {
      const matchesSearch =
        searchTerm === "" ||
        entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.accountCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === "ALL" || entry.accountType === selectedType;
      const matchesStatus = selectedStatus === "ALL" || entry.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data.ledgerEntries, searchTerm, selectedType, selectedStatus]);

  // Filtered Chart of Accounts
  const filteredAccounts = useMemo(() => {
    return data.chartOfAccounts.filter((acc) => {
      const matchesSearch =
        searchTerm === "" ||
        acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (acc.description && acc.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === "ALL" || acc.accountType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [data.chartOfAccounts, searchTerm, selectedType]);

  // Sums for current filtered ledger view
  const filteredTotalDebit = useMemo(() => {
    return filteredEntries.reduce((sum, item) => sum + item.debit, 0);
  }, [filteredEntries]);

  const filteredTotalCredit = useMemo(() => {
    return filteredEntries.reduce((sum, item) => sum + item.credit, 0);
  }, [filteredEntries]);

  // Export Ledger to CSV
  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Reference",
      "Account Code",
      "Account Name",
      "Account Type",
      "Description",
      "Debit (KES)",
      "Credit (KES)",
      "Status",
    ];

    const rows = filteredEntries.map((e) => [
      `"${e.date}"`,
      `"${e.ref}"`,
      `"${e.accountCode}"`,
      `"${e.accountName.replace(/"/g, '""')}"`,
      `"${e.accountType}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      e.debit,
      e.credit,
      `"${e.status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `General_Ledger_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`Exported ${filteredEntries.length} ledger entries to CSV.`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Print Ledger Function
  const handlePrint = () => {
    window.print();
  };

  const accountTypeBadges: Record<AccountTypeCategory, { bg: string; text: string }> = {
    ASSET: { bg: "bg-emerald-100", text: "text-emerald-700" },
    LIABILITY: { bg: "bg-amber-100", text: "text-amber-700" },
    EQUITY: { bg: "bg-purple-100", text: "text-purple-700" },
    REVENUE: { bg: "bg-blue-100", text: "text-blue-700" },
    EXPENSE: { bg: "bg-rose-100", text: "text-rose-700" },
  };

  return (
    <div className="p-6 space-y-8">
      {/* Toast Notification */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold">{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">General Accounting & Ledger</h2>
            {data.summary.isBalanced ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Balanced
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Variance: {formatCurrency(data.summary.difference)}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Double-entry journal records, automated category aggregation, and real-time trial balance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border shadow-sm ${
              showFilters
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters {selectedType !== "ALL" || selectedStatus !== "ALL" ? "(Active)" : ""}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
            title="Print General Ledger"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-md shadow-primary-900/10"
          >
            <Download className="w-4 h-4" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Quick Filter Drawer / Bar */}
      {showFilters && (
        <div className="bg-slate-50/80 border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Search Ledger</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search description, reference, account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary-700"
              />
            </div>
          </div>

          <div className="w-44">
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Account Category</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-700"
            >
              <option value="ALL">All Categories</option>
              <option value="ASSET">Assets</option>
              <option value="LIABILITY">Liabilities</option>
              <option value="EQUITY">Equity</option>
              <option value="REVENUE">Revenue</option>
              <option value="EXPENSE">Expenses</option>
            </select>
          </div>

          <div className="w-40">
            <label className="block text-[11px] font-black uppercase text-slate-500 mb-1">Entry Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="POSTED">Posted</option>
              <option value="DRAFT">Draft</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end self-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedType("ALL");
                setSelectedStatus("ALL");
              }}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* 5-Category Key Financial KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Assets Card */}
        <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Assets</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Dr</span>
          </div>
          <div className="text-xl font-black text-emerald-950 truncate" title={formatCurrency(data.summary.totalAssets)}>
            {formatCurrency(data.summary.totalAssets)}
          </div>
          <p className="text-[11px] font-semibold text-emerald-700/80 mt-1">
            {data.typeSummaries.ASSET.accountCount} Accounts
          </p>
        </div>

        {/* Liabilities Card */}
        <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Liabilities</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Cr</span>
          </div>
          <div className="text-xl font-black text-amber-950 truncate" title={formatCurrency(data.summary.totalLiabilities)}>
            {formatCurrency(data.summary.totalLiabilities)}
          </div>
          <p className="text-[11px] font-semibold text-amber-700/80 mt-1">
            {data.typeSummaries.LIABILITY.accountCount} Accounts
          </p>
        </div>

        {/* Equity Card */}
        <div className="bg-purple-50/70 border border-purple-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Equity</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">Cr</span>
          </div>
          <div className="text-xl font-black text-purple-950 truncate" title={formatCurrency(data.summary.totalEquity)}>
            {formatCurrency(data.summary.totalEquity)}
          </div>
          <p className="text-[11px] font-semibold text-purple-700/80 mt-1">
            {data.typeSummaries.EQUITY.accountCount} Accounts
          </p>
        </div>

        {/* Revenue Card */}
        <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Revenue</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Cr</span>
          </div>
          <div className="text-xl font-black text-blue-950 truncate" title={formatCurrency(data.summary.totalRevenue)}>
            {formatCurrency(data.summary.totalRevenue)}
          </div>
          <p className="text-[11px] font-semibold text-blue-700/80 mt-1">
            {data.typeSummaries.REVENUE.accountCount} Accounts
          </p>
        </div>

        {/* Expenses Card */}
        <div className="bg-rose-50/70 border border-rose-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Expenses</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">Dr</span>
          </div>
          <div className="text-xl font-black text-rose-950 truncate" title={formatCurrency(data.summary.totalExpenses)}>
            {formatCurrency(data.summary.totalExpenses)}
          </div>
          <p className="text-[11px] font-semibold text-rose-700/80 mt-1">
            {data.typeSummaries.EXPENSE.accountCount} Accounts
          </p>
        </div>

        {/* Net Income / Operating Surplus */}
        <div className={`p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border ${
          data.summary.netIncome >= 0 ? "bg-indigo-50/80 border-indigo-100" : "bg-red-50/80 border-red-200"
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Net Surplus</span>
            {data.summary.netIncome >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            )}
          </div>
          <div
            className={`text-xl font-black truncate ${
              data.summary.netIncome >= 0 ? "text-indigo-950" : "text-rose-700"
            }`}
            title={formatCurrency(data.summary.netIncome)}
          >
            {formatCurrency(data.summary.netIncome)}
          </div>
          <p className="text-[11px] font-semibold text-indigo-700/80 mt-1">
            Rev vs Exp Margin
          </p>
        </div>
      </div>

      {/* Main Accounting Content Card */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200/60 bg-slate-50/50 px-6 pt-4 gap-6 overflow-x-auto">
          <button
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "ledger"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("ledger")}
          >
            <FileText className="w-4 h-4" />
            Journal Entries & Ledger ({filteredEntries.length})
          </button>

          <button
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "chart"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("chart")}
          >
            <Layers className="w-4 h-4" />
            Chart of Accounts ({filteredAccounts.length})
          </button>

          <button
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="w-4 h-4" />
            Category Analytics & Visuals
          </button>

          <button
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === "trial"
                ? "border-primary-900 text-primary-900"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setActiveTab("trial")}
          >
            <Scale className="w-4 h-4" />
            Trial Balance
          </button>
        </div>

        {/* Tab 1: Journal Entries / General Ledger */}
        {activeTab === "ledger" && (
          <div className="p-0">
            <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xs font-bold text-slate-500">
                Showing {filteredEntries.length} of {data.ledgerEntries.length} recorded journal lines
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Ledger Status:</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  <CheckCircle2 className="w-3 h-3" /> Validated Double-Entry
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80">
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Ref</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Account & Code</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Debit (KSh)
                    </th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Credit (KSh)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-bold text-sm">No journal entries match your filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry) => {
                      const badge = accountTypeBadges[entry.accountType] || {
                        bg: "bg-slate-100",
                        text: "text-slate-700",
                      };
                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/90 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="font-bold text-sm text-slate-800">{entry.date}</div>
                            <div className="text-xs font-medium text-slate-400 font-mono mt-0.5">{entry.ref}</div>
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-bold text-sm text-slate-900 group-hover:text-primary-800 transition-colors">
                              {entry.accountName}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-mono font-bold text-slate-400">{entry.accountCode}</span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${badge.bg} ${badge.text}`}
                              >
                                {entry.accountType}
                              </span>
                            </div>
                          </td>

                          <td className="py-4 px-6 text-sm font-medium text-slate-600 max-w-xs">
                            {entry.description}
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                                entry.status === "POSTED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : entry.status === "DRAFT"
                                  ? "bg-slate-100 text-slate-600"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-sm font-bold text-slate-900 text-right">
                            {entry.debit > 0 ? entry.debit.toLocaleString("en-KE") : "-"}
                          </td>

                          <td className="py-4 px-6 text-sm font-bold text-slate-900 text-right">
                            {entry.credit > 0 ? entry.credit.toLocaleString("en-KE") : "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot className="bg-slate-50 font-black text-sm text-slate-900 border-t-2 border-slate-200">
                  <tr>
                    <td colSpan={4} className="py-4 px-6 text-right">
                      Total Filtered Ledger for Period:
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-800">
                      {filteredTotalDebit.toLocaleString("en-KE")}
                    </td>
                    <td className="py-4 px-6 text-right text-blue-800">
                      {filteredTotalCredit.toLocaleString("en-KE")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Chart of Accounts */}
        {activeTab === "chart" && (
          <div className="p-0">
            <div className="p-4 bg-slate-50/40 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="text-xs font-bold text-slate-500">
                Chart of Accounts directory ({filteredAccounts.length} accounts configured)
              </div>
              <div className="flex flex-wrap gap-2">
                {(["ALL", "ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                      selectedType === t
                        ? "bg-primary-900 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t === "ALL" ? "All" : t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80">
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Code</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Name & Description</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Total Debit
                    </th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Total Credit
                    </th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Current Net Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAccounts.map((acc) => {
                    const badge = accountTypeBadges[acc.accountType] || {
                      bg: "bg-slate-100",
                      text: "text-slate-700",
                    };
                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-sm text-primary-900">{acc.accountCode}</td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-sm text-slate-900">{acc.accountName}</div>
                          {acc.description && (
                            <div className="text-xs text-slate-500 mt-0.5">{acc.description}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md ${badge.bg} ${badge.text}`}
                          >
                            {acc.accountType}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">
                          {acc.totalDebit > 0 ? acc.totalDebit.toLocaleString("en-KE") : "-"}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">
                          {acc.totalCredit > 0 ? acc.totalCredit.toLocaleString("en-KE") : "-"}
                        </td>
                        <td className="py-4 px-6 text-sm font-black text-slate-900 text-right">
                          {formatCurrency(acc.balance)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Category Analytics & Visuals */}
        {activeTab === "analytics" && (
          <div className="p-6 space-y-8">
            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debit vs Credit Breakdown Bar Chart */}
              <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Debits vs Credits by Account Category
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Double-entry volume distribution across standard accounting groups
                    </p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-slate-400" />
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatCompactNumber(v)}
                      />
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(Number(val)), ""]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "12px",
                          color: "#fff",
                          border: "none",
                          fontWeight: "bold",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="debit" name="Total Debit (KSh)" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="credit" name="Total Credit (KSh)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Revenue vs Expense Trend */}
              <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Revenue vs Expense Trend
                    </h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Operating surplus timeline generated from journal transactions
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-slate-400" />
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => formatCompactNumber(v)}
                      />
                      <Tooltip
                        formatter={(val: any) => [formatCurrency(Number(val)), ""]}
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "12px",
                          color: "#fff",
                          border: "none",
                          fontWeight: "bold",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="net"
                        name="Net Surplus"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Category Breakdown Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50/60 border-b border-slate-200">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Aggregated Category Breakdown Summary
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Category</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Total Accounts</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Total Debits</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Total Credits</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase text-right">Net Group Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.typeSummaryList.map((item) => (
                      <tr key={item.type} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${item.badgeBg} ${item.badgeText}`}
                          >
                            {item.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 font-bold text-sm text-slate-700">{item.accountCount}</td>
                        <td className="py-3.5 px-6 font-semibold text-sm text-slate-800">
                          {formatCurrency(item.totalDebit)}
                        </td>
                        <td className="py-3.5 px-6 font-semibold text-sm text-slate-800">
                          {formatCurrency(item.totalCredit)}
                        </td>
                        <td className="py-3.5 px-6 font-black text-sm text-slate-900 text-right">
                          {formatCurrency(item.netBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Trial Balance */}
        {activeTab === "trial" && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-800">Standard Trial Balance Sheet</h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Verifies that all debit balances equal credit balances across the general ledger.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    data.summary.isBalanced
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {data.summary.isBalanced ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Books are Perfectly Balanced
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Discrepancy: {formatCurrency(data.summary.difference)}
                    </>
                  )}
                </div>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-primary-900 text-white rounded-xl text-xs font-bold hover:bg-primary-800 transition-colors"
                >
                  Print Trial Balance
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200">
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-600 uppercase">Code</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-600 uppercase">Account Title</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-600 uppercase">Category</th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-600 uppercase text-right">
                      Debit Balance (KSh)
                    </th>
                    <th className="py-3.5 px-6 text-xs font-bold text-slate-600 uppercase text-right">
                      Credit Balance (KSh)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.chartOfAccounts.map((acc) => {
                    const isDebitNormal = acc.accountType === "ASSET" || acc.accountType === "EXPENSE";
                    const debitAmount = isDebitNormal && acc.balance > 0 ? acc.balance : 0;
                    const creditAmount = !isDebitNormal && acc.balance > 0 ? acc.balance : 0;

                    const badge = accountTypeBadges[acc.accountType] || {
                      bg: "bg-slate-100",
                      text: "text-slate-700",
                    };

                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-6 font-mono font-bold text-xs text-slate-500">{acc.accountCode}</td>
                        <td className="py-3 px-6 font-bold text-sm text-slate-800">{acc.accountName}</td>
                        <td className="py-3 px-6">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 text-[9px] font-black uppercase rounded ${badge.bg} ${badge.text}`}
                          >
                            {acc.accountType}
                          </span>
                        </td>
                        <td className="py-3 px-6 font-bold text-sm text-slate-900 text-right">
                          {debitAmount > 0 ? debitAmount.toLocaleString("en-KE") : "-"}
                        </td>
                        <td className="py-3 px-6 font-bold text-sm text-slate-900 text-right">
                          {creditAmount > 0 ? creditAmount.toLocaleString("en-KE") : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100 font-black text-sm text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={3} className="py-4 px-6 text-right uppercase tracking-wider">
                      Trial Balance Totals:
                    </td>
                    <td className="py-4 px-6 text-right text-emerald-800">
                      {data.summary.totalDebits.toLocaleString("en-KE")}
                    </td>
                    <td className="py-4 px-6 text-right text-blue-800">
                      {data.summary.totalCredits.toLocaleString("en-KE")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
