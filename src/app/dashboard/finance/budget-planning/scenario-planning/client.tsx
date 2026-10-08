"use client";

import React, { useState, useTransition } from "react";
import { SplitSquareHorizontal, Save, Play, Percent, Users, TrendingDown, ArrowRight } from "lucide-react";
import { saveScenarioAction } from "./actions";

type ScenarioProps = {
  budget: { id: string; name: string; totalAmount: number };
  baseBudget: number;
  baseRevenue: number;
  scenarios: { id: string; name: string; description: string | null; adjustedAmount: number }[];
};

export default function ScenarioClient({ budget, baseBudget, baseRevenue, scenarios }: ScenarioProps) {
  const [enrollmentChange, setEnrollmentChange] = useState(0);
  const [inflationRate, setInflationRate] = useState(5);
  const [feeIncrease, setFeeIncrease] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Simple mock projection logic
  const projectedRevenue = baseRevenue * (1 + (enrollmentChange / 100)) * (1 + (feeIncrease / 100));
  const projectedBudget = baseBudget * (1 + (inflationRate / 100));
  const projectedNet = projectedRevenue - projectedBudget;

  const handleSaveScenario = () => {
    startTransition(async () => {
      try {
        const name = `Scenario (E:${enrollmentChange}%, I:${inflationRate}%, F:${feeIncrease}%)`;
        const description = JSON.stringify({ enrollmentChange, inflationRate, feeIncrease });
        
        await saveScenarioAction(budget.id, name, description, projectedNet);
        alert("Scenario saved successfully!");
      } catch (error) {
        console.error("Failed to save scenario", error);
        alert("Failed to save scenario");
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Financial Scenario Modeling</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Simulate changes in key drivers to see impact on net position.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveScenario}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all disabled:opacity-50">
             <Save className="w-4 h-4" /> {isPending ? "Saving..." : "Save Scenario"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
         {/* Left Column: Levers/Inputs */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6">
               <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                     <SplitSquareHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800">Model Parameters</h3>
               </div>
               
               <div className="space-y-6">
                  {/* Slider 1 */}
                  <div>
                     <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400"/> Enrollment Change</label>
                        <span className={`text-sm font-black ${enrollmentChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{enrollmentChange > 0 ? '+' : ''}{enrollmentChange}%</span>
                     </div>
                     <input 
                        type="range" min="-20" max="20" step="1" 
                        value={enrollmentChange} onChange={(e) => setEnrollmentChange(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                     />
                  </div>

                  {/* Slider 2 */}
                  <div>
                     <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-slate-400"/> General Inflation</label>
                        <span className="text-sm font-black text-rose-600">+{inflationRate}%</span>
                     </div>
                     <input 
                        type="range" min="0" max="15" step="0.5" 
                        value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                     />
                  </div>

                  {/* Slider 3 */}
                  <div>
                     <div className="flex justify-between items-end mb-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Percent className="w-4 h-4 text-slate-400"/> Fee Adjustment</label>
                        <span className={`text-sm font-black ${feeIncrease >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{feeIncrease > 0 ? '+' : ''}{feeIncrease}%</span>
                     </div>
                     <input 
                        type="range" min="-5" max="15" step="1" 
                        value={feeIncrease} onChange={(e) => setFeeIncrease(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                     />
                  </div>
               </div>

               <button className="w-full mt-8 py-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Run Simulation
               </button>
            </div>
         </div>

         {/* Right Column: Output comparison */}
         <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col mb-6">
               <div className="grid grid-cols-2 divide-x divide-slate-100 flex-1">
                  
                  {/* Base Scenario */}
                  <div className="p-8 bg-slate-50/50">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Base Line (Current FY)</h3>
                     
                     <div className="space-y-6">
                        <div>
                           <p className="text-xs font-semibold text-slate-500 mb-1">Projected Revenue</p>
                           <p className="text-2xl font-black text-slate-800">KSh {(baseRevenue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                           <p className="text-xs font-semibold text-slate-500 mb-1">Projected Expenses</p>
                           <p className="text-2xl font-black text-slate-800">KSh {(baseBudget / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="pt-6 border-t border-slate-200">
                           <p className="text-xs font-semibold text-slate-500 mb-1">Net Position</p>
                           <p className="text-3xl font-black text-emerald-600">KSh {((baseRevenue - baseBudget) / 1000000).toFixed(1)}M</p>
                        </div>
                     </div>
                  </div>

                  {/* Modeled Scenario */}
                  <div className="p-8 relative">
                     {/* Arrow indicator pointing from Base to Modeled */}
                     <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 shadow-sm z-10">
                        <ArrowRight className="w-3 h-3" />
                     </div>

                     <h3 className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-6">Simulated Outcome</h3>
                     
                     <div className="space-y-6">
                        <div>
                           <p className="text-xs font-semibold text-slate-500 mb-1">Projected Revenue</p>
                           <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-black text-slate-800">KSh {(projectedRevenue / 1000000).toFixed(1)}M</p>
                              <span className={`text-xs font-bold ${projectedRevenue >= baseRevenue ? 'text-emerald-500' : 'text-rose-500'}`}>
                                 {projectedRevenue >= baseRevenue ? '+' : '-'}{Math.abs(((projectedRevenue - baseRevenue)/baseRevenue) * 100).toFixed(1)}%
                              </span>
                           </div>
                        </div>
                        <div>
                           <p className="text-xs font-semibold text-slate-500 mb-1">Projected Expenses</p>
                           <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-black text-slate-800">KSh {(projectedBudget / 1000000).toFixed(1)}M</p>
                              <span className={`text-xs font-bold ${projectedBudget <= baseBudget ? 'text-emerald-500' : 'text-rose-500'}`}>
                                 {projectedBudget > baseBudget ? '+' : '-'}{Math.abs(((projectedBudget - baseBudget)/baseBudget) * 100).toFixed(1)}%
                              </span>
                           </div>
                        </div>
                        <div className="pt-6 border-t border-slate-200">
                           <p className="text-xs font-semibold text-slate-500 mb-1">Net Position</p>
                           <div className="flex items-baseline gap-2">
                              <p className={`text-3xl font-black ${projectedNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                 KSh {(projectedNet / 1000000).toFixed(1)}M
                              </p>
                              <span className={`text-sm font-bold ${projectedNet >= (baseRevenue - baseBudget) ? 'text-emerald-500' : 'text-rose-500'}`}>
                                 {projectedNet >= (baseRevenue - baseBudget) ? '+' : ''}{((projectedNet - (baseRevenue - baseBudget)) / 1000000).toFixed(1)}M
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>

            {/* Saved Scenarios List */}
            {scenarios && scenarios.length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6">
                 <h3 className="font-bold text-slate-800 mb-4">Saved Scenarios</h3>
                 <div className="space-y-4">
                   {scenarios.map(scenario => (
                     <div key={scenario.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <div>
                         <p className="font-semibold text-slate-800">{scenario.name}</p>
                         {scenario.description && (
                            <p className="text-xs text-slate-500 mt-1">{scenario.description}</p>
                         )}
                       </div>
                       <div className="text-right">
                         <p className="text-xs text-slate-500">Adjusted Amount</p>
                         <p className={`font-bold ${scenario.adjustedAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            KSh {(scenario.adjustedAmount / 1000000).toFixed(1)}M
                         </p>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
         </div>

      </div>
    </div>
  );
}
