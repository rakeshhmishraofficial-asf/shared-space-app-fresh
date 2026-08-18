// Simple script to generate placeholder PNG icons
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple base64 PNG icon (purple gradient square)
const createIcon = (size) => {
  // This is a minimal PNG - a solid purple square
  // In production, use proper icon generation tools
  const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="#1a1a2e" rx="${size * 0.15}"/>
      <g transform="translate(${size/2}, ${size/2})">
        <circle cx="0" cy="0" r="${size * 0.12}" fill="url(#grad)" opacity="0.9"/>
        <circle cx="${-size * 0.2}" cy="${-size * 0.2}" r="${size * 0.08}" fill="url(#grad)" opacity="0.8"/>
        <circle cx="${size * 0.2}" cy="${-size * 0.2}" r="${size * 0.08}" fill="url(#grad)" opacity="0.8"/>
        <circle cx="${-size * 0.2}" cy="${size * 0.2}" r="${size * 0.08}" fill="url(#grad)" opacity="0.8"/>
        <circle cx="${size * 0.2}" cy="${size * 0.2}" r="${size * 0.08}" fill="url(#grad)" opacity="0.8"/>
        <line x1="${-size * 0.2}" y1="${-size * 0.2}" x2="0" y2="0" stroke="url(#grad)" stroke-width="${size * 0.015}" opacity="0.6"/>
        <line x1="${size * 0.2}" y1="${-size * 0.2}" x2="0" y2="0" stroke="url(#grad)" stroke-width="${size * 0.015}" opacity="0.6"/>
        <line x1="${-size * 0.2}" y1="${size * 0.2}" x2="0" y2="0" stroke="url(#grad)" stroke-width="${size * 0.015}" opacity="0.6"/>
        <line x1="${size * 0.2}" y1="${size * 0.2}" x2="0" y2="0" stroke="url(#grad)" stroke-width="${size * 0.015}" opacity="0.6"/>
        <path d="M ${-size * 0.04} ${-size * 0.02} L ${size * 0.04} ${-size * 0.02} L ${size * 0.05} ${size * 0.02} L ${size * 0.04} ${size * 0.04} L ${-size * 0.04} ${size * 0.04} L ${-size * 0.05} ${size * 0.02} Z" fill="white" opacity="0.9"/>
      </g>
    </svg>
  `;
  return canvas;
};

// Save SVG files that can be converted to PNG
const publicDir = path.join(__dirname, 'public');

fs.writeFileSync(
  path.join(publicDir, 'icon-192.svg'),
  createIcon(192)
);

fs.writeFileSync(
  path.join(publicDir, 'icon-512.svg'),
  createIcon(512)
);

console.log('✅ SVG icons generated!');
console.log('📝 To convert to PNG, use one of these methods:');
console.log('   1. Online: https://cloudconvert.com/svg-to-png');
console.log('   2. ImageMagick: magick icon-192.svg icon-192.png');
console.log('   3. Or use the icon.svg file with an online PWA icon generator');
