"use client";

import React from "react";
import { Download } from "lucide-react";

export default function ExportButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
    >
      <Download className="w-4 h-4" />
      Export PDF
    </button>
  );
}
