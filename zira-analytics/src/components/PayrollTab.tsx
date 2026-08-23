import React, { useState } from 'react';
import { Plus, X, Search, Banknote, Download, Users, Landmark, Wallet, CircleDollarSign, GraduationCap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export function PayrollTab() {
  const [payrollList, setPayrollList] = useState([
    { id: '1', name: 'Mr. Daniel Gitumu', grade: 'Grade L', basic: 54000, allowance: 12000, tax: 6800, net: 59200, month: 'May 2026' },
    { id: '2', name: 'Mrs. Mercy Chepkoech', grade: 'Grade N', basic: 72000, allowance: 18000, tax: 9500, net: 80500, month: 'May 2026' },
    { id: '3', name: 'Mr. Shadrack Kiprop', grade: 'Grade K', basic: 45000, allowance: 8000, tax: 5600, net: 47400, month: 'May 2026' },
    { id: '4', name: 'Mrs. Angela Ndwiga', grade: 'Grade J', basic: 38000, allowance: 6000, tax: 4250, net: 39750, month: 'May 2026' }
  ]);

  const [payrollSearchQuery, setPayrollSearchQuery] = useState('');
  const [payrollMonthFilter, setPayrollMonthFilter] = useState('All');
  const [showAddPayrollModal, setShowAddPayrollModal] = useState(false);
  const [newPayrollStaff, setNewPayrollStaff] = useState('');
  const [newPayrollGrade, setNewPayrollGrade] = useState('Grade L');
  const [newPayrollBasic, setNewPayrollBasic] = useState(50000);
  const [newPayrollAllowance, setNewPayrollAllowance] = useState(10000);
  const [newPayrollMonth, setNewPayrollMonth] = useState('May 2026');
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  // Dynamic variables
  const totalSalariesPaid = payrollList.reduce((acc, p) => acc + p.net, 0);
  const averageBasePay = Math.round(payrollList.reduce((acc, p) => acc + p.basic, 0) / (payrollList.length || 1));
  const collectiveTaxes = payrollList.reduce((acc, p) => acc + p.tax, 0);
  const salariedCount = payrollList.length;

  const filteredPayroll = payrollList.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(payrollSearchQuery.toLowerCase()) || 
                          p.grade.toLowerCase().includes(payrollSearchQuery.toLowerCase());
    const matchesMonth = payrollMonthFilter === 'All' || p.month === payrollMonthFilter;
    return matchesSearch && matchesMonth;
  });

  const uniquePayrollMonths = Array.from(new Set(payrollList.map(p => p.month)));

  return (
    <div className="space-y-6 font-sans animate-fade-in text-slate-800">
      
      {/* HUD Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <motion.div whileHover={{ y: -2 }} className="bg-gradient-to-br from-primary to-primary/90 p-5 md:p-6 rounded-2xl shadow-md text-white relative overflow-hidden group border border-primary/80">
          <div className="relative z-10">
            <span className="text-[16px] text-white/80 font-bold uppercase tracking-wide block">Total Net Outflow</span>
            <span className="text-3xl font-bold tabular-nums block mt-1">KES {totalSalariesPaid.toLocaleString()}</span>
            <span className="text-[15px] font-bold block mt-1.5 bg-black/20 w-fit px-3 py-1 rounded-md border border-white/10 uppercase tracking-wider">
              Disbursed total volume
            </span>
          </div>
          <Wallet className="w-24 h-24 text-white opacity-10 absolute -right-2 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Average Base Pay</span>
            <span className="text-3xl font-bold text-slate-900 tabular-nums block mt-1">KES {averageBasePay.toLocaleString()}</span>
            <span className="text-[16px] font-bold block mt-1.5 bg-slate-100 text-slate-600 w-fit px-2 py-0.5 rounded-md">
              Basic standard line
            </span>
          </div>
          <CircleDollarSign className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Total Registered Payslips</span>
            <span className="text-4xl font-bold text-indigo-600 tabular-nums block mt-1">{salariedCount}</span>
            <span className="text-[16px] text-indigo-700 font-bold block mt-1.5 bg-indigo-50 w-fit px-2 py-0.5 rounded-md">
              Endorsed contracts
            </span>
          </div>
          <Users className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>

        <motion.div whileHover={{ y: -2 }} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[16px] text-slate-400 font-bold uppercase tracking-wider block">Statutory Deductions (PAYE)</span>
            <span className="text-3xl font-bold text-rose-500 tabular-nums block mt-1">KES {collectiveTaxes.toLocaleString()}</span>
            <span className="text-[16px] text-rose-700 font-bold block mt-1.5 bg-rose-50 w-fit px-2 py-0.5 rounded-md">
              Total taxes sequestered
            </span>
          </div>
          <Landmark className="w-20 h-20 text-slate-50 absolute -right-4 -bottom-4 z-0 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
      </div>

      <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[20px] font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2 tabular-nums">
              <Banknote className="w-5 h-5 text-emerald-600" /> Staff Compensation Registry
            </h3>
            <p className="text-[17px] text-slate-500 mt-1 font-medium max-w-2xl">Formulate, record, disburse, and scrutinize structural compensations, standardized basic pay, allowances and statutory reductions across staff grades.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              className="px-2 py-2.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-700 text-[17px] font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1 shadow-sm"
              onClick={() => toast.success('Extracting consolidated payroll statement...')}
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => setShowAddPayrollModal(true)}
              className="px-5 py-2.5 bg-emerald-600 text-white text-[17px] font-bold rounded-xl hover:bg-emerald-700 transition cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" /> Issue Wage Slip
            </button>
          </div>
        </div>

        {/* Filters and controls */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -mt-2" />
            <input 
              type="text" 
              placeholder="Search specific staff identity or pay grade..." 
              value={payrollSearchQuery}
              onChange={e => setPayrollSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-bold text-slate-800 transition-all tabular-nums placeholder:text-slate-400 placeholder:font-sans"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 px-1.5 py-2 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]">
            <span className="text-slate-400 text-[15px] font-bold uppercase tracking-wide whitespace-nowrap hidden sm:inline-block">Filter Processing Month</span>
            <select 
              value={payrollMonthFilter}
              onChange={e => setPayrollMonthFilter(e.target.value)}
              className="bg-transparent text-[17px] font-bold focus:outline-none text-slate-700 cursor-pointer appearance-none pl-1 pr-4 uppercase tracking-wide tabular-nums"
            >
              <option value="All">All Intervals</option>
              {uniquePayrollMonths.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-lg border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Principal Identity</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Job Grade Level</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Stipulated Basic (KES)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums">Accrued Allowances (KES)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums text-rose-500">Statutory Tax (PAYE)</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[15px] tabular-nums text-emerald-600">Disbursed Net Pay</th>
                <th className="px-6 py-4 text-center font-bold uppercase tracking-wider text-[15px] tabular-nums">Billing Month</th>
                <th className="px-6 py-4 text-right font-bold uppercase tracking-wider text-[15px] tabular-nums">Config</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 bg-white">
              <AnimatePresence>
                {filteredPayroll.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">
                       <Banknote className="w-10 h-10 text-slate-200 mx-auto mb-3 stroke-[1.5]" />
                      No formalized salary slips indexed for existing parameters.
                    </td>
                  </tr>
                ) : (
                  filteredPayroll.map(p => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={p.id} 
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-[18px] text-slate-900">{p.name}</td>
                      <td className="px-6 py-4 text-indigo-700 font-bold text-[17px]">{p.grade}</td>
                      <td className="px-6 py-4 tabular-nums font-bold text-slate-700">{p.basic.toLocaleString()}</td>
                      <td className="px-6 py-4 tabular-nums font-bold text-slate-700">{p.allowance.toLocaleString()}</td>
                      <td className="px-6 py-4 tabular-nums font-bold text-rose-500">{p.tax.toLocaleString()}</td>
                      <td className="px-6 py-4 tabular-nums font-bold text-emerald-600 bg-emerald-50/30 text-[18px]">{p.net.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-1 rounded-md font-bold text-[14px] uppercase tracking-wide border bg-slate-100 text-slate-600 border-slate-200">
                          {p.month}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedPayslip(p)}
                            className="px-3 py-1.5 text-[15px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white rounded-lg transition-all cursor-pointer uppercase tracking-wide tabular-nums shadow-sm"
                          >
                            Preview
                          </button>
                          <button
                            onClick={() => {
                              setPayrollList(prev => prev.filter(item => item.id !== p.id));
                              toast.success(`Salary slip reference withdrawn successfully.`);
                            }}
                            className="px-1.5 py-1.5 text-[15px] font-bold bg-white text-rose-600 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] hover:border-rose-200 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-block uppercase tracking-wide tabular-nums shadow-sm"
                          >
                            Revoke
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD PAYROLL SLIP MODAL */}
      <AnimatePresence>
        {showAddPayrollModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-3xl p-1.5 max-w-[480px] w-full space-y-2 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                <h3 className="font-bold text-slate-900 text-xl flex items-center gap-2 tracking-tight uppercase tabular-nums">
                  <Banknote className="w-5 h-5 text-emerald-600" /> Structure Compensation Outline
                </h3>
                <button onClick={() => setShowAddPayrollModal(false)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5 font-sans">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Staff Subject Matrix Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mrs. Sarah Tanui"
                      value={newPayrollStaff}
                      onChange={e => setNewPayrollStaff(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-bold text-slate-800 transition-shadow shadow-inner"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Job Form Grade</label>
                    <select 
                      value={newPayrollGrade}
                      onChange={e => setNewPayrollGrade(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[17px] font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none transition-shadow"
                    >
                      <option value="Grade J">Grade J (Junior Scale)</option>
                      <option value="Grade K">Grade K (Senior Scale)</option>
                      <option value="Grade L">Grade L (Principle Standard)</option>
                      <option value="Grade M">Grade M (Deputy Executive)</option>
                      <option value="Grade N">Grade N (Chief Executive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Designated Schedule</label>
                    <input 
                      type="text" 
                      value={newPayrollMonth}
                      onChange={e => setNewPayrollMonth(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-[17px] font-bold text-slate-700 transition-shadow"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] p-2 rounded-xl space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Standardized Basic (KES)</label>
                      <input 
                        type="number"
                        value={newPayrollBasic}
                        onChange={e => setNewPayrollBasic(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-bold text-slate-900 tabular-nums transition-shadow shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 tabular-nums">Assigned Perks Allocation</label>
                      <input 
                        type="number"
                        value={newPayrollAllowance}
                        onChange={e => setNewPayrollAllowance(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-lg font-bold text-slate-900 tabular-nums transition-shadow shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2 w-full justify-between items-center text-slate-400 text-base font-bold uppercase tracking-wide pt-4">
                     {/* Preview pane */}
                     <div>
                       <span className="block mb-1">Estimated Tax</span>
                       <span className="tabular-nums text-rose-500">KES {(Math.round((newPayrollBasic + newPayrollAllowance) * 0.15)).toLocaleString()}</span>
                     </div>
                     <div className="text-right">
                       <span className="block mb-1">Pre-Computed Net Proceeds</span>
                       <span className="tabular-nums text-emerald-600 text-lg">KES {(Math.round((newPayrollBasic + newPayrollAllowance) * 0.85)).toLocaleString()}</span>
                     </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => {
                      if (!newPayrollStaff.trim() || !newPayrollMonth.trim() || newPayrollBasic <= 0) {
                        toast.error('Complete structurally required identity and payout values before committing.');
                        return;
                      }

                      const estimatedTax = Math.round((newPayrollBasic + newPayrollAllowance) * 0.15); // Simple proxy calculation 
                      const netAmount = (newPayrollBasic + newPayrollAllowance) - estimatedTax;

                      setPayrollList([
                        {
                          id: String(Date.now()),
                          name: newPayrollStaff,
                          grade: newPayrollGrade,
                          basic: newPayrollBasic,
                          allowance: newPayrollAllowance,
                          tax: estimatedTax,
                          net: netAmount,
                          month: newPayrollMonth
                        },
                        ...payrollList
                      ]);
                      
                      toast.success(`Consolidated standard slip for ${newPayrollStaff}`);
                      setShowAddPayrollModal(false);
                    }}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 text-[13.5px] hover:bg-emerald-700 transition-colors"
                  >
                    Commit Active Registry Outline
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAYSLIP PREVIEW MODAL */}
      <AnimatePresence>
        {selectedPayslip && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-[650px] shadow-2xl relative overflow-hidden border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A]"
            >
              <div className="bg-primary p-6 text-white flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <GraduationCap className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold uppercase tracking-tight font-sans">Staff Salary Advice</h2>
                    <p className="text-white/70 text-base font-bold uppercase tracking-wide mt-1">Karega Secondary School | Official Ledger</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPayslip(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8 font-sans">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-8 border-b border-slate-100 pb-6">
                  <div>
                    <span className="text-[14px] font-bold text-slate-400 uppercase tracking-wide block mb-2 tabular-nums text-secondary">Personnel Record</span>
                    <h3 className="text-3xl font-bold text-slate-900">{selectedPayslip.name}</h3>
                    <p className="text-lg font-bold text-slate-500 mt-0.5">{selectedPayslip.grade} | Senior Staff Portfolio</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[14px] font-bold text-slate-400 uppercase tracking-wide block mb-2 tabular-nums text-secondary">Disbursement Interval</span>
                    <h3 className="text-2xl font-bold text-slate-900 tabular-nums">{selectedPayslip.month}</h3>
                    <p className="text-base font-bold text-slate-500 mt-1 uppercase tracking-wider">Ref: SLIP-{(selectedPayslip.id || '000').slice(-6)}</p>
                  </div>
                </div>

                {/* Earnings & Deductions */}
                <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-[15px] font-bold text-emerald-600 uppercase tracking-wide border-b border-emerald-100 pb-2 flex items-center gap-2 tabular-nums">
                      Gross Earnings <ArrowUpRight className="w-3 h-3" />
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-slate-500">Basic Stipulated Salary</span>
                        <span className="tabular-nums font-bold text-slate-800">KES {selectedPayslip.basic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-slate-500">Consolidated Allowances</span>
                        <span className="tabular-nums font-bold text-slate-800">KES {selectedPayslip.allowance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xl">
                        <span className="font-bold text-slate-900 uppercase tracking-tighter">Gross Subject Pay</span>
                        <span className="tabular-nums font-bold text-slate-900">KES {(selectedPayslip.basic + selectedPayslip.allowance).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[15px] font-bold text-rose-500 uppercase tracking-wide border-b border-rose-100 pb-2 flex items-center gap-2 tabular-nums">
                      Statutory Deductions <ArrowDownRight className="w-3 h-3" />
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-bold text-slate-500">P.A.Y.E (15% Approx)</span>
                        <span className="tabular-nums font-bold text-rose-500">KES {selectedPayslip.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg opacity-50">
                        <span className="font-bold text-slate-500">N.H.I.F Contribution</span>
                        <span className="tabular-nums font-bold text-slate-800">Invoiced</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xl">
                        <span className="font-bold text-slate-900 uppercase tracking-tighter">Total Sequestered</span>
                        <span className="tabular-nums font-bold text-rose-600">KES {selectedPayslip.tax.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Net Section */}
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 flex items-center justify-between shadow-inner">
                   <div>
                      <h5 className="text-[14px] font-bold text-emerald-700 uppercase tracking-[0.2em] mb-1 tabular-nums">Final Net Proceeds Disbursed</h5>
                      <span className="text-base font-bold text-emerald-600 italic">Funds transferred via registered bank EFT details</span>
                   </div>
                   <div className="text-right">
                      <span className="text-4xl font-bold text-emerald-700 tabular-nums tracking-tighter">KES {selectedPayslip.net.toLocaleString()}</span>
                   </div>
                </div>
                
                <div className="flex justify-center gap-4 pt-4">
                   <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-800 transition-colors cursor-pointer shadow-lg">
                      <Download className="w-4 h-4" /> Download Official PDF
                   </button>
                   <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-900 rounded-xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-50 transition-colors cursor-pointer">
                      <Plus className="w-4 h-4" /> Print Copy
                   </button>
                </div>
              </div>

              {/* Decorative footer */}
              <div className="h-2 bg-gradient-to-r from-secondary via-primary to-secondary/80 w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
