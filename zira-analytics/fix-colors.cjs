const fs = require('fs');

let file = 'src/components/AccountingSubsystem.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/([a-z]+-[a-z]+)-350/g, '$1-300');
txt = txt.replace(/([a-z]+-[a-z]+)-250/g, '$1-200');
txt = txt.replace(/([a-z]+-[a-z]+)-150/g, '$1-200'); 
txt = txt.replace(/([a-z]+-[a-z]+)-55/g, '$1-50');
txt = txt.replace(/([a-z]+-[a-z]+)-505/g, '$1-500');
txt = txt.replace(/([a-z]+-[a-z]+)-205/g, '$1-200');
txt = txt.replace(/([a-z]+-[a-z]+)-105/g, '$1-100');
txt = txt.replace(/([a-z]+-[a-z]+)-705/g, '$1-700');
txt = txt.replace(/([a-z]+-[a-z]+)-707/g, '$1-700');
txt = txt.replace(/([a-z]+-[a-z]+)-650/g, '$1-600');
txt = txt.replace(/([a-z]+-[a-z]+)-801/g, '$1-800');
txt = txt.replace(/([a-z]+-[a-z]+)-850/g, '$1-800');
txt = txt.replace(/([a-z]+-[a-z]+)-905/g, '$1-900');
txt = txt.replace(/([a-z]+-[a-z]+)-405/g, '$1-400');
txt = txt.replace(/bg-slate-5([^0-9])/g, 'bg-slate-50$1');

fs.writeFileSync(file, txt);
