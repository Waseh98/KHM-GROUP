const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Ensures the directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadDir = uploadDir;

/**
 * Converts a base64 image to a file and returns its URL.
 * If the input is already a URL, it returns it unchanged.
 */
exports.processImage = (imageStr) => {
  if (!imageStr || typeof imageStr !== 'string') return imageStr;

  // Check if it's a base64 data URI
  const matches = imageStr.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return imageStr; // It's likely already a URL
  }

  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  // Generate a unique filename
  const filename = crypto.randomBytes(16).toString('hex') + '.' + ext;
  const filePath = path.join(uploadDir, filename);

  // Write file to disk
  fs.writeFileSync(filePath, buffer);

  // Return the public URL path
  return '/uploads/' + filename;
};

/**
 * Processes an array of image objects: [{ url: '...' }]
 */
exports.processImageArray = (images) => {
  if (!images || !Array.isArray(images)) return images;

  return images.map(img => {
    if (img && img.url) {
      return {
        ...img,
        url: exports.processImage(img.url)
      };
    }
    return img;
  });
};
