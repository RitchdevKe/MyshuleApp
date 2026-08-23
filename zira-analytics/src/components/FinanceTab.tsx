import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  collection, 
  setDoc, 
  doc, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase.ts';
import { Student, FeeTransaction, FeePaymentType } from '../types.ts';
import { 
  Wallet, 
  Plus, 
  Receipt, 
  Search, 
  TrendingUp, 
  CreditCard, 
  FileCheck,
  CheckCircle,
  Clock,
  CircleDollarSign,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewEnrollmentWizard } from './NewEnrollmentWizard.tsx';
import { InvoicePreviewModal } from './InvoicePreviewModal.tsx';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface FinanceTabProps {
  students: Student[];
  transactions: FeeTransaction[];
}

export function FinanceTab({ students, transactions }: FinanceTabProps) {
  const { currency } = useCurrency();

  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'structure' | 'invoices'>('ledger');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedInvoiceStudent, setSelectedInvoiceStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<FeePaymentType>('M-Pesa');
  const [reference, setReference] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fee Structure Engine states
  const [feeItems, setFeeItems] = useState([
    { id: '1', name: 'Tuition', amount: 35000, frequency: 'Termly', category: 'Academic' },
    { id: '2', name: 'Boarding Fee', amount: 15000, frequency: 'Termly', category: 'Logistics' },
    { id: '3', name: 'Exercise Books', amount: 4500, frequency: 'Annual', category: 'Materials' },
    { id: '4', name: 'Bus Transport', amount: 8000, frequency: 'Termly', category: 'Logistics' }
  ]);
  const [showAddItem, setShowAddItem] = useState(false);

  // Financial status calculations
  const totalFeesRequired = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalFeesPaid = students.reduce((sum, s) => sum + (s.totalFees - s.feeBalance), 0);
  const totalOutstandingBalance = totalFeesRequired - totalFeesPaid;
  const collectionRate = totalFeesRequired > 0 ? ((totalFeesPaid / totalFeesRequired) * 100).toFixed(1) : '0';

  // Filter transaction statements
  const filteredTx = transactions.filter((tx) => {
    return tx.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           tx.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payVal = Number(amount);
    if (!selectedStudentId || payVal <= 0 || !reference) return;

    setLoading(true);
    const targetStudent = students.find(s => s.id === selectedStudentId);
    if (!targetStudent) {
      toast.success("Selected student record is missing.");
      setLoading(false);
      return;
    }

    const txId = 'tx-' + Date.now();
    const txDocRef = doc(db, 'fee_transactions', txId);
    const studDocRef = doc(db, 'students', selectedStudentId);

    // Prepare batch transaction
    const batch = writeBatch(db);

    const txPayload: FeeTransaction = {
      id: txId,
      studentId: selectedStudentId,
      studentName: targetStudent.name,
      amount: payVal,
      date: new Date().toISOString(),
      type: paymentType,
      reference: reference.trim().toUpperCase(),
      receivedBy: "Daniel Gitumu Hia"
    };

    const newBalance = Math.max(0, targetStudent.feeBalance - payVal);

    batch.set(txDocRef, txPayload);
    batch.update(studDocRef, { feeBalance: newBalance });

    try {
      await batch.commit();
      setAmount('');
      setReference('');
      setSelectedStudentId('');
      setFormOpen(false);
      toast.success("Payment transaction successfully recorded.");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'fee_transactions/' + txId);
    } finally {
      setLoading(false);
    }
  };

  const handleAutocompleteRef = () => {
    const randomRef = 'MP' + Math.floor(100000 + Math.random() * 900000) + 'XN';
    setReference(randomRef);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header dashboard statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-[1.25rem] border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] shadow-sm flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400 tracking-wide block">Total Cleared</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">{currency} {totalFeesPaid.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[1.25rem] border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] shadow-sm flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400 tracking-wide block">Outstanding Arrears</span>
            <p className="text-xl font-bold text-purple-700 mt-0.5 tabular-nums">{currency} {totalOutstandingBalance.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-[1.25rem] border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] shadow-sm flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase font-medium text-slate-400 tracking-wide block">Collection Rate</span>
            <p className="text-xl font-bold text-slate-900 mt-0.5 tabular-nums">{collectionRate}%</p>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit gap-1 overflow-x-auto">
        {[
          { id: 'ledger', label: 'Transactions Ledger' },
          { id: 'structure', label: 'Fee Schedule' },
          { id: 'invoices', label: 'Billing & Invoices' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border-none whitespace-nowrap ${activeSubTab === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800 bg-transparent'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'ledger' && (
        <div className="space-y-4">
          {/* Collection Velocity */}
          <div className="bg-gradient-to-br from-[#3D1D3F] to-[#1f0f20] text-white p-4 rounded-[1.5rem] relative overflow-hidden shadow-sm">
             <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-3">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-indigo-300" />
                   </div>
                   <div>
                      <h3 className="text-sm font-semibold">Collection Velocity</h3>
                      <p className="text-white/40 text-[11px] mt-0.5">Term 2 projected inflow</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                   <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">Velocity Rate</span>
                      <div className="text-xl font-bold tabular-nums">74.2%</div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[74.2%]" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">Daily Average</span>
                      <div className="text-xl font-bold tabular-nums">{currency} 42.5k</div>
                      <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +12% efficiency
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">Arrears Recovery</span>
                      <div className="text-xl font-bold tabular-nums">68.5%</div>
                      <div className="text-[11px] font-medium text-white/40">Target: 80%</div>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button className="px-3 py-2 bg-[#C20F47] text-white rounded-lg text-xs font-medium hover:bg-[#a30c3a] transition-all cursor-pointer border-none">Generate Arrears Pipeline</button>
                   <button className="px-3 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-medium hover:bg-white/20 transition-all cursor-pointer">Bulk Debt Reminder</button>
                </div>
             </div>
             <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-500/20 blur-[80px] -mr-20 -mb-20" />
          </div>

          <div className="bg-white p-3 rounded-[1.25rem] border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="relative w-full sm:w-72">
              <Search className="absolute inset-y-0 left-3 my-auto w-3.5 h-3.5 text-slate-400" />
              <input
                id="tx-search-box"
                type="text"
                placeholder="Search payment logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-lg text-xs font-normal bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
              />
            </div>

            <button
              id="open-record-fees-modal-btn"
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-medium text-white bg-[#C20F47] hover:bg-[#3D1D3F] transition shrink-0 cursor-pointer shadow-sm border-none whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Record Payment
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Recent Ledger Statements</h3>
                <p className="text-slate-400 text-xs mt-0.5">Fee collections history</p>
              </div>
              <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                {filteredTx.length} payments
              </span>
            </div>

            {filteredTx.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <CircleDollarSign className="w-7 h-7 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">No transactions match this query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[16px] font-bold text-slate-500 uppercase tracking-wider tabular-nums">
                      <th className="py-3 px-6">Transaction ID</th>
                      <th className="py-3 px-5">Student Adm</th>
                      <th className="py-3 px-5">Name</th>
                      <th className="py-3 px-4 text-center">Date</th>
                      <th className="py-3 px-4 text-center">Type</th>
                      <th className="py-3 px-4">Reference No</th>
                      <th className="py-3 px-6 text-right">Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTx.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-2.5 tabular-nums text-slate-400 text-xs">{tx.id}</td>
                        <td className="px-4 py-2.5 tabular-nums text-slate-500 text-xs">{tx.studentId}</td>
                        <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{tx.studentName}</td>
                        <td className="px-4 py-2.5 text-center text-slate-400 text-xs tabular-nums">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium">
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 tabular-nums font-medium text-indigo-600 text-sm">{tx.reference}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-slate-800 tabular-nums text-sm">
                          {currency} {tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'structure' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Fee Items</h3>
                <p className="text-xs text-slate-400 mt-0.5">Reusable billing components</p>
              </div>
              <button 
                onClick={() => setShowAddItem(true)}
                className="px-3 py-2 bg-[#C20F47] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm hover:bg-[#3D1D3F] transition cursor-pointer border-none"
              >
                <Plus className="w-3.5 h-3.5" /> New Fee Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {feeItems.map(item => (
                <div key={item.id} className="bg-slate-50 p-3 rounded-xl space-y-2 hover:bg-slate-100 transition-colors group">
                   <div className="flex justify-between items-start">
                    <span className="text-[10px] font-medium uppercase text-slate-400 tracking-wide">{item.category}</span>
                    <button className="text-slate-300 group-hover:text-rose-500 transition-colors border-none bg-transparent cursor-pointer">
                      <Plus className="w-3.5 h-3.5 rotate-45" />
                    </button>
                   </div>
                   <h4 className="font-semibold text-slate-800 text-sm">{item.name}</h4>
                   <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-900 tabular-nums">{currency} {item.amount.toLocaleString()}</span>
                    <span className="text-[10px] font-medium text-slate-400">/ {item.frequency}</span>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-3.5 rounded-xl flex items-start gap-2.5 text-amber-900">
            <div className="w-8 h-8 bg-amber-100 rounded-lg text-amber-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h4 className="font-semibold text-xs">Penalty & Discount Rules</h4>
              <p className="text-xs leading-relaxed opacity-80 mt-0.5">Sibling discount (15%), early-bird waiver (5%), and late penalty ({currency} 500/week) apply automatically.</p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'invoices' && (
        <div className="bg-white p-4 rounded-[1.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] shadow-sm space-y-2">
           <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Billing Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">Generate official invoices for parents</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer">Export All (PDF)</button>
                 <button className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 cursor-pointer border-none">Bulk Email</button>
              </div>
           </div>

           <div className="divide-y divide-slate-50">
              {students.slice(0, 5).map(s => (
                <div key={s.id} className="py-3 flex items-center justify-between group">
                   <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center font-semibold text-slate-400 text-xs shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {s.name.split(' ')[0][0]}{s.name.split(' ')[1]?.[0] || ''}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-800 text-sm truncate">{s.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                           <span className="tabular-nums">{s.id}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                           <span>Form {s.form} {s.stream}</span>
                        </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 shrink-0">
                       <div className="text-right">
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide block">Balance</span>
                          <span className={`text-sm font-semibold tabular-nums ${s.feeBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>{currency} {s.feeBalance.toLocaleString()}</span>
                       </div>
                       <button 
                          onClick={() => setSelectedInvoiceStudent(s)}
                          className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer bg-transparent"
                       >
                          <Receipt className="w-3.5 h-3.5" />
                       </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* 4. RECIEPT RECORD MODAL FORM */}
      {formOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
              <h3 className="font-semibold text-sm">Record Fees Receipt</h3>
              <button 
                id="close-finance-modal-btn"
                onClick={() => setFormOpen(false)}
                className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent text-xs font-medium"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Student</label>
                <select
                  id="fees-student-select"
                  required
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition cursor-pointer"
                >
                  <option value="" className="bg-white text-slate-400">Select a student...</option>
                  {students.map((stud) => (
                    <option key={stud.id} value={stud.id} className="bg-white text-slate-800">
                      {stud.name} ({stud.id}) — Balance: {currency} {stud.feeBalance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Receipt Amount ({currency})</label>
                <input
                  id="fees-receipt-amount"
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-3.5 py-2 hover:border-slate-300 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Payment Mode</label>
                  <select
                    id="fees-payment-type"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value as FeePaymentType)}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition cursor-pointer"
                  >
                    <option value="M-Pesa" className="bg-white text-slate-800">M-Pesa</option>
                    <option value="Bank Deposit" className="bg-white text-slate-800">Bank Deposit</option>
                    <option value="Cash" className="bg-white text-slate-800">Cash</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-slate-500">Ref Number</label>
                    <button 
                      id="regen-ref-btn"
                      type="button" 
                      onClick={handleAutocompleteRef}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer border-none bg-transparent"
                    >
                      Autofill Ref
                    </button>
                  </div>
                  <input
                    id="fees-payment-reference"
                    type="text"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. QX938472M"
                    className="w-full px-3.5 py-2 hover:border-slate-300 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3.5 border-t border-slate-100 -mx-5 -mb-5 px-5 py-3.5 bg-slate-50">
                <button
                  id="cancel-record-btn"
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-3.5 py-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition font-medium text-sm border-none bg-transparent"
                >
                  Cancel
                </button>
                <button
                  id="submit-record-btn"
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-white bg-[#C20F47] hover:bg-[#3D1D3F] rounded-lg shadow-sm cursor-pointer transition disabled:opacity-70 font-medium text-sm border-none"
                >
                  {loading ? 'Processing…' : 'Apply Payment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* 5. INVOICE PREVIEW MODAL */}
      <AnimatePresence>
        {selectedInvoiceStudent && (
          <InvoicePreviewModal 
            student={selectedInvoiceStudent} 
            onClose={() => setSelectedInvoiceStudent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
