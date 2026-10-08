"use client";

import React, { useState, useTransition } from 'react';
import { 
  CheckCircle2, Wallet, GraduationCap, Users, BookOpen, Truck, 
  MessageSquare, Megaphone, FileWarning, Search, Calendar, RefreshCw
} from 'lucide-react';
import { getActivities } from './actions';

type Activity = Awaited<ReturnType<typeof getActivities>>[0];

const typeStyles: Record<string, { icon: React.ElementType, color: string, bg: string }> = {
  "Admin": { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100" },
  "Library": { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
  "Admission": { icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-100" },
  "Academic": { icon: Users, color: "text-indigo-500", bg: "bg-indigo-100" },
  "Finance": { icon: Wallet, color: "text-amber-500", bg: "bg-amber-100" },
  "Transport": { icon: Truck, color: "text-teal-500", bg: "bg-teal-100" },
  "Communication": { icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-100" },
  "Announcement": { icon: Megaphone, color: "text-rose-500", bg: "bg-rose-100" },
  "HR": { icon: Users, color: "text-orange-500", bg: "bg-orange-100" },
  "default": { icon: CheckCircle2, color: "text-slate-500", bg: "bg-slate-100" },
};

const FILTERS = ["All", "Academic", "Finance", "HR", "Transport", "Library", "Admin", "Communication", "Announcement"];

export default function ActivitiesClient({ initialActivities }: { initialActivities: Activity[] }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [hasMore, setHasMore] = useState(initialActivities.length >= 20);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    startTransition(async () => {
      const filtered = await getActivities(20, filter, dateFilter ? new Date(dateFilter) : undefined);
      setActivities(filtered);
      setHasMore(filtered.length >= 20);
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDateFilter(newDate);
    startTransition(async () => {
      const filtered = await getActivities(20, activeFilter, newDate ? new Date(newDate) : undefined);
      setActivities(filtered);
      setHasMore(filtered.length >= 20);
    });
  };

  const loadMore = () => {
    if (activities.length === 0) return;
    const lastActivity = activities[activities.length - 1];
    startTransition(async () => {
      const more = await getActivities(20, activeFilter, new Date(lastActivity.timestamp));
      setActivities((prev) => [...prev, ...more]);
      setHasMore(more.length >= 20);
    });
  };

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl shadow-md border border-slate-100 p-6 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
          {FILTERS.map((filter) => (
            <button 
              key={filter} 
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-primary-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search activities..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors" 
            />
          </div>
          <div className="relative flex items-center">
             <Calendar className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
             <input 
               type="date"
               value={dateFilter}
               onChange={handleDateChange}
               className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
             />
          </div>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
        {isPending && activities.length === 0 && (
          <div className="pl-8 text-sm text-slate-500 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading activities...
          </div>
        )}
        
        {!isPending && filteredActivities.length === 0 && (
          <div className="pl-8 text-sm text-slate-500">No activities found matching your criteria.</div>
        )}

        {filteredActivities.map((item) => {
          const style = typeStyles[item.type] || typeStyles.default;
          const Icon = style.icon;

          return (
            <div key={item.id} className="relative pl-8">
              {/* Timeline Dot */}
              <div className={`absolute -left-4 top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${style.bg} ${style.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              
              {/* Content */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 group-hover:text-primary-900 transition-colors">{item.title}</h4>
                  <span className="text-xs font-semibold text-slate-400 ml-4 whitespace-nowrap">{item.time}</span>
                </div>
                {item.description && (
                  <p className="text-sm text-slate-500 mb-2">{item.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${style.bg} ${style.color}`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <button 
          onClick={loadMore}
          disabled={isPending}
          className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? <><RefreshCw className="w-4 h-4 animate-spin" /> Loading...</> : "Load More Activities"}
        </button>
      )}
    </div>
  );
}
