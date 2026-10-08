"use client";

import React, { useState, useTransition } from "react";
import {
  DollarSign,
  Download,
  Filter,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Printer,
  Calendar,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Receipt,
  RefreshCw,
  School,
} from "lucide-react";
import {
  FeeReportData,
  FilterOptions,
  getFeeReportData,
} from "./actions";

interface FeesClientProps {
  initialData: FeeReportData;
  filterOptions: FilterOptions;
}

export default function FeesClient({ initialData, filterOptions }: FeesClientProps) {
  const [data, setData] = useState<FeeReportData>(initialData);
  const [activeYear, setActiveYear] = useState<string>("all");
  const [activeTerm, setActiveTerm] = useState<string>("all");
  const [activeClass, setActiveClass] = useState<string>("all");
  const [activeView, setActiveView] = useState<"class" | "stream" | "payments" | "aging">("class");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (newYear: string, newTerm: string, newClass: string) => {
    setActiveYear(newYear);
    setActiveTerm(newTerm);
    setActiveClass(newClass);

    startTransition(async () => {
      try {
        const res = await getFeeReportData({
          academicYearId: newYear === "all" ? undefined : newYear,
          termId: newTerm === "all" ? undefined : newTerm,
          classId: newClass === "all" ? undefined : newClass,
        });
        setData(res);
      } catch (error) {
        console.error("Failed to load fee report data:", error);
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (amount: number): string => {
    if (isNaN(amount) || amount === 0) return "KSh 0";
    if (Math.abs(amount) >= 1_000_000) {
      return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `KSh ${(amount / 1_000).toFixed(1)}K`;
    }
    return `KSh ${amount.toLocaleString()}`;
  };

  const formatFullMoney = (amount: number): string => {
    return `KSh ${amount.toLocaleString("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Filter Terms based on activeYear
  const availableTerms =
    activeYear === "all"
      ? filterOptions.terms
      : filterOptions.terms.filter((t) => t.academicYearId === activeYear);

  // Search filtering
  const filteredClassBreakdown = data.classBreakdown.filter((row) =>
    row.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStreamBreakdown = data.streamBreakdown.filter(
    (row) =>
      row.streamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = data.recentPayments.filter(
    (row) =>
      row.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedYearName =
    activeYear === "all"
      ? "All Academic Years"
      : filterOptions.years.find((y) => y.id === activeYear)?.name || "Selected Year";

  const selectedTermName =
    activeTerm === "all"
      ? "All Terms"
      : filterOptions.terms.find((t) => t.id === activeTerm)?.name || "Selected Term";

  const selectedClassName =
    activeClass === "all"
      ? "All Classes"
      : filterOptions.classes.find((c) => c.id === activeClass)?.name || "Selected Class";

  return (
    <div className="p-6 space-y-8 print:p-0 print:space-y-6 print:bg-white text-slate-800">
      {/* Printable Header - Visible only in Print Mode */}
      <div className="hidden print:block border-b border-slate-300 pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Fee Collection & Analytics Report
            </h1>
            <p className="text-xs text-slate-600 font-bold mt-1">
              Generated on: {new Date().toLocaleDateString("en-KE", { dateStyle: "full" })}
            </p>
          </div>
          <div className="text-right text-xs font-semibold text-slate-600 space-y-0.5">
            <p><span className="font-bold text-slate-900">Period:</span> {selectedYearName} • {selectedTermName}</p>
            <p><span className="font-bold text-slate-900">Scope:</span> {selectedClassName}</p>
          </div>
        </div>
      </div>

      {/* Screen Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Fee Analytics</h2>
            {isPending && (
              <RefreshCw className="w-4 h-4 text-primary-600 animate-spin" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Detailed breakdown of expected vs collected fees and outstanding balances.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex-1 sm:flex-none cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print
          </button>
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm hover:shadow flex-1 sm:flex-none cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-2xl flex flex-wrap items-center gap-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 mr-2">
          <Filter className="w-3.5 h-3.5" /> Filters:
        </div>

        {/* Academic Year Filter */}
        <div className="flex-1 sm:flex-none min-w-[150px]">
          <select
            value={activeYear}
            onChange={(e) => handleFilterChange(e.target.value, activeTerm, activeClass)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option value="all">All Academic Years</option>
            {filterOptions.years.map((y) => (
              <option key={y.id} value={y.id}>
                Year: {y.name} {y.isActiveYear ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Term Filter */}
        <div className="flex-1 sm:flex-none min-w-[150px]">
          <select
            value={activeTerm}
            onChange={(e) => handleFilterChange(activeYear, e.target.value, activeClass)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option value="all">All Academic Terms</option>
            {availableTerms.map((t) => (
              <option key={t.id} value={t.id}>
                Term: {t.name} {t.isActiveTerm ? "(Active)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Class Filter */}
        <div className="flex-1 sm:flex-none min-w-[150px]">
          <select
            value={activeClass}
            onChange={(e) => handleFilterChange(activeYear, activeTerm, e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
          >
            <option value="all">All Classes</option>
            {filterOptions.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {(activeYear !== "all" || activeTerm !== "all" || activeClass !== "all") && (
          <button
            onClick={() => handleFilterChange("all", "all", "all")}
            type="button"
            className="text-xs font-bold text-primary-700 hover:text-primary-900 underline px-2 py-1 ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {/* Total Expected */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Total Expected</h3>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
              {formatMoney(data.metrics.totalExpected)}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 pt-2 border-t border-slate-100">
              <span>{data.metrics.totalInvoices} Invoiced Students</span>
              <span className="text-emerald-700 font-black">{formatFullMoney(data.metrics.totalExpected)}</span>
            </div>
          </div>
        </div>

        {/* Collected */}
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                Collected ({data.metrics.collectionRate}%)
              </h3>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-primary-900 mb-1">
              {formatMoney(data.metrics.totalCollected)}
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(data.metrics.collectionRate, 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2">
              <span>{data.metrics.paidInvoicesCount} Fully Paid</span>
              <span className="text-primary-800 font-black">{formatFullMoney(data.metrics.totalCollected)}</span>
            </div>
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white/90 backdrop-blur-xl border border-rose-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-600">Outstanding Balance</h3>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 mb-1">
              {formatMoney(data.metrics.totalOutstanding)}
            </div>
            <p className="text-xs font-bold text-rose-600 mt-1">
              {data.metrics.studentsWithArrears} students with fee arrears
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 pt-2 border-t border-rose-100">
              <span>{data.metrics.partialInvoicesCount + data.metrics.unpaidInvoicesCount} Active Balances</span>
              <span className="text-rose-700 font-black">{formatFullMoney(data.metrics.totalOutstanding)}</span>
            </div>
          </div>
        </div>

        {/* Overdue Arrears */}
        <div className="bg-white/90 backdrop-blur-xl border border-amber-200/70 p-5 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-700">Past Due (Overdue)</h3>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-800 mb-1">
              {formatMoney(data.metrics.overdueAmount)}
            </div>
            <p className="text-xs font-bold text-amber-600 mt-1">
              {data.metrics.overdueCount} overdue invoices
            </p>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-2 pt-2 border-t border-amber-100">
              <span>Past Due Date</span>
              <span className="text-amber-800 font-black">{formatFullMoney(data.metrics.overdueAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Toolbar */}
      <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 print:hidden">
          {/* Tab Navigation */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1 md:pb-0">
            {[
              { id: "class", label: "Collection by Grade / Class", icon: BarChart3 },
              { id: "stream", label: "Collection by Stream", icon: Layers },
              { id: "payments", label: "Recent Receipts", icon: Receipt },
              { id: "aging", label: "Aging & Summary", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                activeView === "payments"
                  ? "Search receipt, student, adm..."
                  : "Search classes or streams..."
              }
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* View 1: Collection by Class / Grade */}
        {activeView === "class" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Grade / Class
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Expected
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Collected
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Outstanding
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[180px]">
                    Progress Rate
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClassBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold text-sm">
                      No fee records found for the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredClassBreakdown.map((row, idx) => (
                    <tr key={row.classId || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-sm text-slate-800">
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-slate-400" />
                          <span>{row.className}</span>
                        </div>
                        {row.studentCount > 0 && (
                          <div className="text-[11px] font-medium text-slate-400 mt-0.5 ml-6">
                            {row.studentCount} students ({row.fullyPaidCount} cleared, {row.arrearsCount} arrears)
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-700 text-right">
                        {formatFullMoney(row.expected)}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-right">
                        {formatFullMoney(row.collected)}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-rose-600 text-right">
                        {formatFullMoney(row.outstanding)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                row.percent < 50
                                  ? "bg-rose-500"
                                  : row.percent < 80
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(row.percent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-slate-700 min-w-[3.5ch]">
                            {row.percent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                            row.percent >= 90
                              ? "bg-emerald-100 text-emerald-700"
                              : row.percent >= 60
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {row.percent >= 90 ? "Excellent" : row.percent >= 60 ? "Moderate" : "Action Needed"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {filteredClassBreakdown.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50 font-black border-t-2 border-slate-200">
                    <td className="py-4 px-6 text-xs uppercase tracking-wider text-slate-700">
                      Total Summary
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-800 text-right">
                      {formatFullMoney(data.metrics.totalExpected)}
                    </td>
                    <td className="py-4 px-6 text-sm text-emerald-700 text-right">
                      {formatFullMoney(data.metrics.totalCollected)}
                    </td>
                    <td className="py-4 px-6 text-sm text-rose-700 text-right">
                      {formatFullMoney(data.metrics.totalOutstanding)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-emerald-600"
                            style={{ width: `${Math.min(data.metrics.collectionRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-800 min-w-[3.5ch]">
                          {data.metrics.collectionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-xs font-black text-slate-600">
                      {data.metrics.studentsWithArrears} Arrears
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* View 2: Collection by Stream */}
        {activeView === "stream" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stream Name
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Expected
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Collected
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Outstanding
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[180px]">
                    Collection Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStreamBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold text-sm">
                      No stream fee records found for the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStreamBreakdown.map((row, idx) => (
                    <tr key={row.streamId || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-sm text-slate-800">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>{row.streamName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-600">
                        {row.className}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-slate-700 text-right">
                        {formatFullMoney(row.expected)}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-emerald-600 text-right">
                        {formatFullMoney(row.collected)}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-rose-600 text-right">
                        {formatFullMoney(row.outstanding)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                row.percent < 50
                                  ? "bg-rose-500"
                                  : row.percent < 80
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(row.percent, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-black text-slate-700 min-w-[3.5ch]">
                            {row.percent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View 3: Recent Payment Receipts */}
        {activeView === "payments" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Receipt #
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Class / Stream
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Method & Reference
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3.5 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                    Amount Paid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold text-sm">
                      No payment receipts found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-black text-xs text-primary-900">
                        {p.receiptNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-slate-800">{p.studentName}</div>
                        <div className="text-xs text-slate-400">{p.admissionNumber}</div>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-600">
                        {p.className}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-bold">
                          {p.paymentMethod}
                        </span>
                        {p.referenceNumber && (
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {p.referenceNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-xs font-medium text-slate-500">
                        {new Date(p.paymentDate).toLocaleDateString("en-KE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 font-black text-sm text-emerald-600 text-right">
                        {formatFullMoney(p.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* View 4: Aging & Arrears Breakdown */}
        {activeView === "aging" && (
          <div className="p-6 space-y-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Fee Arrears Aging Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                <div className="text-xs font-black uppercase text-emerald-600 mb-1">0–30 Days Due</div>
                <div className="text-2xl font-black text-emerald-800 mb-1">
                  {formatMoney(data.agingSummary.days0to30)}
                </div>
                <p className="text-[11px] font-medium text-emerald-700">
                  {formatFullMoney(data.agingSummary.days0to30)}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                <div className="text-xs font-black uppercase text-amber-600 mb-1">31–60 Days Due</div>
                <div className="text-2xl font-black text-amber-800 mb-1">
                  {formatMoney(data.agingSummary.days31to60)}
                </div>
                <p className="text-[11px] font-medium text-amber-700">
                  {formatFullMoney(data.agingSummary.days31to60)}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl">
                <div className="text-xs font-black uppercase text-orange-600 mb-1">61–90 Days Due</div>
                <div className="text-2xl font-black text-orange-800 mb-1">
                  {formatMoney(data.agingSummary.days61to90)}
                </div>
                <p className="text-[11px] font-medium text-orange-700">
                  {formatFullMoney(data.agingSummary.days61to90)}
                </p>
              </div>

              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
                <div className="text-xs font-black uppercase text-rose-600 mb-1">90+ Days Due (Critical)</div>
                <div className="text-2xl font-black text-rose-800 mb-1">
                  {formatMoney(data.agingSummary.days90Plus)}
                </div>
                <p className="text-[11px] font-medium text-rose-700">
                  {formatFullMoney(data.agingSummary.days90Plus)}
                </p>
              </div>
            </div>

            {/* Invoice Breakdown Summary */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
              <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-4">
                Invoice Status Composition
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500">Fully Paid Invoices</div>
                    <div className="text-xl font-black text-slate-800">{data.metrics.paidInvoicesCount}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500">Partial Invoices</div>
                    <div className="text-xl font-black text-slate-800">{data.metrics.partialInvoicesCount}</div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500">Unpaid Invoices</div>
                    <div className="text-xl font-black text-slate-800">{data.metrics.unpaidInvoicesCount}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
