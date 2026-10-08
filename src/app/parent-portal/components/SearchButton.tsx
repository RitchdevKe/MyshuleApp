"use client";

import React from "react";
import { Search } from "lucide-react";

export default function SearchButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-800/50 hover:bg-primary-800 text-primary-200 hover:text-white transition-colors border border-primary-700/50"
    >
      <Search className="w-4 h-4" />
      <span className="text-sm font-medium">Search...</span>
      <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary-900 text-[10px] font-semibold text-primary-300 ml-2">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
