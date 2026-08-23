export default function DashboardLoading() {
  return (
    <div className="w-full h-full p-6 lg:p-8 animate-pulse flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-64"></div>
        </div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-32"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        ))}
      </div>

      <div className="flex-1 min-h-[400px] bg-slate-200 dark:bg-slate-800 rounded-3xl mt-4"></div>
    </div>
  );
}
