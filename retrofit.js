const fs = require('fs');
const path = require('path');

const dirsToRetrofit = [
  path.join(__dirname, 'src', 'app', 'dashboard', 'registration'),
  path.join(__dirname, 'src', 'app', 'dashboard', 'academics')
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file === 'layout.tsx') {
      retrofitLayout(fullPath);
    } else if (file === 'page.tsx') {
      retrofitPage(fullPath);
    }
  }
}

function retrofitLayout(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Ensure Search, Filter, Download are imported from lucide-react if not present
  if (!content.includes('lucide-react')) {
    content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { Download, Filter, Search } from "lucide-react";');
  }

  // 2. Extract Workspace Title
  const titleMatch = content.match(/<h1[^>]*>[\s\S]*?([A-Za-z0-ms\s&]+)[\s\S]*?<\/h1>/);
  let title = "Workspace";
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // 3. Replace the entire <h1> container and the <nav> block with the new Header + Pill Nav
  // The old layout has:
  // <div className="mb-4">
  //   <h1 ...>...</h1>
  // </div>
  // <div className="border-b border-slate-200...">
  //   <nav ...>
  //     {tabs.map...
  //   </nav>
  // </div>

  // We can just use a regex to replace everything from <div className="mb-4"> up to the end of the <nav> container
  const regex = /<div className="mb-4">[\s\S]*?<\/nav>[\s\S]*?<\/div>/;

  const newBlock = `
      {/* Consistent Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 capitalize">
            ${title}
          </h1>
          <p className="text-slate-500 mt-1">
            Manage records and settings for ${title}.
          </p>
        </div>
        
        {/* Global Toolbar for Workspace */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search in ${title}..." 
              className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Pill-style Navigation */}
      <div className="overflow-x-auto pb-2">
        <nav className="flex space-x-2 min-w-max" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={\`
                  whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors
                  \${isActive 
                    ? 'bg-primary-900/10 text-primary-900' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }
                \`}
              >
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>`;

  if (regex.test(content)) {
    content = content.replace(regex, newBlock.trim());
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated layout: ${filePath}`);
  }
}

function retrofitPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Skip base page.tsx that just have redirect
  if (content.includes('redirect(')) return;

  let modified = false;

  // 1. Table Header Background (bg-slate-50 -> bg-[#F8FAFC])
  if (content.includes('bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200')) {
    content = content.replace('bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200', 'bg-[#F8FAFC] text-xs uppercase font-bold text-slate-500 border-b border-slate-200');
    modified = true;
  }

  // 2. Table Row Hover (hover:bg-slate-50 -> hover:bg-primary-50/50)
  if (content.includes('className="hover:bg-slate-50 transition-colors group"')) {
    content = content.replace('className="hover:bg-slate-50 transition-colors group"', 'className="hover:bg-primary-50/50 transition-colors group"');
    modified = true;
  }

  // 3. Min-height for flex layout
  if (content.includes('className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"')) {
    content = content.replace('className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"', 'className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]"');
    modified = true;
  }

  // 4. Footer mt-auto
  if (content.includes('className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50"')) {
    content = content.replace('className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50"', 'className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50 mt-auto"');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated page: ${filePath}`);
  }
}

for (const dir of dirsToRetrofit) {
  processDirectory(dir);
}
console.log("Retrofit complete.");
