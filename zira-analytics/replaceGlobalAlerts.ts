import fs from 'fs';
import path from 'path';

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir);

let changed = 0;

for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes('alert(')) {
      // Add imports to the file if needed
      if (!content.includes('import { toast } from')) {
        // find last import
        const idx = content.lastIndexOf('import ');
        if (idx !== -1) {
          const endIdx = content.indexOf('\n', idx);
          content = content.slice(0, endIdx + 1) + 'import { toast } from "react-hot-toast";\n' + content.slice(endIdx + 1);
        } else {
          content = 'import { toast } from "react-hot-toast";\n' + content;
        }
      }

      content = content.replace(/alert\(/g, 'toast.success(');
      fs.writeFileSync(filePath, content);
      console.log('Replaced in ' + file);
      changed++;
    }
  }
}

console.log('Finished. Changed ' + changed + ' files.');
