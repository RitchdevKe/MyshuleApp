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
      
      // We want to replace the tab ternary operator strings:
      // Active: 'bg-primary-900 text-white shadow-md' -> 'bg-secondary-500 text-white shadow-md'
      // Inactive: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100' -> 'bg-primary-900 text-white hover:bg-primary-800 shadow-sm'
      
      let modified = false;
      
      if (content.includes("'bg-primary-900 text-white shadow-md'")) {
        content = content.replace(/'bg-primary-900 text-white shadow-md'/g, "'bg-secondary-500 text-white shadow-md'");
        modified = true;
      }
      // Also catch if it was double quotes
      if (content.includes('"bg-primary-900 text-white shadow-md"')) {
        content = content.replace(/"bg-primary-900 text-white shadow-md"/g, "'bg-secondary-500 text-white shadow-md'");
        modified = true;
      }

      if (content.includes("'text-slate-500 hover:text-slate-700 hover:bg-slate-100'")) {
        content = content.replace(/'text-slate-500 hover:text-slate-700 hover:bg-slate-100'/g, "'bg-primary-900 text-white hover:bg-primary-800 shadow-sm'");
        modified = true;
      }
      // Also catch if it was double quotes
      if (content.includes('"text-slate-500 hover:text-slate-700 hover:bg-slate-100"')) {
        content = content.replace(/"text-slate-500 hover:text-slate-700 hover:bg-slate-100"/g, "'bg-primary-900 text-white hover:bg-primary-800 shadow-sm'");
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated feature tabs in: ${fullPath}`);
      }
    }
  }
}

for (const dir of dirsToUpdate) {
  processDirectory(dir);
}
console.log("Feature tabs updated globally.");
