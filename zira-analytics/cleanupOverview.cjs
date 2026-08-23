const fs = require('fs');

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.includes('useCurrency()')) return;

  const importLines = content.split('\n').filter(line => line.startsWith('import '));
  const lastImportIndex = content.indexOf(importLines[importLines.length - 1]);
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  content = content.slice(0, insertIndex) + `import { useCurrency } from '../contexts/CurrencyContext.tsx';\n` + content.slice(insertIndex);

  content = content.replace(/(export function [a-zA-Z0-9_]+\([^)]*\)\s*\{)/, '$1\n  const { currency } = useCurrency();\n');

  content = content.replace(/KES\s*\{/g, '{currency} {');
  content = content.replace(/>KES\s+([\d,.]+[\w]?)</g, '>{currency} $1<');
  content = content.replace(/'KES\s*([0-9.,]+)'/g, '\\`${currency} $1\\`'); // wait, this could break strings
  content = content.replace(/`KES /g, '`${currency} ');
  content = content.replace(/=> `KES \$\{v/g, '=> `${currency} ${v');
  content = content.replace(/Amount \(KES\)/g, 'Amount (${currency})');
  content = content.replace(/Balance \(KES\)/g, 'Balance (${currency})');
  content = content.replace(/KES /g, '${currency} ');

  fs.writeFileSync(filePath, content, 'utf-8');
};

processFile('src/components/OverviewTab.tsx');
console.log("Done");
