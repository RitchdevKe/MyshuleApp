const fs = require('fs');
const path = require('path');

const loadingCode = `import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        <p className="text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  );
}`;

function traverse(dir) {
  const files = fs.readdirSync(dir);
  let hasPage = false;
  let hasLoading = false;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else {
      if (file === 'page.tsx') hasPage = true;
      if (file === 'loading.tsx') hasLoading = true;
    }
  }

  if (hasPage && !hasLoading) {
    fs.writeFileSync(path.join(dir, 'loading.tsx'), loadingCode);
    console.log("Added loading.tsx to", dir);
  }
}

traverse('./src/app/dashboard');
console.log("Done");
