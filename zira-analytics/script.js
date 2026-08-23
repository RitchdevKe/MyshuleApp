const fs = require('fs');

const content = fs.readFileSync('src/components/AccountingSubsystem.tsx', 'utf8');

const targetStart = "      {/* TAB 1: ACCOUNTING DASHBOARD */}";
const targetEnd = "      {/* TAB 2: GENERAL LEDGER */}";

const startIdx = content.indexOf(targetStart);
const endIdx = content.indexOf(targetEnd);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find boundaries", startIdx, endIdx);
  process.exit(1);
}

const newDashContent = `      {/* TAB 1: ACCOUNTING DASHBOARD */}
      {tab === 'accounting_dash' && (
        <div className="space-y-6">
          {/* Header Card (Accentra dark style) */}
          <div className="bg-[#181A25] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6">
               <div className="space-y-8 flex-1 w-full">
                  <div className="flex items-center gap-6">
                     <span className="text-xl font-bold font-display tracking-tight text-white">Accentra</span>
                     <div className="hidden lg:flex p-1.5 bg-[#2B2D3B] rounded-full text-[12px] font-bold text-slate-400">
                        <button className="px-5 py-2 rounded-full bg-[#181A25] text-white shadow-sm transition">Dashboard</button>
                        <button className="px-5 py-2 rounded-full hover:text-white transition">Transactions</button>
                        <button className="px-5 py-2 rounded-full hover:text-white transition">Invoice</button>
                        <button className="px-5 py-2 rounded-full hover:text-white transition">Report</button>
                        <button className="px-5 py-2 rounded-full hover:text-white transition">Bank Reconcile</button>
                     </div>
                  </div>
                  <div>
                     <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome, Anne!</h2>
                  </div>
               </div>
               
               <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto self-end mt-4 md:mt-0">
                  <div className="w-full sm:w-auto bg-[#2B2D3B] text-white text-[12px] font-bold px-4 py-3 rounded-2xl flex items-center justify-between sm:justify-start gap-3 border border-white/5 shadow-sm">
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-300" /> 24 Mar, 2025 - 24 Apr, 2025</span>
                    <span className="text-slate-300 text-[10px] ml-2">v</span>
                  </div>
                  <button className="w-full sm:w-auto bg-[#8862F0] hover:bg-[#7D54E5] text-white flex items-center gap-2 text-[12px] font-bold px-5 py-3 rounded-2xl transition shadow-[0_4px_14px_rgba(136,98,240,0.3)]">
                    <span className="text-lg leading-none mt-[-2px]">+</span> Create New Invoice
                  </button>
               </div>
            </div>
          </div>

          {/* Core Metrics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
             {/* Total Revenue */}
             <div className="bg-[#181A25] rounded-[32px] p-6 text-white shadow-sm flex flex-col justify-between overflow-hidden relative group border border-[#2B2D3B]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8862F0]/20 to-indigo-500/10 opacity-100" />
                <span className="text-[14px] font-bold text-slate-400 block mb-5 relative z-10 flex justify-between items-center tracking-wide">
                  Total Revenue <TrendingUp className="w-5 h-5 text-emerald-400 opacity-80" />
                </span>
                <span className="text-3xl font-black tracking-tight text-white relative z-10">$50,904.00</span>
                <div className="flex items-center gap-2 mt-5 relative z-10">
                   <span className="text-[11px] text-slate-400 font-medium">Since last month</span>
                   <span className="bg-[#1E3A32] text-[#4ADE80] text-[11px] font-bold px-2 py-0.5 rounded-full">+3.5%</span>
                </div>
             </div>

             {/* Expenses */}
             <div className="bg-white rounded-[32px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <span className="text-[14px] font-bold text-slate-600 block mb-5 flex justify-between items-center tracking-wide">
                  Expenses <TrendingDown className="w-5 h-5 text-emerald-400 opacity-80" />
                </span>
                <span className="text-3xl font-black tracking-tight text-slate-900">$3,000.00</span>
                <div className="flex items-center gap-2 mt-5">
                   <span className="text-[11px] text-slate-400 font-medium">since last month</span>
                   <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-full">+2.5%</span>
                </div>
             </div>

             {/* Net Profit */}
             <div className="bg-white rounded-[32px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <span className="text-[14px] font-bold text-slate-600 block mb-5 flex justify-between items-center tracking-wide">
                  Net Profit <TrendingUp className="w-5 h-5 text-emerald-400 opacity-80" />
                </span>
                <span className="text-3xl font-black tracking-tight text-slate-900">$47,904.00</span>
                <div className="flex items-center gap-2 mt-5">
                   <span className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-full">+10.03%</span>
                   <span className="text-[11px] text-slate-400 font-medium">from last month</span>
                </div>
             </div>

             {/* Invoice */}
             <div className="bg-white p-6 rounded-[32px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center justify-between">
                <div className="flex justify-between items-center w-full mb-2">
                   <span className="text-[14px] font-bold text-slate-800 tracking-wide">Invoice</span>
                   <span className="text-slate-300 font-bold tracking-widest text-lg cursor-pointer">...</span>
                </div>
                <div className="relative w-32 h-32 flex items-center justify-center -mt-2">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={[{name: 'Paid', value: 300}, {name: 'Unpaid', value: 150}, {name: 'Overdue', value: 50}]} cx="50%" cy="50%" innerRadius={42} outerRadius={56} stroke="none" dataKey="value" strokeWidth={0}>
                          <Cell fill="#181A25" />
                          <Cell fill="#8862F0" />
                          <Cell fill="#4ADE80" />
                       </Pie>
                     </PieChart>
                   </ResponsiveContainer>
                   <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-xl font-black text-slate-900 leading-none">500</span>
                     <span className="text-[8px] uppercase text-slate-400 w-12 text-center leading-tight font-bold tracking-tight mt-1">Total Invoice this month</span>
                   </div>
                </div>
                <div className="flex justify-between gap-2 w-full mt-4 flex-wrap">
                   <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm shrink-0 bg-[#181A25]"></span><span className="text-[10px] text-slate-400 font-bold tracking-wide">Paid Invoice</span></div>
                   <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm shrink-0 bg-[#8862F0]"></span><span className="text-[10px] text-slate-400 font-bold tracking-wide">Unpaid Invoice</span></div>
                   <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm shrink-0 bg-[#4ADE80]"></span><span className="text-[10px] text-slate-400 font-bold tracking-wide">Overdue Invoice</span></div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Revenue Area Chart */}
             <div className="lg:col-span-2 bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between min-h-[340px]">
                <div className="flex justify-between items-start mb-6 w-full">
                   <div>
                      <h3 className="text-base font-bold text-slate-800 tracking-wide">Revenue</h3>
                      <div className="flex items-center mt-1">
                         <span className="text-[11px] text-emerald-500 font-medium tracking-wide">since last month <span className="font-bold">+3.5%</span></span>
                      </div>
                   </div>
                   <span className="text-slate-300 font-bold tracking-widest text-lg cursor-pointer hover:text-slate-500 transition">...</span>
                </div>
                
                <div className="h-48 w-full relative -ml-4">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevL" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8A92A6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#8A92A6" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v, i) => \`\${i+14} Apr\`} tickMargin={12} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={val => \`\${val / 1000}K\`} tickMargin={10} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                        />
                        <Area type="monotone" name="Revenue" dataKey="Revenue" stroke="#8A92A6" fillOpacity={1} fill="url(#colorRevL)" strokeWidth={2.5} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Tasks Donut Overlap Style */}
             <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center">
                <div className="flex justify-between items-start mb-6 w-full">
                   <h3 className="text-base font-bold text-slate-800 tracking-wide">Tasks</h3>
                   <span className="text-slate-300 font-bold tracking-widest text-lg cursor-pointer hover:text-slate-500 transition">...</span>
                </div>
                
                <div className="flex-1 flex items-center justify-center relative w-full h-full min-h-[220px]">
                   <div className="relative w-48 h-48 flex items-center justify-center">
                     {/* Green Circle */}
                     <div className="absolute top-0 right-2 w-[120px] h-[120px] rounded-full bg-[#4ADE80] text-white flex flex-col items-center justify-center shadow-lg shadow-[#4ADE80]/20 z-10 transition hover:scale-105 duration-300">
                        <span className="text-[28px] font-black leading-tight">20</span>
                        <span className="text-[10px] font-bold tracking-wide">Finished</span>
                     </div>
                     {/* Black Circle */}
                     <div className="absolute bottom-6 left-2 w-[90px] h-[90px] rounded-full bg-[#181A25] text-white flex flex-col items-center justify-center shadow-lg z-20 transition hover:scale-105 duration-300">
                        <span className="text-[20px] font-black leading-tight">7</span>
                        <span className="text-[9px] font-medium tracking-wide text-slate-300 mt-0.5">Unfinished</span>
                     </div>
                     {/* White border circle */}
                     <div className="absolute bottom-8 right-0 w-[64px] h-[64px] rounded-full bg-white border-[6px] border-slate-50 text-slate-800 flex flex-col items-center justify-center shadow-sm z-30 transition hover:scale-105 duration-300">
                        <span className="text-[16px] font-black leading-tight">2</span>
                        <span className="text-[8px] font-medium tracking-wide text-slate-500 mt-0.5">Overdue</span>
                     </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Recent Activities Section */}
          <div className="bg-white rounded-[32px] p-6 lg:p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 pb-8">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-bold text-slate-800 tracking-wide">Recent Activities</h3>
                <div className="flex gap-4 items-center text-slate-400">
                   <ArrowUpRight className="w-5 h-5 cursor-pointer hover:text-slate-800 transition" />
                   <span className="text-slate-300 font-bold tracking-widest text-lg cursor-pointer hover:text-slate-500 transition">...</span>
                </div>
             </div>
             
             <div className="overflow-x-auto mt-2">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50 transition border-b border-slate-100">
                       <td className="py-5 px-2 w-12">
                          <div className="w-8 h-8 rounded-full bg-[#E8F8F0] text-emerald-500 flex items-center justify-center">
                             <TrendingDown className="w-4 h-4" />
                          </div>
                       </td>
                       <td className="py-5 px-2 font-bold text-slate-700 text-[13px]">Mark . D Enterprise</td>
                       <td className="py-5 px-2 text-slate-400 text-[12px] font-medium">21Apr. 10:20AM</td>
                       <td className="py-5 px-4 font-mono text-slate-400 text-[12px]">#1246770</td>
                       <td className="py-5 px-4 font-mono text-slate-700 font-bold">+1,500</td>
                       <td className="py-5 px-2 text-right">
                          <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[#4ADE80]">
                             <span className="w-2 h-2 bg-[#4ADE80] rounded-full"></span> Completed
                          </span>
                       </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition">
                       <td className="py-5 px-2">
                          <div className="w-8 h-8 rounded-full bg-[#FEE2E2] text-[#F87171] flex items-center justify-center">
                             <TrendingUp className="w-4 h-4" />
                          </div>
                       </td>
                       <td className="py-5 px-2 font-bold text-slate-700 text-[13px]">Altima Group Ltd</td>
                       <td className="py-5 px-2 text-slate-400 text-[12px] font-medium">19Apr. 09:01AM</td>
                       <td className="py-5 px-4 font-mono text-slate-400 text-[12px]">#0016770</td>
                       <td className="py-5 px-4 font-mono text-slate-400 font-bold">-2,500</td>
                       <td className="py-5 px-2 text-right">
                          <span className="inline-flex items-center gap-2 text-[12px] font-bold text-[#4ADE80]">
                             <span className="w-2 h-2 bg-[#4ADE80] rounded-full"></span> Completed
                          </span>
                       </td>
                    </tr>
                  </tbody>
               </table>
             </div>
          </div>
        </div>
      )}
`;

const res = content.substring(0, startIdx) + newDashContent + "\n" + content.substring(endIdx);
fs.writeFileSync('src/components/AccountingSubsystem.tsx', res);
console.log("Replacement applied");
