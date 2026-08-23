import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;

      // Increase explicit pixel text classes
      content = content.replace(/text-\[(\d+)px\]/g, (match, pxStr) => {
        const px = parseInt(pxStr, 10);
        changed = true;
        return `text-[${px + 2}px]`;
      });
      
      // Increase text-xs, text-sm, etc by standard tailwind
      // text-xs -> text-sm
      // text-sm -> text-base
      // text-base -> text-lg
      
      const map: Record<string, string> = {
        'text-xs': 'text-sm',
        'text-sm': 'text-base',
        'text-base': 'text-lg',
        'text-lg': 'text-xl',
        'text-xl': 'text-2xl',
        'text-2xl': 'text-3xl'
      };
      
      content = content.replace(/\b(text-(xs|sm|base|lg|xl|2xl))\b/g, (match) => {
        changed = true;
        return map[match] || match;
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(SRC_DIR);
console.log("Done.");
