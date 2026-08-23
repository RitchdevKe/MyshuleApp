export default function Loading() {
  return (
    <div className="p-6 md:p-8 space-y-6 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded w-48"></div>
          <div className="h-3 bg-slate-200 rounded w-64"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
        <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
        <div className="h-32 bg-slate-100 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
