// Simple script to create PWA icon placeholders
// Run with: node generate-pwa-icons.js

const fs = require('fs');
const path = require('path');

// Create SVG icons that will work as PNG
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="middle" fill="white">🎨</text>
</svg>`;
};

// Save icons
const publicDir = path.join(__dirname, 'public');

fs.writeFileSync(path.join(publicDir, 'icon-192.svg'), createSVGIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.svg'), createSVGIcon(512));

console.log('✅ PWA icons created successfully!');
console.log('📁 Location: shared-space-app/client/public/');
console.log('📝 Files: icon-192.svg, icon-512.svg');
