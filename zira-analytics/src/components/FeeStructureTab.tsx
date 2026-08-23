import React, { useState } from 'react';
import { Plus, X, ListTree, Calculator, Shapes, Settings2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

export function FeeStructureTab() {
  const { currency } = useCurrency();

  const [feeStructureItems, setFeeStructureItems] = useState([
    { id: '1', item: 'Tuition Fees', form1_2: 12000, form3_4: 15000, frequency: 'Per Term' },
    { id: '2', item: 'Boarding & Accommodation', form1_2: 8000, form3_4: 8000, frequency: 'Per Term' },
    { id: '3', item: 'Medical Cover', form1_2: 1500, form3_4: 1500, frequency: 'Per Year' },
    { id: '4', item: 'Activity Fee', form1_2: 2500, form3_4: 2500, frequency: 'Per Term' },
    { id: '5', item: 'Caution Money', form1_2: 2000, form3_4: 2000, frequency: 'One-Time' }
  ]);

  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [newFeeItemName, setNewFeeItemName] = useState('');
  const [newFeeForm12Val, setNewFeeForm12Val] = useState(5000);
  const [newFeeForm34Val, setNewFeeForm34Val] = useState(6000);
  const [newFeeFreq, setNewFeeFreq] = useState('Per Term');

  const totalForm1_2 = feeStructureItems.map(f => f.form1_2).reduce((a, b) => a + b, 0);
  const totalForm3_4 = feeStructureItems.map(f => f.form3_4).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#3D1D3F] p-4 rounded-[1.25rem] shadow-sm text-white relative overflow-hidden">
           <div className="relative z-10">
             <span className="text-[11px] text-white/50 font-medium uppercase tracking-wide block">Forms 1–2 Total</span>
             <span className="text-2xl font-bold tabular-nums block mt-1">{currency} {totalForm1_2.toLocaleString()}</span>
             <span className="text-[11px] font-medium block mt-2 bg-white/10 w-fit px-2 py-0.5 rounded">
               Per billing cycle
             </span>
           </div>
           <Calculator className="w-16 h-16 text-white opacity-10 absolute -right-2 -bottom-2 z-0" />
        </div>
        
        <div className="bg-[#C20F47] p-4 rounded-[1.25rem] shadow-sm text-white relative overflow-hidden">
           <div className="relative z-10">
             <span className="text-[11px] text-white/60 font-medium uppercase tracking-wide block">Forms 3–4 Total</span>
             <span className="text-2xl font-bold tabular-nums block mt-1">{currency} {totalForm3_4.toLocaleString()}</span>
             <span className="text-[11px] font-medium block mt-2 bg-white/10 w-fit px-2 py-0.5 rounded">
               Per billing cycle
             </span>
           </div>
           <Shapes className="w-16 h-16 text-white opacity-10 absolute -right-2 -bottom-2 z-0" />
        </div>
      </div>

      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-3.5 h-3.5 text-indigo-600" /> Fee Structure
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">Billing rates for lower (F1-F2) and upper (F3-F4) bands.</p>
          </div>
          <button 
            onClick={() => {
              setNewFeeItemName('');
              setNewFeeForm12Val(5000);
              setNewFeeForm34Val(6000);
              setNewFeeFreq('Per Term');
              setShowAddFeeModal(true);
            }}
            className="px-3.5 py-2 bg-[#C20F47] text-white text-xs font-medium rounded-lg hover:bg-[#3D1D3F] transition cursor-pointer flex items-center gap-1.5 shadow-sm border-none shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Fee Item</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">F1–F2 Rate</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">F3–F4 Rate</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Frequency</th>
                <th className="px-4 py-2.5 text-right font-medium text-slate-500 text-xs">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {feeStructureItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                       <ListTree className="w-7 h-7 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm">No fee categories configured.</p>
                    </td>
                  </tr>
                ) : (
                  feeStructureItems.map(f => (
                    <motion.tr 
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       key={f.id} 
                       className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">
                        {f.item}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5 group-hover:bg-white px-1.5 py-1 rounded-lg transition border border-transparent group-hover:border-slate-200 group-hover:shadow-sm w-fit">
                          <span className="text-slate-400 text-xs tabular-nums">{currency}</span>
                          <input 
                            type="number"
                            value={f.form1_2}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setFeeStructureItems(prev => prev.map(item => item.id === f.id ? { ...item, form1_2: val } : item));
                            }}
                            className="w-20 px-1 py-0.5 bg-transparent border-none focus:outline-none text-sm font-semibold tabular-nums text-slate-800"
                            title="Edit Form 1-2 Rate"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5 group-hover:bg-white px-1.5 py-1 rounded-lg transition border border-transparent group-hover:border-slate-200 group-hover:shadow-sm w-fit">
                          <span className="text-slate-400 text-xs tabular-nums">{currency}</span>
                          <input 
                            type="number"
                            value={f.form3_4}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 0;
                              setFeeStructureItems(prev => prev.map(item => item.id === f.id ? { ...item, form3_4: val } : item));
                            }}
                            className="w-20 px-1 py-0.5 bg-transparent border-none focus:outline-none text-sm font-semibold tabular-nums text-slate-800"
                            title="Edit Form 3-4 Rate"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                           {f.frequency}
                         </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => {
                            setFeeStructureItems(prev => prev.filter(item => item.id !== f.id));
                            toast.success(`"${f.item}" removed.`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center border-none bg-transparent"
                          title="Remove Category"
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
        
        <div className="p-3 bg-indigo-50 border-t border-indigo-100 text-indigo-700 text-xs text-center">
          Tap any rate to edit it directly — changes apply instantly.
        </div>
      </div>

      {/* ADD FEE CATEGORY MODAL */}
      <AnimatePresence>
        {showAddFeeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5" /> New Fee Category
                </h3>
                <button onClick={() => setShowAddFeeModal(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="p-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Fee Item Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Science Laboratory Fees"
                    value={newFeeItemName}
                    onChange={e => setNewFeeItemName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white text-sm font-medium text-slate-800 transition"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">F1–F2 Rate</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 tabular-nums">{currency}</span>
                      <input 
                        type="number"
                        value={newFeeForm12Val}
                        onChange={e => setNewFeeForm12Val(Number(e.target.value) || 0)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 text-sm font-medium text-slate-800 tabular-nums transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">F3–F4 Rate</label>
                    <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 tabular-nums">{currency}</span>
                      <input 
                        type="number"
                        value={newFeeForm34Val}
                        onChange={e => setNewFeeForm34Val(Number(e.target.value) || 0)}
                        className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 text-sm font-medium text-slate-800 tabular-nums transition"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Frequency</label>
                  <select 
                    value={newFeeFreq}
                    onChange={e => setNewFeeFreq(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 transition"
                  >
                    <option value="Per Term">Per Term</option>
                    <option value="Per Year">Per Year</option>
                    <option value="One-Time">One-Time</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      if (!newFeeItemName.trim()) {
                        toast.error('Please name this fee item.');
                        return;
                      }

                      setFeeStructureItems([
                        ...feeStructureItems,
                        {
                          id: String(Date.now()),
                          item: newFeeItemName,
                          form1_2: newFeeForm12Val,
                          form3_4: newFeeForm34Val,
                          frequency: newFeeFreq
                        }
                      ]);

                      toast.success(`"${newFeeItemName}" added.`);
                      setShowAddFeeModal(false);
                    }}
                    className="w-full py-2.5 bg-[#C20F47] text-white font-medium rounded-lg shadow-sm text-sm hover:bg-[#3D1D3F] transition-colors cursor-pointer border-none"
                  >
                    Save Category
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
