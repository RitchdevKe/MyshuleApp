import os, glob, re

target_dir = 'src/app/dashboard'
files = glob.glob(os.path.join(target_dir, '**', '*.tsx'), recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '{/* Contextual Header */}' in content and 'bg-primary-900' not in content:
        print(f'Found in {file}')
        
        # Replace the div class
        new_content = re.sub(
            r'({\/\*\s*Contextual Header\s*\*\/}\s*\n\s*<div className=\"flex flex-col md:flex-row md:items-center justify-between gap-4 )bg-white/40 p-\d+ rounded-3xl border border-white/60 backdrop-blur-md shadow-sm(\")>',
            r'\1bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20\2>',
            content, count=1
        )
        
        # Replace h1 text-slate-800 with text-white
        new_content = re.sub(
            r'(<h1 className=\"[^\"]*)text-slate-800([^\"]*\")>',
            r'\1text-white\2>',
            new_content, count=1
        )
        
        # Replace p text-slate-500 with text-primary-100
        new_content = re.sub(
            r'(<p className=\"[^\"]*)text-slate-500([^\"]*\")>',
            r'\1text-primary-100\2>',
            new_content, count=1
        )
        
        # We also need to fix buttons if they exist
        # Example: className="... bg-indigo-600 rounded-xl hover:bg-indigo-700 ..."
        new_content = re.sub(
            r'bg-indigo-600(.*?)hover:bg-indigo-700(.*?)shadow-indigo-600/20',
            r'bg-secondary-500\1hover:bg-secondary-600\2shadow-secondary-500/20',
            new_content, count=1
        )
        
        if content != new_content:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'Updated {file}')
