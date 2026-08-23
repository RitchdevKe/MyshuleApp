import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFileSync } from 'fs';

async function main() {
  const data = new Uint8Array(readFileSync('C:/Users/USER/Downloads/Meeting started 2026_08_10 08_57 UTC - Notes by Gemini.pdf'));
  const doc = await getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    text += `--- PAGE ${i} ---\n${pageText}\n\n`;
  }
  console.log(text);
}

main().catch(console.error);
