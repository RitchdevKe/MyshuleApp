"use client";

import React, { useState } from "react";
import { Users, Briefcase, GraduationCap, Building2, Utensils, Shield, ChevronDown, ChevronUp } from "lucide-react";

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
};

interface OrgChartClientProps {
  staff: Staff[];
}

const getInitials = (first: string, last: string) => {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

const getDepartmentIcon = (dept: string) => {
  switch (dept.toUpperCase()) {
    case 'ACADEMICS': return <GraduationCap className="w-6 h-6" />;
    case 'ADMINISTRATION': return <Briefcase className="w-6 h-6" />;
    case 'TRANSPORT': return <Users className="w-6 h-6" />;
    case 'KITCHEN': return <Utensils className="w-6 h-6" />;
    case 'SUPPORT': return <Shield className="w-6 h-6" />;
    default: return <Building2 className="w-6 h-6" />;
  }
};

const getDepartmentColor = (dept: string) => {
  switch (dept.toUpperCase()) {
    case 'ACADEMICS': return "bg-blue-50 text-blue-600 hover:border-blue-500";
    case 'ADMINISTRATION': return "bg-emerald-50 text-emerald-600 hover:border-emerald-500";
    case 'TRANSPORT': return "bg-amber-50 text-amber-600 hover:border-amber-500";
    case 'KITCHEN': return "bg-orange-50 text-orange-600 hover:border-orange-500";
    case 'SUPPORT': return "bg-purple-50 text-purple-600 hover:border-purple-500";
    default: return "bg-slate-50 text-slate-600 hover:border-slate-500";
  }
};

export default function OrgChartClient({ staff }: OrgChartClientProps) {
  // Find principal or head teacher
  const principalIndex = staff.findIndex(s => 
    s.jobTitle.toLowerCase().includes('principal') || 
    s.jobTitle.toLowerCase().includes('head teacher') ||
    s.jobTitle.toLowerCase().includes('director')
  );

  let principal = null;
  let remainingStaff = staff;

  if (principalIndex !== -1) {
    principal = staff[principalIndex];
    remainingStaff = staff.filter((_, idx) => idx !== principalIndex);
  } else if (staff.length > 0) {
    // If no explicit principal, just take the first one for the demo or leave it as a placeholder
    // Let's create a placeholder if no principal found
    principal = {
      id: "placeholder-principal",
      firstName: "School",
      lastName: "Principal",
      jobTitle: "Principal (Not Assigned)",
      department: "ADMINISTRATION"
    };
  }

  // Group by department
  const departments = remainingStaff.reduce((acc, s) => {
    const dept = s.department || 'OTHER';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(s);
    return acc;
  }, {} as Record<string, Staff[]>);

  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(
    Object.keys(departments).reduce((acc, dept) => ({ ...acc, [dept]: true }), {})
  );

  const toggleDept = (dept: string) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };

  return (
    <div className="flex flex-col items-center min-w-max pb-12">
       {/* Principal Node */}
       {principal && (
         <div className="flex flex-col items-center">
            <div className="w-64 bg-slate-900 rounded-2xl p-4 shadow-lg text-center relative z-10 transition-transform hover:scale-105">
               <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl font-black text-white">{getInitials(principal.firstName, principal.lastName)}</span>
               </div>
               <h3 className="text-lg font-black text-white">{principal.firstName} {principal.lastName}</h3>
               <p className="text-sm font-bold text-slate-300">{principal.jobTitle}</p>
            </div>
            {/* Connecting Line Down */}
            {Object.keys(departments).length > 0 && (
              <div className="w-0.5 h-12 bg-slate-300"></div>
            )}
         </div>
       )}

       {/* Horizontal Line for Departments */}
       {Object.keys(departments).length > 0 && (
         <div className="relative flex justify-center w-full">
           <div className="absolute top-0 h-0.5 bg-slate-300" style={{
             width: `${(Object.keys(departments).length - 1) * 320}px`,
           }}></div>
           
           <div className="flex justify-center gap-16 relative mt-0">
             {Object.entries(departments).map(([deptName, deptStaff]) => {
               
               // Find dept head
               const headIndex = deptStaff.findIndex(s => 
                  s.jobTitle.toLowerCase().includes('head') || 
                  s.jobTitle.toLowerCase().includes('manager') ||
                  s.jobTitle.toLowerCase().includes('lead')
               );
               let head = null;
               let members = deptStaff;
               if (headIndex !== -1) {
                 head = deptStaff[headIndex];
                 members = deptStaff.filter((_, i) => i !== headIndex);
               } else if (deptStaff.length > 0) {
                 // pick first as head if no explicit head
                 head = deptStaff[0];
                 members = deptStaff.filter((_, i) => i !== 0);
               }

               const isExpanded = expandedDepts[deptName];
               const colorClass = getDepartmentColor(deptName);

               return (
                 <div key={deptName} className="flex flex-col items-center">
                    {/* Vertical line from horizontal connecting line */}
                    <div className="w-0.5 h-8 bg-slate-300"></div>

                    {/* Department Head / Category Box */}
                    <div 
                      className={`w-64 bg-white border border-slate-200 shadow-sm rounded-2xl p-4 text-center relative z-10 cursor-pointer transition-all hover:shadow-md ${colorClass}`}
                      onClick={() => toggleDept(deptName)}
                    >
                       <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 bg-white/50 backdrop-blur-sm shadow-sm border border-black/5">
                          {getDepartmentIcon(deptName)}
                       </div>
                       <h3 className="text-base font-black text-slate-800">
                         {head ? `${head.firstName} ${head.lastName}` : deptName}
                       </h3>
                       <p className="text-xs font-bold text-slate-500 mb-2">
                         {head ? head.jobTitle : `Head of ${deptName}`}
                       </p>
                       <div className="flex items-center justify-center text-slate-400">
                         {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                       </div>
                    </div>

                    {/* Department Members */}
                    {isExpanded && members.length > 0 && (
                      <>
                        <div className="w-0.5 h-8 bg-slate-200"></div>
                        <div className="flex flex-col gap-3">
                           {members.map(member => (
                             <div key={member.id} className="w-56 bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-sm transition-all hover:bg-slate-100 hover:border-slate-300">
                               <div className="font-bold text-slate-700">{member.firstName} {member.lastName}</div>
                               <div className="text-xs font-medium text-slate-500">{member.jobTitle}</div>
                             </div>
                           ))}
                        </div>
                      </>
                    )}
                    
                    {/* Empty state if no other members */}
                    {isExpanded && members.length === 0 && (
                      <>
                        <div className="w-0.5 h-8 bg-slate-200"></div>
                        <div className="w-56 bg-slate-50/50 border border-slate-200 border-dashed rounded-xl p-3 text-center text-xs font-medium text-slate-400">
                          No other members
                        </div>
                      </>
                    )}
                 </div>
               );
             })}
           </div>
         </div>
       )}
    </div>
  );
}
