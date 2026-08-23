import fs from 'fs';

const filePath = 'src/components/ExtraModules.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all alerts with toast.success
content = content.replace(/alert\(/g, 'toast.success(');

fs.writeFileSync(filePath, content);
console.log('Replaced alert with toast.success in ExtraModules.tsx');
