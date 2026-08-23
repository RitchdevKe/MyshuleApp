const fs = require('fs');

let file = 'src/components/AccountingSubsystem.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/text-\[\#6d7c90\]/g, 'text-slate-600');
txt = txt.replace(/text-slate-400/g, 'text-slate-500'); // make slate-400 slightly darker
txt = txt.replace(/text-zinc-400/g, 'text-slate-300'); // wait, if it's in dark bg, slate-300 is lighter and better
txt = txt.replace(/text-zinc-350/g, 'text-slate-300');
txt = txt.replace(/text-zinc-300/g, 'text-slate-200'); // lighter for dark bg
txt = txt.replace(/text-slate-350/g, 'text-slate-300'); // just in case

// We saw bg-indigo-505 earlier, let's also fix text-indigo-350 etc
txt = txt.replace(/text-[a-z]+-350/g, 'text-slate-300');

fs.writeFileSync(file, txt);
