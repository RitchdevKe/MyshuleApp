
const fs = require("fs");
const path = require("path");

const targetDir = "c:\\\\Users\\\\USER\\\\Documents\\\\antigravity\\\\focused-kepler\\\\src\\\\app\\\\dashboard\\\\human-resources";

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

        // Replace indigo buttons with primary
        content = content.replace(/bg-indigo-600/g, "bg-primary-900");
        content = content.replace(/hover:bg-indigo-700/g, "hover:bg-primary-800");
        content = content.replace(/shadow-indigo-600/g, "shadow-primary-900");

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, "utf8");
            console.log("Updated", filePath);
        }
    }
});

