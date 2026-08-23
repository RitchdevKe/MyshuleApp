export default function AcademicLoading() {
  return (
    <div className="p-6 md:p-8 animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-44"></div>
            <div className="h-3 bg-slate-200 rounded w-64"></div>
          </div>
        </div>
        <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
      </div>
      <div className="space-y-3">
        <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
        <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
        <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
        <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
      </div>
      <div className="h-40 bg-slate-100 rounded-2xl w-full"></div>
    </div>
  );
}
