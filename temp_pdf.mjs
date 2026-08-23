const fs = require('fs');
async function main() {
  const { default: pdf } = await import('pdf-parse');
  const buf = fs.readFileSync('C:/Users/USER/Downloads/Meeting started 2026_08_10 08_57 UTC - Notes by Gemini.pdf');
  const data = await pdf(buf);
  console.log(data.text);
}
main();
