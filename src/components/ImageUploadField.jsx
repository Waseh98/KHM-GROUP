import { useId, useState } from 'react';
import { getImageUrl } from '../utils/api';
import { uploadFile } from '../utils/upload';

export default function ImageUploadField({
  label = 'Image',
  value = '',
  onChange,
  folder,
  token,
  placeholder = 'Paste image URL or upload a file',
  previewHeight = 120,
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const preview = getImageUrl(value);

  async function handleFile(file) {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadFile(file, { token, folder });
      onChange(uploaded.url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>

      <div
        style={{
          border: '2px dashed rgba(212,175,90,0.25)',
          borderRadius: 12,
          padding: 14,
          background: 'rgba(255,255,255,0.02)',
          transition: 'border-color 0.2s ease',
        }}
      >
        {preview && preview !== '' ? (
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: previewHeight,
                objectFit: 'cover',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,80,80,0.92)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
        ) : (
          <label
            htmlFor={inputId}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: previewHeight,
              cursor: uploading ? 'wait' : 'pointer',
              color: '#888',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <span style={{ fontSize: 28, opacity: 0.6 }}>{uploading ? '⏳' : '📷'}</span>
            <span>{uploading ? 'Uploading to Cloudinary...' : 'Click to upload image'}</span>
            <span style={{ fontSize: 11, color: '#666' }}>JPG, PNG, WebP · max 8MB</span>
          </label>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*"
          hidden
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <input
          type="url"
          value={value}
          disabled={uploading}
          onChange={(e) => {
            setError('');
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          style={{
            ...inputStyle,
            width: '100%',
            marginTop: 10,
            fontSize: 12,
            opacity: uploading ? 0.5 : 1,
          }}
        />
      </div>

      {error && (
        <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 8, fontWeight: 600 }}>{error}</p>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  color: '#aaa',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 6,
};

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0,0,0,0.3)',
  color: '#fff',
  outline: 'none',
};
