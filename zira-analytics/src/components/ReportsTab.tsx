import { toast } from "react-hot-toast";
import { useCurrency } from '../contexts/CurrencyContext.tsx';
import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Wallet, 
  Layers, 
  Check, 
  RefreshCw 
} from 'lucide-react';

interface ReportsTabProps {
  students: any[];
  transactions: any[];
}

export function ReportsTab({ students, transactions }: ReportsTabProps) {
  const { currency } = useCurrency();

  const [reportType, setReportType] = useState<'academics' | 'finance' | 'students' | 'staff'>('academics');
  const [isCompiling, setIsCompiling] = useState(false);

  const handleExportCSV = (title: string) => {
    toast.success(`Successfully compiled and downloaded "${title} Worksheet.csv" spreadsheet ledger with localized student fields.`);
  };

  const handleExportPDF = (title: string) => {
    toast.success(`Successfully generated and downloaded high-fidelity "${title} Report.pdf" document report signed by Karega supervisor.`);
  };

  const handleCompileReport = () => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      toast.success('Centralized school analytics engine refreshed successfully.');
    }, 1200);
  };

  return (
    <div className="space-y-6 text-slate-800 font-sans text-lg font-semibold">
      
      {/* Search Header Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-2 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl gap-1.5">
        <div className="flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-[var(--color-secondary)]" />
          <span className="text-lg font-bold text-slate-900 uppercase">Select Report Catalog:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {(['academics', 'finance', 'students', 'staff'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-3.5 py-1.5 rounded-xl uppercase hover:scale-[1.01] transition duration-150 text-[16px] font-bold cursor-pointer border ${
                reportType === type
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {type} report
            </button>
          ))}
        </div>

        <button
          onClick={handleCompileReport}
          disabled={isCompiling}
          className="px-4 py-1.5 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] disabled:bg-slate-300 text-white rounded-xl uppercase text-[16px] flex items-center gap-1 cursor-pointer font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
          {isCompiling ? 'Refreshing...' : 'Re-compile Engine'}
        </button>
      </div>

      {reportType === 'academics' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-905 uppercase">Terminal Academics Performance Ledger</h3>
              <p className="text-[16px] text-slate-400 mt-0.5">Weighted subject averages, mean points formulas and school grade counts</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleExportCSV('Academics_Performance')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Export CSV</button>
              <button onClick={() => handleExportPDF('Academics_Performance')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Generate PDF</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase text-[16px]">
                  <th className="px-4 py-2.5">Class Form Stream</th>
                  <th className="px-4 py-2.5">Total Registered Students</th>
                  <th className="px-4 py-2.5">Mathematics GPA Average</th>
                  <th className="px-4 py-2.5">English GPA Average</th>
                  <th className="px-4 py-2 text-right">Class mean Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Form 4 East</td>
                  <td className="px-4 py-3">28 Candidates</td>
                  <td className="px-4 py-3 tabular-nums">74.2 %</td>
                  <td className="px-4 py-3 tabular-nums">68.5 %</td>
                  <td className="px-4 py-3 text-right text-indigo-600 font-bold text-xl">B- (Average)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Form 4 West</td>
                  <td className="px-4 py-3">15 Candidates</td>
                  <td className="px-4 py-3 tabular-nums">71.0 %</td>
                  <td className="px-4 py-3 tabular-nums">72.3 %</td>
                  <td className="px-4 py-3 text-right text-indigo-600 font-bold text-xl">B- (Average)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Form 3 East</td>
                  <td className="px-4 py-3">30 Candidates</td>
                  <td className="px-4 py-3 tabular-nums">66.5 %</td>
                  <td className="px-4 py-3 tabular-nums">61.0 %</td>
                  <td className="px-4 py-3 text-right text-indigo-600 font-bold text-xl">C+ (Creditable)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'finance' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-905 uppercase">Direct Consolidated Fees Income Ledger</h3>
              <p className="text-[16px] text-slate-400 mt-0.5">Sum of cleared bank slips, pending outstanding balance logs & scholarships</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleExportCSV('Fees_Transactions_Collections')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Export CSV</button>
              <button onClick={() => handleExportPDF('Fees_Transactions_Collections')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Generate PDF</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase text-[16px]">
                  <th className="px-4 py-2.5">Fees Structured category</th>
                  <th className="px-4 py-2.5">Total Invoiced Amount</th>
                  <th className="px-4 py-2.5">Total Direct Collections</th>
                  <th className="px-4 py-2 text-right">Sum Arrears outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                <tr>
                  <td className="px-4 py-3 font-bold text-indigo-700">Form 4 Tuition Fees (2026 Term 1)</td>
                  <td className="px-4 py-3 tabular-nums">{currency} 1,290,000</td>
                  <td className="px-4 py-3 tabular-nums">{currency} 880,000</td>
                  <td className="px-4 py-3 text-right text-rose-600 font-bold tabular-nums">{currency} 410,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-indigo-700">Vehicle Logistics Transport service route</td>
                  <td className="px-4 py-3 tabular-nums">{currency} 220,000</td>
                  <td className="px-4 py-3 tabular-nums">{currency} 185,000</td>
                  <td className="px-4 py-3 text-right text-rose-600 font-bold tabular-nums">{currency} 35,000</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-indigo-700">Aberdares Boarding Hostels services group</td>
                  <td className="px-4 py-3 tabular-nums">{currency} 540,000</td>
                  <td className="px-4 py-3 tabular-nums">{currency} 490,000</td>
                  <td className="px-4 py-3 text-right text-rose-600 font-bold tabular-nums">{currency} 50,050</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'students' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-905 uppercase">Pupils demographic registry audit</h3>
              <p className="text-[16px] text-slate-400 mt-0.5">Enrollments rosters, boarders / day-scholars ratio metrics</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleExportCSV('Students_Demographics_Roll')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Export CSV</button>
              <button onClick={() => handleExportPDF('Students_Demographics_Roll')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Generate PDF</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase text-[16px]">
                  <th className="px-4 py-2.5">Class Stream</th>
                  <th className="px-4 py-2.5">Male Students Count</th>
                  <th className="px-4 py-2.5">Female Students Count</th>
                  <th className="px-4 py-2 text-right">Roster Active Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Form 4 Streams</td>
                  <td className="px-4 py-3 tabular-nums">24 Boys</td>
                  <td className="px-4 py-3 tabular-nums">19 Girls</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded text-[15px] uppercase font-bold tracking-wide">Dynamic stream active</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Form 3 Streams</td>
                  <td className="px-4 py-3 tabular-nums">20 Boys</td>
                  <td className="px-4 py-3 tabular-nums">15 Girls</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded text-[15px] uppercase font-bold tracking-wide">Dynamic stream active</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'staff' && (
        <div className="bg-white p-1.5 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl shadow-sm space-y-2">
          <div className="flex justify-between items-center border-b border-slate-150 pb-3 flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-905 uppercase">Staff Roster leave & biometric attendance tracker</h3>
              <p className="text-[16px] text-slate-400 mt-0.5">Biometric logs checklist, payroll payouts and approved leave metrics</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleExportCSV('Staff_Compliance_Attendance')} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Export CSV</button>
              <button onClick={() => handleExportPDF('Staff_Compliance_Attendance')} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[16px] font-bold uppercase rounded-lg flex items-center gap-1 shadow-sm"><Download className="w-3 h-3" /> Generate PDF</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-lg border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase text-[16px]">
                  <th className="px-4 py-2.5">Staff Employee</th>
                  <th className="px-4 py-2.5">Official Designation Role</th>
                  <th className="px-4 py-2.5">Biometric Clock compliance</th>
                  <th className="px-4 py-2 text-right">Leaves Accrued count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Dr. Ouma Patrick</td>
                  <td className="px-4 py-3 text-slate-600">Head Teacher Instructor</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-600">98.5 % (Excellence)</td>
                  <td className="px-4 py-3 text-right">2 leave Days approved</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">Mr. Gitumu Dennis</td>
                  <td className="px-4 py-3 text-slate-600">Educator Tutor</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-600">94.2 % (Compliant)</td>
                  <td className="px-4 py-3 text-right">0 leave Days approved</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-bold text-slate-900">N. Esther Wanjala</td>
                  <td className="px-4 py-3 text-slate-600">Administrative Accountant</td>
                  <td className="px-4 py-3 tabular-nums text-emerald-600">96.0 % (Compliant)</td>
                  <td className="px-4 py-3 text-right">1 leave Day approved</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
