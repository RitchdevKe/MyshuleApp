const fs = require('fs');
const path = require('path');

const dirsToUpdate = [
  path.join(__dirname, 'src', 'app', 'dashboard', 'registration'),
  path.join(__dirname, 'src', 'app', 'dashboard', 'academics'),
  path.join(__dirname, 'src', 'app', 'dashboard', 'finance')
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'layout.tsx') {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Update active tab style to solid primary color
      if (content.includes("bg-primary-900/10 text-primary-900")) {
        content = content.replace(
          "bg-primary-900/10 text-primary-900",
          "bg-primary-900 text-white shadow-md"
        );
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated active tab style in: ${fullPath}`);
      }
    } else if (file === 'page.tsx') {
       // Just to be sure, check if there are buttons that should be primary but aren't.
       // In our generated pages, the primary button is the first action.
       // Currently it's generated with bg-primary-900 text-white. So they should be fine.
       // But wait, the toolbar in layout.tsx has "Filter" and "Export" buttons which are bg-white border-primary-200.
       // Maybe the user wants those to be primary too? "other main buttons".
       // Let's leave them as secondary for now, as usually only the primary call-to-action is solid.
       // The user said "On the feature buttons and other main buttons,i want the backgound to be the primary colours."
       // "Feature buttons" likely refers to the tabs (as they correspond to the features of a workspace).
    }
  }
}

for (const dir of dirsToUpdate) {
  processDirectory(dir);
}
console.log("Tab styles updated.");
