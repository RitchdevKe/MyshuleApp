import { AlertCircle } from "lucide-react";

export default function BudgetTab({ data }: any) {
  const departments = data?.departments || [];

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
      <h3 className="text-lg font-black text-slate-800 mb-6">Departmental Budget Health</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {departments.slice(0, 2).map((dept: any) => (
            <BudgetBar key={dept.department} dept={dept} />
          ))}
        </div>
        <div className="space-y-6">
          {departments.slice(2, 4).map((dept: any) => (
            <BudgetBar key={dept.department} dept={dept} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BudgetBar({ dept }: { dept: any }) {
  const isOverBudget = dept.percentage > 100;
  
  let colorClass = "bg-blue-500";
  if (isOverBudget) {
    colorClass = "bg-rose-500";
  } else if (dept.percentage > 90) {
    colorClass = "bg-amber-500";
  } else if (dept.percentage > 70) {
    colorClass = "bg-emerald-500";
  }

  return (
    <div className="group">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-bold text-slate-600 flex items-center gap-1">
          {dept.department} {isOverBudget && "(Over Budget)"}
          {isOverBudget && <AlertCircle className="w-4 h-4 text-rose-500 animate-pulse" />}
        </span>
        <span className={`font-black px-2 rounded-md ${isOverBudget ? 'text-rose-700 bg-rose-50 border border-rose-200' : 'text-slate-700 bg-slate-100'}`}>
          {dept.percentage}% Used
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${colorClass} rounded-full group-hover:scale-x-[1.02] origin-left transition-transform`}
          style={{ width: `${Math.min(dept.percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
