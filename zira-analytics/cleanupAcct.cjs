const fs = require('fs');
let file = fs.readFileSync('src/components/AccountingSubsystem.tsx', 'utf-8');

// Replace these raw KES strings with template literals containing ${currency}
file = file.replace(/balance: "KES ([\d,.]+)"/g, "balance: \\`${currency} $1\\`");
file = file.replace(/amount: '(-|\+) KES ([\d,.]+)'/g, "amount: \\`$1 \\${currency} $2\\`");
file = file.replace(/chartScaleLabel: "KES"/g, "chartScaleLabel: currency");

// And for the spans that say KES (line 979, 996)
file = file.replace(/>KES</g, '>{currency}<');
// And the classes that have KES (like line 1854: ... border-slate-800 KES">
file = file.replace(/ KES">/g, ' ">');
file = file.replace(/>KES ([\d,.]+k)</g, '>{currency} $1<');

// And line 3166
file = file.replace(/dispatch KES payment/g, 'dispatch ${currency} payment');

fs.writeFileSync('src/components/AccountingSubsystem.tsx', file, 'utf-8');
console.log("Done");
