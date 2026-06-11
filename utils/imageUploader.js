const cloudinary = require('./cloudinary');
const { isConfigured } = require('./cloudinary');

const UPLOAD_TIMEOUT_MS = 30_000;
const FOLDERS = {
  products: 'ktex/products',
  collections: 'ktex/collections',
  categories: 'ktex/categories',
  orders: 'ktex/orders',
  misc: 'ktex/misc',
};

function ensureConfigured() {
  if (!isConfigured()) {
    throw new Error('Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to the server environment.');
  }
}

function isDataUri(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function isRemoteUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function isCloudinaryUrl(value) {
  return typeof value === 'string' && value.includes('res.cloudinary.com');
}

function withTimeout(promise, ms = UPLOAD_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Image upload timed out. Please try again.')), ms);
    }),
  ]);
}

function cloudinaryUpload(source, folder) {
  ensureConfigured();
  return withTimeout(new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      source,
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
  }));
}

async function uploadFromSource(source, folder = FOLDERS.misc) {
  if (!source || typeof source !== 'string') {
    return { url: source || '', public_id: '' };
  }

  if (isCloudinaryUrl(source)) {
    return { url: source, public_id: '' };
  }

  if (isRemoteUrl(source) && !isDataUri(source)) {
    return cloudinaryUpload(source, folder);
  }

  if (isDataUri(source)) {
    return cloudinaryUpload(source, folder);
  }

  return { url: source, public_id: '' };
}

exports.FOLDERS = FOLDERS;
exports.isCloudinaryConfigured = isConfigured;

exports.processImage = async (imageStr, folder = FOLDERS.misc) => {
  const result = await uploadFromSource(imageStr, folder);
  return result.url;
};

exports.processImageField = async (value, folder = FOLDERS.misc) => {
  if (!value) return value;
  const result = await uploadFromSource(value, folder);
  return result.url;
};

exports.processImageArray = async (images, folder = FOLDERS.products) => {
  if (!images || !Array.isArray(images)) return images;

  const results = [];
  for (const img of images) {
    const source = typeof img === 'string' ? img : img?.url;
    if (!source) continue;
    const uploaded = await uploadFromSource(source, folder);
    results.push({
      url: uploaded.url,
      public_id: uploaded.public_id || img?.public_id || '',
    });
  }
  return results;
};

exports.uploadFromSource = uploadFromSource;
