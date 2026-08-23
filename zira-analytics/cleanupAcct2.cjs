const fs = require('fs');
let file = fs.readFileSync('src/components/AccountingSubsystem.tsx', 'utf-8');
file = file.replace(/KES ([0-9]+k)/g, '{currency} $1');
fs.writeFileSync('src/components/AccountingSubsystem.tsx', file, 'utf-8');
console.log("Done");
