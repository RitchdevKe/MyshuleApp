const fs = require('fs');
const path = require('path');

const pages = [
  'account/student-details/page.tsx',
  'account/education-info/page.tsx',
  'account/guardians/page.tsx',
  'home/page.tsx',
  'analysis/page.tsx',
  'fees/page.tsx',
  'messages/page.tsx'
];

const headerRegex = /<div className="bg-white rounded-xl p-4 shadow-sm flex items-start gap-4 border border-slate-100">[\s\S]*?<\/div>\s*<\/div>/;
const importRegex = /import React from 'react';/;

pages.forEach(p => {
  const filePath = path.join('src/app/parent-portal', p);
  if (!fs.existsSync(filePath)) {
    console.log(`Missing ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace header div
  content = content.replace(headerRegex, '<ActiveStudentHeader />');
  
  // Add import if not exists
  if (!content.includes('ActiveStudentHeader')) {
    let importDepth = '../';
    if (p.includes('/')) importDepth = '../../';
    if (p.split('/').length > 2) importDepth = '../../../';
    content = content.replace(importRegex, `import React from 'react';\nimport ActiveStudentHeader from '${importDepth}components/ActiveStudentHeader';`);
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
});
