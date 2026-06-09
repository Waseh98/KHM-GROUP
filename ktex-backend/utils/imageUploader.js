const cloudinary = require('./cloudinary');
const path = require('path');
const fs = require('fs');

exports.uploadDir = null;

exports.processImage = async (imageStr) => {
  if (!imageStr || typeof imageStr !== 'string') return imageStr;

  const matches = imageStr.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return imageStr;
  }

  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');

  // Try Cloudinary first if configured
  if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
    return new Promise((resolve) => {
      try {
        cloudinary.uploader.upload(
          `data:image/${ext};base64,${matches[2]}`,
          { folder: 'ktex-products', resource_type: 'image' },
          (error, result) => {
            if (error) {
              console.warn('Cloudinary upload failed:', error.message);
              resolve(saveLocally(buffer, ext));
            } else {
              resolve(result.secure_url);
            }
          }
        );
      } catch (err) {
        console.warn('Cloudinary upload error, using local fallback:', err.message);
        resolve(saveLocally(buffer, ext));
      }
    });
  } else {
    // Local filesystem fallback
    return saveLocally(buffer, ext);
  }
};

function saveLocally(buffer, ext) {
  try {
    const filename = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const uploadPath = path.join(__dirname, '..', 'public', 'uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadPath, filename), buffer);
    console.log(`💾 Image saved locally: /uploads/${filename}`);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to save image locally:', err.message);
    // Fall back to original base64 string
    return `data:image/${ext};base64,${buffer.toString('base64')}`;
  }
}

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