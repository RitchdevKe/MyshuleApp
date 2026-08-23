const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app', 'dashboard', 'registration');

const workspaces = {
  'admissions': ['applications', 'admissions', 'enrollments', 'documents'],
  'students': ['directory', 'progress', 'welfare', 'exit'],
  'parents': ['parents', 'guardians', 'communication', 'finance'],
  'school-structure': ['branches', 'academic', 'classes', 'users']
};

for (const [workspace, tabs] of Object.entries(workspaces)) {
  const workspacePath = path.join(basePath, workspace);
  
  // Create the layout for the workspace (Tab navigation)
  const layoutContent = `"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const tabs = [
${tabs.map(t => `    { name: "${t.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}", href: "/dashboard/registration/${workspace}/${t}" }`).join(',\n')}
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-800 capitalize">
          ${workspace.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h1>
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={\`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-bold
                  \${isActive 
                    ? 'border-secondary-500 text-secondary-600' 
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                  }
                \`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(workspacePath, 'layout.tsx'), layoutContent);

  // Overwrite the base page to redirect to the first tab
  const basePageContent = `import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/dashboard/registration/${workspace}/${tabs[0]}');
}`;
  fs.writeFileSync(path.join(workspacePath, 'page.tsx'), basePageContent);

  // Create the sub-routes (tabs)
  for (const tab of tabs) {
    const tabPath = path.join(workspacePath, tab);
    fs.mkdirSync(tabPath, { recursive: true });

    const title = tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const pageContent = `import React from "react";

export default function ${title.replace(/\s+/g, '')}Page() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-700 mb-2">${title}</h2>
        <p className="text-slate-400">This module is under construction.</p>
      </div>
    </div>
  );
}`;
    fs.writeFileSync(path.join(tabPath, 'page.tsx'), pageContent);
  }
}

// Also create the root registration dashboard page
const rootPagePath = path.join(basePath, 'page.tsx');
// we'll write this manually later, just ensure the file exists.
