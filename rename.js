const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'drone-sim');
if (!fs.existsSync(dir)) {
  console.log('Directory does not exist');
  process.exit(1);
}

const files = fs.readdirSync(dir);
console.log('Files in drone-sim:', files);

const mappings = {
  'WhatsApp Image 2026-05-21 at 12.24.19 PM.jpeg': 'image1.jpeg',
  'WhatsApp Image 2026-05-21 at 12.24.20 PM.jpeg': 'image2.jpeg',
  'WhatsApp Image 2026-05-21 at 12.24.21 PM.jpeg': 'image3.jpeg',
  'WhatsApp Image 2026-05-21 at 12.24.21 PM (1).jpeg': 'image4.jpeg'
};

for (const [oldName, newName] of Object.entries(mappings)) {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed ${oldName} to ${newName}`);
  } else {
    console.log(`File not found: ${oldName}`);
  }
}
