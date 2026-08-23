const fs = require('fs');
const path = require('path');

const dirsToUpdate = [
  path.join(__dirname, 'src', 'app', 'dashboard', 'registration'),
  path.join(__dirname, 'src', 'app', 'dashboard', 'academics'),
  path.join(__dirname, 'src', 'app', 'dashboard', 'finance')
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Update header area to have a subtle gradient
      // Current: <div className="p-4 sm:p-6 lg:p-8">
      // Let's add a subtle background gradient to the header text area.
      // Actually, let's just add it to the wrapping div if we can find it.
      if (content.includes('className="mb-8"')) {
        // Just leaving the layout header as is but maybe updating the buttons
      }
      
      // Update buttons in layout (e.g. Filter, Export)
      // Current: bg-white border border-slate-200 text-slate-600 hover:bg-slate-50
      // Change to: bg-primary-900 text-white hover:bg-secondary-500 active:bg-secondary-600 shadow-sm
      content = content.replace(/bg-white border border-slate-200 text-slate-600 hover:bg-slate-50/g, 'bg-primary-900 text-white hover:bg-secondary-500 active:bg-secondary-600 shadow-sm border-none');
      
      fs.writeFileSync(fullPath, content, 'utf-8');
      
    } else if (file === 'page.tsx') {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Update Card Container
      // Current: bg-white border border-slate-200 rounded-xl shadow-sm
      // Change to: bg-white border-t-4 border-t-primary-900 border-l border-r border-b border-slate-200 rounded-xl shadow-md
      content = content.replace(/bg-white border border-slate-200 rounded-xl shadow-sm/g, 'bg-white border-t-4 border-t-primary-900 border-l border-r border-b border-slate-200 rounded-xl shadow-md');
      
      // Update Table Hover
      // Current: hover:bg-primary-50/50
      // Change to: hover:bg-primary-50/50 border-l-2 border-transparent hover:border-primary-500
      content = content.replace(/hover:bg-primary-50\/50/g, 'hover:bg-primary-50/50 border-l-2 border-transparent hover:border-l-primary-500 transition-colors');
      
      // Update Buttons in Page (Add New, Bulk Import, etc)
      // Current Primary buttons: bg-primary-900 hover:bg-primary-800
      content = content.replace(/bg-primary-900 hover:bg-primary-800/g, 'bg-primary-900 hover:bg-secondary-500 active:bg-secondary-600');
      
      // Current Secondary buttons: bg-white border border-slate-200 text-slate-600 hover:bg-slate-50
      content = content.replace(/bg-white border border-slate-200 text-slate-600 hover:bg-slate-50/g, 'bg-primary-900 text-white hover:bg-secondary-500 active:bg-secondary-600 shadow-sm border-none');
      
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }
}

// 1. Process all modules
for (const dir of dirsToUpdate) {
  processDirectory(dir);
}

// 2. Update dashboard root layout background
const dashboardLayoutPath = path.join(__dirname, 'src', 'app', 'dashboard', 'layout.tsx');
if (fs.existsSync(dashboardLayoutPath)) {
  let layoutContent = fs.readFileSync(dashboardLayoutPath, 'utf-8');
  layoutContent = layoutContent.replace(/bg-slate-50 dark:bg-slate-950/g, 'bg-slate-100 dark:bg-slate-900');
  fs.writeFileSync(dashboardLayoutPath, layoutContent, 'utf-8');
}

console.log("UI Upgrades applied successfully.");
