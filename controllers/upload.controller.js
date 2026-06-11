const { uploadFromSource, FOLDERS, isCloudinaryConfigured } = require('../utils/imageUploader');

const ALLOWED_FOLDERS = new Set(Object.values(FOLDERS));

function resolveFolder(folder) {
  return ALLOWED_FOLDERS.has(folder) ? folder : FOLDERS.misc;
}

exports.getUploadStatus = (req, res) => {
  res.json({
    success: true,
    data: {
      cloudinary: isCloudinaryConfigured(),
      folders: FOLDERS,
    },
  });
};

exports.uploadImage = async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }
    const uploaded = await uploadFromSource(image, resolveFolder(folder));
    res.status(201).json({ success: true, message: 'Image uploaded', data: uploaded });
  } catch (error) {
    console.error('uploadImage error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const { images, folder } = req.body;
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: 'images array is required' });
    }
    const targetFolder = resolveFolder(folder);
    const uploaded = [];
    for (const image of images) {
      uploaded.push(await uploadFromSource(image, targetFolder));
    }
    res.status(201).json({ success: true, message: 'Images uploaded', data: uploaded });
  } catch (error) {
    console.error('uploadImages error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};

exports.uploadPaymentProof = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: 'Payment screenshot is required' });
    }
    const uploaded = await uploadFromSource(image, FOLDERS.orders);
    res.status(201).json({ success: true, message: 'Payment proof uploaded', data: uploaded });
  } catch (error) {
    console.error('uploadPaymentProof error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Upload failed' });
  }
};
