
const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  console.log('Fixing:', filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix HTML entities
  content = content.replace(/&amp;lt;/g, '&lt;');
  content = content.replace(/&amp;gt;/g, '&gt;');
  content = content.replace(/&amp;amp;/g, '&amp;');
  
  // Also fix any double-escaped entities
  content = content.replace(/&lt;/g, '&lt;');
  content = content.replace(/&gt;/g, '&gt;');
  content = content.replace(/&amp;/g, '&amp;');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed:', filePath);
}

const componentsDir = path.join(__dirname, 'ai-phone-app', 'src', 'components');

// Fix all component files
const files = fs.readdirSync(componentsDir);
files.forEach(file => {
  if (file.endsWith('.tsx')) {
    fixFile(path.join(componentsDir, file));
  }
});

console.log('All files fixed!');
