const fs = require('fs');
const path = require('path');

const dirsToUpdate = [
  path.join(__dirname, 'src', 'app', 'dashboard')
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      let modified = false;
      
      const oldThead = 'className="bg-[#F8FAFC] text-xs uppercase font-bold text-slate-500 border-b border-slate-200"';
      const newThead = 'className="bg-primary-900 text-xs uppercase font-bold text-white border-b border-primary-900"';
      
      if (content.includes(oldThead)) {
        content = content.replace(new RegExp(oldThead.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newThead);
        modified = true;
      }

      // Sometimes it might use single quotes or omit border-b
      const regexAlternative = /className=["']bg-\[#F8FAFC\] text-xs uppercase font-bold text-slate-[0-9]+[^"']*["']/g;
      if (regexAlternative.test(content)) {
        content = content.replace(regexAlternative, newThead);
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated table header in: ${fullPath}`);
      }
    }
  }
}

for (const dir of dirsToUpdate) {
  processDirectory(dir);
}
console.log("Table headers updated globally.");
