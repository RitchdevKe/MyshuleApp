"use client";

import React, { useState, useTransition } from "react";
import {
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Download,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Calendar,
  FileSpreadsheet,
  Printer,
  Search,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Layers,
  ChevronDown,
  Receipt,
  Building2,
  Wallet
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import {
  CashflowReportData,
  FilterOptions,
  getCashflowReportData
} from "./actions";

interface CashflowClientProps {
  initialData: CashflowReportData;
  filterOptions: FilterOptions;
}

export default function CashflowClient({
  initialData,
  filterOptions,
}: CashflowClientProps) {
  const [data, setData] = useState<CashflowReportData>(initialData);
  const [selectedYear, setSelectedYear] = useState<number>(initialData.selectedYear);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(initialData.selectedPeriod);
  const [chartType, setChartType] = useState<"area" | "bar" | "net" | "cumulative">("area");
  const [activeTab, setActiveTab] = useState<"overview" | "monthly" | "categories" | "transactions">("overview");
  const [txSearch, setTxSearch] = useState<string>("");
  const [txTypeFilter, setTxTypeFilter] = useState<"ALL" | "INFLOW" | "OUTFLOW">("ALL");
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newYear: number, newPeriod: string) => {
    setSelectedYear(newYear);
    setSelectedPeriod(newPeriod);
    startTransition(async () => {
      try {
        const updated = await getCashflowReportData({ year: newYear, period: newPeriod });
        setData(updated);
      } catch (err) {
        console.error("Failed to update cashflow data:", err);
      }
    });
  };

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const updated = await getCashflowReportData({ year: selectedYear, period: selectedPeriod });
        setData(updated);
      } catch (err) {
        console.error("Failed to refresh cashflow data:", err);
      }
    });
  };

  // Currency formatting helpers
  const formatKsh = (amount: number): string => {
    return `KSh ${amount.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatCompact = (amount: number): string => {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";
    if (abs >= 1_000_000) {
      return `${sign}KSh ${(abs / 1_000_000).toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}KSh ${(abs / 1_000).toFixed(0)}k`;
    }
    return `${sign}KSh ${abs.toLocaleString()}`;
  };

  // Export handlers
  const exportSummaryCSV = () => {
    const headers = ["Month", "Year", "Inflows (KES)", "Outflows (KES)", "Net Flow (KES)", "Cumulative Net (KES)", "Inflow Tx Count", "Outflow Tx Count"];
    const rows = data.monthlyTrends.map(m => [
      `"${m.monthFullName}"`,
      m.year,
      m.inflow.toFixed(2),
      m.outflow.toFixed(2),
      m.net.toFixed(2),
      m.cumulativeNet.toFixed(2),
      m.inflowCount,
      m.outflowCount
    ]);

    // Add summary row
    rows.push([]);
    rows.push([
      `"TOTAL / AVERAGE"`,
      data.selectedYear,
      data.summary.totalInflow.toFixed(2),
      data.summary.totalOutflow.toFixed(2),
      data.summary.netCashflow.toFixed(2),
      "",
      "",
      ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Cashflow_Statement_${data.selectedYear}_${data.selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const exportTransactionsCSV = () => {
    const headers = ["Date", "Type", "Category", "Description", "Reference", "Amount (KES)", "Payment Method"];
    const rows = data.recentTransactions.map(t => [
      `"${new Date(t.date).toLocaleDateString()}"`,
      `"${t.type}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.reference}"`,
      t.amount.toFixed(2),
      `"${t.paymentMethod || "N/A"}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Cashflow_Transactions_${data.selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    setShowExportMenu(false);
    window.print();
  };

  // Filtered transactions
  const filteredTransactions = data.recentTransactions.filter(tx => {
    const matchesType = txTypeFilter === "ALL" || tx.type === txTypeFilter;
    const matchesSearch =
      txSearch.trim() === "" ||
      tx.description.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.category.toLowerCase().includes(txSearch.toLowerCase()) ||
      tx.reference.toLowerCase().includes(txSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const { summary, monthlyTrends, inflowSources, outflowCategories } = data;

  return (
    <div className="p-6 space-y-8 print:p-0 print:space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-6 print:border-b-2 print:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cashflow Analytics</h2>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-2.5 py-0.5 rounded-full">
              Live DB Data
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Real-time operating cash inflows, disbursements, and liquidity tracking for FY {selectedYear}.
          </p>
        </div>

        {/* Filter Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto print:hidden">
          {/* Year selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedYear}
              onChange={(e) => handleFilterChange(Number(e.target.value), selectedPeriod)}
              className="bg-transparent text-xs font-black text-slate-700 focus:outline-none cursor-pointer"
            >
              {filterOptions.years.map((yr) => (
                <option key={yr} value={yr}>
                  Year {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => handleFilterChange(selectedYear, e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              {filterOptions.periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isPending}
            title="Refresh database records"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isPending ? "animate-spin text-primary-600" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-xs hover:bg-primary-800 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-1.5 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={exportSummaryCSV}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div>Export Monthly CSV</div>
                    <div className="text-[10px] font-normal text-slate-400">Statement summary data</div>
                  </div>
                </button>
                <button
                  onClick={exportTransactionsCSV}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Receipt className="w-4 h-4 text-primary-600" />
                  <div>
                    <div>Export Transactions CSV</div>
                    <div className="text-[10px] font-normal text-slate-400">All inflow/outflow entries</div>
                  </div>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <div>
                    <div>Print / Export PDF</div>
                    <div className="text-[10px] font-normal text-slate-400">Formal printable statement</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Inflow Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-emerald-200/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-800">Total Inflows</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100/70 text-emerald-700 px-2 py-0.5 rounded-md">
              In
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-800 mb-1.5 tracking-tight">
            {formatCompact(summary.totalInflow)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{formatKsh(summary.totalInflow)}</span>
            <span className={`font-bold flex items-center ${summary.inflowGrowth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {summary.inflowGrowth >= 0 ? "+" : ""}{summary.inflowGrowth}% MoM
            </span>
          </div>
        </div>

        {/* Total Outflow Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-rose-200/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-800">Total Outflows</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100/70 text-rose-700 px-2 py-0.5 rounded-md">
              Out
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-800 mb-1.5 tracking-tight">
            {formatCompact(summary.totalOutflow)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">{formatKsh(summary.totalOutflow)}</span>
            <span className={`font-bold flex items-center ${summary.outflowGrowth <= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {summary.outflowGrowth >= 0 ? "+" : ""}{summary.outflowGrowth}% MoM
            </span>
          </div>
        </div>

        {/* Net Cash Flow Card */}
        <div className={`bg-white/90 backdrop-blur-xl border p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all ${
          summary.netCashflow >= 0 ? "border-indigo-200/80" : "border-amber-200/80"
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                summary.netCashflow >= 0 ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
              }`}>
                {summary.netCashflow >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-800">Net Cashflow</h3>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
              summary.netCashflow >= 0 ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
            }`}>
              {summary.netCashflow >= 0 ? "Surplus" : "Deficit"}
            </span>
          </div>
          <div className={`text-2xl lg:text-3xl font-black mb-1.5 tracking-tight ${
            summary.netCashflow >= 0 ? "text-indigo-900" : "text-amber-700"
          }`}>
            {formatCompact(summary.netCashflow)}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Margin: {summary.netMargin}%</span>
            <span className="font-bold text-emerald-600">
              {summary.netCashflow >= 0 ? "Positive Balance" : "Requires Funding"}
            </span>
          </div>
        </div>

        {/* Operating Coverage / Velocity Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 p-5 rounded-2xl shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-full blur-2xl -z-10 group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <Wallet className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Operating Ratio</h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
              Coverage
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-black text-slate-800 mb-1.5 tracking-tight">
            {summary.operatingRatio.toFixed(2)}x
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Avg Net: {formatCompact(summary.avgMonthlyNet)}/mo</span>
            <span className="font-bold text-slate-700">{summary.totalTransactions} Total Tx</span>
          </div>
        </div>
      </div>

      {/* Main View Tabs Navigation */}
      <div className="border-b border-slate-200 print:hidden">
        <div className="flex gap-2 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-primary-900 text-primary-900 bg-primary-50/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Interactive Chart & Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "monthly"
                ? "border-primary-900 text-primary-900 bg-primary-50/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Monthly Statement Table</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "categories"
                ? "border-primary-900 text-primary-900 bg-primary-50/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sources & Category Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "transactions"
                ? "border-primary-900 text-primary-900 bg-primary-50/50 rounded-t-xl"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Transactions Activity ({data.recentTransactions.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Charts & Trend Analytics */}
      {(activeTab === "overview" || typeof window === "undefined") && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Cashflow Trend ({selectedYear})
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Monthly cash inflows vs outflows in Kenyan Shillings (KES).
                </p>
              </div>

              {/* Chart Mode Selector */}
              <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1 print:hidden">
                <button
                  onClick={() => setChartType("area")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartType === "area" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartType === "bar" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Bars
                </button>
                <button
                  onClick={() => setChartType("net")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartType === "net" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Net Flow
                </button>
                <button
                  onClick={() => setChartType("cumulative")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    chartType === "cumulative" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Cumulative
                </button>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(val) => formatCompact(val)}
                      dx={-8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "14px",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.3)",
                        padding: "12px 16px",
                      }}
                      labelStyle={{ color: "#f8fafc", fontWeight: 800, marginBottom: "6px" }}
                      formatter={(val: any, name: any) => [
                        formatKsh(Number(val)),
                        name === "inflow" ? "Cash Inflow" : "Cash Outflow",
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      formatter={(val) => (
                        <span className="text-xs font-bold text-slate-700 capitalize mr-4">
                          {val === "inflow" ? "Cash Inflows" : "Cash Outflows"}
                        </span>
                      )}
                    />
                    <Area
                      type="monotone"
                      dataKey="inflow"
                      name="inflow"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorInflow)"
                    />
                    <Area
                      type="monotone"
                      dataKey="outflow"
                      name="outflow"
                      stroke="#f43f5e"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorOutflow)"
                    />
                  </AreaChart>
                ) : chartType === "bar" ? (
                  <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(val) => formatCompact(val)}
                      dx={-8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "14px",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.3)",
                        padding: "12px 16px",
                      }}
                      labelStyle={{ color: "#f8fafc", fontWeight: 800, marginBottom: "6px" }}
                      formatter={(val: any, name: any) => [
                        formatKsh(Number(val)),
                        name === "inflow" ? "Inflow" : "Outflow",
                      ]}
                    />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      formatter={(val) => (
                        <span className="text-xs font-bold text-slate-700 capitalize mr-4">
                          {val === "inflow" ? "Cash Inflows" : "Cash Outflows"}
                        </span>
                      )}
                    />
                    <Bar dataKey="inflow" name="inflow" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                    <Bar dataKey="outflow" name="outflow" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                ) : chartType === "net" ? (
                  <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(val) => formatCompact(val)}
                      dx={-8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "14px",
                        border: "none",
                        padding: "12px 16px",
                      }}
                      labelStyle={{ color: "#f8fafc", fontWeight: 800 }}
                      formatter={(val: any) => [formatKsh(Number(val)), "Net Cashflow"]}
                    />
                    <Bar
                      dataKey="net"
                      name="Net Flow"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      tickFormatter={(val) => formatCompact(val)}
                      dx={-8}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderRadius: "14px",
                        border: "none",
                        padding: "12px 16px",
                      }}
                      labelStyle={{ color: "#f8fafc", fontWeight: 800 }}
                      formatter={(val: any) => [formatKsh(Number(val)), "Cumulative Cash Position"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeNet"
                      name="Cumulative Position"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#ffffff" }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Quick Metrics Footer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div className="bg-slate-50/70 p-3 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Monthly Inflow</div>
                <div className="text-base font-black text-slate-800 mt-0.5">
                  {formatCompact(summary.avgMonthlyInflow)}
                </div>
              </div>
              <div className="bg-slate-50/70 p-3 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Monthly Outflow</div>
                <div className="text-base font-black text-slate-800 mt-0.5">
                  {formatCompact(summary.avgMonthlyOutflow)}
                </div>
              </div>
              <div className="bg-slate-50/70 p-3 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Monthly Velocity</div>
                <div className={`text-base font-black mt-0.5 ${summary.avgMonthlyNet >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {formatCompact(summary.avgMonthlyNet)}
                </div>
              </div>
              <div className="bg-slate-50/70 p-3 rounded-xl">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cumulative Position</div>
                <div className="text-base font-black text-indigo-800 mt-0.5">
                  {formatCompact(summary.netCashflow)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Breakdown Statement Table */}
      {(activeTab === "monthly" || typeof window === "undefined") && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Monthly Cash Flow Statement
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Detailed schedule of operating cash flows by calendar month.
              </p>
            </div>
            <button
              onClick={exportSummaryCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors print:hidden"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-3.5 px-6">Month</th>
                  <th className="py-3.5 px-6 text-right">Inflows (KES)</th>
                  <th className="py-3.5 px-6 text-right">Outflows (KES)</th>
                  <th className="py-3.5 px-6 text-right">Net Cash Flow</th>
                  <th className="py-3.5 px-6 text-right">Cumulative Balance</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {monthlyTrends.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        <span>{m.monthFullName} {m.year}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right font-black text-emerald-600">
                      {formatKsh(m.inflow)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-black text-rose-600">
                      {formatKsh(m.outflow)}
                    </td>
                    <td className={`py-3.5 px-6 text-right font-black ${m.net >= 0 ? "text-indigo-700" : "text-amber-700"}`}>
                      {m.net >= 0 ? "+" : ""}{formatKsh(m.net)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-700">
                      {formatKsh(m.cumulativeNet)}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        m.net >= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {m.net >= 0 ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {m.net >= 0 ? "Surplus" : "Deficit"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100/80 border-t-2 border-slate-300 text-sm font-black text-slate-800">
                <tr>
                  <td className="py-4 px-6 uppercase tracking-wider">Full Year Total</td>
                  <td className="py-4 px-6 text-right text-emerald-700">{formatKsh(summary.totalInflow)}</td>
                  <td className="py-4 px-6 text-right text-rose-700">{formatKsh(summary.totalOutflow)}</td>
                  <td className={`py-4 px-6 text-right ${summary.netCashflow >= 0 ? "text-indigo-800" : "text-amber-800"}`}>
                    {summary.netCashflow >= 0 ? "+" : ""}{formatKsh(summary.netCashflow)}
                  </td>
                  <td className="py-4 px-6 text-right text-slate-900">{formatKsh(summary.netCashflow)}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-xs font-black text-slate-600">Margin: {summary.netMargin}%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Sources & Category Breakdown */}
      {(activeTab === "categories" || typeof window === "undefined") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inflow Sources Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Inflow Sources
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Breakdown by cash stream</p>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Total: {formatCompact(summary.totalInflow)}
              </span>
            </div>

            <div className="space-y-4">
              {inflowSources.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-8">No inflow records found.</div>
              ) : (
                inflowSources.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{cat.category}</span>
                        {cat.count > 0 && (
                          <span className="text-[10px] text-slate-400 font-normal">({cat.count} tx)</span>
                        )}
                      </div>
                      <div className="font-black text-slate-800 flex items-center gap-2">
                        <span>{formatKsh(cat.amount)}</span>
                        <span className="text-[11px] text-emerald-600 w-10 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Outflow Categories Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    Outflow Categories
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Breakdown by expense purpose</p>
                </div>
              </div>
              <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                Total: {formatCompact(summary.totalOutflow)}
              </span>
            </div>

            <div className="space-y-4">
              {outflowCategories.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-8">No outflow records found.</div>
              ) : (
                outflowCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>{cat.category}</span>
                        {cat.count > 0 && (
                          <span className="text-[10px] text-slate-400 font-normal">({cat.count} tx)</span>
                        )}
                      </div>
                      <div className="font-black text-slate-800 flex items-center gap-2">
                        <span>{formatKsh(cat.amount)}</span>
                        <span className="text-[11px] text-rose-600 w-10 text-right">{cat.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Transactions Activity Log */}
      {(activeTab === "transactions" || typeof window === "undefined") && (
        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">
                Cashflow Activity Ledger
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Individual receipts, payments, and disbursements recorded in the system.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto print:hidden">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setTxTypeFilter("ALL")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    txTypeFilter === "ALL" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTxTypeFilter("INFLOW")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    txTypeFilter === "INFLOW" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-emerald-700"
                  }`}
                >
                  Inflows
                </button>
                <button
                  onClick={() => setTxTypeFilter("OUTFLOW")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    txTypeFilter === "OUTFLOW" ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:text-rose-700"
                  }`}
                >
                  Outflows
                </button>
              </div>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-wider">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Category / Purpose</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">Reference</th>
                  <th className="py-3 px-6 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                      No cashflow transactions matched your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-600 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-KE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          tx.type === "INFLOW"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {tx.type === "INFLOW" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 font-bold text-slate-700 whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-3.5 px-6 text-slate-600 max-w-xs truncate" title={tx.description}>
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {tx.reference}
                      </td>
                      <td className={`py-3.5 px-6 text-right font-black whitespace-nowrap ${
                        tx.type === "INFLOW" ? "text-emerald-600" : "text-rose-600"
                      }`}>
                        {tx.type === "INFLOW" ? "+" : "-"}{formatKsh(tx.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
