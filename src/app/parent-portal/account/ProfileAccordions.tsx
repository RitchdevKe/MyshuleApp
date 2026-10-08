"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PenLine } from 'lucide-react';
import type { Student, StudentParent } from '@prisma/client';

export function ProfileAccordions({ student }: { student: Student }) {
  const [openSection, setOpenSection] = useState<string>('personal');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  const AccordionHeader = ({ id, title }: { id: string, title: string }) => {
    const isOpen = openSection === id;
    return (
      <button 
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <h3 className="font-medium text-primary-600 text-lg">{title}</h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
      </button>
    );
  };

  const FieldRow = ({ label, value, editable = false }: { label: string, value: string, editable?: boolean }) => (
    <div className="flex flex-col py-3 border-b border-slate-100 last:border-0 relative">
      <span className="text-slate-600 mb-1">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
      {editable && (
        <button className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-primary-600">
          <PenLine className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col divide-y divide-slate-200">
      
      {/* Personal Information */}
      <div>
        <AccordionHeader id="personal" title="Personal Information" />
        {openSection === 'personal' && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <FieldRow label="Name" value={`${student.firstName} ${student.lastName}`.toUpperCase()} editable />
            <FieldRow label="Admission Number" value={student.admissionNumber || 'N/A'} />
            <FieldRow label="Gender" value={student.gender === 'MALE' ? 'Male' : student.gender === 'FEMALE' ? 'Female' : 'N/A'} />
            <FieldRow label="Assessment Number" value="N/A" />
          </div>
        )}
      </div>

      {/* Education Information */}
      <div>
        <AccordionHeader id="education" title="Education Information" />
        {openSection === 'education' && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <FieldRow label="Date of Admission" value={student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'} editable />
            <FieldRow label="Enrollment Grade" value="N/A" />
            <FieldRow label="Previous School" value="N/A" />
            <FieldRow label="Primary School Name" value="N/A" />
            <FieldRow label="Leave Date" value="N/A" />
          </div>
        )}
      </div>

      {/* Guardian Details */}
      <div>
        <AccordionHeader id="guardian" title="Guardian Details" />
        {openSection === 'guardian' && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="py-4 text-center text-slate-500">
              Guardian information available here.
            </div>
          </div>
        )}
      </div>

      {/* Other Student Details */}
      <div>
        <AccordionHeader id="other" title="Other Student Details" />
        {openSection === 'other' && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <FieldRow label="Date of Birth" value={student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'} editable />
            <FieldRow label="Place Of Birth" value="N/A" />
            <FieldRow label="Birth Certificate Entry Number" value="N/A" />
            <FieldRow label="SHA" value="N/A" />
            <FieldRow label="Nationality" value="N/A" />
            <FieldRow label="County" value="N/A" />
            <FieldRow label="Sub-County" value="N/A" />
          </div>
        )}
      </div>

      {/* Additional Information */}
      <div>
        <AccordionHeader id="additional" title="Additional Information" />
        {openSection === 'additional' && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <FieldRow label="Medical History" value="None recorded" editable />
            <FieldRow label="Comments" value="No comments" />
          </div>
        )}
      </div>

    </div>
  );
}


