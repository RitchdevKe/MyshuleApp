const fs = require('fs');
const path = require('path');

const moduleName = 'reports';
const dirs = [
  'students',
  'teachers',
  'financials',
  'staff',
  'insights'
];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, 'src', 'app', 'dashboard', moduleName, dir);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const title = dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const content = `import React from "react";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 capitalize">
          Reports & Analytics / ${title}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Manage ${title.toLowerCase()} data here.
        </p>
      </div>
      <div className="bg-white border-2 border-secondary-500 rounded-xl p-8 shadow-sm flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-lg">Coming soon...</p>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});
