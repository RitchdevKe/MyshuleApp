import React, { useState } from 'react';
import { Plus, X, Search, FileText, CheckCircle2, Bookmark, BarChart3, Edit, Trash2, Award, Wallet, ArrowUpRight, DollarSign, Receipt, FileSignature } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

export function InvoicesTab() {
  const { currency } = useCurrency();

  const [invoicesLogs, setInvoicesLogs] = useState([
    { id: 'INV-2026-01', name: 'Douglas Omari', form: 4, amount: 25000, paid: 25000, balance: 0, date: '2026-05-15', status: 'Fully Paid' },
    { id: 'INV-2026-02', name: 'Emily Wanjala', form: 4, amount: 25000, paid: 12500, balance: 12500, date: '2026-05-15', status: 'Partially Paid' },
    { id: 'INV-2026-03', name: 'Pius Mwambia', form: 2, amount: 22000, paid: 7000, balance: 15000, date: '2026-05-15', status: 'Partially Paid' },
    { id: 'INV-2026-04', name: 'Adrian Kipirono', form: 4, amount: 25000, paid: 20000, balance: 5000, date: '2026-05-16', status: 'Partially Paid' }
  ]);

  const [invoicesSearchQuery, setInvoicesSearchQuery] = useState('');
  const [invoicesStatusFilter, setInvoicesStatusFilter] = useState('All');

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvStudent, setNewInvStudent] = useState('');
  const [newInvForm, setNewInvForm] = useState(1);
  const [newInvAmount, setNewInvAmount] = useState(25000);

  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);
  const [paymentInvoiceId, setPaymentInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('MPESA');
  const [paymentReceipt, setPaymentReceipt] = useState('');

  const mockStudents = [
    { id: '1', name: 'Douglas Omari', form: 4, admissionNo: 'AD1001' },
    { id: '2', name: 'Emily Wanjala', form: 4, admissionNo: 'AD1002' },
    { id: '3', name: 'Pius Mwambia', form: 2, admissionNo: 'AD1003' },
    { id: '4', name: 'Lilian Chepotip', form: 4, admissionNo: 'AD1004' },
    { id: '5', name: 'Adrian Kipirono', form: 4, admissionNo: 'AD1005' },
    { id: '6', name: 'Beryl Atieno', form: 3, admissionNo: 'AD1006' },
  ];

  const filteredInvoices = invoicesLogs.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(invoicesSearchQuery.toLowerCase()) || 
                          i.id.toLowerCase().includes(invoicesSearchQuery.toLowerCase());
    const matchesStatus = invoicesStatusFilter === 'All' || i.status === invoicesStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'Fully Paid') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (status === 'Partially Paid') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  const totalInvoiced = invoicesLogs.reduce((acc, i) => acc + i.amount, 0);
  const totalPaid = invoicesLogs.reduce((acc, i) => acc + i.paid, 0);
  const totalBalance = invoicesLogs.reduce((acc, i) => acc + i.balance, 0);

  return (
    <div className="space-y-4">
      
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm relative overflow-hidden">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Total Billed</span>
          <span className="text-2xl font-bold text-[#C20F47] tabular-nums block mt-1.5">{currency} {(totalInvoiced / 1000).toFixed(1)}k</span>
          <span className="text-[11px] text-[#C20F47] font-medium block mt-2">
            {invoicesLogs.length} active invoices
          </span>
          <Receipt className="w-16 h-16 text-slate-50 absolute -right-2 -bottom-2 z-0" />
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm relative overflow-hidden">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Total Cleared</span>
          <span className="text-2xl font-bold text-emerald-600 tabular-nums block mt-1.5">{currency} {(totalPaid / 1000).toFixed(1)}k</span>
          <span className="text-[11px] text-emerald-600 font-medium block mt-2">
            {Math.round((totalPaid / (totalInvoiced || 1)) * 100)}% collection rate
          </span>
          <CheckCircle2 className="w-16 h-16 text-slate-50 absolute -right-2 -bottom-2 z-0" />
        </div>

        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] px-4 py-3.5 rounded-[1.25rem] shadow-sm relative overflow-hidden">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wide block">Outstanding Due</span>
          <span className="text-2xl font-bold text-rose-500 tabular-nums block mt-1.5">{currency} {(totalBalance / 1000).toFixed(1)}k</span>
          <span className="text-[11px] text-rose-600 font-medium block mt-2">
            Pending fee arrears
          </span>
          <Wallet className="w-16 h-16 text-slate-50 absolute -right-2 -bottom-2 z-0" />
        </div>
      </div>

      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FileSignature className="w-3.5 h-3.5 text-indigo-600" /> Students Billing Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">Issue, inspect, and reconcile pupil fee invoices.</p>
          </div>
          <button 
            onClick={() => {
              setNewInvStudent('');
              setNewInvAmount(25000);
              setShowAddInvoiceModal(true);
            }}
            className="px-3.5 py-2 bg-[#C20F47] text-white text-xs font-medium rounded-lg hover:bg-[#3D1D3F] transition cursor-pointer flex items-center gap-1.5 shadow-sm border-none shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Issue Invoice
          </button>
        </div>

        {/* Filter and control panel */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search billed name or invoice ID..." 
              value={invoicesSearchQuery}
              onChange={e => setInvoicesSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-xs font-normal text-slate-700 transition tabular-nums"
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={invoicesStatusFilter}
              onChange={e => setInvoicesStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none text-slate-700 cursor-pointer"
            >
              <option value="All">All Invoices</option>
              <option value="Fully Paid">Fully Cleared Only</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Unpaid">Unpaid Dues</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Invoice Ref.</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Student</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs whitespace-nowrap">Invoiced</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs whitespace-nowrap">Paid</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs whitespace-nowrap">Balance</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Date</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-center">Status</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                       <FileSignature className="w-7 h-7 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm">No invoices match this search or filter.</p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(i => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      key={i.id} 
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-2.5 tabular-nums text-slate-400 text-xs">{i.id}</td>
                      <td className="px-4 py-2.5">
                        <span className="font-semibold text-slate-800 leading-tight block text-sm">{i.name}</span>
                        <span className="text-slate-400 text-[11px]">Form {i.form}</span>
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-slate-700 font-medium text-sm">{currency} {i.amount.toLocaleString()}</td>
                      <td className="px-4 py-2.5 tabular-nums text-emerald-600 font-medium text-sm">{currency} {i.paid.toLocaleString()}</td>
                      <td className="px-4 py-2.5 tabular-nums text-rose-600 font-medium text-sm">
                        {i.balance === 0 ? (
                          <span className="text-emerald-600 font-medium text-[11px]">Cleared</span>
                        ) : (
                          `${currency} ${i.balance.toLocaleString()}`
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 tabular-nums text-xs">{i.date}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(i.status)}`}>
                          {i.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        {i.balance > 0 && (
                          <button
                            onClick={() => {
                              setPaymentInvoiceId(i.id);
                              setPaymentAmount(i.balance);
                              setPaymentReceipt('');
                              setPaymentMethod('MPESA');
                              setShowRecordPaymentModal(true);
                            }}
                            className="px-2.5 py-1 text-[11px] text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors font-medium cursor-pointer border-none"
                          >
                            Pay Dues
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setInvoicesLogs(prev => prev.filter(inv => inv.id !== i.id));
                            toast.success(`Invoice ${i.id} excluded.`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center border-none bg-transparent"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD INVOICE MODAL */}
      <AnimatePresence>
        {showAddInvoiceModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileSignature className="w-3.5 h-3.5" /> Issue Invoice
                </h3>
                <button onClick={() => setShowAddInvoiceModal(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Student</label>
                  <select 
                    value={newInvStudent}
                    onChange={e => {
                      setNewInvStudent(e.target.value);
                      const s = mockStudents.find(st => st.name === e.target.value);
                      if (s) setNewInvForm(s.form);
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                  >
                    <option value="">-- Choose pupil --</option>
                    {mockStudents.map(s => (
                      <option key={s.id} value={s.name}>{s.name} (Form {s.form} - Ad. {s.admissionNo})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Form</label>
                    <select 
                      value={newInvForm}
                      onChange={e => setNewInvForm(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                    >
                      <option value={1}>Form 1</option>
                      <option value={2}>Form 2</option>
                      <option value={3}>Form 3</option>
                      <option value={4}>Form 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Total Charge</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs tabular-nums">{currency}</span>
                      <input 
                        type="number" 
                        value={newInvAmount}
                        onChange={e => setNewInvAmount(Number(e.target.value) || 0)}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium tabular-nums transition text-slate-900"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      if (!newInvStudent.trim()) {
                        toast.error('Please specify a valid candidate student.');
                        return;
                      }
                      if (newInvAmount <= 0) {
                        toast.error('Please enter a valid ledger billing rate.');
                        return;
                      }
                      
                      const newId = `INV-2026-0${invoicesLogs.length + 1}`;
                      setInvoicesLogs([
                        {
                          id: newId,
                          name: newInvStudent,
                          form: newInvForm,
                          amount: newInvAmount,
                          paid: 0,
                          balance: newInvAmount,
                          date: new Date().toISOString().split('T')[0],
                          status: 'Unpaid'
                        },
                        ...invoicesLogs
                      ]);

                      toast.success(`Invoice ${newId} incurred successfully for ${newInvStudent}!`);
                      setShowAddInvoiceModal(false);
                    }}
                    className="w-full py-2.5 bg-[#C20F47] text-white font-medium rounded-lg shadow-sm text-sm hover:bg-[#3D1D3F] transition-colors cursor-pointer border-none"
                  >
                    Generate Invoice
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECORD PAYMENT MODAL */}
      <AnimatePresence>
        {showRecordPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5" /> Record Fee Payment
                </h3>
                <button onClick={() => setShowRecordPaymentModal(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="p-5 space-y-3.5">
              <div className="bg-slate-50 p-3 rounded-xl">
                 <span className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide">Target Invoice</span>
                 <span className="block tabular-nums text-sm font-semibold text-slate-800 mt-0.5">{paymentInvoiceId}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Amount Received</label>
                  <div className="relative">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs tabular-nums">{currency}</span>
                    <input 
                      type="number" 
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(Number(e.target.value) || 0)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-lg font-bold tabular-nums transition text-emerald-700"
                      min="1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Payment Method</label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition"
                  >
                    <option value="MPESA">M-PESA Paybill</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Receipt Reference (optional)</label>
                  <input 
                    type="text" 
                    value={paymentReceipt}
                    onChange={e => setPaymentReceipt(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-sm font-medium tabular-nums transition text-slate-800 placeholder:text-slate-400"
                    placeholder="e.g. QLK92MNX"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      if (paymentAmount <= 0) {
                        toast.error('Payment amount must be greater than zero.');
                        return;
                      }
                      
                      let updated = false;
                      setInvoicesLogs(prev => prev.map(inv => {
                        if (inv.id === paymentInvoiceId) {
                          if (paymentAmount > inv.balance) {
                            toast.error(`Payment exceeds the outstanding balance of ${currency} ${inv.balance.toLocaleString()}`);
                            return inv;
                          }
                          updated = true;
                          const newPaid = inv.paid + paymentAmount;
                          const newBalance = inv.amount - newPaid;
                          return {
                            ...inv,
                            paid: newPaid,
                            balance: newBalance,
                            status: newBalance === 0 ? 'Fully Paid' : 'Partially Paid'
                          };
                        }
                        return inv;
                      }));

                      if (updated) {
                        toast.success(`Payment of ${currency} ${paymentAmount.toLocaleString()} via ${paymentMethod} recorded!`);
                        setShowRecordPaymentModal(false);
                      }
                    }}
                    className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-lg shadow-sm text-sm hover:bg-emerald-700 transition-colors cursor-pointer border-none"
                  >
                    Confirm Payment
                  </button>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
