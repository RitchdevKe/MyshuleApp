const fs = require('fs');

const paths = [
  'src/components/ReportsTab.tsx',
  'src/components/CommunicationTab.tsx',
  'src/components/InvoicePreviewModal.tsx',
  'src/components/StudentsTab.tsx',
  'src/components/QuickSearchTab.tsx',
  'src/components/LibraryTab.tsx',
  'src/components/InvoicesTab.tsx',
  'src/components/FeeStructureTab.tsx',
  'src/components/TransportModule.tsx',
  'src/components/StudentProfileDossier.tsx'
];

for (const filePath of paths) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Insert our context
  if (!content.includes('useCurrency()') && !content.includes('CurrencyContext.tsx')) {
    const importLines = content.split('\n').filter(line => line.startsWith('import '));
    const lastImportIndex = content.indexOf(importLines[importLines.length - 1]);
    const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
    // Add import
    content = content.slice(0, insertIndex) + `import { useCurrency } from '../contexts/CurrencyContext.tsx';\n` + content.slice(insertIndex);

    // Call hook inside the default export component
    // match export function Something(
    content = content.replace(/(export function [a-zA-Z0-9_]+\([^)]*\)[^\{]*\{)/, '$1\n  const { currency } = useCurrency();\n');
  } else if (!content.includes('const { currency } = useCurrency();')) {
    content = content.replace(/(export function [a-zA-Z0-9_]+\([^)]*\)[^\{]*\{)/, '$1\n  const { currency } = useCurrency();\n');
  }

  content = content.replace(/KES\s*\{/g, '{currency} {');
  content = content.replace(/>KES\s+([\d,.]+[\w]?)</g, '>{currency} $1<');
  content = content.replace(/'KES /g, '`${currency} ');
  content = content.replace(/`KES /g, '`${currency} ');
  content = content.replace(/Amount \(KES\)/g, 'Amount (${currency})');
  content = content.replace(/Balance \(KES\)/g, 'Balance (${currency})');
  content = content.replace(/KES/g, '${currency}');

  // Un-mess up template string references that might have been hit incorrectly 
  // if they were text in jsx. Wait, `${currency}` text in JSX is rendered as text.
  // Instead of risking JSX breakages across so many components blindly, I'll be safer.

  content = content.replace(/>\$\{currency\}/g, '>{currency}'); // JSX nodes
  content = content.replace(/"\$\{currency\}"/g, 'currency'); // if string literal became "${currency}"

  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log("Done");
