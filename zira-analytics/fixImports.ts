import fs from 'fs';
import path from 'path';

const componentsDir = 'src/components';
const files = fs.readdirSync(componentsDir);

for (const file of files) {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes('import { toast } from "react-hot-toast";')) {
      content = content.replace(/import \{ toast \} from "react-hot-toast";\n/g, '');
      content = 'import { toast } from "react-hot-toast";\n' + content;
      fs.writeFileSync(filePath, content);
      console.log('Fixed ' + file);
    }
  }
}
