const fs = require('fs');

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip if already processed or manually added
  if (content.includes('useCurrency()') && !filePath.includes('ModuleHeader.tsx')) {
      console.log('Skipping ' + filePath);
      return;
  }

  // 1. Add import
  const importLines = content.split('\n').filter(line => line.startsWith('import '));
  const lastImportIndex = content.indexOf(importLines[importLines.length - 1]);
  const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
  content = content.slice(0, insertIndex) + `import { useCurrency } from '../contexts/CurrencyContext.tsx';\n` + content.slice(insertIndex);

  // 2. Add hook call
  // Match `export function ComponentName({...}) {`
  content = content.replace(/(export function [a-zA-Z0-9_]+\([^)]*\)\s*\{)/, '$1\n  const { currency } = useCurrency();\n');

  // 3. Replace text strings 
  // Replace `KES {` with `{currency} {` jsx
  content = content.replace(/KES\s*\{/g, '{currency} {');
  
  // Replace `>KES ` with `>{currency} `
  content = content.replace(/>KES\s+([\d,.]+[\w]?)</g, '>{currency} $1<');
  content = content.replace(/>KES\s+([\d,.]+[\w]?)(.*)</g, '>{currency} $1$2<');

  // In template literals e.g. `KES ${` -> `${currency} ${`
  content = content.replace(/KES\s*\$\{/g, '${currency} ${');

  // In strings that are isolated e.g. `(KES)`
  content = content.replace(/\(KES\)/g, '({currency})');

  // Specific hardcoded replacements:
  content = content.replace(/>KES\s+([0-9.,kKmM]+)</g, '>{currency} $1<');

  // Attributes: placeholder="KES amount"
  content = content.replace(/placeholder="KES amount"/g, 'placeholder={`${currency} amount`}');

  // Any remaining 'KES' that is visually displayed can be caught manually or through a global replace with caution
  // "Liquidity: KES "
  content = content.replace(/Liquidity:\s*KES\s*/g, 'Liquidity: ${currency} ');
  
  content = content.replace(/'KES /g, '`${currency} '); // Wait, this might break things if not careful.

  // Let's do a more robust approach for simple 'KES' mentions
  // Replace `KES ` with `{currency}` or `${currency}` depending if it's in a JSX text node
  
  // We'll write it to file
  fs.writeFileSync(filePath, content, 'utf-8');
};

processFile('src/components/AccountingSubsystem.tsx');
processFile('src/components/FinanceTab.tsx');
processFile('src/components/SettingsTab.tsx'); // Wait, SettingsTab has currency state

console.log("Done");
