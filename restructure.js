const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app', 'dashboard');

// 1. Delete all existing subfolders to start fresh
const existingFolders = fs.readdirSync(basePath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

for (const folder of existingFolders) {
  fs.rmSync(path.join(basePath, folder), { recursive: true, force: true });
}

// 2. Define new structure
const structure = {
  '': ['analytics', 'activities', 'calendar', 'ai-insights'], // Dashboard root workspaces (Overview is root)
  'registration': ['admissions', 'students', 'parents', 'school-structure'],
  'academics': ['curriculum', 'teaching', 'assessment', 'scheduling', 'academic-reports'],
  'finance': ['fees', 'payments', 'accounting', 'budgeting', 'financial-reports'],
  'human-resources': ['employees', 'attendance', 'payroll', 'performance', 'hr-reports'],
  'operations': ['library', 'transport', 'hostel', 'resources', 'procurement'],
  'communication': ['messaging', 'announcements', 'engagement', 'templates'],
  'reports': ['academic-reports', 'financial-reports', 'operational-reports', 'custom-reports', 'ai-analytics'],
  'administration': ['users', 'roles', 'security', 'subscription', 'system'],
  'settings': ['school', 'academic', 'finance', 'communication', 'integrations']
};

// 3. Scaffold new directories and pages
for (const [moduleName, workspaces] of Object.entries(structure)) {
  for (const workspace of workspaces) {
    const dirPath = moduleName === '' 
      ? path.join(basePath, workspace) 
      : path.join(basePath, moduleName, workspace);
      
    fs.mkdirSync(dirPath, { recursive: true });

    const title = workspace.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const moduleTitle = moduleName === '' ? 'Dashboard' : moduleName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const content = `import React from "react";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 capitalize">
          ${moduleTitle} / ${title}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Welcome to the ${title} workspace.
        </p>
      </div>
      <div className="bg-white border-2 border-secondary-500 rounded-xl p-8 shadow-sm flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400 text-lg">Coming soon...</p>
      </div>
    </div>
  );
}`;

    fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  }
}
