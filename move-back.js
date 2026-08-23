const fs = require('fs');
const path = require('path');

const base = path.join(__dirname, 'src', 'app', 'dashboard');
const home = path.join(base, '(home)');

const itemsToMove = ['calendar', 'ai-insights'];

for (const item of itemsToMove) {
  const oldPath = path.join(home, item);
  const newPath = path.join(base, item);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${item} back to dashboard root`);
  }
}
