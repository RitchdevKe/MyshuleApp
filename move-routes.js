const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'src', 'app', 'dashboard');
const home = path.join(base, '(home)');

if (!fs.existsSync(home)) {
  fs.mkdirSync(home);
}

const itemsToMove = ['page.tsx', 'analytics', 'activities', 'calendar', 'ai-insights'];

for (const item of itemsToMove) {
  const oldPath = path.join(base, item);
  const newPath = path.join(home, item);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${item} to (home)`);
  }
}
