const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('src/app/dashboard', function(filePath) {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('{/* Contextual Header */}') && !content.includes('bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20')) {
            console.log('Found in ' + filePath);
            
            // Replace the div class
            let newContent = content.replace(
                /({\/\*\s*Contextual Header\s*\*\/}\s*\n\s*<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 )bg-white\/40 p-\d+ rounded-3xl border border-white\/60 backdrop-blur-md shadow-sm(")/,
                '$1bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20$2'
            );
            
            // Replace h1 text-slate-800 with text-white
            newContent = newContent.replace(
                /(<h1 className="[^"]*)text-slate-800([^"]*">)/,
                '$1text-white$2'
            );
            
            // Replace p text-slate-500 with text-primary-100
            newContent = newContent.replace(
                /(<p className="[^"]*)text-slate-500([^"]*">)/,
                '$1text-primary-100$2'
            );
            
            // Replace button bg-indigo-600 with bg-secondary-500
            newContent = newContent.replace(
                /bg-indigo-600(.*?)hover:bg-indigo-700(.*?)shadow-indigo-600\/20/g,
                'bg-secondary-500$1hover:bg-secondary-600$2shadow-secondary-500/20'
            );
            
            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log('Updated ' + filePath);
            }
        }
    }
});
