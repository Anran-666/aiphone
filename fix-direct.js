
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  console.log('Fixing:', filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Simple direct replacements, no regex escaping issues
  while (content.includes('&lt;') || content.includes('&gt;') || content.includes('&amp;')) {
    content = content.replace(/&lt;/g, '<');
    content = content.replace(/&gt;/g, '>');
    content = content.replace(/&amp;/g, '&');
  }
  
  // Make sure we have all the right characters
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed:', filePath);
}

const componentsDir = path.join(__dirname, 'ai-phone-app', 'src', 'components');
const files = fs.readdirSync(componentsDir);
files.forEach(file => {
  if (file.endsWith('.tsx')) {
    fixFile(path.join(componentsDir, file));
  }
});

// Also check types file
const typesFile = path.join(__dirname, 'ai-phone-app', 'src', 'types.ts');
if (fs.existsSync(typesFile)) {
  fixFile(typesFile);
}

console.log('All files fixed!');
