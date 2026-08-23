import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Calendar,
  User,
  CreditCard,
  History
} from 'lucide-react';
import { Student } from '../types.ts';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface InvoicePreviewModalProps {
  student: Student;
  onClose: () => void;
}

export function InvoicePreviewModal({ student, onClose }: InvoicePreviewModalProps) {
  const { currency } = useCurrency();

  const currentTerm = "Term 2, 2026";
  const dueDate = "June 30, 2026";
  const schoolName = "Karega Secondary School";
  
  const handleSendSMS = () => {
    toast.success(`Success: Invoice summary sent to parent of ${student.name}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header Actions */}
        <div className="px-8 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
               <ShieldCheck className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-base font-bold text-slate-900 uppercase tracking-wide">Official Billing Preview</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Invoice Body (The PDF Style part) */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12 print:p-0" id="printable-invoice">
          {/* School Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white font-bold text-3xl">
                 K
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter">{schoolName}</h2>
                <p className="text-[15px] font-bold text-slate-400 uppercase tracking-wide mt-1">Registry of Financial Accounts</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-500 uppercase">
                    <Calendar className="w-3.5 h-3.5" /> {new Date().toLocaleDateString()}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-500 uppercase">
                    <User className="w-3.5 h-3.5" /> Adm: {student.id}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[14px] font-bold uppercase tracking-wide mb-4">Invoice #INV-{Date.now().toString().slice(-6)}</span>
              <h3 className="text-5xl font-bold text-slate-900 tracking-tighter">{currency} {student.feeBalance.toLocaleString()}</h3>
              <p className="text-[15px] font-bold text-rose-500 uppercase mt-2">Outstanding Balance</p>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <span className="text-[14px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-4">Billed To</span>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900 uppercase">{student.name}</p>
                <p className="text-base font-bold text-slate-500 uppercase tracking-tight">Form {student.form} {student.stream}</p>
                <p className="text-base font-bold text-slate-500 mt-2">Registry ID: {student.id}</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[14px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-4">Payment Schedule</span>
              <div className="space-y-1">
                <p className="text-lg font-bold text-slate-900 uppercase">Due Date: {dueDate}</p>
                <p className="text-base font-bold text-slate-500 uppercase tracking-tight">Period: {currentTerm}</p>
                <div className="mt-4 flex items-center justify-end gap-2">
                   <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                         <CreditCard className="w-3 h-3 text-slate-400" />
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                         <History className="w-3 h-3 text-slate-400" />
                      </div>
                   </div>
                   <span className="text-[14px] font-bold text-[var(--color-secondary)] uppercase">Verified Agent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Breakdown Table */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <span className="text-[15px] font-bold text-slate-900 uppercase tracking-wide whitespace-nowrap">Billing Summary Breakdown</span>
               <div className="h-px bg-slate-50 w-full" />
            </div>
            
            <div className="overflow-hidden bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-3xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100/50 text-[14px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100">
                    <th className="py-4 px-6">Description</th>
                    <th className="py-4 px-6 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-base font-bold text-slate-700 divide-y divide-slate-100">
                  <tr>
                    <td className="py-5 px-6 uppercase">Tuition & Operational Base Fees</td>
                    <td className="py-5 px-6 text-right tabular-nums">{currency} {student.totalFees.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="py-5 px-6 uppercase">Previous Credits / Payments Applied</td>
                    <td className="py-5 px-6 text-right tabular-nums text-emerald-600">- {currency} {(student.totalFees - student.feeBalance).toLocaleString()}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-5 px-6 uppercase text-slate-900 font-bold">Net Amount Due</td>
                    <td className="py-5 px-6 text-right font-bold text-slate-900 text-xl tabular-nums">{currency} {student.feeBalance.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <p className="text-[14px] font-bold text-slate-400 uppercase leading-relaxed text-center italic">
               This is an automatically generated electronic invoice. Verification can be performed via the parent portal using the student's unique identifiers. 
               Late payments may attract penalties as per the school's finance policy.
             </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <button 
             onClick={handleSendSMS}
             className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
             <Smartphone className="w-5 h-5 text-[var(--color-secondary)]" /> Send SMS Alert to Parent
          </button>
          
          <div className="flex gap-4 sm:w-auto">
            <button 
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-1.5 py-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 rounded-2xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button 
              onClick={() => toast.success("Invoice PDF generated and downloaded.")}
              className="flex-1 sm:flex-none px-1.5 py-2 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] text-slate-600 rounded-2xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <Download className="w-4 h-4" /> PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
