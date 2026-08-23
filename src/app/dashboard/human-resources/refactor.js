const fs = require("fs");
const path = require("path");

const targetDir = "c:\\Users\\USER\\Documents\\antigravity\\focused-kepler\\src\\app\\dashboard\\human-resources";

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(targetDir, function(filePath) {
    if (filePath.endsWith(".tsx")) {
        let content = fs.readFileSync(filePath, "utf8");
        let originalContent = content;

        // 1. Premium Glassmorphism
        content = content.replace(/bg-white\/[0-9]+\s+backdrop-blur-[a-z]+/g, "bg-white/80 backdrop-blur-xl");
        
        content = content.replace(/className="bg-white border-2 border-secondary-500 rounded-xl/g, "className=\"bg-white/80 backdrop-blur-xl border-2 border-secondary-500 rounded-xl");
        
        // 2. Tab styles in layout.tsx
        let tabRegex = /isActive\s*\?\s*"bg-white text-secondary-500 shadow-sm border border-slate-100"\s*:\s*"text-slate-500 hover:text-primary-900 hover:bg-white\/50 border border-transparent"/g;
        
        content = content.replace(tabRegex, 
            `isActive ? "bg-secondary-500 text-white shadow-sm border border-slate-100" : "bg-primary-900 text-white hover:bg-primary-800 border border-transparent"`);

        content = content.replace(/<Icon className=\{`w-4 h-4 \$\{isActive \? 'text-secondary-500' : 'text-slate-400'\}`\} \/>/g, 
            `<Icon className="w-4 h-4 text-white" />`);

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, "utf8");
            console.log("Updated", filePath);
        }
    }
});
