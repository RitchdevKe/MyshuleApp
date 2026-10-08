"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function FilterControls({ classes }: { classes: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [classFilter, setClassFilter] = useState(searchParams.get("classId") || "");
  const [arrearsOnly, setArrearsOnly] = useState(searchParams.get("arrearsOnly") === "true");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  const toggleArrears = () => {
    const params = new URLSearchParams(searchParams);
    const newArrears = !arrearsOnly;
    setArrearsOnly(newArrears);
    if (newArrears) {
      params.set("arrearsOnly", "true");
    } else {
      params.delete("arrearsOnly");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    const val = e.target.value;
    setClassFilter(val);
    if (val) {
      params.set("classId", val);
    } else {
      params.delete("classId");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-5 border-b border-slate-100/80 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
      <div className="relative w-full sm:w-96">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search student name, ADM no..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 font-medium shadow-sm transition-all"
        />
      </div>
      <div className="flex gap-2">
        <div className="relative flex items-center">
          <Filter className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <select
            value={classFilter}
            onChange={handleClassChange}
            className="appearance-none pl-11 pr-10 py-2.5 bg-white border border-slate-200/80 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
          >
            <option value="">All Grades/Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
        </div>
        <button
          onClick={toggleArrears}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl font-bold text-sm transition-all shadow-sm ${
            arrearsOnly
              ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
              : "bg-white border-slate-200/80 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter className={`w-4 h-4 ${arrearsOnly ? "text-rose-400" : "text-slate-400"}`} />
          Status: Arrears
        </button>
      </div>
    </div>
  );
}
