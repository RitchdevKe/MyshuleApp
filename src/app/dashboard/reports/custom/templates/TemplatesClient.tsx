"use client";

import React, { useState } from "react";
import { Copy, FileText, Loader2, Info } from "lucide-react";
import { createReportFromTemplate } from "./actions";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";

type CustomReport = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  config: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
};

export default function TemplatesClient({ initialTemplates }: { initialTemplates: CustomReport[] }) {
  const router = useRouter();
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUseTemplate = async (templateId: string) => {
    setCloningId(templateId);
    setError(null);
    try {
      const result = await createReportFromTemplate(templateId);
      if (result.success) {
        router.push("/dashboard/reports/custom/my-reports");
      }
    } catch (err: any) {
      setError(err.message || "Failed to clone template.");
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Available Templates</h2>
          <p className="text-sm text-slate-500">
            Start quickly by cloning an existing report template.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {initialTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-3xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Templates Found</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            There are no custom report templates available in this workspace yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  Template
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">
                {template.name}
              </h3>
              
              <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow">
                {template.description || "No description provided for this template."}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  {new Date(template.createdAt).toLocaleDateString()}
                </span>
                
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  disabled={cloningId === template.id}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cloningId === template.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cloning...
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Use
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
