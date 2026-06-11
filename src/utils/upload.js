import { API_BASE } from './api';

const MAX_FILE_BYTES = 8 * 1024 * 1024;

export const UPLOAD_FOLDERS = {
  products: 'ktex/products',
  collections: 'ktex/collections',
  categories: 'ktex/categories',
  orders: 'ktex/orders',
  misc: 'ktex/misc',
};

export function compressImageFile(file, { maxWidth = 1600, maxHeight = 2000, quality = 0.88 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Please choose an image file (JPG, PNG, WebP).'));
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('Image must be 8MB or smaller.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > maxWidth || h > maxHeight) {
          const ratio = Math.min(maxWidth / w, maxHeight / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);

        let q = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', q);
        while (dataUrl.length > MAX_FILE_BYTES && q > 0.45) {
          q -= 0.08;
          dataUrl = canvas.toDataURL('image/jpeg', q);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Could not read image file.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read image file.'));
    reader.readAsDataURL(file);
  });
}

async function parseUploadResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Upload failed (${res.status})`);
  return data.data;
}

export async function uploadImage(image, { token, folder = UPLOAD_FOLDERS.misc } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ image, folder }),
  });
  return parseUploadResponse(res);
}

export async function uploadFile(file, options = {}) {
  const dataUrl = await compressImageFile(file);
  return uploadImage(dataUrl, options);
}

export async function uploadPaymentProof(image) {
  const res = await fetch(`${API_BASE}/api/upload/payment-proof`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  });
  return parseUploadResponse(res);
}
