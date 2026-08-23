const fs = require('fs');
let file = fs.readFileSync('src/components/OverviewTab.tsx', 'utf-8');

file = file.replace(/message: '14 candidates have outstanding Term 1 tuition balances exceeding \$\{currency\} 30,000 threshold requirement.',/g,
  "message: `14 candidates have outstanding Term 1 tuition balances exceeding ${currency} 30,000 threshold requirement.`,"
);

file = file.replace(/name="Collected Amount \(\$\{currency\}\)"/g, 'name={`Collected Amount (${currency})`}');
file = file.replace(/name="Pending Balance \(\$\{currency\}\)"/g, 'name={`Pending Balance (${currency})`}');

fs.writeFileSync('src/components/OverviewTab.tsx', file, 'utf-8');
console.log("Done");
