
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  console.log('Fixing:', filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Do replacements until there are no more entities
  let done = false;
  while (!done) {
    let newContent = content
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    
    if (newContent === content) {
      done = true;
    }
    content = newContent;
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed:', filePath);
}

function fixDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(fullPath);
    }
  });
}

const srcDir = path.join(__dirname, 'ai-phone-app', 'src');
fixDirectory(srcDir);
console.log('All files fixed!');
