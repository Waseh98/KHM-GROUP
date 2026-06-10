const cloudinary = require('./cloudinary');
const path = require('path');

exports.uploadDir = null;

exports.processImage = async (imageStr) => {
  if (!imageStr || typeof imageStr !== 'string') return imageStr;

  const matches = imageStr.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return imageStr;
  }

  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      `data:image/${ext};base64,${matches[2]}`,
      { folder: 'ktex-products', resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.warn('Cloudinary upload failed:', error.message);
          resolve(imageStr);
        } else {
          resolve(result.secure_url);
        }
      }
    );
  });
};

exports.processImageArray = async (images) => {
  if (!images || !Array.isArray(images)) return images;

  const results = [];
  for (const img of images) {
    if (img && img.url) {
      const processed = await exports.processImage(img.url);
      results.push({ ...img, url: processed });
    } else {
      results.push(img);
    }
  }
  return results;
};