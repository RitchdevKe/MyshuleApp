"use client";

import React, { useState, useTransition } from "react";
import { FileText, Printer, CheckCircle, Clock, Download, Settings, Loader2 } from "lucide-react";
import { generateDocumentBatch } from "../actions";
import { DocumentTemplate, StudentDocument, Student } from "@prisma/client";

type DocumentWithStudent = StudentDocument & {
  student: { firstName: string; lastName: string };
};

interface DocumentsClientProps {
  templates: DocumentTemplate[];
  recentDocuments: DocumentWithStudent[];
}

export default function DocumentsClient({ templates, recentDocuments }: DocumentsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerate = (templateId: string, templateName: string, documentType: string) => {
    setGeneratingId(templateId);
    startTransition(async () => {
      try {
        await generateDocumentBatch(templateId, templateName, documentType);
        alert(`Successfully generated batch for ${templateName}`);
      } catch (error) {
        console.error(error);
        alert("Failed to generate batch. Ensure there is at least one student in the system.");
      } finally {
        setGeneratingId(null);
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-800">Document Generation</h2>
          <p className="text-sm text-slate-500">Bulk generate, print, and manage academic documents.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {templates.map((template) => {
          let Icon = FileText;
          let bgClass = "bg-indigo-50 border-indigo-100 hover:bg-indigo-100";
          let iconBg = "text-indigo-600";
          let btnClass = "text-indigo-700 border-indigo-200";

          if (template.type === "TRANSCRIPT") {
            Icon = Printer;
            bgClass = "bg-emerald-50 border-emerald-100 hover:bg-emerald-100";
            iconBg = "text-emerald-600";
            btnClass = "text-emerald-700 border-emerald-200";
          } else if (template.type === "LEAVING_CERTIFICATE") {
            Icon = Settings;
            bgClass = "bg-amber-50 border-amber-100 hover:bg-amber-100";
            iconBg = "text-amber-600";
            btnClass = "text-amber-700 border-amber-200";
          }

          const isGenerating = isPending && generatingId === template.id;

          return (
            <div key={template.id} className={`border p-6 rounded-2xl shadow-sm text-center group cursor-pointer transition-colors ${bgClass}`}>
              <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform ${iconBg}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="font-black text-slate-800">{template.name}</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Generate {template.type.replace('_', ' ').toLowerCase()}s.</p>
              <button 
                onClick={() => handleGenerate(template.id, template.name, template.type)}
                disabled={isPending}
                className={`text-xs flex items-center justify-center gap-2 font-bold uppercase tracking-wider bg-white border px-4 py-2 rounded-lg group-hover:shadow-sm transition-all w-full ${btnClass} disabled:opacity-50`}
              >
                {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : "Generate Batch"}
              </button>
            </div>
          );
        })}
        {templates.length === 0 && (
          <div className="col-span-3 text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">No document templates found in the database. Add templates to see options here.</p>
          </div>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-black text-slate-800">Recent Generation Batches</h3>
            <p className="text-xs text-slate-500 mt-1">Monitor the status of your bulk document generation jobs.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Title</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Type</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Student</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 text-sm">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {new Date(doc.uploadedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-slate-600">
                    {doc.documentType.replace('_', ' ')}
                  </td>
                  <td className="p-4 text-center text-sm font-black text-slate-700">
                    {doc.student.firstName} {doc.student.lastName}
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded border border-emerald-100">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <a 
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm items-center gap-1 ml-auto transition-all bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200"
                    >
                      <Download className="w-3 h-3"/> Download PDF
                    </a>
                  </td>
                </tr>
              ))}
              {recentDocuments.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-sm">
                    No recent documents generated.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
