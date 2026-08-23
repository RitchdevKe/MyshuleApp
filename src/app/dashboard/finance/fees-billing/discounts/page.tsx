"use client";

import React from "react";
import { BadgePercent } from "lucide-react";

export default function DiscountsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: "Sibling Discount (10%)", type: "Percentage", students: 42, impact: "420,000", color: "purple" },
        { name: "Academic Scholarship", type: "Fixed Amount", students: 5, impact: "250,000", color: "amber" },
        { name: "Staff Child Waiver", type: "Percentage (50%)", students: 12, impact: "275,000", color: "blue" },
      ].map((discount, i) => (
        <div key={i} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-start gap-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className={`p-4 bg-${discount.color}-50 text-${discount.color}-600 rounded-2xl`}>
            <BadgePercent className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-800">{discount.name}</h3>
            <p className="text-xs font-bold text-slate-500 mb-4">{discount.type}</p>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
               <span className="text-sm font-bold text-slate-600">{discount.students} Beneficiaries</span>
               <span className="text-sm font-black text-rose-500">- KSh {discount.impact}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
